import React, {Component} from 'react';
import {
  ScrollView,
  Keyboard,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Text,
  View,
} from 'react-native';
import AutoScrollFlatList from 'react-native-autoscroll-flatlist';
import nodejs from 'nodejs-mobile-react-native';

import {styles} from './styles.js';
import {mcChatToString, splitText} from './util.js';

const LogComponent = React.memo((props) => {
  {
    props.log.map((l, i) => (
      <Text key={i}>
        {l.map((v, k) => (
          <Text style={v.style} key={k}>
            {v.text}
          </Text>
        ))}
      </Text>
    ));
  }
});

class App extends Component {
  appendArrayToLog(log) {
    this.setState((st) => ({log: [...st.log, log]}));
  }

  appendToLog(log) {
    this.appendArrayToLog([{text: log, style: {color: 'white'}}]);
  }

  constructor() {
    super();

    const initialDimensions = Dimensions.get('window');
    this.state = {
      portrait: initialDimensions.height >= initialDimensions.width,
    };

    this.appendToLog = this.appendToLog.bind(this);
    this.appendArrayToLog = this.appendArrayToLog.bind(this);
    this.onConnect = this.onConnect.bind(this);
    this.onError = this.onError.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.connect = this.connect.bind(this);
    this.sendChat = this.sendChat.bind(this);
    this.onChat = this.onChat.bind(this);

    this.chatRef = React.createRef();
    this.passwordRef = React.createRef();

    nodejs.channel.addListener('connect', this.onConnect);
    nodejs.channel.addListener('disconnect', this.onDisconnect);
    nodejs.channel.addListener('error', this.onError);
    nodejs.channel.addListener('chat', this.onChat);
    nodejs.channel.addListener('updateState', (state) => {
      this.setState(state);
    });
    nodejs.channel.addListener('message', (message) => {
      console.log(message);
    });

    Dimensions.addEventListener('change', () => {
      const dimensions = Dimensions.get('window');
      const portrait = dimensions.height >= dimensions.width;
      this.setState({portrait: portrait});
    });
  }

  connect() {
    if (!this.state.connected && !this.state.connecting) {
      this.appendToLog('connecting');
      nodejs.channel.post('createBot', {
        username: this.state.username.trim(),
        password: this.state.password,
      });
    }
  }

  disconnect() {
    if (this.state.connected) {
      nodejs.channel.post('disconnect', {});
      this.appendToLog('disconnected from hypixel');
    }
  }

  onConnect() {
    this.appendToLog('connected to hypixel');
  }

  onChat(packet) {
    if (packet.position === 2) {
      return;
    }
    try {
      const mcChat = mcChatToString(JSON.parse(packet.message));
      for (const line of mcChat.split('\n')) {
        this.appendArrayToLog(splitText(line));
      }
    } catch (e) {
      this.appendToLog(packet.message);
    }
  }

  onDisconnect(reason) {
    this.appendToLog(`disconnected - reason: ${reason}`);
  }

  onError(err) {
    nodejs.channel.post('disconnect', {});
    if (err instanceof Error) {
      this.appendToLog(`error occured, ${err.message}`);
    } else {
      this.appendToLog(`error occured, ${err}`);
    }
  }

  sendChat() {
    const chat = this.state.chat.trim();
    if (chat.startsWith('/p')) {
      this.appendToLog('please no command that starts with /p');
      return;
    } else if (
      chat.startsWith('/lobby') ||
      chat.startsWith('/zoo') ||
      chat.startsWith('/hub')
    ) {
      this.appendToLog('please no lobby commands');
      return;
    } else if (chat.startsWith('/rej')) {
      this.appendToLog('please no rejoining games');
      return;
    } else {
      nodejs.channel.post('chat', this.state.chat);
    }

    this.setState({chat: ''});
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleBar}>
          <Text style={[styles.heading, styles.title]}>
            Zombies Help Starter Account Provider
          </Text>
          <Text style={styles.disclaimer}>
            - connection to hypixel is directly made from this program{'\n'}
            not even a single part of your credential is sent to the dev's
            server
          </Text>
        </View>
        <View
          style={[
            styles.content,
            {flexDirection: this.state.portrait ? 'column' : 'row'},
          ]}>
          <View
            style={[
              this.state.portrait
                ? {
                    height: '50%',
                  }
                : {
                    width: '50%',
                  },
              {padding: 5},
            ]}>
            <Text style={[styles.heading, {textAlign: 'center'}]}>
              Minecraft Credentials
            </Text>
            <View style={styles.inputLine}>
              <Text>username</Text>
              <TextInput
                style={styles.input}
                placeholder="minecraft username"
                value={this.state.username}
                blurOnSubmit={false}
                onSubmitEditing={() => this.passwordRef.current.focus()}
                onChangeText={(text) => this.setState({username: text})}
              />
            </View>
            <View style={styles.inputLine}>
              <Text>password</Text>
              <TextInput
                secureTextEntry={true}
                style={styles.input}
                placeholder="minecraft password"
                value={this.state.password}
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                  if (!this.state.connected) {
                    this.connect();
                  }
                }}
                onChangeText={(text) => this.setState({password: text})}
                ref={this.passwordRef}
              />
            </View>
            <TouchableOpacity
              style={styles.connect}
              onPress={() => {
                !this.state.connected ? this.connect() : this.disconnect();
                Keyboard.dismiss();
              }}>
              <Text>{!this.state.connected ? 'Connect' : 'Disconnect'}</Text>
            </TouchableOpacity>
            <Text style={{textAlign: 'center', marginTop: 5}}>
              Current Status:{' '}
              {this.state.connecting
                ? 'Connecting...'
                : this.state.connected
                ? 'Connected'
                : 'Disconnected'}
            </Text>
          </View>
          <View
            style={[
              this.state.portrait
                ? {
                    height: '50%',
                  }
                : {
                    width: '50%',
                  },
              {padding: 5},
            ]}>
            <Text style={[styles.heading, {textAlign: 'center'}]}>
              Chat / Log
            </Text>
            <View style={styles.chatWrapperWrapper}>
              <AutoScrollFlatList
                showScrollToEndIndicator={false}
                showNewItemAlert={false}
                threshold={20}
                ref={this.chatRef}
                style={styles.chatWrapper}
                contentContainerStyle={styles.chatWrapperContent}
                data={this.state.log}
                keyExtractor={(item, index) => index.toString()}
                renderItem={mapLog}
              />
            </View>
            <View style={styles.inputLine}>
              <TextInput
                style={styles.input}
                placeholder="Enter chat here..."
                value={this.state.chat}
                onSubmitEditing={this.sendChat}
                onChangeText={(text) => this.setState({chat: text})}
              />
              <TouchableOpacity style={styles.send} onPress={this.sendChat}>
                <Text>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

function mapLog({item}) {
  return <Text>{item.map(logMapper)}</Text>;
}

const logMapper = (v, k) => {
  return (
    <Text style={v.style} key={k}>
      {v.text}
    </Text>
  );
};

export default App;
