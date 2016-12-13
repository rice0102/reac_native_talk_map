import { Actions } from 'react-native-router-flux';
import { MessageList } from '../services/Map';

const INITIAL_STATE = {
};

export default {
  namespace: 'Map',
  state: { ...INITIAL_STATE },
  reducers: {
  },
  effects: {
    * MessageRoom({ payload }, { call, put }) {
      Actions.messageRoom();

      const message = yield call(MessageList, payload);
      yield put({ type: 'asyncHelloSuccess', payload: message });
    }
  },
  subscriptions: {

  }
};
