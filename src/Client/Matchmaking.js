/* eslint-disable */

const Events = require('events');
const { client: WebsocketClient } = require('websocket');
const ENDPOINT = require('../../resources/Endpoint');

class Matchmaking extends Events {

  constructor(app, options) {
    super();

    if (typeof options === 'undefined') options = {};

    this.options = {
      ...options,
    };

    this.app = app;
    this.launcher = this.app.launcher;
    this.account = this.launcher.account;

    this.http = this.launcher.http;
    this.communicator = null;

    /**
     * Currently I don't know, how to authorize websocket connection.
     */

    (async () => {

      const {
        serviceUrl,
        ticketType,
        payload,
        signature, 
      } = await this.getTicket();

      const ws = new WebsocketClient();

      ws.on('connectFailed', (error) => {
        console.dir(error);
      });
      
      ws.on('connect', (connection) => {

        console.log('WebSocket Client Connected');
          
        connection.on('error', (error) => {
          console.dir(error);
        });
        connection.on('close', () => {
          console.log('echo-protocol Connection Closed');
        });
        connection.on('message', (message) => {
          console.dir(message);
        });

      });

      ws.connect(serviceUrl, 'echo-protocol', null, {
        Authorization: payload,
        Signature: signature,
        signature,
      });
      console.dir(ws);

    })();

  }

  async getTicket() {
    
    try {
      
      const { data } = await this.http.sendGet(
        // eslint-disable-next-line max-len
        `${ENDPOINT.MATCHMAKING_TICKET.replace('{{account_id}}', this.account.id)}?partyPlayerIds=${this.account.id}&bucketId=4620426%3A0%3AEU%3Aplaylist_defaultsolo&player.platform=Windows&player.subregions=DE%2CFR%2CGB&player.option.crossplayOptOut=false&party.WIN=true&input.KBM=true`,
        `${this.app.auth.tokenType} ${this.app.auth.accessToken}`,
      );

      console.dir(data);
      
      return data;

    } catch (err) {

      this.launcher.debug.print(new Error(err));

    }

    return false;
  }

}

module.exports = Matchmaking;
