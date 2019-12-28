const LauncherMember = require('epicgames-client/src/Party/Member');

class Member extends LauncherMember {

  currentState() {
    return this.meta.currentState();
  }

    /**
     * The user's state.
    * @param {string} state, either `SittingOut`, `Ready`, or `NotReady`, incorrect sets to NotReady.
    */


  async setState(...args) {
    let state = await this.meta.setState(...args);
    this.checkPermissions();
    if(state == args) throw new Error ("Already on that State!")
    await this.meta.setState(...args);
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
      emoteItemDef: 'None',
    });
    await this.meta.setEmote({
      emoteItemDef: `/Game/Athena/Items/Cosmetics/Dances/${asset}.${asset}`,
    });
  }

  async setEmoji(asset) {
    await this.meta.setEmote({
      emoteItemDef: 'None',
    });
    await this.meta.setEmote({
      emoteItemDef: `/Game/Athena/Items/Cosmetics/Dances/Emoji/${asset}.${asset}`,
    });
  }

  async clearEmote() {
    this.checkPermissions();
    // Not needed anymore.
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

  async setVariant(asset, variant) {

    if(asset.startsWith("CID") || asset.startsWith("cid")) {
     await this.meta.setCosmeticLoadout({
       characterDef: `/Game/Athena/Items/Cosmetics/Characters/${asset}.${asset}`,
       characterEKey: '',
       variants: variant || '',
     });
   }

   if(asset.startsWith("BID") || asset.startsWith("bid") ) {
     await this.meta.setCosmeticLoadout({
       backpackDef: `/Game/Athena/Items/Cosmetics/Backpacks/${asset}.${asset}`,
       backpackEKey: '',
       variants: variant || '',
     });
   }

   if(asset.startsWith("Pickaxe_ID_") || asset.startsWith("pickaxe_id_") ) {
     await this.meta.setCosmeticLoadout({
       pickaxeDef: `/Game/Athena/Items/Cosmetics/Pickaxes/${asset}.${asset}`,
       pickaxeEKey: '',
       variants: variant || '',
     });
   }

  }

 async setOutfit(asset) {
   await this.meta.setCosmeticLoadout({
     characterDef: `/Game/Athena/Items/Cosmetics/Characters/${asset}.${asset}`,
     characterEKey: '',
   });
 }

 async setBackpack(asset) {
   await this.meta.setCosmeticLoadout({
     backpackDef: `/Game/Athena/Items/Cosmetics/Backpacks/${asset}.${asset}`,
     backpackEKey: ''
   });
 }

 async setPickaxe(asset) {
   await this.meta.setCosmeticLoadout({
     pickaxeDef: `/Game/Athena/Items/Cosmetics/Pickaxes/${asset}.${asset}`,
     pickaxeEKey: ''
   });
 }


}

module.exports = Member;
