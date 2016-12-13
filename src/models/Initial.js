import _ from 'lodash';

import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';

const INITIAL_STATE = {};

export default {
  namespace: 'Initial',
  state: { ...INITIAL_STATE },
  reducers: {},
  effects: {},
  subscriptions: {
    initializeFirebase() {
      const config = {
        apiKey: 'AIzaSyA1mGtM572mvaEoeXuBBhpKlxQBABF8lJg',
        authDomain: 'talkmap-52ba1.firebaseapp.com',
        databaseURL: 'https://talkmap-52ba1.firebaseio.com',
        storageBucket: 'talkmap-52ba1.appspot.com',
        messagingSenderId: '971463438867'
      };
      firebase.initializeApp(config);
    },
    monitorAuth() {
      _.delay(() => {
        firebase
          .auth()
          .onAuthStateChanged((user) => {
            checkUser(user);
          });
      }, 1500);
    }
  }
};

function checkUser(user) {
  if (user) {
    Actions.main({ type: 'reset' });
  } else {
    Actions.auth({ type: 'reset' });
  }
}
