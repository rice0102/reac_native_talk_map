import firebase from 'firebase';
import { Dimensions } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { fetchMarkers, updatePosistion } from '../services/Map';

const INITIAL_STATE = {
    initialRegion: {
      latitude: 24.795258,
      longitude: 120.996351,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    userPosition: {}
};

export default {
  namespace: 'Map',
  state: { ...INITIAL_STATE },
  reducers: {
    fetchSuccess(state, action) {
      return { ...state, marker: action.payload };
    },
    onRegionChange(state, action) {
      return { ...state, region: action.payload };
    },
    getCurrentPosition(state, action) {
      return { ...state, initialRegion: action.payload };
    },
    userPositionChange(state, action) {
       return { ...state, markerPosition: action.payload };
    },
  },
  effects: {
    * updateUserPosition({ payload }, { call, put }) {
      yield put({ type: 'userPositionChange', payload });
      yield call(updatePosistion, payload);
    },

  },
  subscriptions: {
   mapinit({ dispatch }) {
     firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          const { width, height } = Dimensions.get('window');
          const ASPECT_RATIO = width / height;
          const LATITUDE_DELTA = 0.01;
          const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

          fetchMarkers((val) => {
            dispatch({ type: 'fetchSuccess', payload: val });
          });

        navigator.geolocation.getCurrentPosition(
          (position) => {
            dispatch({
              type: 'getCurrentPosition',
              payload: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA
              }
            });
          },
          (error) => alert(error.message),
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );

        this.watchID = navigator.geolocation.watchPosition((position) => {
          const newRegion = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          };
          const newloaction = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          dispatch({ type: 'onRegionChange', payload: newRegion });
          dispatch({ type: 'updateUserPosition', payload: newloaction });
        });
      } else {
          Actions.auth();
      }
     });
    }
  }
};
