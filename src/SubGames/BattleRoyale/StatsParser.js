const { EInputType } = require('epicgames-client');

class StatsParser {

  constructor(subGame) {

    this.app = subGame.fn;
    this.launcher = this.app.launcher;

  }

  parseV1(stats, selectedInputType) {
    
    if (!stats) return false;
    
    const result = {};

    stats.forEach((stat) => {

      const parts = stat.name.match(/^(.*?)_(.*?)_(.*?)_(.*?)_(.*?)$/);

      if (parts.length === 6) {
        
        const name = parts[2];
        const platform = this.readInputType(parts[3]);
        // const m = parts[4]; // I don't know, what is this. It seems, that everytime is `m0`
        let mode = parts[5];

        switch (mode) {
          case 'p2': mode = 'defaultsolo'; break;
          case 'p10': mode = 'defaultduo'; break;
          case 'p9': mode = 'defaultsquad'; break;
          default:
        }

        if (typeof result[platform] === 'undefined') {
          result[platform] = {};
        }

        if (typeof result[platform][mode] === 'undefined') {
          result[platform][mode] = {};
        }

        if (name === 'lastmodified') {
          stat.value = new Date(stat.value * 1000);
        }

        result[platform][mode][this.rename(name)] = stat.value;

      }

    });

    if (typeof selectedInputType === 'number') {
      return typeof result[selectedInputType] !== 'undefined' ? result[selectedInputType] : {};
    }

    return result;
  }

  parseV2(data, selectedInputType) {

    if (!data) return false;

    const result = {};
  
    const { stats } = data;
    
    Object.keys(stats).forEach((param) => {

      let paramValue = stats[param];

      param = param.split('_');

      const subGame = param[0];
      const paramName = this.rename(param[1]);
      const inputType = this.readInputType(param[2]);
      const playlist = param[5];
      const playlistMode = param[6];

      if (subGame !== 'br') return;

      if (typeof result[inputType] === 'undefined') result[inputType] = {};
      if (typeof result[inputType][playlist] === 'undefined') result[inputType][playlist] = {};
      if (playlistMode && typeof result[inputType][playlist][playlistMode] === 'undefined') result[inputType][playlist][playlistMode] = {};

      if (paramName === 'lastModified') paramValue = new Date(paramValue * 1000);
      
      if (playlistMode) result[inputType][playlist][playlistMode][paramName] = paramValue;
      else result[inputType][playlist][paramName] = paramValue;
    });
    
    if (typeof selectedInputType === 'number') {
      return typeof result[selectedInputType] !== 'undefined' ? result[selectedInputType] : {};
    }
    
    return result;
  }

  rename(name) {
    switch (name) {
      case 'placetop5': return 'placeTop5';
      case 'placetop6': return 'placeTop6';
      case 'placetop25': return 'placeTop25';
      case 'placetop1': return 'placeTop1';
      case 'matchesplayed': return 'matchesPlayed';
      case 'lastmodified': return 'lastModified';
      case 'minutesplayed': return 'minutesPlayed';
      case 'playersoutlived': return 'playersOutLived';
      case 'placetop10': return 'placeTop10';
      case 'placetop12': return 'placeTop12';
      case 'placetop3': return 'placeTop3';
      default: return name;
    }
  }

  readInputType(inputType) {
    switch (inputType) {
      case 'keyboardmouse': return EInputType.MouseAndKeyboard;
      case 'gamepad': return EInputType.Controller;
      case 'touch': return EInputType.Touch;
      case 'pc': return EInputType.MouseAndKeyboard;
      case 'ps4': return EInputType.Controller;
      case 'xb': return EInputType.Controller;
      case 'and': return EInputType.Touch;
      case 'ios': return EInputType.Touch;
      default: return inputType;
    }
  }

}

module.exports = StatsParser;
