import React, { useRef, useEffect, FunctionComponent, useState } from "react";
import { Box, Text, TextInput } from "grommet";
import { textToLatex } from "../../Components/Core/LatexRendering";


interface Props {
  localUser: LocalUser;
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

const ChatBox:FunctionComponent<Props> = (props) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [messageChannel, setMessageChannel] = useState(null as any)
  const messagesEndRef = useRef<null | HTMLDivElement>(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(() => { scrollToBottom() }, [messages]);

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