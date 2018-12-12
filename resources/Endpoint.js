module.exports = Object.freeze({
    WAITING_ROOM: 'https://fortnitewaitingroom-public-service-prod.ol.epicgames.com/waitingroom/api/waitingroom',
    BASIC_DATA: 'https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game',
    VERSION_CHECK: 'https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/v2/versioncheck',
	STATS: 'https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/stats/accountId',
	STOREFRONT_CATALOG: 'https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/storefront/v2/catalog', // ?rvn=4

	WORLD_INFO: 'https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/game/v2/world/info',
	// XMPP wss://notifications-service-prod06.ol.epicgames.com:443.ol.epicgames.com/stomp
	/**
	 * [2018.12.12-12.09.13:579][500]LogProfileSys: MCP-Profile: subscribed to notifications topic '/topic/fn/profile/{{account_id}}/fortnite'
	 * [2018.12.12-12.09.13:611][504]LogPostmaster: Display: Subscribed to Stomp topic '/topic/fn/twitch/{{account_id}}/fortnite' with id 'mcp-1-nil'
	 */

	// IDK, friend codes?: https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/game/v2/friendcodes/9a1d43b1d826420e9fa393a79b74b2ff/epic
	
	MATCHMAKING_TICKET: 'https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/game/v2/matchmakingservice/ticket/player/{{account_id}}', // ?partyPlayerIds=59a2dae26f7e4ba18e05d4db37bf3189&bucketId=4620426%3A0%3AEU%3Aplaylist_defaultsquad&player.platform=Windows&player.subregions=DE%2CFR%2CGB&player.option.fillTeam=true&player.option.crossplayOptOut=false&party.WIN=true&input.KBM=true
	// XMPP wss://fortnite-matchmaking-public-service-live-prod-a.ol.epicgames.com:443
	MATCHMAKING_SESSION: 'https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/matchmaking/session/{{session_id}}',
	MATCHMAKING_SESSION_ACCOUNT: 'https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/game/v2/matchmaking/account/{{account_id}}/session/{{session_id}}',
	MATCHMAKING_SESSION_JOIN: 'https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/matchmaking/session/{{session_id}}/join' // ?accountId={{account_id}}
});