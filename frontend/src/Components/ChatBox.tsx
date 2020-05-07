import React, { Component } from "react";
import { Box, Text, TextInput, Keyboard } from "grommet";
import Loading from "./Loading";
import { Send, Emoji } from "grommet-icons";
import { User, UserService } from "../Services/UserService";
import Identicon from "react-identicons";
import Sockette from "sockette";
import "emoji-mart/css/emoji-mart.css";
import "../Styles/emoji-picker.css";
import { Picker } from "emoji-mart";
import { InlineMath } from "react-katex";
import { chatUrl } from "../config";

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
  pingIntervalId: any;
  loading: boolean;
}

export default class ChatBox extends Component<Props, State> {
  private ws: Sockette | null;
  constructor(props: Props) {
    super(props);
    this.state = {
      messages: [],
      newMessageContent: "",
      loggedInUser: UserService.getCurrentUser(),
      showEmojiPicker: false,
      pingIntervalId: null,
      loading: true,
    };
    this.ws = null;
  }

  componentDidMount() {
    this.ws = new Sockette(chatUrl, {
      maxAttempts: 10,
      onopen: (e) => {
        console.log("connected:", e);
        this.joinChatRoom();
      },
      onmessage: (e) => this.handleIncomingWebsocketMessage(e),
      onerror: (e) => console.log("error:", e),
    });
    // this.setState({ pingIntervalId: setInterval(this.pingChat, 3000) });
  }

  componentWillUnmount() {
    clearInterval(this.state.pingIntervalId);
    this.ws && this.ws.close();
  }

  pingChat = () => {
    // this.ws!.json({
    //   statusCode: 200,
    //   action: "ping",
    //   utc_ts_in_s: Math.floor(Date.now() / 1000),
    // });
  };

  joinChatRoom = () => {
    this.ws?.json({
      action: "join",
      chatId: 10,
    });
  };

  addEmoji = (e: any) => {
    let sym = e.unified.split("-");
    let codesArray: any[] = [];
    sym.forEach((e: any) => codesArray.push("0x" + e));
    let emoji = String.fromCodePoint(...codesArray);
    this.setState({
      newMessageContent: this.state.newMessageContent + emoji,
    });
  };

  handleIncomingWebsocketMessage = (message: any) => {
    const data = JSON.parse(message.data);
    if (data.type === "history") {
      this.setState(
        {
          messages: data.data,
          loading: false,
        },
        () => {
          let messagesDiv = document.getElementById("messages");
          messagesDiv!.scrollTop = messagesDiv!.scrollHeight;
        }
      );
    } else if (data.type === "message") {
      this.setState(
        {
          messages: [...this.state.messages, data.data],
        },
        () => {
          let messagesDiv = document.getElementById("messages");
          messagesDiv!.scrollTop = messagesDiv!.scrollHeight;
        }
      );
    }
  };

  onMessageReceived = ({ data }: any) => {
    const message = JSON.parse(data);
    this.setState(
      {
        messages: [...this.state.messages, message],
      },
      () => {
        let messagesDiv = document.getElementById("messages");
        messagesDiv!.scrollTop = messagesDiv!.scrollHeight;
      }
    );
  };

  sendMessage = () => {
    if (this.state.newMessageContent === "") {
      return;
    }
    this.ws &&
      this.ws.json({
        action: "onMessage",
        message: this.state.newMessageContent,
        username: this.state.loggedInUser.username,
        chatId: 10,
      });
    this.setState({
      showEmojiPicker: false,
      newMessageContent: "",
    });
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
        width="75%"
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
          {this.state.loading && (
            <Box height="80%" width="100%" justify="center" align="center">
              <Loading color="black" size={50} />
            </Box>
          )}
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
              width: "20.83vw",
            }}
          />
        )}
      </Box>
    );
  }
}
