const Events = require('events');
const ENDPOINT = require('../../resources/Endpoint');

const Http = require('../Http');

const {
  WaitingRoom, Endpoints: LauncherEndpoint, User, Communicator,
// eslint-disable-next-line import/no-dynamic-require
} = require(process.env.KYSUNE_EPICGAMES_CLIENT || 'epicgames-client');
const {
  BR: StatsParserBR,
} = require('../StatsParser');
const CreativeWorld = require('./CreativeWorld');

const FORTNITE_AUTHORIZATION = 'ZWM2ODRiOGM2ODdmNDc5ZmFkZWEzY2IyYWQ4M2Y1YzY6ZTFmMzFjMjExZjI4NDEzMTg2MjYyZDM3YTEzZmM4NGQ=';

class Client extends Events {

  constructor(launcher, config) {
    super(config);
    
    this.appName = 'Fortnite';
    this.libraryName = process.env.KYSUNE_EPICGAMES_FORTNITE_CLIENT || 'epicgames-fortnite-client';

    this.config = {
            
      useWaitingRoom: false,
      http: {},

      ...config,

    };
        
    this.launcher = launcher;

    this.build = '4.22.0-4980899+++Fortnite+Release-7.40'; // TODO: Receive current version from EpicGames Launcher
        
    this.http = new Http(this.config.http);
    this.http.setHeader('Accept-Language', this.launcher.http.getHeader('Accept-Language'));

    this.basicData = null;
    this.auth = null;

    this.communicator = null;

  }

  setLanguage(language) {
    this.http.setHeader('Accept-Language', language);
  }

  async init() {

    try {
            
      let wait = false;
      if (this.config.useWaitingRoom) {
        const waitingRoom = new WaitingRoom(this.http, ENDPOINT.WAITING_ROOM);
        wait = await waitingRoom.needWait();
      }
    
      if (wait) {
                    
        this.launcher.debug.print(`Problems with servers, need wait ${wait.expectedWait} seconds.`);
        const sto = setTimeout(() => {
          clearTimeout(sto);
          return this.init();
        }, wait.expectedWait * 1000);
    
      } else {

        const { data } = await this.http.sendGet(ENDPOINT.BASIC_DATA);
                
        if (data) {
                    
          this.basicData = data;

          const login = await this.login();

          /* const { data: common_public } = */await this.http.send(
            'POST',
            `https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/game/v2/profile/${this.launcher.account.id}/client/QueryProfile?profileId=common_public&rvn=-1`,
            `${this.auth.tokenType} ${this.auth.accessToken}`,
            {
              rev: 1,
              version: 'fortnite_start@w=9',
            },
          );

          // TODO: Support for receives data `common_public`
        
          /* const { data: common_core } = */await this.http.send(
            'POST',
            `https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/game/v2/profile/${this.launcher.account.id}/client/QueryProfile?profileId=common_core&rvn=-1`,
            `${this.auth.tokenType} ${this.auth.accessToken}`,
            {
              rev: 2259,
              version: 'fortnite_start@w=9',
            },
          );

          // TODO: Support for receives data `common_core`
          
          this.communicator = new Communicator(this);
          await this.communicator.connect(this.auth.accessToken);

          this.launcher.on('access_token_refreshed', async () => {
            await this.login(true);
            await this.communicator.disconnect();
            await this.communicator.connect(this.auth.accessToken);
          });

          return login;

        }

      }

    } catch (err) {

      if (typeof err === 'object') this.launcher.debug.print(err);
      else this.launcher.debug.print(new Error(err));

    }

    return false;
  }
  
  async login(isRefresh) {

    try {

      this.launcher.debug.print(`Fortnite: ${isRefresh ? 'Exchanging refreshed access token...' : 'Exchanging access token...'}`);

      const { code } = await this.launcher.account.auth.exchange();

      if (code) {

        const { data } = await this.launcher.http.sendPost(LauncherEndpoint.OAUTH_TOKEN, `basic ${FORTNITE_AUTHORIZATION}`, {
          grant_type: 'exchange_code',
          exchange_code: code,
          includePerms: false,
          token_type: 'eg1',
        });
        
        this.auth = {
          accessToken: data.access_token,
          expiresIn: data.expires_in,
          expiresAt: new Date(data.expires_at),
          tokenType: data.token_type,
          refreshToken: data.refresh_token,
          refreshExpires: data.refresh_expires,
          refreshExpiresAt: new Date(data.refresh_expires_at),
          accountId: data.account_id,
          clientId: data.client_id,
          internalClient: data.internal_client,
          clientService: data.client_service,
          app: data.pp,
          inAppId: data.in_app_id,
          deviceId: data.device_id,
        };

        this.launcher.debug.print(`Fortnite: ${isRefresh ? 'Refreshed access token exchanged!' : 'Access token exchanged!'}`);

        if (!isRefresh) {
          
          await this.http.send(
            'DELETE',
            'https://account-public-service-prod03.ol.epicgames.com/account/api/oauth/sessions/kill?killType=OTHERS_ACCOUNT_CLIENT_SERVICE',
            `${this.auth.tokenType} ${this.auth.accessToken}`,
          );
          
        }

        return true;

      }

    } catch (err) {

      throw new Error(err);

    }

    return false;
  }
  
  async refreshBasicData() {

    try {

      const { data } = await this.http.sendGet(ENDPOINT.BASIC_DATA);
                
      if (data) {
        
        this.basicData = data;

        return this.basicData;

      }

    } catch (err) {

      this.launcher.debug.print(err);

    }

    return false;
  }
  
  async getStatsBR(id, inputType) {

    try {
      
      if (this.launcher.isDisplayName(id)) {

        const account = await this.launcher.lookup(id);
        if (account) ({ id } = account);
        else return false;

      }

      const { data } = await this.http.sendGet(
        `${ENDPOINT.STATSV2}/${id}`,
        `${this.auth.tokenType} ${this.auth.accessToken}`,
      );
      
      return (new StatsParserBR(this)).parse(data, inputType);

    } catch (err) {
      
      this.launcher.debug.print(err);

    }

    return false;
  }
  
  async getStoreCatalog() {

    try {
            
      const { data } = await this.http.sendGet(
        ENDPOINT.STOREFRONT_CATALOG,
        `${this.auth.tokenType} ${this.auth.accessToken}`,
      );

      return data;

    } catch (err) {

      this.launcher.debug.print(new Error(err));

    }

    return false;
  }
  
  async getStoreFeaturedItems() {

    const store = await this.getStoreCatalog();
    
    if (!store) return false;

    const storefront = store.storefronts.find(sf => sf.name === 'BRWeeklyStorefront');
    
    return storefront.catalogEntries;
  }
  
  async getStoreDailyItems() {

    const store = await this.getStoreCatalog();
    
    if (!store) return false;

    const storefront = store.storefronts.find(sf => sf.name === 'BRDailyStorefront');
    
    return storefront.catalogEntries;
  }
  
  getTournaments() {

    if (
      !this.basicData
      || !this.basicData.tournamentinformation
      || !this.basicData.tournamentinformation.tournament_info
    ) return false;

    const result = {
      list: this.basicData.tournamentinformation.tournament_info.tournaments,
      lastModified: new Date(this.basicData.tournamentinformation.lastModified),
    };

    return result;
  }
  
  getAllGameModes() {

    if (
      !this.basicData
      || !this.basicData.playlistinformation
      || !this.basicData.playlistinformation.playlist_info
    ) return false;

    const result = {
      list: this.basicData.playlistinformation.playlist_info.playlists,
      lastModified: new Date(this.basicData.playlistinformation.lastModified),
    };

    return result;
  }
  
  getNewsBR() {

    if (
      !this.basicData
      || !this.basicData.battleroyalenews
      || !this.basicData.battleroyalenews.news
    ) return false;

    const result = {
      list: this.basicData.battleroyalenews.news.messages,
      style: this.basicData.battleroyalenews.style,
      lastModified: new Date(this.basicData.battleroyalenews.lastModified),
    };

    return result;
  }
  
  getNewsPVE() {

    if (
      !this.basicData
      || !this.basicData.savetheworldnews
      || !this.basicData.savetheworldnews.news
    ) return false;

    const result = {
      list: this.basicData.savetheworldnews.news.messages,
      lastModified: new Date(this.basicData.savetheworldnews.lastModified),
    };

    return result;
  }

  getSubgames() {

    if (
      !this.basicData
      || !this.basicData.subgameselectdata
    ) return false;

    const result = { ...this.basicData.subgameselectdata };
    // eslint-disable-next-line no-underscore-dangle
    delete result._locale;
    // eslint-disable-next-line no-underscore-dangle
    delete result._title;
    // eslint-disable-next-line no-underscore-dangle
    delete result._activeDate;
    result.lastModified = new Date(result.lastModified);
    delete result.lastModified;

    return result;
  }

  getRawBasicData() {
    return this.basicData;
  }
  
  async getWorldInfo() {

    try {
            
      const { data } = await this.http.sendGet(
        ENDPOINT.WORLD_INFO,
        `${this.auth.tokenType} ${this.auth.accessToken}`,
      );

      return data;

    } catch (err) {

      this.launcher.debug.print(new Error(err));

    }

    return false;
  }

  getCreativeWorld(code) {
    return CreativeWorld.getByCode(this, code);
  }

  async getFavoriteCreativeWorlds() {
    
    try {
            
      let { data } = await this.http.sendGet(
        `${ENDPOINT.CREATIVE_FAVORITES}/${this.launcher.account.id}?limit=30`, // TODO: Add pagination
        `${this.auth.tokenType} ${this.auth.accessToken}`,
      );

      data = data.results.map(result => new CreativeWorld(this, {
        code: result.linkData.mnemonic,
        author: new User(this.launcher, {
          accountId: result.linkData.accountId,
          displayName: result.linkData.creatorName,
        }),
        title: result.linkData.metadata.title,
        description: result.linkData.metadata.tagline,
        type: result.linkData.metadata.islandType,
        locale: result.linkData.metadata.locale,
      }));

      return data;

    } catch (err) {

      this.launcher.debug.print(new Error(err));

    }

    return false;
  }

}

module.exports = Client;
