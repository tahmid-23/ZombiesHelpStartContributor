/**
 * @format
 */

import {AppRegistry} from 'react-native';
import nodejs from 'nodejs-mobile-react-native';
import App from './src/App';
import {name as appName} from './app.json';

nodejs.start('main.js');
AppRegistry.registerComponent(appName, () => App);
