const LauncherStatus = require('epicgames-client/src/Communicator/Status');

class Status extends LauncherStatus {

  constructor(communicator, data) {
    super(communicator, data);
    
    this.readProperties();

  }

  readProperties() {

    if (!this.properties) return;

    this.fortnite = {

      basicInfo: this.properties.FortBasicInfo_j ? {
        homeBaseRating: this.properties.FortBasicInfo_j.homeBaseRating,
      } : null,

      lfg: this.properties.FortLFG_I,
      partySize: this.properties.FortPartSize_i,
      subGame: this.properties.FortSubGame_i,
      inUnjoinableMatch: this.properties.InUnjoinableMatch_b,

    };

    let party = Object.keys(this.properties).find(key => key.match(/^party\.joininfodata\.[0-9]{1,}_j$/));

    if (!party) return;
    
    party = this.properties[party];
    
    this.partyJoinData = {
      
      partyId: party.partyId,
      partyTypeId: party.partyTypeId,
      accessKey: party.key,
      appId: party.appId,
      buildId: party.buildId,
      partyFlags: party.partyFlags,
      notAcceptingReason: party.notAcceptingReason,

      source: {
        accountId: party.sourceId,
        displayName: party.sourceDisplayName,
        platform: party.sourcePlatform,
      },

    };

  }

}

module.exports = Status;
