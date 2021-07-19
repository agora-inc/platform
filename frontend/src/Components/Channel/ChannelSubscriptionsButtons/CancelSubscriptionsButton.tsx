import React, { useState, FunctionComponent } from "react"
import { ChannelSubscriptionService } from "../../../Services/ChannelSubscriptionService";
import { Text, Box } from "grommet";

interface Props {
    channelId: number
}

const CancelSubscriptionsButton:FunctionComponent<Props> = (props) => {    
    const [text, setText] = useState("Unsubscribe from all")

    const onClick = async () => {
        ChannelSubscriptionService.cancelAllSubscriptionsForChannel(props.channelId, 
            (data: any) => {
                if (data == "ok"){
                    setText("Successfully unsubscribed")
                } else {
                    setText(data)
                }
            })
    }
    
    return (
        <Box
            onClick={onClick}
            background="#0C385B"
            round="xsmall"
            pad="xsmall"
            width="160px"
            height="40px"
            justify="center"
            align="center"
            focusIndicator={false}
            hoverIndicator="#6DA3C7"
            alignSelf="center"
        >
            <Text size="14px" weight="bold">{text}</Text>
        </Box>
    );
}

export default CancelSubscriptionsButton