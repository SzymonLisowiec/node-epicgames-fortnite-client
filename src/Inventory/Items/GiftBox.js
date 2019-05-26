const Item = require('../Item');

class GiftBox extends Item {

  constructor(app, data) {
    super(app, data);
    
    this.subGame = this.attributes.params.subGame;
    this.level = this.attributes.level;
    this.xp = this.attributes.xp;
    this.maxLevelBonus = this.attributes.max_level_bonus;
    this.items = this.attributes.lootList;
    this.giftedAt = new Date(this.attributes.giftedOn);
    
  }

}

module.exports = GiftBox;
