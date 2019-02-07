const LauncherStatus = require('epicgames-client/src/Communicator/Status');
const Party = require('epicgames-client/src/Communicator/Party');
const PartyQueryJoinability = require('epicgames-client/src/Communicator/PartyQueryJoinability');

class Status extends LauncherStatus {

	constructor (communicator, data) {
		super(communicator, data);
		
		this.readProperties();

	}

	readProperties () {

		if(!this.properties)
			return;

		this.fortnite = {

			basic_info: this.properties.FortBasicInfo_j ? {
				home_base_rating: this.properties.FortBasicInfo_j.homeBaseRating
			} : null,

			lfg: this.properties.FortLFG_I,
			party_size: this.properties.FortPartSize_i,
			subgame: this.properties.FortSubGame_i,
			in_unjoinable_match: this.properties.InUnjoinableMatch_b

		};

		let party = Object.keys(this.properties).find(key => {
			return key.match(/^party\.joininfodata\.[0-9]{1,}\_j$/);
		});

		if(!party)
			return;
		
		party = this.properties[party];
		
		this.party_join_data = {
			
			party_id: party.partyId,
			party_type_id: party.partyTypeId,
			access_key: party.key,
			app_id: party.appId,
			build_id: party.buildId,
			party_flags: party.partyFlags,
			not_accepting_reason: party.notAcceptingReason,

			source: {
				account_id: party.sourceId,
				display_name: party.sourceDisplayName,
				platform: party.sourcePlatform
			}

		};

	}

	async joinToParty () {
		
		if(!this.party_join_data)
			return false;

		let party = new Party(this.communicator, this.party_join_data);

		await this.party.askToJoin(this.sender.jid);

		return party;
	}

}

module.exports = Status;