const Item = require('../Item');

class QuestItem extends Item {

  constructor(app, data) {
    super(app, data);

    this.challengeBundleId = this.attributes.challenge_bundle_id;
    this.challengeLinkedQuestGiven = this.attributes.challenge_linked_quest_given;
    this.questState = this.attributes.quest_state;
    this.lastStateChangeTime = this.attributes.last_state_change_time;
    this.challengeLinkedQuestParent = this.attributes.challenge_linked_quest_parent;
    
  }

}

module.exports = QuestItem;
