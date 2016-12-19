import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import { createMessage, fetchMessage } from '../services/Message';

const INITIAL_STATE = {
  text: '',
  error: '',
  loading: false,
  list: {
    message: ''
  }
};

export default {
  namespace: 'Message',
  state: { ...INITIAL_STATE },
  reducers: {
    showLoading(state) {
      return { ...state, loading: true, error: '' };
    },
    textChanged(state, action) {
      return { ...state, message: action.payload };
    },
    sendSuccess(state, action) {
      return { ...state, sendStatus: action.payload, message: '', loading: false };
    },
    fetchSuccess(state, action) {
      return { ...state, list: action.payload };
    },
  },
  effects: {
   * messageSend({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const { message, latitude, longitude } = payload;
      const user = yield call(createMessage, { message, latitude, longitude });
      yield put({ type: 'sendSuccess', payload: user });
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          fetchMessage((val) => {
            dispatch({ type: 'fetchSuccess', payload: val });
          });
          Actions.main();
        } else {
          Actions.auth();
        }
      });
    }
  }
};
