const Item = require('../Item');

class AthenaItemWrap extends Item {

  constructor(app, data) {
    super(app, data);

    this.seen = !!this.attributes.item_seen;
    this.favorite = !!this.attributes.favorite;
    this.variants = this.attributes.variants;

  }

  async unequip() {

    const index = this.app.profiles.athena.stats.attributes.favorite_itemwraps.indexOf(this.id);

    if (index === -1) return;
    
    await this.app.requestMCP('EquipBattleRoyaleCustomization', 'athena', {
      slotName: 'ItemWrap',
    });

    this.app.profiles.athena.stats.attributes.favorite_itemwraps.splice(index, 1);

  }

}

module.exports = AthenaItemWrap;
