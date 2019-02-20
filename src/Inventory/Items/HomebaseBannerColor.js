const Item = require('../Item');

class HomebaseBannerColor extends Item {

  constructor(app, data) {
    super(app, data);

    this.seen = !!this.attributes.item_seen;

  }

}

module.exports = HomebaseBannerColor;
