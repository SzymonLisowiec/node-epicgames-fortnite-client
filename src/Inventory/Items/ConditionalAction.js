const Item = require('../Item');

class ConditionalAction extends Item {

  constructor(app, data) {
    super(app, data);

    this.devName = this.attributes.devName;
    this.seen = !!this.attributes.item_seen;
    this.favorite = !!this.attributes.favorite;
    
    this.conditions = this.attributes.conditions;

  }

}

module.exports = ConditionalAction;
