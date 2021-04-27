const rn_bridge = require('rn-bridge');
const mineflayer = require('mineflayer');
const Vec3 = require('vec3').Vec3;
const rateLimit = require('function-rate-limit');
const WebSocket = require('ws');
const mcChatToString = require('./util').mcChatToString;

var bot;
var websocket;

const state = {connected: false, connecting: false, log: [], username: '', password: '', chat: ''}

function updateState(newState) {
  rn_bridge.channel.post('message', "update the state before the error")
  Object.keys(newState).map(key => {
    state[key] = newState[key];
  });
  rn_bridge.channel.post('updateState', state);
  rn_bridge.channel.post('message', "jk xd")
}

rn_bridge.channel.on('createBot', (args) => {
  updateState({connecting: true, username: args.username, password: args.password});

  bot = mineflayer.createBot({
    host: 'mc.hypixel.net',
    port: 25565,
    username: args.username,
    password: args.password,
    version: "1.8.9"
  });

  bot.on('disconnect', (reason) => rn_bridge.channel.post('disconnect', reason));
  bot.on('error', (err) => {
    rn_bridge.channel.post('error', err);
    updateState({connected: false, connecting: false});
  });
  bot._client.on('chat', (packet) => {
    rn_bridge.channel.post('chat', packet);
    onChat(packet);
  });
  bot.once('spawn', () => connect());
});

rn_bridge.channel.on('disconnect', () => {
  if (bot !== undefined) {
    bot.quit();
  }
  if (websocket !== undefined) {
    websocket.close(3000, "intentional");
  }
  updateState({connected: false});
});

rn_bridge.channel.on('chat', (message) => {
    if (bot !== undefined) {
      bot.chat(message)
    }
});

var sendMessage = rateLimit(1, 200, function(x) {
    bot.chat(x);
})

var difficultySlot = 0;

function connect() {
    updateState({connecting: false, connected: true});

    websocket = new WebSocket('ws://reshift.kro.kr:25560');
    websocket.onopen = function() {
      websocket.send(JSON.stringify({
          command: "connect",
          data: bot.username
      }));
      rn_bridge.channel.post('connect', {});
    };

    websocket.onmessage = function(e) {
      const data = JSON.parse(e.data);
      if (data.command === "chat") {
        sendMessage(data.data);
      } else if (data.command === "difficulty") {
        difficultySlot = data.data === "HARD" ? 13 : data.data === "RIP" ? 15 : 0;

        setTimeout(() => {
            bot.setQuickBarSlot(4);
            bot.once('windowOpen', function (window) {
                bot.clickWindow(difficultySlot, 0, 0);
            })
            setTimeout(() => {
                bot.swingArm("right");
            }, 1000);
        }, 1000);

      } else if (data.command === "open") {

            const block = bot.blockAt(new Vec3(data.data[0],data.data[1],data.data[2]));
            bot.activateBlock(block);
      }
    };

    websocket.onclose = function(e) {
        if (e.reason === "intentional") return;
        if (e.reason === "Couldn't get invited" || e.reason === "not following directions bot" || e.reason === "not following directions") {
            onDisconnect(e.reason);
            return;
        }
      setTimeout(function() {
        connect();
      }, 10000);
    };

    websocket.onerror = function(err) {
      console.error('Socket encountered error: ', err.message, 'Closing socket and bot');
      rn_bridge.channel.post('error', e.reason);
    };
}

function onChat(packet) {
    if (packet.position === 2) return;
    var msg;
    try {
        msg = mcChatToString(JSON.parse(packet.message), "");
    } catch (e) {
        msg = packet.message;
    }
    if (websocket !== undefined && websocket.readyState === WebSocket.OPEN) {
        websocket.send(JSON.stringify({
            command: "chatReceived",
            data: msg
        }));
    }
}
