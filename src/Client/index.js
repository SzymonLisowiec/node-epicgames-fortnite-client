const Events = require('events');
const ENDPOINT = require('../../resources/Endpoint');

const Http = require('../Http');
const Item = require('./Item');
const Inventory = require('./Inventory');

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
    this.commonCore = {};
    this.commonPublic = {};
    this.inventory = new Inventory(this, []);

    this.auth = null;

    this.communicator = null;

  }

  get giftsHistory() {
    return this.commonCore.profileChanges[0].profile.stats.attributes.gift_history.gifts.map(gift => ({
      offerId: gift.offerId,
      toAccountId: gift.toAccountId,
      time: new Date(gift.date),
    }));
  }

  get countOfSentGifts() {
    return this.commonCore.profileChanges[0].profile.stats.attributes.gift_history.num_sent;
  }

  get countOfReceivedGifts() {
    return this.commonCore.profileChanges[0].profile.stats.attributes.gift_history.num_received;
  }

  get canSendGifts() {
    return this.commonCore.profileChanges[0].profile.stats.attributes.allowed_to_send_gifts;
  }

  get canReceiveGifts() {
    return this.commonCore.profileChanges[0].profile.stats.attributes.allowed_to_receive_gifts;
  }

  get usedCreatorTag() {
    if (!this.commonCore.profileChanges[0].profile.stats.attributes.mtx_affiliate) return false;
    return {
      name: this.commonCore.profileChanges[0].profile.stats.attributes.mtx_affiliate,
      lastModified: this.commonCore.profileChanges[0].profile.stats.attributes.mtx_affiliate_set_time,
    };
  }

  get countUsedRefunds() {
    return this.commonCore.profileChanges[0].profile.stats.attributes.mtx_purchase_history.refundsUsed;
  }

  get countPossibleRefunds() {
    return this.commonCore.profileChanges[0].profile.stats.attributes.mtx_purchase_history.refundCredits;
  }

  get purchasesHistory() {
    return this.commonCore.profileChanges[0].profile.stats.attributes.mtx_purchase_history.purchases.map(purchase => ({
      purchaseId: purchase.purchaseId,
      offerId: purchase.offerId,
      purchaseDate: new Date(purchase.purchaseDate),
      refundDate: purchase.refundDate ? new Date(purchase.refundDate) : null,
      isRefunded: !!purchase.refundDate,
      fulfillments: purchase.fulfillments,
      paid: purchase.totalMtxPaid,
      lootResult: purchase.lootResult.map(item => new Item(this, {
        id: item.itemGuid,
        templateId: item.itemType,
        // itemProfile: item.itemProfile,
        quantity: item.quantity,
      })),
    }));
  }

  get PVEBase() {
    if (!this.commonPublic.profileChanges[0].profile.stats.attributes.homebase_name) return false;
    return {
      name: this.commonPublic.profileChanges[0].profile.stats.attributes.homebase_name,
      bannerColor: this.commonPublic.profileChanges[0].profile.stats.attributes.banner_color,
      bannerIcon: this.commonPublic.profileChanges[0].profile.stats.attributes.banner_icon,
    };
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

          const { data: commonPublic } = await this.http.send(
            'POST',
            `https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/game/v2/profile/${this.launcher.account.id}/client/QueryProfile?profileId=common_public&rvn=-1`,
            `${this.auth.tokenType} ${this.auth.accessToken}`,
            {
              rev: 1,
              version: 'fortnite_start@w=9',
            },
          );

          this.commonPublic = commonPublic;
        
          const { data: commonCore } = await this.http.send(
            'POST',
            `https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/game/v2/profile/${this.launcher.account.id}/client/QueryProfile?profileId=common_core&rvn=-1`,
            `${this.auth.tokenType} ${this.auth.accessToken}`,
            {
              rev: 2259,
              version: 'fortnite_start@w=9',
            },
          );

          this.commonCore = commonCore;
          this.inventory.addItems(Object.keys(this.commonCore.profileChanges[0].profile.items).map(
            id => new Item(this, {
              ...this.commonCore.profileChanges[0].profile.items[id],
              id,
            }),
          ));
          
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
      list: this.basicData.tournamentinformation.tournament_info.tournaments.map(item => ({
        tournamentDisplayId: item.tournament_display_id,
        titleLine1: item.title_line_1,
        titleLine2: item.title_line_2,
        titleColor: item.title_color,
        shortFormatTitle: item.short_format_title,
        longFormatTitle: item.long_format_title,
        detailsDescription: item.details_description,
        flavorDescription: item.flavor_description,
        pinScoreRequirement: item.pin_score_requirement,
        pinEarnedText: item.pin_earned_text,
        scheduleInfo: item.schedule_info,

        posterFrontImage: item.poster_front_image,
        posterBackImage: item.poster_back_image,
        playlistTileImage: item.playlist_tile_image,
        loadingScreenImage: item.loading_screen_image,

        posterFaceColor: item.poster_fade_color,
        primaryColor: item.primary_color,
        secondaryColor: item.secondary_color,
        highlightColor: item.highlight_color,
        shadowColor: item.shadow_color,
        baseColor: item.base_color,
        backgroundLeftColor: item.background_left_color,
        backgroundRightColor: item.background_right_color,
        backgroundTextColor: item.background_text_color,
      })),
      lastModified: new Date(this.basicData.tournamentinformation.lastModified),
    };

    return result;
  }
  
  getPlaylist(onlyActive) {

    if (
      !this.basicData
      || !this.basicData.playlistinformation
      || !this.basicData.playlistinformation.playlist_info
    ) return false;

    let list = this.basicData.playlistinformation.playlist_info.playlists.map(item => ({
      name: item.playlist_name,
      image: item.image,
      isActive: !!item.special_border,
    }));

    if (onlyActive) {
      list = list.filter(item => item.isActive);
    }

    const result = {
      list,
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
      list: this.basicData.battleroyalenews.news.messages.map(item => ({
        title: item.title,
        image: item.image,
        body: item.body,
        hidden: item.hidden,
        messageType: item.messagetype,
        adspace: item.adspace,
        spotlight: item.spotlight,
      })),
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
      list: this.basicData.savetheworldnews.news.messages.map(item => ({
        title: item.title,
        image: item.image,
        body: item.body,
        hidden: item.hidden,
        messageType: item.messagetype,
        adspace: item.adspace,
        spotlight: item.spotlight,
      })),
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
