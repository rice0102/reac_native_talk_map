import { Actions } from 'react-native-router-flux';
import { Dimensions } from 'react-native';

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
    onRegionChange(state, action) {
      return { ...state, region: action.payload };
    },

    getCurrentPosition(state, action) {
      const userPosition = {
        latitude: action.payload.latitude,
        longitude: action.payload.longitude
      };

      return { ...state, initialRegion: action.payload, userPosition };
    }
  },
  effects: {

  },
  subscriptions: {
   setup({ dispatch }) {
    const { width, height } = Dimensions.get('window');
    const ASPECT_RATIO = width / height;
    const LATITUDE_DELTA = 0.01;
    const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

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
      dispatch({ type: 'onRegionChange', payload: newRegion });
    });
    }
  }
};
