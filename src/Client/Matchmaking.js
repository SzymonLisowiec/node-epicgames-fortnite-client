const Events = require('events');
const ENDPOINT = require('../../resources/Endpoint');

class Client extends Events {

  constructor(client, options) {
    super();

    if (typeof options === 'undefined') options = {};

    this.options = {
      ...options,
    };

    this.client = client;
    this.launcher = this.client.launcher;
    this.account = this.client.launcher.account;

    this.http = this.client.http;

    (async () => {

      // const {
      //   serviceUrl,
      //   ticketType,
      //   payload,
      //   signature, 
      // } = await this.getTicket();

      // XMPP connection

    })();

  }

  async getTicket() {
    
    try {
            
      const { data } = await this.http.sendGet(
        `${ENDPOINT.MATCHMAKING_TICKET.replace('{{account_id}}', this.account.id)}?partyPlayerIds=${this.account.id}&bucketId=4620426%3A0%3AEU%3Aplaylist_defaultsolo&player.platform=Windows&player.subregions=DE%2CFR%2CGB&player.option.crossplayOptOut=false&party.WIN=true&input.KBM=true`,
        `${this.client.auth.token_type} ${this.client.auth.access_token}`,
      );
      
      return data;

    } catch (err) {

      this.launcher.debug.print(new Error(err));

    }

    return false;
  }

}

module.exports = Client;
