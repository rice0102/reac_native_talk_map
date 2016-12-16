import React from 'react';
import { AppRegistry } from 'react-native';
import dva from 'dva/mobile';

import Initial from './src/models/Initial';
import Auth from './src/models/Auth';
//import Hello from './src/models/Hello';
import Map from './src/models/Map';
import Message from './src/models/Message';

import Router from './src/Router';

const app = dva();

app.model(Initial);
app.model(Auth);
//app.model(Hello);
app.model(Map);
app.model(Message);

app.router(() => <Router />);

AppRegistry.registerComponent('talk_map', () => app.start());
