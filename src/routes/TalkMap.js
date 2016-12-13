import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import { connect } from 'dva/mobile';
import {
  WhiteSpace,
  WingBlank,
  Button,
} from 'antd-mobile';

class TalkMap extends Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'Hello/hello',
      payload: 'sync message'
    });
  }

render() {
   const { region } = this.props;
   console.log(region);

   return (
     <View style={styles.container}>
       <MapView
         style={styles.map}
         region={{
           latitude: 37.78825,
           longitude: -122.4324,
           latitudeDelta: 0.015,
           longitudeDelta: 0.0121,
         }}
       />
     </View>
   );
 }
}

const styles = StyleSheet.create({
 container: {
   ...StyleSheet.absoluteFillObject,
   justifyContent: 'flex-end',
   alignItems: 'center',
 },
 map: {
   ...StyleSheet.absoluteFillObject,
 },
});

const mapStateToProps = ({ Hello }) => {
  const { syncMessage } = Hello;
  return { syncMessage };
};

export default connect(mapStateToProps)(TalkMap);
