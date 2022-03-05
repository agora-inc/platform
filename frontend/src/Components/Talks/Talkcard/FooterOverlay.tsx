import React, { useState } from "react";
import { Box, Text } from "grommet";
import { Talk, TalkService } from "../../../Services/TalkService";
import { ChannelService } from "../../../Services/ChannelService";
import { User } from "../../../Services/UserService";
import { Calendar } from "grommet-icons";
import { default as TagComponent } from "../../Core/Tag";
import Countdown from "../Countdown";
import CalendarButtons from "../CalendarButtons";
import ShareButtons from "../../Core/ShareButtons";
import TalkRegistrationButton from "./TalkRegistrationButton";
import SaveForLaterButton from "./SaveForLaterButton";
import { useStore } from "../../../store";
import { useAuth0 } from "@auth0/auth0-react";
// import "../../../Styles/talk"

interface Props {
  talk: Talk;
  role: string | undefined;
  available: boolean;
  registered: boolean;
  registrationStatus: string;
  isSharingPage: boolean;
  width?: string;
  // isCurrent?: boolean;
  following?: boolean;
  onEditCallback?: any;
  callback?: any;
}

interface State {
  showModal: boolean;
  showShadow: boolean;
  showEdit: boolean;
}

export const FooterOverlay = (props: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [showShadow, setShowShadow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const user = useStore((state) => state.loggedInUser);

  const { getAccessTokenSilently } = useAuth0();

  const onFollowClicked = async () => {
    if (user === null) return;
    const token = await getAccessTokenSilently();
    if (!props.following) {
      ChannelService.addUserToChannel(
        user.id,
        props.talk.channel_id,
        "follower",
        () => {},
        token
      );
    } else {
      ChannelService.removeUserFromChannel(
        user.id,
        props.talk.channel_id,
        () => {},
        token
      );
    }
    props.callback();
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    const dateStr = date.toDateString().slice(0, -4);
    const timeStr = date.toTimeString().slice(0, 5);
    return `${dateStr} ${timeStr}`;
  };

  const getTimeRemaining = (): string => {
    const end = new Date(props.talk.end_date);
    const now = new Date();
    let deltaMin = Math.floor((end.valueOf() - now.valueOf()) / (60 * 1000));
    let message = deltaMin < 0 ? "Finished " : "Finishing in ";
    const suffix = deltaMin < 0 ? " ago" : "";
    deltaMin = Math.abs(deltaMin);

    let hours = Math.floor(deltaMin / 60);
    let minutes = Math.floor(deltaMin % 60);
    if (hours > 0) {
      message += `${hours}h `;
    }
    if (minutes > 0) {
      message += `${minutes}m `;
    }
    return message + suffix;
  };

  const register = () => {
    // props.user &&
    //   TalkService.registerForTalk(
    //     props.talk.id,
    //     props.user.id,
    //     () => {
    //       // this.toggleModal();
    //       this.checkIfRegistered();
    //       this.setState({
    //         showShadow: false,
    //       });
    //     }
    //   );
  };

  const unregister = () => {
    // props.user &&
    //   TalkService.unRegisterForTalk(
    //     props.talk.id,
    //     props.user.id,
    //     () => {
    //       // this.toggleModal();
    //       this.checkIfRegistered();
    //       this.setState({
    //         showShadow: false,
    //       });
    //     }
    //   );
  };

  const formatDateFull = (s: string, e: string) => {
    const start = new Date(s);
    const dateStartStr = start.toDateString().slice(0, -4);
    const timeStartStr = start.toTimeString().slice(0, 5);
    const end = new Date(e);
    const dateEndStr = end.toDateString().slice(0, -4);
    const timeEndStr = end.toTimeString().slice(0, 5);
    return `${dateStartStr} ${timeStartStr} - ${timeEndStr} `;
  };

  const onClick = () => {
    if (props.registered) {
      unregister();
    } else {
      register();
    }
  };

  const toggleEdit = () => {
    setShowEdit(!showEdit);
  };

  let renderMobileView = window.innerWidth < 800;

  return (
    <Box direction="column" gap="small" width="100%">
      <Box direction="row" gap="small" margin={{ left: "20px", right: "20px" }}>
        <Box direction="row" width="100%" align="center" gap="10px">
          <Calendar size={renderMobileView ? "14px" : "16px"} />
          <Text
            size={renderMobileView ? "14px" : "16px"}
            color="black"
            margin={{ left: "5px" }}
            style={{ height: "20px", fontStyle: "normal" }}
          >
            {formatDateFull(props.talk.date, props.talk.end_date)}
          </Text>
          <CalendarButtons talk={props.talk} />
        </Box>
        <Box
          justify="end"
          align="end"
          // margin={{left: "10px"}}
        >
          <ShareButtons
            talk={props.talk}
            width={renderMobileView ? "50px" : "90px"}
          />
        </Box>

        {/* <Box
                onClick={() => {navigator.clipboard.writeText(`https://mora.stream/event/${props.talk.id}`); }}
                data-tip data-for='save_url_event'
                background="white"
                round="xsmall"
                pad={{ bottom: "6px", top: "6px", left: "18px", right: "18px" }}
                justify="center"
                align="end"
                focusIndicator={true}
                style={{
                  border: "1px solid #C2C2C2",
                }}
                hoverIndicator={true}>
                <LinkIcon size="medium"/>
            </Box>
            <ReactTooltip id="save_url_event" effect="solid">
              Click to copy Event URL!
            </ReactTooltip> */}
      </Box>

      {/* <SaveForLaterButton
          talk={props.talk}
          user={props.user}
        /> */}

      <Box
        direction="row"
        align="center"
        gap="20px"
        background="#d5d5d5"
        pad="25px"
        justify="center"
      >
        {(!props.isSharingPage ||
          (!(props.role && ["owner", "member"].includes(props.role)) &&
            !props.registered &&
            props.talk.visibility !== "Everybody")) && (
          <TalkRegistrationButton
            talk={props.talk}
            role={props.role}
            registered={props.registered}
            registrationStatus={props.registrationStatus}
          />
        )}
        {props.isSharingPage &&
          ((props.role && ["owner", "member"].includes(props.role)) ||
            props.registered ||
            props.talk.visibility === "Everybody") && (
            <Countdown talk={props.talk} />
          )}
      </Box>
    </Box>
  );
};
