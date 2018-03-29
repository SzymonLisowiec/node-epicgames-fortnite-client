const ENDPOINT = require('../../resources/Endpoint');

const Events = require('events');
const request = require('request');
const Http = require('../Http');
const WaitingRoom = require('epicgames-client').WaitingRoom;
const LauncherEndpoint = require('epicgames-client').Endpoints;
const StatsParser = require('../StatsParser');

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
        this.http.setHeader('Accept-Language', 'en-EN');

        this.basic_data = null;
        this.auth = null;

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

                let { err, data } = await this.http.sendGet(ENDPOINT.BASIC_DATA);
                
                if(data){
                    
                    this.basic_data = data;

                    let login = await this.login();

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
    async login () {

        try {

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

                return true;

            }

        }catch(err){

            throw new Error(err);

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

}

module.exports = Client;