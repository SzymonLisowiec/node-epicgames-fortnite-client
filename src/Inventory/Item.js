class Item {

  constructor(app, data) {

    this.app = app;
    this.client = this.app.launcher;

    this.id = data.id;
    this.templateId = data.templateId;
    this.quantity = data.quantity;

    this.attributes = data.attributes || {};

  }

  /**
   * mark item seen.
   */
  async markAsSeen() {

    if (this.seen !== false) return;

    await this.app.requestMCP('MarkItemSeen', 'athena', {
      itemIds: [this.id],
    });

    this.seen = true;

  }

}

module.exports = Item;
