const Item = require('../Item');

class Token extends Item {

  constructor(app, data) {
    super(app, data);
    
    this.seen = !!data.attributes.item_seen;
    this.favorite = !!data.attributes.favorite;

  }

}

module.exports = Token;
