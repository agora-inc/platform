import React, { FunctionComponent, useState } from "react";
import { Redirect } from "react-router-dom";
import { Text, Box, TextInput } from "grommet";
import { useAuth0 } from "@auth0/auth0-react";

import { useStore } from "../../../store";
import { Channel, ChannelService } from "../../../Services/ChannelService";
import { Topic } from "../../../Services/TopicService";
import ChannelTopicSelector from "../ChannelTopicSelector";
import { Overlay, OverlaySection } from "../../Core/Overlay";
import { LoginButton } from "../../Account/LoginButton";
import SignUpButton from "../../Account/SignUpButton";

const topicExists = (topics: Topic[]) => {
  let res = [];
  for (let topic in topics) {
    if (topic) {
      res.push(true);
    } else {
      res.push(false);
    }
  }
  return res;
};

interface Props {
  onBackClicked: any;
  onComplete: any;
  channel?: Channel;
  visible: boolean;
}

export const CreateChannelOverlay: FunctionComponent<Props> = (props) => {
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelDescription, setNewChannelDescription] = useState("");
  const [newChannelEmail, setNewChannelEmail] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [topics, setTopics] = useState<Topic[]>(
    props.channel ? props.channel.topics : []
  );
  const [isPrevTopics, setIsPrevTopics] = useState<boolean[]>(
    props.channel ? topicExists(props.channel?.topics) : [false, false, false]
  );

  const user = useStore((state) => state.loggedInUser);

  const { getAccessTokenSilently } = useAuth0();

  const onCreateClicked = async () => {
    const token = await getAccessTokenSilently();
    ChannelService.createChannel(
      newChannelName,
      newChannelDescription,
      user?.id || -1,
      (r: string) => {
        setRedirect(true);
      },
      topics,
      token
    );
  };

  const containsSpecialCharacter = (name: string) => {
    let check = /[`~@£$%^&*=+{}\[\]'"\\\|\/?<>]/;
    let test = name.toLowerCase().replace(/[0-9]/g, " ");
    if (test.match(check)) {
      return true;
    } else {
      return false;
    }
  };

  const selectTopic = (topic: Topic, num: number) => {
    let tempTopics = topics;
    tempTopics[num] = topic;
    setTopics(tempTopics);
  };

  const cancelTopic = (num: number) => {
    let tempTopics = topics;
    tempTopics[num] = {
      field: "",
      id: 0,
      is_primitive_node: false,
      parent_1_id: -1,
      parent_2_id: -1,
      parent_3_id: -1,
    };
    setTopics(tempTopics);
  };

  const isComplete = () => {
    return (
      newChannelName !== "" &&
      newChannelName.length >= 5 &&
      containsSpecialCharacter(newChannelName) &&
      topics.length > 0
    );
  };

  return redirect ? (
    <Redirect to={`/${newChannelName}`} />
  ) : (
    <Overlay
      width={500}
      height={380}
      visible={props.visible}
      title={user === null ? "Get started!" : `Create an Agora`}
      submitButtonText="Create"
      disableSubmitButton={user === null ? true : false}
      onSubmitClick={onCreateClicked}
      contentHeight="230px"
      canProceed={isComplete()}
      onCancelClick={props.onBackClicked}
      onClickOutside={props.onBackClicked}
      onEsc={props.onBackClicked}
    >
      {user === null && (
        <>
          <Box style={{ minHeight: "40%" }} />
          <Box direction="row" align="center" gap="10px">
            <LoginButton callback={() => {}} />
            <Text size="14px"> or </Text>
            <SignUpButton callback={() => {}} />
            <Text size="14px"> to proceed </Text>
          </Box>
        </>
      )}

      {user && (
        <>
          <OverlaySection>
            An agora is a hub for your community. It is the place where you
            organise and list all your events, past or future. Give your
            community a name and classification before getting started!
            <TextInput
              style={{ width: "100%", marginTop: "5px" }}
              placeholder="Your agora name"
              onChange={(e) => setNewChannelName(e.target.value)}
            />
          </OverlaySection>
          <OverlaySection>
            <ChannelTopicSelector
              onSelectedCallback={selectTopic}
              onCanceledCallback={cancelTopic}
              isPrevTopics={isPrevTopics}
              prevTopics={props.channel ? props.channel.topics : []}
              textSize="medium"
            />
          </OverlaySection>
        </>
      )}

      {containsSpecialCharacter(newChannelName) ? (
        <Text color="red" size="12px" style={{ marginBottom: "12px" }}>
          Agora name cannot contain special characters
        </Text>
      ) : null}
    </Overlay>
  );
};
