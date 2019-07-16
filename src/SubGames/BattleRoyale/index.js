const SubGame = require('../');

const ENDPOINT = require('../../../resources/Endpoint');
const StatsParser = require('./StatsParser');
const Inventory = require('../../Inventory');

class BattleRoyaleSubGame extends SubGame {
  
  constructor(fn) {
    super(fn);

    this.name = 'BattleRoyale';

    this.inventory = new Inventory(this.fn);

  }

  async init() {

    await this.fn.updateProfile('athena');

    Object.keys(this.fn.profiles.athena.items).forEach((id) => {
      this.inventory.addItem({
        id,
        ...this.fn.profiles.athena.items[id],
      });
    });

  }

  /**
   * Returns an object of statistics for specyfic player.
   * @param {string} id id or displayName
   * @param {EInputType} inputType 
   */
  async getStatsForPlayer(id, inputType) {
    
    try {
      
      if (this.launcher.isDisplayName(id)) {

        const account = await this.launcher.lookup(id);
        if (account) ({ id } = account);
        else return false;

      }

      const { data } = await this.fn.http.sendGet(
        `${ENDPOINT.STATSV2}/${id}`,
        `${this.fn.auth.tokenType} ${this.fn.auth.accessToken}`,
      );
      
      return (new StatsParser(this)).parseV2(data, inputType);

    } catch (err) {
      
      this.launcher.debug.print(err);

    }

    return false;
  }

  /**
   * Returns an object of statistics for specyfic player.
   * @param {string} id id or displayName
   * @param {EInputType} inputType 
   */
  async getStatsV1ForPlayer(id, inputType, time) {
    
    time = ['weekly', 'alltime'].indexOf(time) > -1 ? time : 'alltime';

    try {
      
      if (this.launcher.isDisplayName(id)) {

        const account = await this.launcher.lookup(id);
        if (account) ({ id } = account);
        else return false;

      }

      const { data } = await this.fn.http.sendGet(
        `${ENDPOINT.STATS}/${id}/bulk/window/${time}`,
        `${this.fn.auth.tokenType} ${this.fn.auth.accessToken}`,
      );

      return (new StatsParser(this)).parseV1(data, inputType);

    } catch (err) {
      
      this.launcher.debug.print(err);

    }

    return false;
  }

  /**
   * Returns list of store items.
   */
  getStoreItems() {
    return [
      ...this.fn.storeCatalog.storefronts.find(sf => sf.name === 'BRWeeklyStorefront').catalogEntries,
      ...this.fn.storeCatalog.storefronts.find(sf => sf.name === 'BRDailyStorefront').catalogEntries,
    ];
  }

  /**
   * Returns list of store featured items.
   */
  getStoreFeaturedItems() {
    return this.fn.storeCatalog.storefronts.find(sf => sf.name === 'BRWeeklyStorefront').catalogEntries;
  }
  
  /**
   * Returns list of store daily items.
   */
  getStoreDailyItems() {
    return this.fn.storeCatalog.storefronts.find(sf => sf.name === 'BRDailyStorefront').catalogEntries;
  }

  /**
   * Returns an object with list of tournaments and last modified time.
   */
  getTournaments() {

    if (
      !this.fn.basicData
      || !this.fn.basicData.tournamentinformation
      || !this.fn.basicData.tournamentinformation.tournament_info
    ) return false;

    const result = {
      list: this.fn.basicData.tournamentinformation.tournament_info.tournaments.map(item => ({
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
      lastModified: new Date(this.fn.basicData.tournamentinformation.lastModified),
    };

    return result;
  }
  
  /**
   * Returns an object with list of all game modes and last modified time.
   * @param {boolean} onlyActive 
   */
  getPlaylist(onlyActive) {

    if (
      !this.fn.basicData
      || !this.fn.basicData.playlistinformation
      || !this.fn.basicData.playlistinformation.playlist_info
    ) return false;

    let list = this.fn.basicData.playlistinformation.playlist_info.playlists.map(item => ({
      name: item.playlist_name,
      image: item.image,
      isActive: !!item.special_border,
    }));

    if (onlyActive) {
      list = list.filter(item => item.isActive);
    }

    const result = {
      list,
      lastModified: new Date(this.fn.basicData.playlistinformation.lastModified),
    };

    return result;
  }
  
  /**
   * Returns an object with list of news for subgame Battle Royale and last modified time.
   */
  getNews() {

    if (
      !this.fn.basicData
      || !this.fn.basicData.battleroyalenews
      || !this.fn.basicData.battleroyalenews.news
    ) return false;

    const result = {
      list: this.fn.basicData.battleroyalenews.news.messages.map(item => ({
        title: item.title,
        image: item.image,
        body: item.body,
        hidden: item.hidden,
        messageType: item.messagetype,
        adspace: item.adspace,
        spotlight: item.spotlight,
      })),
      style: this.fn.basicData.battleroyalenews.style,
      lastModified: new Date(this.fn.basicData.battleroyalenews.lastModified),
    };

    return result;
  }

  /**
   * 
   * @param {Number} seasonNumber numer of season
   */
  getSeasonStats(seasonNumber) {

    const attrs = this.fn.profiles.athena.stats.attributes;
    
    if (seasonNumber > attrs.season_num) return false;
    
    if (seasonNumber === attrs.season_num) {
      return {
        seasonNumber: attrs.season_num,
        numWins: attrs.season.numWins,
        numHighBracket: attrs.season.numHighBracket,
        numLowBracket: attrs.season.numLowBracket,
        seasonXp: attrs.xp,
        seasonLevel: attrs.level,
        bookXp: attrs.book_xp,
        bookLevel: attrs.book_level,
        bookPurchased: attrs.book_purchased,
      };
    }
    
    const season = attrs.past_seasons.find(s => s.seasonNumber === seasonNumber);
    season.bookPurchased = season.purchasedVIP;
    delete season.purchasedVIP;
    
    return season;
  }

}

module.exports = BattleRoyaleSubGame;
