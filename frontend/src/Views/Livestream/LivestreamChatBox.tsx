import React, { useRef, useEffect, FunctionComponent, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Box, Text, TextInput } from "grommet";
import { textToLatex } from "../../Components/Core/LatexRendering";
import AgoraRTM from 'agora-rtm-sdk';


interface Props {
  localUser: LocalUser;
  talkId: string;
}

interface LocalUser {
  appId: string,
  talkId: string,
  role: string,
  name: string,
  uid: string,
}

interface Message {
  senderId: string;
  text: string;
  name?: string;
  first: boolean;
}

const APP_ID_MESSAGING = 'c80c76c5fa6348d3b6c022cb3ff0fd38'

const ChatBox:FunctionComponent<Props> = (props) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [messageChannel, setMessageChannel] = useState(null as any)
  const [agoraMessageClient] = useState(AgoraRTM.createInstance(APP_ID_MESSAGING))

  useEffect(() => {
    (async () => {join_live_chat()})()
  }, [])

  // Autoscroll to the end 
  const messagesEndRef = useRef<null | HTMLDivElement>(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(() => { scrollToBottom() }, [messages]);

  // methods to send messages via agora.io
  async function on_message(msg:any, senderId:string){
    let attr = await agoraMessageClient.getUserAttributes(senderId)
    setMessages((m) => {
      let first = m.length === 0 ? true : m[m.length-1].senderId !== senderId
      return [...m, {senderId, text: msg.text, name: attr.name ||'', first: first}]
    })
  }

  async function join_live_chat(){
    console.log('joining live chat...')
    let talkId = props.talkId.toString()
    let uid = props.localUser.uid
    try{
      await agoraMessageClient.login({ uid })
      let _messageChannel = agoraMessageClient.createChannel(talkId)
      await agoraMessageClient.addOrUpdateLocalUserAttributes({name: `Admin`})
      await _messageChannel.join()
      _messageChannel.on('ChannelMessage', on_message)
      setMessageChannel(_messageChannel)
    }catch(e) {
      console.log(e)
    }
  }

  async function send_message(evt:React.KeyboardEvent<HTMLInputElement>){
    if(evt.key !== 'Enter') return
    // @ts-ignore
    let text = evt.target.value
    // @ts-ignore
    evt.target.value = ''
    try {
      let first = messages.length === 0 ? true : messages[messages.length-1].senderId !== props.localUser.uid
      setMessages([...messages, {senderId: props.localUser.uid, text: text, name: 'Me', first: first}])
      await messageChannel.sendMessage({text})
    } catch{
      console.log('error sending message')
    }
  }

  return (
    <>
    <Box height="85%" flex={true} gap="5px" overflow="auto" margin="small" style={{position : "relative", bottom: 0}}>
      {messages.map((msg, i)=>(
      <Box flex={false} alignSelf={msg.senderId == props.localUser.uid ? 'end': 'start'} direction="column" key={i} gap={msg.first ? "2px" : "0px"} 
        >
        { msg.first && (
          <Text color="#0C385B" size="12px" weight="bold" style={{textAlign: msg.senderId == props.localUser.uid?'right': 'left'}}>
            {msg.name}
          </Text>
        )}
        <Text size="14px" style={{textAlign: msg.senderId == props.localUser.uid?'right': 'left'}}>
          {textToLatex(msg.text)}
        </Text>
      </Box>
      // style={{textAlign: msg.senderId == localUser.uid?'right': 'left'}}
      ))}
      <Box ref={messagesEndRef} />
    </Box>
    <TextInput onKeyUp={send_message} placeholder='Aa' />
    {/* <input type='textbox' onKeyUp={send_message} placeholder='type message and press enter.' /> */}
    </>
  )
}

export default ChatBox