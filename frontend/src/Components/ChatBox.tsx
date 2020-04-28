import React, { Component } from "react";
import { Box, Text, TextInput, Keyboard } from "grommet";
import { Send, Emoji } from "grommet-icons";
import { User, UserService } from "../Services/UserService";
import Identicon from "react-identicons";
import Sockette from "sockette";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { InlineMath } from "react-katex";

type Message = {
  username: string;
  content: string;
};

interface Props {
  gridArea?: string;
}

interface State {
  messages: Message[];
  newMessageContent: string;
  loggedInUser: User;
  showEmojiPicker: boolean;
}

export default class ChatBox extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      messages: [],
      newMessageContent: "",
      loggedInUser: UserService.getCurrentUser(),
      showEmojiPicker: false,
    };
  }

  componentWillMount() {
    const m1 = {
      username: "maxtaylordavies",
      content: "Hello everyone!",
    };
    const m2 = {
      username: "remymess",
      content: "Hey!",
    };
    this.setState({ messages: [m1, m2] });
  }

  addEmoji = (e: any) => {
    let sym = e.unified.split("-");
    let codesArray: any[] = [];
    sym.forEach((e: any) => codesArray.push("0x" + e));
    let emoji = String.fromCodePoint(...codesArray);
    this.setState({
      newMessageContent: this.state.newMessageContent + emoji,
    });
  };

  sendMessage = () => {
    if (this.state.newMessageContent === "") {
      return;
    }
    const newMessage = {
      username: this.state.loggedInUser.username,
      content: this.state.newMessageContent,
    };
    this.setState(
      {
        showEmojiPicker: false,
        messages: [...this.state.messages, newMessage],
        newMessageContent: "",
      },
      () => {
        let messagesDiv = document.getElementById("messages");
        messagesDiv!.scrollTop = messagesDiv!.scrollHeight;
      }
    );
  };

  renderMessageContent = (content: string) => {
    if (!content.includes("$")) {
      return (
        <Text size="16px" color="black">
          {content}
        </Text>
      );
    } else {
      const textArr = content.split("$");
      return (
        <Box
          //   height="100%"
          direction="row"
          wrap
          align="center"
          style={{
            overflowWrap: "break-word",
            wordBreak: "break-all",
          }}
        >
          {textArr.map((textElement: string, index) => {
            if (index % 2 == 0) {
              return (
                <Text
                  color="black"
                  style={{
                    marginLeft: 3,
                    marginRight: 3,
                    overflowWrap: "break-word",
                    wordBreak: "break-all",
                  }}
                  size="16px"
                >
                  {textElement}
                </Text>
              );
            } else {
              if (textElement != "" && index != textArr.length - 1) {
                return <InlineMath math={textElement} />;
              }
            }
          })}
        </Box>
      );
    }
  };

  renderMessage = (message: Message) => {
    return (
      <Box
        style={{ minHeight: 40 }}
        direction="row"
        gap="small"
        width="60%"
        align="start"
        justify={
          message.username === this.state.loggedInUser.username
            ? "end"
            : "start"
        }
        alignSelf={
          message.username === this.state.loggedInUser.username
            ? "end"
            : "start"
        }
      >
        {message.username !== this.state.loggedInUser.username && (
          <Identicon string={message.username} size={25} />
        )}
        <Box
          margin={{ top: "-5px" }}
          align={
            message.username == this.state.loggedInUser.username
              ? "end"
              : "start"
          }
        >
          <Text size="11px" weight="bold" color="pink">
            {message.username}
          </Text>
          <Text
            size="16px"
            color="black"
            textAlign={
              message.username == this.state.loggedInUser.username
                ? "end"
                : "start"
            }
          >
            {this.renderMessageContent(message.content)}
          </Text>
        </Box>
        {message.username === this.state.loggedInUser.username && (
          <Identicon string={message.username} size={25} />
        )}
      </Box>
    );
  };

  render() {
    return (
      <Box
        style={{ position: "relative" }}
        background="white"
        // pad="25px"
        justify="between"
        round="small"
        gridArea={this.props.gridArea}
      >
        <Box width="100%" pad="25px">
          <Text
            color="black"
            weight="bold"
            size="24px"
            margin={{ bottom: "medium" }}
          >
            Live chat
          </Text>
          <Box
            height="80%"
            gap="small"
            width="100%"
            overflow="scroll"
            id="messages"
            style={{ maxHeight: "80%" }}
          >
            {this.state.messages.map((message: Message) =>
              this.renderMessage(message)
            )}
          </Box>
        </Box>
        <Keyboard onEnter={this.sendMessage}>
          <Box
            margin="25px"
            direction="row"
            background="#f2f2f2"
            align="center"
            // pad={{ right: "xsmall" }}
            round="xsmall"
            overflow="hidden"
            style={{ minHeight: 42 }}
          >
            <TextInput
              height="36px"
              placeholder="send a message"
              value={this.state.newMessageContent}
              onChange={(event) =>
                this.setState({ newMessageContent: event.target.value })
              }
              plain
              style={{
                backgroundColor: "#f2f2f2",
                border: "none",
              }}
              //   focusIndicator={false}
            />
            <Box
              round="xsmall"
              pad={{ vertical: "xsmall", horizontal: "9px" }}
              hoverIndicator="background"
              justify="center"
              align="center"
              onClick={() => {
                this.setState({ showEmojiPicker: !this.state.showEmojiPicker });
              }}
              //   margin={{ horizontal: "xsmall" }}
              focusIndicator={false}
              background={this.state.showEmojiPicker ? "#e6e6e6" : "none"}
            >
              <Emoji color="black" />
            </Box>
            <Box
              round="xsmall"
              pad={{ vertical: "xsmall", horizontal: "9px" }}
              hoverIndicator="background"
              justify="center"
              align="center"
              onClick={this.sendMessage}
              focusIndicator={false}
            >
              <Send color="black" />
            </Box>
          </Box>
        </Keyboard>
        {this.state.showEmojiPicker && (
          <Picker
            emoji="clap"
            color="#61EC9F"
            onSelect={this.addEmoji}
            style={{
              position: "absolute",
              bottom: 75,
              zIndex: 10,
              alignSelf: "center",
            }}
          />
        )}
      </Box>
    );
  }
}
