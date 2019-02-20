const Item = require('../Item');

class HomebaseBannerIcon extends Item {

  constructor(app, data) {
    super(app, data);

    this.seen = !!this.attributes.item_seen;

  }

}

module.exports = HomebaseBannerIcon;
