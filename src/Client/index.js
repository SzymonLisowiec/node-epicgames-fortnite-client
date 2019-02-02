const ENDPOINT = require('../../resources/Endpoint');

const Events = require('events');
const request = require('request');
const Http = require('../Http');
const { WaitingRoom, Endpoints: LauncherEndpoint, User } = require('epicgames-client');
const StatsParser = require('../StatsParser');
const Matchmaking = require('./Matchmaking');
const CreativeWorld = require('./CreativeWorld');

const FORTNITE_AUTHORIZATION = 'ZWM2ODRiOGM2ODdmNDc5ZmFkZWEzY2IyYWQ4M2Y1YzY6ZTFmMzFjMjExZjI4NDEzMTg2MjYyZDM3YTEzZmM4NGQ=';

class Client extends Events {

	constructor (launcher, config) {
		super(config);

		this.config = Object.assign({
            
            use_waiting_room: false,
			http: {}

        }, config || {});
        
        this.launcher = launcher;

		this.build = '4.20.0-3948073+++Fortnite+Release-3.3'; //TODO: Receive current version from EpicGames Launcher
        
        this.http = new Http(this.config.http);
        this.http.setHeader('Accept-Language', this.launcher.http.getHeader('Accept-Language'));

        this.basic_data = null;
        this.auth = null;

	}

	/**
	 * Sets language for client
	 */
	setLanguage (iso_language) {
		this.http.setHeader('Accept-Language', iso_language);
	}
    
    /**
     * Initialize client.
     */
	async init () {

        try {
            
            let wait = false;
            if(this.config.use_waiting_room){
                let waiting_room = new WaitingRoom(ENDPOINT.WAITING_ROOM, this.http);
                wait = await waiting_room.needWait();
            }
    
            if(wait){
                    
                this.launcher.debug.print('Problems with servers, need wait ' + wait.expected_wait + ' seconds.');
                let sto = setTimeout(_ => {
                    clearTimeout(sto);
                    return this.init();
                }, wait.expected_wait*1000);
    
            }else{

                let { data } = await this.http.sendGet(ENDPOINT.BASIC_DATA);
                
                if(data){
                    
					this.basic_data = data;

                    let login = await this.login();

					this.launcher.on('access_token_refreshed', _ => {
						this.login(true);
					});

                    return login;

                }

            }

        }catch(err){

            if(typeof err === 'object')
                this.launcher.debug.print(err);
            else this.launcher.debug.print(new Error(err));

        }

        return false;
    }

    /**
     * Login to account.
     */
    async login (is_refresh) {

        try {

			this.launcher.debug.print('Fortnite: ' + (is_refresh ? 'Exchanging refreshed access token...' : 'Exchanging access token...'));

            let { code } = await this.launcher.account.auth.exchange();

            if(code){

                let { data } = await this.launcher.http.sendPost(LauncherEndpoint.OAUTH_TOKEN, 'basic ' + FORTNITE_AUTHORIZATION, {
                    grant_type: 'exchange_code',
                    exchange_code: code,
                    includePerms: false,
                    token_type: 'eg1'
                });

                this.auth = data;
                this.auth.expires_at = new Date(this.auth.expires_at);
				this.auth.refresh_expires_at = new Date(this.auth.refresh_expires_at);

				this.launcher.debug.print('Fortnite: ' + (is_refresh ? 'Refreshed access token exchanged!' : 'Access token exchanged!'));

				if(!is_refresh){
					
					await this.http.send(
						'DELETE',
						'https://account-public-service-prod03.ol.epicgames.com/account/api/oauth/sessions/kill?killType=OTHERS_ACCOUNT_CLIENT_SERVICE',
						this.auth.token_type + ' ' + this.auth.access_token
					);
					
				}

                return true;

            }

        }catch(err){

            throw new Error(err);

        }

        return false;
	}
	
	/**
	 * Refreshing a basic data.
	 */
	async refreshBasicData () {

        try {

            let { data } = await this.http.sendGet(ENDPOINT.BASIC_DATA);
                
            if(data){
				
				this.basic_data = data;

				return this.basic_data;

			}

        }catch(err){

            this.launcher.debug.print(err);

        }

        return false;
	}

    /**
     * Geting stats of Battle Royale
     * @param {string} id - account's id or display name
     * @param {string} time - weekly or alltime
     */
    async getStatsBR(id, time) {

        time = ['weekly', 'alltime'].indexOf(time) > -1 ?  time : 'alltime';

        try {
			
			if(this.launcher.isDisplayName(id)){

				let account = await this.launcher.lookup(id);
				if(account)
					id = account.id;
				else return false;

            }
            
			let { data } = await this.http.sendGet(
				ENDPOINT.STATS + '/' + id + '/bulk/window/' + time,
				this.auth.token_type + ' ' + this.auth.access_token
			);

			return StatsParser.BR(data);

		}catch(err){

			this.launcher.debug.print(new Error(err));

		}

		return false;
	}

	/**
     * Getting full store catalog
     */
    async getStoreCatalog() {

        try {
            
			let { data } = await this.http.sendGet(
				ENDPOINT.STOREFRONT_CATALOG,
				this.auth.token_type + ' ' + this.auth.access_token
			);

			return data;

		}catch(err){

			this.launcher.debug.print(new Error(err));

		}

		return false;
	}

    /**
     * Getting featured items in store
     */
    async getStoreFeaturedItems() {

		let store = await this.getStoreCatalog();
		
		if(!store)
			return false;

		let storefront = store.storefronts.find(storefront => {
			return storefront.name == 'BRWeeklyStorefront';
		});
		
		return storefront.catalogEntries;
	}

    /**
     * Getting daily items in store
     */
    async getStoreDailyItems() {

		let store = await this.getStoreCatalog();
		
		if(!store)
			return false;

		let storefront = store.storefronts.find(storefront => {
			return storefront.name == 'BRDailyStorefront';
		});
		
		return storefront.catalogEntries;
	}
	
	/**
     * Get list of tournaments
     */
    getTournaments() {

		if(!this.basic_data || !this.basic_data.tournamentinformation || !this.basic_data.tournamentinformation.tournament_info)
			return false;

		let result = {
			list: this.basic_data.tournamentinformation.tournament_info.tournaments,
			last_modified: new Date(this.basic_data.tournamentinformation.lastModified)
		};

		return result;
	}
	
	/**
     * Get list of all game modes
     */
    getAllGameModes() {

		if(!this.basic_data || !this.basic_data.playlistinformation || !this.basic_data.playlistinformation.playlist_info)
			return false;

		let result = {
			list: this.basic_data.playlistinformation.playlist_info.playlists,
			last_modified: new Date(this.basic_data.playlistinformation.lastModified)
		};

		return result;
	}

	/**
     * Get list of battle royale news
     */
    getNewsBR() {

		if(!this.basic_data || !this.basic_data.battleroyalenews || !this.basic_data.battleroyalenews.news)
			return false;

		let result = {
			list: this.basic_data.battleroyalenews.news.messages,
			style: this.basic_data.battleroyalenews.style,
			last_modified: new Date(this.basic_data.battleroyalenews.lastModified)
		};

		return result;
	}

	/**
     * Get list of save the world news
     */
    getNewsPVE() {

		if(!this.basic_data || !this.basic_data.savetheworldnews || !this.basic_data.savetheworldnews.news)
			return false;

		let result = {
			list: this.basic_data.savetheworldnews.news.messages,
			last_modified: new Date(this.basic_data.savetheworldnews.lastModified)
		};

		return result;
	}

	/**
     * Get list of subgames (e.g. Battle Royale, Save The World, Creative)
     */
    getSubgames() {

		if(!this.basic_data || !this.basic_data.subgameselectdata)
			return false;

		let result = Object.assign({}, this.basic_data.subgameselectdata);
		delete result._locale;
		delete result._title;
		delete result._activeDate;
		result.last_modified = new Date(result.lastModified);
		delete result.lastModified;

		return result;
	}
	
	/**
     * Get raw basic data (all basic informations e.g. tournaments, game modes is received while start game)
     */
    getRawBasicData() {
		return this.basic_data;
    }

	/**
     * Getting full info about locations, missions etc.
     */
    async getWorldInfo() {

        try {
            
			let { data } = await this.http.sendGet(
				ENDPOINT.WORLD_INFO,
				this.auth.token_type + ' ' + this.auth.access_token
			);

			return data;

		}catch(err){

			this.launcher.debug.print(new Error(err));

		}

		return false;
	}

	/**
     * Working in progress. If you want help, check file ./Matchmaking.js
     */
    async matchmaking(options) {

		let mm = new Matchmaking(this, options);

	}

	getCreativeWorld (code) {
		return CreativeWorld.getByCode(this, code);
	}

	async getFavoriteCreativeWorlds () {
		
		try {
            
			let { data } = await this.http.sendGet(
				ENDPOINT.CREATIVE_FAVORITES + '/' + this.launcher.account.id + '?limit=30', // TODO: Add pagination
				this.auth.token_type + ' ' + this.auth.access_token
			);

			data = data.results.map(result => {
				return new CreativeWorld(this, {
					code: result.linkData.mnemonic,
					author: new User(this.launcher, {
						account_id: result.linkData.accountId,
						display_name: result.linkData.creatorName
					}),
					title: result.linkData.metadata.title,
					description: result.linkData.metadata.tagline,
					type: result.linkData.metadata.islandType,
					locale: result.linkData.metadata.locale,
				});
			});

			return data;

		}catch(err){

			this.launcher.debug.print(new Error(err));

		}

		return false;
	}

}

module.exports = Client;