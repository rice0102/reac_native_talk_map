import React, { Component } from 'react';
import { Text, View, StyleSheet, Dimensions, TextInput } from 'react-native';
import MapView from 'react-native-maps';
import { connect } from 'dva/mobile';
import {
  WhiteSpace,
  Button,
  Flex,
  ActivityIndicator
} from 'antd-mobile';

class TalkMap extends Component {
  onRegionChange(region) {
    this.props.dispatch({
      type: 'Map/onRegionChange',
      payload: region
    });
  }

  onMessageChange(text) {
    this.props.dispatch({
      type: 'Message/textChanged',
      payload: text
    });
  }

  onSendPress() {
    const { text } = this.props;
    this.props.dispatch({
      type: 'Message/messageSend',
      payload: { text }
    });
  }

  renderButton() {
    const { loading } = this.props;
    if (loading) return <ActivityIndicator size="large" />;

    return (
      <Button type="primary" style={styles.buttonStyle} onClick={this.onSendPress.bind(this)}>
        Send
      </Button>
    );
  }
  renderMarker() {
    const { userPosition, list } = this.props;

    if (!list) return <MapView.Marker coordinate={userPosition} />;
    return (
       <MapView.Marker coordinate={userPosition}>
        <MapView.Callout style={styles.customView}>
            <View>
              <Text>{list.text}</Text>
            </View>
        </MapView.Callout>
       </MapView.Marker>
    );
  }

  render() {
    const { initialRegion, region, text } = this.props;

    return (
      <View style={styles.mapcontainer}>
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          //region={region}
          //showsUserLocation
          //onRegionChange={this.onRegionChange.bind(this)}
        >
          {this.renderMarker()}
        </MapView>
        <WhiteSpace size="lg" />
        <Flex style={styles.flexStyle}>
          <Flex.Item style={{ flex: 2 }}>
            <TextInput
              style={styles.input}
              value={text}
              placeholder="Say Something Here..."
              onChangeText={this.onMessageChange.bind(this)}
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
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  flexStyle: {
    backgroundColor: 'white',
    borderRadius: 5,
  },
  input: {
    padding: 4,
    margin: 5,
    width: 260,
    height: 40,
    alignSelf: 'center'
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
  const { regionMessage, region, initialRegion, userPosition } = Map;
  const { text, sendStatus, loading, list } = Message;

  return { regionMessage, region, initialRegion, userPosition, text, sendStatus, loading, list };
};

export default connect(mapStateToProps)(TalkMap);
