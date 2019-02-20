const Item = require('../Item');

class AthenaMusicPack extends Item {

  constructor(app, data) {
    super(app, data);

    this.seen = !!this.attributes.item_seen;
    this.favorite = !!this.attributes.favorite;
    this.variants = this.attributes.variants;

  }

  async unequip() {

    if (this.app.profiles.athena.stats.attributes.favorite_musicpack !== this.id) return;

    await this.app.requestMCP('EquipBattleRoyaleCustomization', 'athena', {
      slotName: 'MusicPack',
    });

    this.app.profiles.athena.stats.attributes.favorite_musicpack = '';

  }

}

module.exports = AthenaMusicPack;
