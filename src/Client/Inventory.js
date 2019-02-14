class Item {

  constructor(app, items) {

    this.app = app;
    this.client = this.app.launcher;

    this.items = items;

  }

  addItem(item) {
    this.items.push(item);
  }

  addItems(items) {
    this.items.push(...items);
  }
  
  findItemsByTemplate(template) {
    return this.items.filter(item => item.templateId.slice(0, template.length) === template);
  }

  getItems() {
    return this.items;
  }

  getItem(id) {
    return this.items.find(item => item.id === id);
  }

}

module.exports = Item;
