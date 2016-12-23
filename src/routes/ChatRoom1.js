import _ from 'lodash';
import React, { Component } from 'react';
import { ScrollView } from 'react-native';
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
    const { uid, chatList } = this.props;
    console.log(uid);
    console.log(chatList);
    this.watchChat = fetchChatMessage(uid, this.chatMessageList.bind(this));
    console.log(this.watchChat);
  }
  chatMessageList(val) {
    if (val !== null) {
      const messages = val;
      this.props.dispatch({
        type: 'Message/loadSuccess',
        payload: { messages }
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
    const { chatMessage, whoTalkTo, uid } = this.props;
    this.props.dispatch({
      type: 'Message/chatMessageSend',
      payload: { chatMessage, whoTalkTo, uid }
    });
  }

  renderButton() {
     const { loading } = this.props;
     if (loading) return <ActivityIndicator size="large" />;

    return (
      <Button
        type="primary"
        onClick={this.onChatPress.bind(this)}
      >
        Send
      </Button>
    );
  }

  render() {
    const { whoTalkTo, chatMessage, chatList } = this.props;
    //console.log(chatList);
    return (
      <ScrollView style={{ flex: 1 }} >
        <WingBlank size="lg">
          <Card>
            <Card.Header
              title={whoTalkTo.name}
              thumbStyle={{ width: 50, height: 50 }}
              thumb={whoTalkTo.photoUrl}
              extra={whoTalkTo.email}
            />
          </Card>
        </WingBlank>

        <WingBlank style={{ marginBottom: 15 }}>
          <Flex direction="column">
            <Flex.Item style={{ flex: 3 }}><Button size="small">按钮1</Button></Flex.Item>
            <Flex.Item style={{ paddingBottom: 4 }}><Button size="small">按钮2</Button></Flex.Item>
            <Flex.Item style={{ paddingBottom: 4 }}><Button size="small">按钮3</Button></Flex.Item>
          </Flex>
        </WingBlank>

        <WingBlank style={{ marginTop: 15, marginBottom: 15 }}>
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
  const { chatMessage, whoTalkTo, loading, chatList, uid } = Message;

  return { whoTalkTo, chatMessage, loading, chatList, uid };
};

export default connect(mapStateToProps)(ChatRoom);
