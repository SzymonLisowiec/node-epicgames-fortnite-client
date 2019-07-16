const ENDPOINT = require('../../../resources/Endpoint');

class CreativeWorld {

  constructor(fn, data) {

    this.fn = fn;

    this.code = data.code || null;
    this.title = data.title || null;
    this.description = data.description || null;
    this.type = data.type || null;
    this.locale = data.locale || null;
    this.introduction = data.introduction || null;
    this.youtubeVideoId = data.youtubeVideoId || null;
    this.creatorAccountId = data.creatorAccountId || null;
    this.creatorTag = data.creatorTag || null;

  }

  async addToFavorites() {

    if (!this.code) return false;

    try {
            
      await this.fn.http.send(
        'PUT',
        `${ENDPOINT.CREATIVE_FAVORITES}/${this.fn.launcher.account.id}/${this.code}`,
        `${this.fn.auth.token_type} ${this.fn.auth.access_token}`,
      );

      return true;

    } catch (err) {

      this.fn.launcher.debug.print(new Error(err));

    }

    return false;
  }

  static async getByCode(fn, code) {

    const link = await fn.getLink(code);

    if (!link) return false;

    try {

      return new this(fn, {
        code: link.mnemonic,
        creatorTag: link.creatorName,
        creatorAccountId: link.accountId,
        title: link.metadata.title,
        description: link.metadata.tagline,
        type: link.metadata.islandType,
        locale: link.metadata.locale,
        introduction: link.metadata.introduction,
        youtubeVideoId: link.metadata.youtube_video_id,
      });

    } catch (err) {

      fn.launcher.debug.print(err);
      fn.launcher.debug.print(new Error(`Cannot get creative world with code: ${code}`));

    }

    return false;
  }
  
}

module.exports = CreativeWorld;
