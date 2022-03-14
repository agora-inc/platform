import React, { Component, useState } from "react";
import { Redirect } from "react-router-dom";
import {
  Box,
  Button,
  Heading,
  TextInput,
  TextArea,
  Layer,
  Text,
} from "grommet";
// Find another library to make this component work
// import { Steps } from
import "../../Styles/manage-channel.css";
import { ReactComponent as TitleImage } from "../title.svg";
import { ReactComponent as DescriptionImage } from "../description.svg";
import { ReactComponent as TagImage } from "../tags.svg";
import { ReactComponent as DoneImage } from "../finished.svg";
import { Stream, StreamService } from "../../../Services/StreamService";
import { Channel } from "../../../Services/ChannelService";
import { Tag } from "../../../Services/TagService";
import Loading from "../../Core/Loading";
import { useAuth0 } from "@auth0/auth0-react";

// const { Step } = Steps;

interface Props {
  margin: string;
  channel: Channel | null;
}

interface State {
  showModal: boolean;
  modalStep: number;
  title: string;
  description: string;
  tags: Tag[];
  loading: boolean;
  toStream: boolean;
  stream: any;
}

export const StreamNowButton = (props: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [toStream, setToStream] = useState(false);
  const [stream, setStream] = useState<any>(null);

  const { getAccessTokenSilently } = useAuth0();

  const toggleModal = () => {
    setShowModal(!showModal);
    setModalStep(0);
  };

  const advanceStep = () => {
    setModalStep(modalStep + 1);
  };

  const onFinishClicked = () => {
    setLoading(true);
    onFinish();
  };

  const onFinish = async () => {
    const token = await getAccessTokenSilently();
    StreamService.createStream(
      props.channel!.id,
      props.channel!.name,
      title,
      description,
      tags,
      (stream: Stream) => {
        setLoading(false);
        setToStream(true);
        setStream(stream);
        toggleModal();
        setModalStep(0);
        setTitle("");
        setDescription("");
        setTags([]);
        setToStream(false);
      },
      token
    );
  };

  const selectTag = (tag: Tag) => {
    setTags([...tags, tag]);
  };

  const deselectTag = (tag: Tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const titleStep = () => {
    return (
      <Box
        style={{ width: "85%" }}
        gap="medium"
        align="center"
        justify="between"
      >
        <TitleImage height={200} />
        <Box style={{ marginBottom: 45, width: "100%" }}>
          <Heading level={4}>Think of a title for your stream</Heading>
          <TextInput
            placeholder="type something"
            onChange={(e) => setTitle(e.target.value)}
          />
        </Box>
        <Button
          label="Next"
          primary
          color="#61EC9F"
          style={{
            width: "78%",
            height: 45,
            position: "absolute",
            bottom: 30,
            alignSelf: "center",
          }}
          onClick={advanceStep}
          disabled={title === ""}
        />
      </Box>
    );
  };

  const descriptionStep = () => {
    return (
      <Box
        style={{ width: "85%" }}
        margin={{ vertical: "medium" }}
        gap="medium"
        align="center"
      >
        <DescriptionImage height={150} />
        <Box style={{ marginBottom: 20 }}>
          <Heading level={4}>
            Add a description so viewers know what your stream is about
          </Heading>
          <TextArea
            placeholder="type something"
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>
        <Button
          label="Next"
          primary
          color="#61EC9F"
          style={{
            width: "78%",
            height: 45,
            position: "absolute",
            bottom: 30,
            alignSelf: "center",
          }}
          onClick={advanceStep}
          disabled={description === ""}
        />
      </Box>
    );
  };

  const tagStep = () => {
    return (
      <Box
        style={{ width: "85%" }}
        margin={{ vertical: "medium" }}
        gap="medium"
        justify="end"
        align="center"
      >
        <TagImage height={150} />
        <Box style={{ marginBottom: 20, marginTop: 0, height: "40%" }}>
          {/* <TagSelector
            onSelectedCallback={selectTag}
            onDeselectedCallback={deselectTag}
          /> */}
        </Box>
        <Button
          label="Next"
          primary
          color="#61EC9F"
          style={{
            width: "78%",
            height: 45,
            position: "absolute",
            bottom: 30,
            alignSelf: "center",
          }}
          onClick={advanceStep}
          disabled={description === ""}
        />
      </Box>
    );
  };

  const finalStep = () => {
    return (
      <Box
        style={{ width: "85%" }}
        margin={{ vertical: "medium" }}
        gap="medium"
        justify="end"
        align="center"
      >
        <DoneImage height={200} />
        <Heading level={2} margin={{ bottom: "50px" }}>
          All done!
        </Heading>
        <Button
          style={{
            width: "78%",
            height: 45,
            position: "absolute",
            bottom: 30,
            alignSelf: "center",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
          label={loading ? "" : "Go live"}
          primary
          color="#61EC9F"
          onClick={onFinishClicked}
          disabled={description === ""}
        >
          {loading && <Loading size={20} color="black" />}
        </Button>
      </Box>
    );
  };

  return (
    <Box
      margin={props.margin}
      pad="none"
      // style={{
      //   backgroundColor: "moz-linear-gradient(to right, #fd6fff, #ffeaa6);",
      //   marginTop: -6,
      // }}
    >
      <Box
        className="gradient-border"
        round="8px"
        align="center"
        justify="center"
        onClick={toggleModal}
        focusIndicator={false}
      >
        <Text color="black" size="16.5px" style={{ fontWeight: 500 }}>
          Stream now
        </Text>
      </Box>
      {showModal && (
        <Layer
          onEsc={toggleModal}
          onClickOutside={toggleModal}
          modal
          responsive
          animation="fadeIn"
          style={{ width: 500, height: 600, borderRadius: 15 }}
        >
          {toStream ? (
            <Redirect
              to={{
                pathname: "/streaming",
                state: {
                  stream: stream,
                },
              }}
            />
          ) : (
            <Box
              margin="medium"
              align="center"
              justify="between"
              style={{ height: "100%" }}
            >
              <Box align="center" width="100%">
                <Heading level={2} style={{ marginBottom: 20 }}>
                  New stream
                </Heading>
                {/* 
                <Steps
                  // size="small"
                  current={modalStep}
                  labelPlacement="vertical"
                >
                  <Step title="Title" />
                  <Step title="Description" />
                  <Step title="Tags" />
                  <Step title="Finish" />
                </Steps> */}
              </Box>
              <Box align="center" style={{ width: "100%" }}>
                {modalStep == 0 && titleStep()}
                {modalStep == 1 && descriptionStep()}
                {modalStep == 2 && tagStep()}
                {modalStep == 3 && finalStep()}
              </Box>
            </Box>
          )}
        </Layer>
      )}
    </Box>
  );
};
