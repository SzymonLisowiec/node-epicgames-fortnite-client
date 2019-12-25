const LauncherMemberMeta = require('epicgames-client/src/Party/MemberMeta');
const { EInputType } = require('epicgames-client');

class MemberMeta extends LauncherMemberMeta {

  constructor(member, meta) {
    super(member);

    const defaultCharacters = [
      'CID_556_Athena_Commando_F_RebirthDefaultA',
      'CID_557_Athena_Commando_F_RebirthDefaultB',
      'CID_558_Athena_Commando_F_RebirthDefaultC',
      'CID_559_Athena_Commando_F_RebirthDefaultD',
      'CID_560_Athena_Commando_M_RebirthDefaultA',
      'CID_561_Athena_Commando_M_RebirthDefaultB',
      'CID_562_Athena_Commando_M_RebirthDefaultC',
      'CID_563_Athena_Commando_M_RebirthDefaultD',
    ];

    const character = defaultCharacters[Math.floor(Math.random() * defaultCharacters.length)];
    
    this.schema = {
      Location_s: 'PreLobby',
      CampaignHero_j: JSON.stringify({
        CampaignHero: {
          heroItemInstanceId: '',
          heroType: `FortHeroType'/Game/Athena/Heroes/${character}.${character}'`,
        },
      }),
      MatchmakingLevel_U: '0',
      ZoneInstanceId_s: '',
      HomeBaseVersion_U: '1',
      HasPreloadedAthena_b: false,
      FrontendEmote_j: JSON.stringify({
        FrontendEmote: {
          emoteItemDef: 'None',
          emoteItemDefEncryptionKey: '',
          emoteSection: 1,
        },
      }),
      NumAthenaPlayersLeft_U: '0',
      UtcTimeStartedMatchAthena_s: '0001-01-01T00:00:00.000Z',
      GameReadiness_s: 'SittingOut',
      HiddenMatchmakingDelayMax_U: '0',
      ReadyInputType_s: 'Count',
      CurrentInputType_s: 'MouseAndKeyboard',
      AssistedChallengeInfo_j: JSON.stringify({
        AssistedChallengeInfo: {
          questItemDef: 'None',
          objectivesCompleted: 0,
        },
      }),
      MemberSquadAssignmentRequest_j: JSON.stringify({
        MemberSquadAssignmentRequest: {
          startingAbsoluteIdx: -1,
          targetAbsoluteIdx: -1,
          swapTargetMemberId: 'INVALID',
          version: 0,
        },
      }),
      AthenaCosmeticLoadout_j: JSON.stringify({
        AthenaCosmeticLoadout: {
          characterDef: `AthenaCharacterItemDefinition'/Game/Athena/Items/Cosmetics/Characters/${character}.${character}'`,
          characterEKey: '',
          backpackDef: 'None',
          backpackEKey: '',
          pickaxeDef: 'AthenaPickaxeItemDefinition\'/Game/Athena/Items/Cosmetics/Pickaxes/DefaultPickaxe.DefaultPickaxe\'',
          pickaxeEKey: '',
          variants: [],
        },
      }),
      AthenaBannerInfo_j: JSON.stringify({
        AthenaBannerInfo: {
          bannerIconId: 'standardbanner15',
          bannerColorId: 'defaultcolor15',
          seasonLevel: 1,
        },
      }),
      BattlePassInfo_j: JSON.stringify({
        BattlePassInfo: {
          bHasPurchasedPass: false,
          passLevel: 1,
          selfBoostXp: 0,
          friendBoostXp: 0,
        },
      }),
      Platform_j: JSON.stringify({
        Platform: {
          platformStr: this.app.config.platform.short,
        },
      }),
      PlatformUniqueId_s: 'INVALID',
      PlatformSessionId_s: '',
      CrossplayPreference_s: 'OptedIn',
      VoiceChatEnabled_b: 'true',
      VoiceConnectionId_s: '',
    };

    if (meta) this.update(meta, true);

  }

  async setPlatform(platform) {
    let loadout = this.get('Platform_j');
    loadout = this.set('Platform_j', {
      ...loadout,
      Platform: {
        ...loadout.Platform,
        platformStr: platform,
      },
    });
    await this.member.patch({
      Platform_j: loadout,
    });
  }

  async setBanner(data) {
    let loadout = this.get('AthenaBannerInfo_j');
    loadout = this.set('AthenaBannerInfo_j', {
      ...loadout,
      AthenaBannerInfo: {
        ...loadout.AthenaBannerInfo,
        ...data,
      },
    });
    await this.member.patch({
      AthenaBannerInfo_j: loadout,
    });
  }

  async setBattlePass(data) {
    let loadout = this.get('BattlePassInfo_j');
    loadout = this.set('BattlePassInfo_j', {
      ...loadout,
      BattlePassInfo: {
        ...loadout.BattlePassInfo,
        ...data,
      },
    });
    await this.member.patch({
      BattlePassInfo_j: loadout,
    });
  }

  async setCosmeticLoadout(data) {
    let loadout = this.get('AthenaCosmeticLoadout_j');
    loadout = this.set('AthenaCosmeticLoadout_j', {
      ...loadout,
      AthenaCosmeticLoadout: {
        ...loadout.AthenaCosmeticLoadout,
        ...data,
      },
    });
    await this.member.patch({
      AthenaCosmeticLoadout_j: loadout,
    });
  }

  async setEmote(data) {
    let loadout = this.get('FrontendEmote_j');
    loadout = this.set('FrontendEmote_j', {
      ...loadout,
      FrontendEmote: {
        ...loadout.FrontendEmote,
        ...data,
      },
    });
    await this.member.patch({
      FrontendEmote_j: loadout,
    });
  }

  async setInputType(inputType) {
    await this.member.patch({
      CurrentInputType_s: this.set('CurrentInputType_s', Object.keys(EInputType)[inputType]),
    });
  }

  async setState(state) {
    var newstate = States[state] || 'NotReady';
    await this.member.patch({
      GameReadiness_s: this.set('GameReadiness_s', newstate),
      ReadyInputType_s: this.get('CurrentInputType_s'),
    });
  }

  async currentState() {
    return this.get('GameReadiness_s');
  }
  
}

module.exports = MemberMeta;
