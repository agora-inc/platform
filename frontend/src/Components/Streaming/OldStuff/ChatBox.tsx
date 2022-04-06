import React, { Component, useEffect, useState } from "react";
import { Box, Text, TextInput, Keyboard } from "grommet";
import Loading from "../../Core/Loading";
import { Send, Emoji } from "grommet-icons";
import { User, UserService } from "../../../Services/UserService";
import Identicon from "react-identicons";
import Sockette from "sockette";
import "emoji-mart/css/emoji-mart.css";
import "../../../Styles/emoji-picker.css";
import { Picker } from "emoji-mart";
import { InlineMath } from "react-katex";
import { chatUrl } from "../../../config";
import { useStore } from "../../../store";

type Message = {
  username: string;
  content: string;
};

interface Props {
  gridArea?: string;
  chatId: number;
  viewerCountCallback: any;
}

interface State {
  messages: Message[];
  newMessageContent: string;
  loggedInUser: User | null;
  showEmojiPicker: boolean;
  pingIntervalId: any;
  loading: boolean;
}

export const ChatBox = (props: Props) => {
  const [ws, setWs] = useState<Sockette | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageContent, setNewMessageContent] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [pingIntervalId, setPingIntervalId] = useState<NodeJS.Timeout>();
  const [loading, setLoading] = useState(true);

  const user = useStore((state) => state.loggedInUser);

  useEffect(() => {
    setWs(
      new Sockette(chatUrl, {
        maxAttempts: 10,
        onopen: (e) => {
          console.log("connected:", e);
          joinChatRoom();
        },
        onmessage: (e) => handleIncomingWebsocketMessage(e),
        onerror: (e) => console.log("error:", e),
      })
    );
    setPingIntervalId(setInterval(pingChat, 3000));

    // cleanup function
    return () => {
      pingIntervalId && clearInterval(pingIntervalId);
      ws && ws.close();
    };
  }, []);

  useEffect(() => {
    let messagesDiv = document.getElementById("messages");
    messagesDiv!.scrollTop = messagesDiv!.scrollHeight;
  }, [messages]);

  const pingChat = () => {
    // ws!.json({
    //   statusCode: 200,
    //   action: "ping",
    //   utc_ts_in_s: Math.floor(Date.now() / 1000),
    // });
  };

  const joinChatRoom = () => {
    ws?.json({
      action: "join",
      chatId: props.chatId,
    });
  };

  const handleIncomingWebsocketMessage = (message: any) => {
    const data = JSON.parse(message.data);
    if (data.type === "history") {
      setMessages(data.data);
      setLoading(false);
    } else if (data.type === "message") {
      setMessages([...messages, data.data]);
    } else if (data.type === "views") {
      props.viewerCountCallback(data.data.views);
    }
  };

  const onMessageReceived = ({ data }: any) => {
    const message = JSON.parse(data);
    setMessages([...messages, message]);
  };

  const sendMessage = () => {
    if (newMessageContent === "" || !user) {
      return;
    }
    ws &&
      ws.json({
        action: "onMessage",
        message: newMessageContent,
        username: user.username,
        chatId: props.chatId,
      });
    setShowEmojiPicker(false);
    setNewMessageContent("");
  };

  const addEmoji = (e: any) => {
    let sym = e.unified.split("-");
    let codesArray: any[] = [];
    sym.forEach((e: any) => codesArray.push("0x" + e));
    let emoji = String.fromCodePoint(...codesArray);
    setNewMessageContent(newMessageContent + emoji);
  };

  const renderMessageContent = (content: string) => {
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

  const renderMessage = (message: Message) => {
    const selfUserName = user?.username;
    return (
      <Box
        style={{ minHeight: 40 }}
        direction="row"
        gap="small"
        width="75%"
        align="start"
        justify={message.username === selfUserName ? "end" : "start"}
        alignSelf={message.username === selfUserName ? "end" : "start"}
      >
        {message.username !== selfUserName && (
          <Identicon string={message.username} size={25} />
        )}
        <Box
          margin={{ top: "-5px" }}
          align={message.username == selfUserName ? "end" : "start"}
        >
          <Text size="11px" weight="bold" color="pink">
            {message.username}
          </Text>
          <Text
            size="16px"
            color="black"
            textAlign={message.username == selfUserName ? "end" : "start"}
          >
            {renderMessageContent(message.content)}
          </Text>
        </Box>
        {message.username === selfUserName && (
          <Identicon string={message.username} size={25} />
        )}
      </Box>
    );
  };

  const renderInputBox = () => {
    return (
      <Keyboard onEnter={sendMessage}>
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
            value={newMessageContent}
            onChange={(e) => setNewMessageContent(e.target.value)}
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
              setShowEmojiPicker(!showEmojiPicker);
            }}
            //   margin={{ horizontal: "xsmall" }}
            focusIndicator={false}
            background={showEmojiPicker ? "#e6e6e6" : "none"}
          >
            <Emoji color="black" />
          </Box>
          <Box
            round="xsmall"
            pad={{ vertical: "xsmall", horizontal: "9px" }}
            hoverIndicator="background"
            justify="center"
            align="center"
            onClick={sendMessage}
            focusIndicator={false}
          >
            <Send color="black" />
          </Box>
        </Box>
      </Keyboard>
    );
  };

  const renderLoginMessage = () => {
    return (
      <Box
        margin="25px"
        background="#f2f2f2"
        align="center"
        justify="center"
        round="xsmall"
        style={{ minHeight: 42 }}
      >
        <Text color="grey">Log in to join the conversation</Text>
      </Box>
    );
  };

  return (
    <Box
      style={{ position: "relative" }}
      background="white"
      // pad="25px"
      justify="between"
      round="small"
      gridArea={props.gridArea}
    >
      <Box width="100%" pad="25px" height="90%" style={{ paddingBottom: 0 }}>
        <Text
          color="black"
          weight="bold"
          size="24px"
          margin={{ bottom: "medium" }}
        >
          Live chat
        </Text>
        {loading && (
          <Box
            height="80%"
            width="100%"
            justify="center"
            align="center"
            style={{ minHeight: "80%" }}
          >
            <Loading color="black" size={50} />
          </Box>
        )}
        <Box
          height="95%"
          gap="small"
          width="100%"
          id="messages"
          style={{
            maxHeight: "95%",
            overflowX: "hidden",
            overflowY: "scroll",
          }}
        >
          {messages.map((message: Message) => renderMessage(message))}
        </Box>
      </Box>
      {user ? renderInputBox() : renderLoginMessage()}
      {showEmojiPicker && (
        <Picker
          emoji="clap"
          color="#61EC9F"
          onSelect={addEmoji}
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
};
