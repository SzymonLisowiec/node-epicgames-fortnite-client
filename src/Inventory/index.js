/* eslint-disable global-require */

const Items = {
  Quest: require('./Items/Quest'),
  EventPurchaseTracker: require('./Items/EventPurchaseTracker'),
  HomebaseBannerColor: require('./Items/HomebaseBannerColor'),
  HomebaseBannerIcon: require('./Items/HomebaseBannerIcon'),
  Token: require('./Items/Token'),
  Currency: require('./Items/Currency'),
  AthenaCharacter: require('./Items/AthenaCharacter'),
  AthenaDance: require('./Items/AthenaDance'),
  AthenaGlider: require('./Items/AthenaGlider'),
  AthenaPickaxe: require('./Items/AthenaPickaxe'),
  AthenaItemWrap: require('./Items/AthenaItemWrap'),
  AthenaLoadingScreen: require('./Items/AthenaLoadingScreen'),
  AthenaBackpack: require('./Items/AthenaBackpack'),
  AthenaSkyDiveContrail: require('./Items/AthenaSkyDiveContrail'),
  ChallengeBundle: require('./Items/ChallengeBundle'),
  ChallengeBundleSchedule: require('./Items/ChallengeBundleSchedule'),
  ConditionalAction: require('./Items/ConditionalAction'),
  AthenaMusicPack: require('./Items/AthenaMusicPack'),
};

class Inventory {

  constructor(app, items) {

    this.app = app;
    this.client = this.app.launcher;

    this.items = items || [];

  }

  addItem(itemData) {
    
    const itemClass = itemData.templateId.split(':')[0];
    let Item = Items[itemClass];
    
    if (typeof Item === 'undefined') {
      // eslint-disable-next-line no-console
      if (process.env.KYSUNE) console.log(JSON.stringify(itemData, null, 2));
      this.client.debug.print(`Unknown item: ${itemClass}`);
      return;
    }

    Item = new Item(this.app, itemData);

    this.items.push(Item);
  }

  addItems(items) {
    items.forEach(this.addItem.bind(this));
  }
  
  findItemsByClass(template) {
    return this.items.filter(item => item.templateId.slice(0, template.length) === template);
  }

  getItems() {
    return this.items;
  }

  getItem(id) {
    return this.items.find(item => item.id === id);
  }

}

module.exports = Inventory;
