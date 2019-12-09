const LauncherMember = require('epicgames-client/src/Party/Member');

class Member extends LauncherMember {

  isReady() {
    return this.meta.isReady();
  }

  async setReady(...args) {
    this.checkPermissions();
    await this.meta.setReady(...args);
  }

  async setInputType(...args) {
    this.checkPermissions();
    await this.meta.setInputType(...args);
  }

  async setPlatform(...args) {
    this.checkPermissions();
    await this.meta.setPlatform(...args);
  }

  async setEmote(asset) {
    this.checkPermissions();
    await this.meta.setEmote({
      emoteItemDef: `/Game/Athena/Items/Cosmetics/Dances/${asset}.${asset}`,
    });
  }

  async clearEmote() {
    this.checkPermissions();
    await this.meta.setEmote({
      emoteItemDef: 'None',
    });
  }

  async setBanner(level, icon, color) {
    this.checkPermissions();
    const payload = {};
    if (typeof level === 'number') payload.seasonLevel = level;
    if (typeof icon === 'string' && icon !== '') payload.bannerIconId = icon;
    if (typeof color === 'string' && color !== '') payload.bannerColorId = color;
    await this.meta.setBanner(payload);
  }

  async setBattlePass(hasPuchased, level, selfBoostXp, friendBoostXp) {
    this.checkPermissions();
    const payload = {};
    if (typeof hasPuchased === 'boolean') payload.bHasPurchasedPass = hasPuchased;
    if (typeof level === 'number') payload.passLevel = level;
    if (typeof selfBoostXp === 'number') payload.selfBoostXp = selfBoostXp;
    if (typeof friendBoostXp === 'number') payload.friendBoostXp = friendBoostXp;
    await this.meta.setBattlePass(payload);
  }

  /**
   * Variants are after the asset.
   * 
   * 
   * NOTE: Assets only need the cid now.
   * 
   * 
   * [
   *  {
   *    ownedVariantTags:{
   *      gameplayTags:[]
   *    },
   *    itemVariantIsUsedFor: 'AthenaCharacterItemDefinition\'/Game/Athena/Items/Cosmetics/Characters/CID_286_Athena_Commando_F_NeonCat.CID_286_Athena_Commando_F_NeonCat\'',
   *    variantChannelTag: {
   *      tagName:'Cosmetics.Variant.Channel.Parts'
   *    },
   *    activeVariantTag: {
   *      tagName: 'Cosmetics.Variant.Property.Stage4'
   *    }
   *  }
   * ]
   */

  async setOutfit(asset, variants) {
    await this.meta.setCosmeticLoadout({
      characterDef: `/Game/Athena/Items/Cosmetics/Characters/${asset}.${asset}`,
      characterEKey: '',
      variants: variants || '',
    });
  }

  async setBackpack(asset, variants) {
    await this.meta.setCosmeticLoadout({
      backpackDef: `/Game/Athena/Items/Cosmetics/Backpacks/${asset}.${asset}`,
      backpackEKey: '',
      variants: variants
    });
  }

  async setPickaxe(asset, variants) {
    await this.meta.setCosmeticLoadout({
      pickaxeDef: `/Game/Athena/Items/Cosmetics/Pickaxes/${asset}.${asset}`,
      pickaxeEKey: '',
      variants: variants,
    });
  }

}

module.exports = Member;
