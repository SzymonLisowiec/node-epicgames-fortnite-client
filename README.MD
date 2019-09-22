# Unofficial Fortnite Client for Node.js
[![npm version](https://img.shields.io/npm/v/epicgames-fortnite-client.svg)](https://npmjs.com/package/epicgames-fortnite-client)
[![npm downloads](https://img.shields.io/npm/dm/epicgames-fortnite-client.svg)](https://npmjs.com/package/epicgames-fortnite-client)
[![license](https://img.shields.io/npm/l/epicgames-fortnite-client.svg)](https://github.com/SzymonLisowiec/node-epicgames-fortnite-client/blob/master/LICENSE.MD)
[![paypal](https://img.shields.io/badge/paypal-donate-orange.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=FDN57KFYRP4CQ&source=url)

__This library supports only fortnite client. If you need launcher, check [`node-epicgames-client`](https://github.com/SzymonLisowiec/node-epicgames-client)__

# Installation
```
npm i epicgames-fortnite-client --save
```

# Example
```javascript
const EGClient = require('epicgames-client').Client;
const Fortnite = require('epicgames-fortnite-client');
const { ESubGame } = Fortnite;

let eg = new EGClient({
  email: 'EMAIL',
  password: 'PASSWORD'
});

eg.init().then(async (success) => {
  
  if(!success)
    throw new Error('Cannot initialize EpicGames launcher.');
    
  if(!await eg.login())
    throw new Error('Cannot login on EpicGames account.');
    
  const fortnite = await eg.runGame(Fortnite);
  const br = await fortnite.runSubGame(ESubGame.BattleRoyale);

  let stats = await br.getStatsForPlayer('Kysune');

  console.dir(stats);

});
```

# Documentation

- [`Home`](https://github.com/SzymonLisowiec/node-epicgames-fortnite-client/wiki)
- [`Client`](https://github.com/SzymonLisowiec/node-epicgames-fortnite-client/wiki/Client)
- [`Communicator`](https://github.com/SzymonLisowiec/node-epicgames-fortnite-client/wiki/Communicator)
- [`Communicator\Status`](https://github.com/SzymonLisowiec/node-epicgames-fortnite-client/wiki/Communicator%5CStatus)
- [`CreativeWorld`](https://github.com/SzymonLisowiec/node-epicgames-fortnite-client/wiki/CreativeWorld)

# Do you need help?
Check our discord server: https://discord.gg/HxGfuEx

# Warning about maintenance
Every Fortnite update, netCL version is updating. You should pass new version number while running this library
```javascript
const fortnite = await eg.runGame(Fortnite, {
  build: '++Fortnite+Release-10.31-CL-8723043',
  engineBuild: '4.23.0-8723043+++Fortnite+Release-10.31',
  netCL: 8371706,
  partyBuildId: '1:1:8371706',
});
```
You'll find informations about version in Fortnite log files under path:
```
// Windows
C:\Users\USERNAME\AppData\Local\FortniteGame\Saved\Logs
```
You need to find these lines:
```
LogInit: Engine Version: 4.23.0-8723043+++Fortnite+Release-10.31
LogInit: Compatible Engine Version: 4.23.0-8707299+++Fortnite+Release-10.31
LogInit: Net CL: 8371706
```

# License
MIT License

Copyright (c) 2018 Kysune

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
