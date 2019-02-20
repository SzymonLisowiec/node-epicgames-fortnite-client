const Item = require('../Item');

class AthenaSkyDiveContrail extends Item {

  constructor(app, data) {
    super(app, data);

    this.seen = !!this.attributes.item_seen;
    this.favorite = !!this.attributes.favorite;
    this.variants = this.attributes.variants;

  }

  async unequip() {

    if (this.app.profiles.athena.stats.attributes.favorite_skydivecontrail !== this.id) return;

    await this.app.requestMCP('EquipBattleRoyaleCustomization', 'athena', {
      slotName: 'SkyDiveContrail',
    });

    this.app.profiles.athena.stats.attributes.favorite_skydivecontrail = '';

  }

}

module.exports = AthenaSkyDiveContrail;
