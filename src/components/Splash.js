import React from 'react';
import { Text, View, Image } from 'react-native';

const Splash = ({ splashText }) => {
  return (
    <View style={styles.splashView}>
      <Image
        source={require('../images/logo.png')}
        style={styles.splashImage}
      />
      <Text style={styles.splashText}>
        { splashText }
      </Text>

    </View>
  );
};

const styles = {
  splashView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashText: {
    fontSize: 50,
    textAlign: 'center'
  }
};

export default Splash;
