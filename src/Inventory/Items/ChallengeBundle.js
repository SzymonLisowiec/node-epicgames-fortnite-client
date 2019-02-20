const Item = require('../Item');

class ChallengeBundle extends Item {

  constructor(app, data) {
    super(app, data);

    this.seen = !!this.attributes.item_seen;
    this.favorite = !!this.attributes.favorite;
    
    this.grantedQuestInstanceIds = this.attributes.grantedquestinstanceids;
    this.numProgressQuestsCompleted = this.attributes.num_progress_quests_completed;
    this.numQuestsCompleted = this.attributes.num_quests_completed;
    this.challengeBundleScheduleId = this.attributes.challenge_bundle_schedule_id;
    this.numGrantedBundleQuests = this.attributes.num_granted_bundle_quests;

  }

}

module.exports = ChallengeBundle;
