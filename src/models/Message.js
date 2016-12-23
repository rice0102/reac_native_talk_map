import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import {
  createMessage,
  fetchMessage,
  roomOpen,
  updateChatMessage2
} from '../services/Message';

const INITIAL_STATE = {
  error: '',
  loading: false,
  chatMessage: '',
  message: ''
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
    chatRoomTextChanged(state, action) {
      return { ...state, chatMessage: action.payload };
    },
    sendSuccess(state, action) {
      return { ...state, sendStatus: action.payload, ...INITIAL_STATE };
    },
    fetchSuccess(state, action) {
      return { ...state, list: action.payload };
    },
    loadSuccess(state, action) {
      const { messages } = action.payload;
      return { ...state, chatList: action.payload };
    },
    chatRoomOpenSuccess(state, action) {
      return { ...state, roomName: action.payload };
    },
    chatUserData(state, action) {
       return { ...state, whoTalkTo: action.payload.userDetail, uid: action.payload.uid };
    }
  },
  effects: {
   * messageSend({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const { message, markerPosition } = payload;
      const latlon = markerPosition;
      const user = yield call(createMessage, { message, latlon });
      yield put({ type: 'sendSuccess', payload: user });
    },
  * openChatRoom({ payload }, { call, put }) {
      const room = yield call(roomOpen, payload);
      if (room !== 'Me') {
        yield put({ type: 'chatRoomOpenSuccess', payload: room.roomName });
        yield put({ type: 'chatUserData', payload });
        Actions.chatRoom();
      } else {
        alert('不要自己玩');
      }
    },
  * chatMessageSend({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const { chatMessage, whoTalkTo, roomName, uid } = payload;
      const Messages = {
        uid,
        name: whoTalkTo.name,
        msg: chatMessage,
        time: '',
        photoURL: whoTalkTo.photoUrl
      };
      console.log(roomName);
      const room = yield call(updateChatMessage2, { Messages, roomName });
      yield put({ type: 'sendSuccess', payload: room.roomName });
    }
  },
  subscriptions: {
    setup({ dispatch }) {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          fetchMessage((val) => {
            dispatch({ type: 'fetchSuccess', payload: val });
          });
          Actions.main({ type: 'reset' });
        } else {
          Actions.auth();
        }
      });
    }
  }
};
