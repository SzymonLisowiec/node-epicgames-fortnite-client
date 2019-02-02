module.exports = Object.freeze({
    WAITING_ROOM: 'https://fortnitewaitingroom-public-service-prod.ol.epicgames.com/waitingroom/api/waitingroom',
    BASIC_DATA: 'https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game',
    VERSION_CHECK: 'https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/v2/versioncheck',
	STATS: 'https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/stats/accountId',
	STOREFRONT_CATALOG: 'https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/storefront/v2/catalog', // ?rvn=4

	CREATIVE_FAVORITES: 'https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/game/v2/creative/favorites', //  /{{account_id}}/{{world_code}}?limit=30

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
	MATCHMAKING_SESSION_JOIN: 'https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/matchmaking/session/{{session_id}}/join', // ?accountId={{account_id}}
	MATCHMAKING_SESSION_FIND_PLAYER: 'https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/matchmaking/session/findPlayer/{{account_id}}'

	/**
	 * 
	 * Results for matchmaking's endpoints:
	 * 
	 * legend:
	 * match id === session id
	 * 
	 * MATCHMAKING_SESSION_ACCOUNT
	 * 
	 * If we requesting for friend:
	 * Error: errors.com.epicgames.fortnite.invalid_encryption_account_id
	 * 
	 * If we requesting for yourself while in match:
	 * {
	 *   accountId: '7486b82f79a64c2d841aa14eaf9d51d3',
	 *   sessionId: 'ae70ccb2f3c3429da4dbe1944f00bd00',
	 *   key: 'eMAQg8Cyt3FuQ4a0lvXSvVmO2vzokL+k9ZBEp0y2ggs='
	 * }
	 * 
	 * 
	 * MATCHMAKING_SESSION_FIND_PLAYER
	 * Everytime empty json response: []
	 * According to https://github.com/Vrekt this endpoint seems to be related to PVE.
	 * 
	 * 
	 * MATCHMAKING_SESSION
	 * 
	 * If we requesting for friend:
	 * Error: errors.com.epicgames.modules.matchmaking.session_already_started
	 * 
	 * If we requesting for yourself while in match:
	 * {
	 *   id: 'ae70ccb2f3c3429da4dbe1944f00bd00',
	 *   ownerId: 'D22C924408D685D079FC7804081914A1',
	 *   ownerName: '[DS]fortnite-liveeuaws02c59ubrcore-4821335-2-i-034a139c3e237c6a1-5626',
	 *   serverName: '[DS]fortnite-liveeuaws02c59ubrcore-4821335-2-i-034a139c3e237c6a1-5626',
	 *   serverAddress: '52.59.234.28',
	 *   serverPort: 9005,
	 *   maxPublicPlayers: 120,
	 *   openPublicPlayers: 23,
	 *   maxPrivatePlayers: 0,
	 *   openPrivatePlayers: 0,
	 *   attributes:
	 *   {
	 *     REGION_s: 'EU',
	 *     GAMEMODE_s: 'FORTATHENA',
	 *     SUBREGION_s: 'DE',
	 *     DCID_s: 'FORTNITE-LIVEEUAWS02C59UBRCORE-4821335-2',
	 *     NEEDS_i: 2,
	 *     NEEDSSORT_i: 2,
	 *     tenant_s: 'Fortnite',
	 *     MATCHMAKINGPOOL_s: 'Any',
	 *     PLAYLISTID_i: 2,
	 *     HOTFIXVERSION_i: 0,
	 *     SESSIONKEY_s: 'DA80811808D685E6C02FE6D842502312',
	 *     TENANT_s: 'Fortnite',
	 *     BEACONPORT_i: 15005 },
	 *     publicPlayers: [ ... ], // array of account ids
	 *     privatePlayers: [],
	 *     totalPlayers: 97,
	 *     allowJoinInProgress: false,
	 *     shouldAdvertise: false,
	 *     isDedicated: false,
	 *     usesStats: false,
	 *     allowInvites: false,
	 *     usesPresence: false,
	 *     allowJoinViaPresence: false,
	 *     allowJoinViaPresenceFriendsOnly: false,
	 *     buildUniqueId: '4691381',
	 *     lastUpdated: '2019-01-29T12:42:15.514Z',
	 *     started: true
	 * }
	 * 
	 */
});