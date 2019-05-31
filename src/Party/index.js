const LauncherParty = require('epicgames-client/src/Party');

const Member = require('./Member');

class Party extends LauncherParty {

  static get Member() { return Member; }

  constructor(app, data) {
    super(app, data);

    this.Member = Party.Member;

    this.app.communicator.on(`party#${this.id}:member:joined`, () => {
      if (this.me.id !== this.leader.id) return;
      this.meta.refreshSquadAssignments();
      this.patch();
    });

  }

  async setCustomMatchKey(...args) {
    await this.meta.setCustomMatchKey(...args);
  }

  async setAllowJoinInProgress(...args) {
    await this.meta.setAllowJoinInProgress(...args);
  }

  async setPlaylist(...args) {
    await this.meta.setPlaylist(...args);
  }

}

module.exports = Party;
