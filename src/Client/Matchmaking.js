const ENDPOINT = require('../../resources/Endpoint');

const WebSocketClient = require('websocket').client;
const Events = require('events');
const Http = require('../Http');

class Client extends Events {

	constructor (client, options) {
		super();

		if(typeof options == 'undefined')
			options = {};

		this.options = Object.assign({
			
		}, options);

		this.client = client;
		this.launcher = this.client.launcher;
		this.account = this.client.launcher.account;

		this.http = this.client.http;

		(async _ => {

			let {
				serviceUrl: service_url,
				ticketType: ticket_type,
				payload,
				signature 
			} = await this.getTicket();

			this.stream = new WebSocketClient();

			this.stream.on('connectFailed', function(error) {
				console.log('Connect error: ' + error.toString());
			});
			 
			this.stream.on('connect', function(connection) {
				console.log('Connected');
				
				connection.on('error', function(error) {
					console.log("Connection error: " + error.toString());
				});
				
				connection.on('close', function() {
					console.log('Connection closed');
				});

				connection.on('message', function(message) {
					
					console.dir(message);

				});

			});

			this.stream.connect(service_url, 'echo-protocol', 'prod.ol.epicgames.com', {
				// 'Authorization': signature,
			});

			/**
			 * I don't know how to authorize websocket connection.
			 */

		})();

	}

	async getTicket() {
		
        try {
            
			let { data } = await this.http.sendGet(
				ENDPOINT.MATCHMAKING_TICKET.replace('{{account_id}}', this.account.id) + '?partyPlayerIds=' + this.account.id + '&bucketId=4620426%3A0%3AEU%3Aplaylist_defaultsolo&player.platform=Windows&player.subregions=DE%2CFR%2CGB&player.option.crossplayOptOut=false&party.WIN=true&input.KBM=true',
				this.client.auth.token_type + ' ' + this.client.auth.access_token
			);
			
			return data;

		}catch(err){

			this.launcher.debug.print(new Error(err));

		}

		return false;
	}

}

module.exports = Client;