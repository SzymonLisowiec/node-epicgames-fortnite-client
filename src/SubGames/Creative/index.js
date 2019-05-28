const { User } = require('epicgames-client');

const SubGame = require('../');
const ENDPOINT = require('../../../resources/Endpoint');
const CreativeWorld = require('./CreativeWorld');

class CreativeSubGame extends SubGame {
  
  constructor(fn) {
    super(fn);

    this.name = 'Creative';

  }

  async init() {

    await this.fn.updateProfile('athena');

  }

  // DEPRECATED
  // /**
  //  * Returns informations about creative world.
  //  * @param {string} code in format `XXXX-XXXX-XXXX`
  //  */
  // getWorldByCode(code) {
  //   return CreativeWorld.getByCode(this.fn, code);
  // }

  /**
   * Returns list of your favorite creative worlds.
   */
  async getFavoriteCreativeWorlds() {
    
    try {
            
      let { data } = await this.fn.http.sendGet(
        `${ENDPOINT.CREATIVE_FAVORITES}/${this.launcher.account.id}?limit=30`, // TODO: Add pagination
        `${this.fn.auth.tokenType} ${this.fn.auth.accessToken}`,
      );

      data = data.results.map(result => new CreativeWorld(this.fn, {
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

module.exports = CreativeSubGame;
