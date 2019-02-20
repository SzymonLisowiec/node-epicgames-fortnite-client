const Item = require('../Item');

class Currency extends Item {

  constructor(app, data) {
    super(app, data);
    
    this.platform = data.platform;

  }

}

module.exports = Currency;
