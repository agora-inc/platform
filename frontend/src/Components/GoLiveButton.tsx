import React, { Component } from "react";
import { Link, withRouter, Redirect } from "react-router-dom";
import { Box, Button, Heading, TextInput, TextArea, Layer } from "grommet";
import { Video } from "grommet-icons";
import { Steps } from "antd";
import "../Styles/antd.css";
import TagSelector from "./TagSelector";
import { ReactComponent as TitleImage } from "../title.svg";
import { ReactComponent as DescriptionImage } from "../description.svg";
import { ReactComponent as TagImage } from "../tags.svg";
import { ReactComponent as DoneImage } from "../finished.svg";
import { Stream, StreamService } from "../Services/StreamService";
import { Tag } from "../Services/TagService";
import Loading from "./Loading";

const { Step } = Steps;

interface Props {
  margin: string;
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

export default class GoLiveButton extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: false,
      modalStep: 0,
      title: "",
      description: "",
      tags: [],
      loading: false,
      toStream: false,
      stream: null,
    };
  }

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal, modalStep: 0 });
  };

  advanceStep = () => {
    console.log(this.state);
    this.setState({ modalStep: this.state.modalStep + 1 });
  };

  onFinishClicked = () => {
    this.setState(
      {
        loading: true,
      },
      () => {
        this.onFinish();
      }
    );
  };

  onFinish = () => {
    StreamService.createStream(
      1,
      "ImperialBioEng",
      this.state.title,
      this.state.description,
      this.state.tags,
      (stream: Stream) => {
        this.setState(
          {
            loading: false,
            toStream: true,
            stream: stream,
          },
          () => {
            this.toggleModal();
            this.setState({
              modalStep: 0,
              title: "",
              description: "",
              tags: [],
              toStream: false,
            });
          }
        );
      }
    );
  };

  selectTag = (tag: Tag) => {
    this.setState({ tags: [...this.state.tags, tag] });
  };

  deselectTag = (tag: Tag) => {
    this.setState({
      tags: this.state.tags.filter(function (t) {
        return t !== tag;
      }),
    });
  };

  titleStep = () => {
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
            onChange={(e) => this.setState({ title: e.target.value })}
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
          onClick={this.advanceStep}
          disabled={this.state.title === ""}
        />
      </Box>
    );
  };

  descriptionStep = () => {
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
            onChange={(e) => this.setState({ description: e.target.value })}
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
          onClick={this.advanceStep}
          disabled={this.state.description === ""}
        />
      </Box>
    );
  };

  tagStep = () => {
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
          <TagSelector
            onSelectedCallback={this.selectTag}
            onDeselectedCallback={this.deselectTag}
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
          onClick={this.advanceStep}
          disabled={this.state.description === ""}
        />
      </Box>
    );
  };

  finalStep = () => {
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
          label={this.state.loading ? "" : "Go live"}
          primary
          color="#61EC9F"
          onClick={this.onFinishClicked}
          disabled={this.state.description === ""}
        >
          {this.state.loading && <Loading size={20} color="black" />}
        </Button>
      </Box>
    );
  };

  render() {
    return (
      <Box
        margin={this.props.margin}
        pad="none"
        style={{
          backgroundColor: "moz-linear-gradient(to right, #fd6fff, #ffeaa6);",
          marginTop: -6,
        }}
      >
        <Button
          icon={<Video />}
          style={{
            width: 125,
            height: 45,
            fontSize: 20,
            fontWeight: "bold",
            padding: 0,
            marginTop: 6,
            border: "none",
            borderRadius: 15,
            alignItems: "center",
            justifyContent: "center",
          }}
          label="Stream"
          primary
          color="#61EC9F"
          onClick={this.toggleModal}
        />
        {this.state.showModal && (
          <Layer
            onEsc={this.toggleModal}
            onClickOutside={this.toggleModal}
            modal
            responsive
            animation="fadeIn"
            style={{ width: 500, height: 600, borderRadius: 15 }}
          >
            {this.state.toStream ? (
              <Redirect
                to={{
                  pathname: "/streaming",
                  state: {
                    stream: this.state.stream,
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
                  <Steps
                    // size="small"
                    current={this.state.modalStep}
                    labelPlacement="vertical"
                  >
                    <Step title="Title" />
                    <Step title="Description" />
                    <Step title="Tags" />
                    <Step title="Finish" />
                  </Steps>
                </Box>
                <Box align="center" style={{ width: "100%" }}>
                  {this.state.modalStep == 0 && this.titleStep()}
                  {this.state.modalStep == 1 && this.descriptionStep()}
                  {this.state.modalStep == 2 && this.tagStep()}
                  {this.state.modalStep == 3 && this.finalStep()}
                </Box>
              </Box>
            )}
          </Layer>
        )}
      </Box>
    );
  }
}
