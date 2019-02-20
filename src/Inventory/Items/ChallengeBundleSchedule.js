const Item = require('../Item');

class ChallengeBundleSchedule extends Item {

  constructor(app, data) {
    super(app, data);

    this.seen = !!this.attributes.item_seen;
    this.favorite = !!this.attributes.favorite;
    
    this.unlockEpoch = new Date(this.attributes.unlock_epoch);
    this.grantedBundles = this.attributes.granted_bundles;

  }

}

module.exports = ChallengeBundleSchedule;
