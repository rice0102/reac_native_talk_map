import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import {
  createMessage,
  fetchMessage,
  roomOpen,
  updateChatMessage,
  fetchChats,
  fetchUserDetail
} from '../services/Message';

const INITIAL_STATE = {
  error: '',
  loading: false,
  chatMessage: '',
  message: ''
};

export default {
  namespace: 'Message',
  state: { ...INITIAL_STATE, chatList: {} },
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
    chatRoomOpenSuccess(state, action) {
      return { ...state, roomName: action.payload };
    },
    chatUserData(state, action) {
      return { ...state, whoTalkTo: action.payload.userDetail };
    },
    fetchUserSuccess(state, action) {
      return { ...state, userDetail: action.payload };
    },
    loadChatsSuccess(state, action) {
      return { ...state, chatList: action.payload };
    },
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
      } else { alert('Can not talk to yourself!!!!'); }
    },
  * chatMessageSend({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const { chatMessage, roomName, userDetail } = payload;
      const Messages = {
        name: userDetail.name,
        msg: chatMessage,
        time: '',
        photoURL: userDetail.photoUrl
      };
      const room = yield call(updateChatMessage, { Messages, roomName });
      yield put({ type: 'sendSuccess', payload: room.roomName });
    },
    * loadChats({ payload }, { call, put }) {
      const chats = yield call(fetchChats, payload);
      yield put({ type: 'loadChatsSuccess', payload: chats });
    }
  },
  subscriptions: {
    setup({ dispatch }) {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          fetchUserDetail((val) => {
            dispatch({ type: 'fetchUserSuccess', payload: val });
          });
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
