import React, { Component } from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { connect } from 'dva/mobile';
import {
  Card,
  WingBlank,
  Button,
  Flex,
  ActivityIndicator,
  InputItem
} from 'antd-mobile';

class ChatRoom extends Component {

  onChatRoomMessageChange(chatMessage) {
    this.props.dispatch({
      type: 'Message/chatRoomTextChanged',
      payload: chatMessage
    });
  }

  renderButton() {
    // const { loading } = this.props;
    // if (loading) return <ActivityIndicator size="large" />;

    return (
      <Button type="primary" >
        Send
      </Button>
    );
  }

  render() {
    const { whoTalkTo, chatMessage } = this.props;

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
            <Flex.Item style={{ paddingBottom: 4 }}><Button size="small">按钮1</Button></Flex.Item>
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

const styles = StyleSheet.create({
  flexStyle: {
    backgroundColor: 'red'
  },
});

const mapStateToProps = ({ Message }) => {
  const { chatMessage, whoTalkTo } = Message;
  return { whoTalkTo, chatMessage };
};

export default connect(mapStateToProps)(ChatRoom);
