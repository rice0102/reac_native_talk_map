import React, { Component } from 'react';
import { View, Image, Text, ScrollView, ListView } from 'react-native';
import { connect } from 'dva/mobile';
import {
  Card,
  WingBlank,
  Button,
  Flex,
  ActivityIndicator,
  InputItem
} from 'antd-mobile';
import { fetchChatMessage } from '../services/Message';

class ChatRoom extends Component {
  componentWillMount() {
    const { roomName, chatList } = this.props;
    this.createDataSource(chatList);
    fetchChatMessage(roomName, this.onChatMessage.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    this.createDataSource(nextProps.chatList);
  }

  onChatMessage(val) {
    if (val !== null) {
      this.props.dispatch({
        type: 'Message/loadChatsSuccess',
        payload: val
      });
    }
  }

  onChatRoomMessageChange(chatMessage) {
    this.props.dispatch({
      type: 'Message/chatRoomTextChanged',
      payload: chatMessage
    });
  }

  onChatPress() {
    const { chatMessage, whoTalkTo, roomName, userDetail } = this.props;
    this.props.dispatch({
      type: 'Message/chatMessageSend',
      payload: { chatMessage, whoTalkTo, roomName, userDetail }
    });
  }

  createDataSource(chatList) {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.dataSource = ds.cloneWithRows(chatList);
  }

  renderRow(chatMessage) {
    const { name, msg, photoURL } = chatMessage;
    return (
      <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 5 }}>
        <Image
          style={{ height: 30, width: 30, borderRadius: 15 }}
          source={{ uri: photoURL }}
        />
        <View style={{ marginLeft: 5 }}>
          <Text style={{ fontSize: 12, color: 'gray' }}>{name}</Text>
          <View style={{ backgroundColor: 'greenyellow', borderRadius: 10, padding: 5 }}>
            <Text style={{ fontSize: 14 }}>{msg}</Text>
          </View>
        </View>
      </View>
    );
  }

  renderButton() {
     const { loading } = this.props;
     if (loading) return <ActivityIndicator size="large" />;

    return (
      <Button type="primary" onClick={this.onChatPress.bind(this)} >
        Send
      </Button>
    );
  }

  render() {
    const { whoTalkTo, chatMessage } = this.props;
    return (
      <ScrollView style={{ flex: 1 }} >
        <WingBlank size="lg" style={{ marginTop: 15 }}>
          <Card>
            <Card.Header
              title={whoTalkTo.name}
              thumbStyle={{ width: 50, height: 50 }}
              thumb={whoTalkTo.photoUrl}
              extra={whoTalkTo.email}
            />
          </Card>
        </WingBlank>

        <WingBlank style={{ marginTop: 15, marginBottom: 15, borderBottomWidth: 1, borderColor: 'gray', paddingBottom: 20 }}>
          <ListView
            enableEmptySections
            dataSource={this.dataSource}
            renderRow={this.renderRow}
          />
        </WingBlank>

        <WingBlank style={{ marginTop: 10, marginBottom: 15 }}>
          <Flex direction="row">
            <Flex.Item style={{ flex: 3 }}>
              <InputItem
                value={chatMessage}
                placeholder='Start Chating Now'
                onChange={this.onChatRoomMessageChange.bind(this)}
              />
            </Flex.Item>
            <Flex.Item style={{ flex: 1 }}>
              {this.renderButton()}
            </Flex.Item>
            </Flex>
        </WingBlank>
      </ScrollView>
      );
    }
}

const mapStateToProps = ({ Message }) => {
  const { userDetail, loading, roomName, chatMessage, whoTalkTo, chatList } = Message;

  return { userDetail, chatMessage, loading, roomName, whoTalkTo, chatList };
};

export default connect(mapStateToProps)(ChatRoom);
