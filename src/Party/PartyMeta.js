const LauncherPartyMeta = require('epicgames-client/src/Party/PartyMeta');

class PartyMeta extends LauncherPartyMeta {

  constructor(party, meta) {
    super(party);

    this.schema = {
      PrimaryGameSessionId_s: '',
      PartyState_s: 'BattleRoyaleView',
      LobbyConnectionStarted_b: 'false',
      MatchmakingResult_s: 'NoResults',
      MatchmakingState_s: 'NotMatchmaking',
      SessionIsCriticalMission_b: 'false',
      ZoneTileIndex_U: '-1',
      ZoneInstanceId_s: '',
      TheaterId_s: '',
      TileStates_j: JSON.stringify({
        TileStates: [],
      }),
      MatchmakingInfoString_s: '',
      CustomMatchKey_s: '',
      PlaylistData_j: JSON.stringify({
        PlaylistData: {
          playlistName: 'Playlist_DefaultDuo',
          tournamentId: '',
          eventWindowId: '',
          regionId: 'EU',
        },
      }),
      AthenaSquadFill_b: 'true',
      AllowJoinInProgress_b: 'false',
      LFGTime_s: '0001-01-01T00:00:00.000Z',
      PartyIsJoinedInProgress_b: 'false',
      GameSessionKey_s: '',
      RawSquadAssignments_j: '',
      PrivacySettings_j: JSON.stringify({
        PrivacySettings: {
          partyType: this.party.config.privacy.partyType,
          partyInviteRestriction: this.party.config.privacy.inviteRestriction,
          bOnlyLeaderFriendsCanJoin: this.party.config.privacy.onlyLeaderFriendsCanJoin,
        },
      }),
      PlatformSessions_j: JSON.stringify({
        PlatformSessions: [],
      }),
    };

    if (meta) this.update(meta, true);
    this.refreshSquadAssignments();

  }

  refreshSquadAssignments() {
    const assignments = [];
    let i = 0;
    this.party.members.forEach((member) => {
      if (member.role === 'CAPTAIN') {
        assignments.push({
          memberId: member.id,
          absoluteMemberIdx: 0,
        });
      } else {
        i += 1;
        assignments.push({
          memberId: member.id,
          absoluteMemberIdx: i,
        });
      }
    });
    return this.set('RawSquadAssignments_j', {
      RawSquadAssignments: assignments,
    });
  }

  async setCustomMatchKey(key) {
    await this.party.patch({
      CustomMatchKey_s: this.set('CustomMatchKey_s', key || ''),
    });
  }

  async setAllowJoinInProgress(canJoin) {
    await this.party.patch({
      AllowJoinInProgress_b: this.set('AllowJoinInProgress_b', !!canJoin),
    });
  }

  async setPlaylist(regionId, playlistName, tournamentId, eventWindowId) {
    if (!regionId) throw new Error('Wrong region id!');
    if (!playlistName) throw new Error('Wrong playlist name!');
    await this.party.patch({
      PlaylistData_j: this.set('PlaylistData_j', {
        PlaylistData: {
          playlistName,
          tournamentId: tournamentId || '',
          eventWindowId: eventWindowId || '',
          regionId,
        },
      }),
    });
  }
  
}

module.exports = PartyMeta;
