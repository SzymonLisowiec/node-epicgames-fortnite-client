class Item {

  constructor(app, data) {

    this.app = app;
    this.client = this.app.launcher;

    this.id = data.id;
    this.templateId = data.templateId;
    this.quantity = data.quantity;

    this.attributes = data.attributes || {};

  }

  get wasSeen() {
    return this.attributes.item_seen || false;
  }

  get isPrivate() {
    // eslint-disable-next-line no-underscore-dangle
    return this.attributes._private || false;
  }

  get devName() {
    return this.attributes.devName || '';
  }

  get eventInstanceId() {
    return this.attributes.event_instance_id || false;
  }

}

module.exports = Item;
