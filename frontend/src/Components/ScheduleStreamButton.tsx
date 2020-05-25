import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import {
  Box,
  Button,
  Heading,
  TextInput,
  TextArea,
  Layer,
  Text,
  Calendar,
  MaskedInput,
} from "grommet";
import { Steps } from "antd";
import "../Styles/antd.css";
import "../Styles/manage-channel.css";
import TagSelector from "./TagSelector";
import { ReactComponent as TitleImage } from "../title.svg";
import { ReactComponent as DescriptionImage } from "../description.svg";
import { ReactComponent as TagImage } from "../tags.svg";
import { ReactComponent as DoneImage } from "../finished.svg";
import {
  ScheduledStream,
  ScheduledStreamService,
} from "../Services/ScheduledStreamService";
import { Tag } from "../Services/TagService";
import { Channel } from "../Services/ChannelService";
import Loading from "./Loading";

const { Step } = Steps;

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
  // toStream: boolean;
  // stream: any;
  date: string;
  time: string;
}

export default class ScheduleStreamButton extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: false,
      modalStep: 0,
      title: "",
      description: "",
      tags: [],
      loading: false,
      // toStream: false,
      // stream: null,
      date: new Date().toISOString(),
      time: "",
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

  combineDateAndTimeStrings = () => {
    return `${this.state.date.slice(0, 10)} ${this.state.time}`;
  };

  onFinish = () => {
    const dateTimeStr = this.combineDateAndTimeStrings();
    ScheduledStreamService.scheduleStream(
      this.props.channel!.id,
      this.props.channel!.name,
      this.state.title,
      this.state.description,
      dateTimeStr,
      (stream: ScheduledStream) => {
        console.log("SCHEDULED STREAM:", stream);
        this.setState(
          {
            loading: false,
          },
          () => {
            this.toggleModal();
            this.setState({
              modalStep: 0,
              title: "",
              description: "",
              tags: [],
              date: new Date().toISOString(),
              time: "",
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

  getDateBounds = () => {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const inOneYear = new Date(
      new Date().setFullYear(new Date().getFullYear() + 1)
    );
    const inOneYearStr = inOneYear.toISOString().slice(0, 10);
    return [todayStr, inOneYearStr];
  };

  dateStep = () => {
    return (
      <Box
        style={{ width: "85%" }}
        gap="medium"
        // align="center"
        justify="between"
      >
        <Box margin={{ bottom: "45px" }} gap="small">
          <Calendar
            date={this.state.date}
            bounds={this.getDateBounds()}
            size="medium"
            onSelect={(date: any) => {
              this.setState({ date });
            }}
            daysOfWeek
            style={{ width: "100%" }}
          />
          <MaskedInput
            mask={[
              {
                length: 2,
                regexp: /^[01][0-9]$|^2[0-3]|^[0-9]$/,
                placeholder: "hh",
              },
              { fixed: ":" },
              {
                length: 2,
                regexp: /^[0-5][0-9]$|^[0-5]$/,
                placeholder: "mm",
              },
            ]}
            value={this.state.time}
            onChange={(event) => {
              this.setState({ time: event.target.value });
            }}
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
          disabled={this.state.time.length !== 5}
        />
      </Box>
    );
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
          label={this.state.loading ? "" : "Finish"}
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
      <Box margin={this.props.margin} pad="none">
        <Box
          className="gradient-border"
          round="8px"
          align="center"
          justify="center"
          onClick={this.toggleModal}
          focusIndicator={false}
        >
          <Text color="black" size="16.5px" style={{ fontWeight: 500 }}>
            Schedule stream
          </Text>
        </Box>
        {this.state.showModal && (
          <Layer
            onEsc={this.toggleModal}
            onClickOutside={this.toggleModal}
            modal
            responsive
            animation="fadeIn"
            style={{ width: 500, height: 650, borderRadius: 15 }}
          >
            <Box
              margin="medium"
              align="center"
              justify="between"
              style={{ height: "100%" }}
            >
              <Box align="center" width="100%">
                <Heading level={2} style={{ marginBottom: 20 }}>
                  Schedule stream
                </Heading>
                <Steps
                  current={this.state.modalStep}
                  labelPlacement="vertical"
                  // size="small"
                >
                  <Step title="Date" />
                  <Step title="Title" />
                  <Step title="Description" />
                  <Step title="Tags" />
                  <Step title="Finish" />
                </Steps>
              </Box>
              <Box align="center" style={{ width: "100%" }}>
                {this.state.modalStep == 0 && this.dateStep()}
                {this.state.modalStep == 1 && this.titleStep()}
                {this.state.modalStep == 2 && this.descriptionStep()}
                {this.state.modalStep == 3 && this.tagStep()}
                {this.state.modalStep == 4 && this.finalStep()}
              </Box>
            </Box>
          </Layer>
        )}
      </Box>
    );
  }
}
