class SubGame {
  
  constructor(fn) {

    this.fn = fn;
    this.launcher = this.fn.launcher;

  }

  async init() {
    // default init
  }

}

module.exports = SubGame;
