const Item = require('../Item');

class EventPurchaseTracker extends Item {

  constructor(app, data) {
    super(app, data);
    
    this.devName = this.attributes.devName;
    this.eventInstanceId = this.attributes.event_instance_id;

    // I don't know what does this item.

  }

}

module.exports = EventPurchaseTracker;
