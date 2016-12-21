import React from 'react';
import { connect } from 'dva/mobile';
import { Scene, Router } from 'react-native-router-flux';

import Splash from './components/Splash';

import LoginForm from './routes/LoginForm';
import ChatRoom from './routes/ChatRoom';
import TalkMap from './routes/TalkMap';

const RouterComponent = ({ dispatch }) => {
  function onLogout() {
    dispatch({ type: 'Auth/logoutUser' });
  }

  return (
    <Router sceneStyle={{ paddingTop: 65 }}>

      <Scene
        key="splash"
        hideNavBar
        passProps
        splashText="Talk Map"
        component={Splash}
      />

      <Scene key="auth">
        <Scene key="login" component={LoginForm} title="Login" />
      </Scene>

      <Scene key="main">
        <Scene
          initial
          onRight={onLogout}
          rightTitle="Logout"
          key="TalkMap"
          component={TalkMap}
          title="Talk Map"
        />

        <Scene
          key="chatRoom"
          component={ChatRoom}
          title="Chat Room"
        />
      </Scene>
    </Router>
  );
};

export default connect()(RouterComponent);
