import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'dva/mobile';
import { Text, View, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
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
      payload: { message, markerPosition }
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
          let photo = data.userDetail.photoUrl;
          if (photo === '') {
            photo = 'https://cdn4.iconfinder.com/data/icons/gradient-ui-1/512/navigation-64.png';
          }
          return (
            <MapView.Marker image={{ uri: photo }} coordinate={data.latlon} key={data.uid}>
              <MapView.Callout
                style={styles.customView}
                onPress={() => {
                  this.props.dispatch({
                    type: 'Message/openChatRoom',
                    payload: data
                  });
                }}
              >
                <View>
                  <Text>{data.userDetail.name} :</Text>
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
  const { region, initialRegion, markerPosition } = Map;
  const { message, loading } = Message;
  const markers = _.map(Map.marker, (val, uid) => {
    return { ...val, uid };
  });
  return { markers, region, initialRegion, markerPosition, message, loading };
};

export default connect(mapStateToProps)(TalkMap);
