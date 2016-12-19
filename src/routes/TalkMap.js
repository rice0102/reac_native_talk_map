import React, { Component } from 'react';
import _ from 'lodash';
import { Text, View, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import { connect } from 'dva/mobile';
import {
  WhiteSpace,
  Button,
  Flex,
  ActivityIndicator,
  InputItem
} from 'antd-mobile';

class TalkMap extends Component {
  onRegionChange(region) {
    this.props.dispatch({
      type: 'Map/onRegionChange',
      payload: region
    });
  }

  onMessageChange(message) {
    this.props.dispatch({
      type: 'Message/textChanged',
      payload: message
    });
  }

  onSendPress() {
    const { message, markerPosition } = this.props;
    this.props.dispatch({
      type: 'Message/messageSend',
      payload: { message, latitude: markerPosition.latitude, longitude: markerPosition.longitude }
    });
  }

  renderButton() {
    const { loading } = this.props;
    if (loading) return <ActivityIndicator size="large" />;

    return (
      <Button
        type="primary"
        style={styles.buttonStyle}
        onClick={this.onSendPress.bind(this)}
      >
        Send
      </Button>
    );
  }

  renderMarker() {
    const { markers } = this.props;
   return markers.map(data => {
      const markerCoordinate = {
          latitude: data.latitude,
          longitude: data.longitude
      };
      return (
        <MapView.Marker coordinate={markerCoordinate} key={data.uid}>
          <MapView.Callout style={styles.customView}>
            <View>
              <Text>{data.uid}</Text>
              <Text>{data.message}</Text>
            </View>
          </MapView.Callout>
        </MapView.Marker>
      );
    });
  }

  render() {
    const { initialRegion, region, message } = this.props;

    return (
      <View style={styles.mapcontainer}>
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          region={region}
          showsUserLocation
          onRegionChange={this.onRegionChange.bind(this)}
        >
          {this.renderMarker()}

        </MapView>
        <WhiteSpace size="lg" />
        <Flex style={styles.flexStyle}>
          <Flex.Item style={{ flex: 2 }}>
            <InputItem
              style={styles.input}
              value={message}
              placeholder='Say Something Here...'
              onChange={this.onMessageChange.bind(this)}
            />
          </Flex.Item>
          <Flex.Item>
            {this.renderButton()}
          </Flex.Item>
        </Flex>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapcontainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  flexStyle: {
    backgroundColor: 'white',
  },
  buttonStyle: {
    margin: 15,
  },
  customView: {
    width: 160,
    height: 50,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = ({ Map, Message }) => {
  const { regionMessage, region, initialRegion, markerPosition } = Map;
  const { message, loading } = Message;
  const markers = _.map(Map.marker, (val, uid) => {
    return { ...val, uid };
  });
  return { markers, regionMessage, region, initialRegion, markerPosition, message, loading };
};

export default connect(mapStateToProps)(TalkMap);
