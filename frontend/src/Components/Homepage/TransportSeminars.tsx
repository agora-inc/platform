import React, { FunctionComponent, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Text, TextInput, Select, CheckBox, Layer } from "grommet";
import { StatusInfo, Close } from "grommet-icons";
import ReactTooltip from "react-tooltip";
import { useAuth0 } from "@auth0/auth0-react";

import { Talk } from "../../Services/TalkService";
import { Topic } from "../../Services/TopicService";
import { ChannelService } from "../../Services/ChannelService";
import { RSScraping } from "../../Services/RSScrapingService";
import { Overlay } from "../Core/Overlay";
import Switch from "../Core/Switch";
import { LoginButton } from "../Account/LoginButton";
import SignUpButton from "../Account/SignUpButton";
import ChannelTopicSelector from "../Channel/ChannelTopicSelector";
import { useStore } from "../../store";

export const _TransportSeminars: FunctionComponent = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [url, setUrl] = useState("");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isPrevTopics, setIsPrevTopics] = useState<boolean[]>([]);
  const [audienceLevel, setAudienceLevel] = useState("General audience");
  const [onRegistration, setOnRegistration] = useState(false);
  const [autoAcceptEnabled, setAutoAcceptEnabled] = useState(false);
  const [autoAcceptGroup, setAutoAcceptGroup] = useState("Everybody");
  const [autoAcceptCustomInstitutions, setAutoAcceptCustomInstitutions] =
    useState(false);
  const [showProgressOverlay, setShowProgressOverlay] = useState(false);
  const [isValidSeries, setIsValidSeries] = useState(0);
  const [allTalkIds, setAllTalkIds] = useState<number[]>([]);
  const [channelId, setChannelId] = useState(-1);
  const [channelName, setChannelName] = useState("");
  const [nTalksParsed, setNTalksParsed] = useState(0);

  const user = useStore((state) => state.loggedInUser);

  const { getAccessTokenSilently } = useAuth0();

  const toggleOverlay = () => setShowOverlay(!showOverlay);

  const toggleProgressOverlay = () =>
    setShowProgressOverlay(!showProgressOverlay);

  const selectTopic = (topic: Topic, i: number) => {
    let tempTopics = topics;
    tempTopics[i] = topic;
    setTopics(tempTopics);
  };

  const cancelTopic = (i: number) => {
    let tempTopics = topics;
    tempTopics[i] = {
      field: "",
      id: 0,
      is_primitive_node: false,
      parent_1_id: -1,
      parent_2_id: -1,
      parent_3_id: -1,
    };
    setTopics(tempTopics);
  };

  const handleCheckBox = (name: "Everybody" | "Academics" | "None") => {
    setAutoAcceptGroup(name);
  };

  const isComplete = () => url !== "" && topics.length > 0;

  const isMigrating = () => {
    return allTalkIds.length === 0 || nTalksParsed < allTalkIds.length;
  };

  const isMissing = () => {
    let res: string[] = [];
    if (url === "") {
      res.push("url");
    }
    if (topics.length === 0) {
      res.push("At least 1 topic");
    }
    return res;
  };

  const textTitle = () => {
    if (isValidSeries) {
      if (isMigrating() && channelId > 0) {
        return "Agora created!";
      }
      if (!isMigrating() && channelId > 0) {
        return "Success!";
      }
      if (isMigrating() && channelId <= 0) {
        return "Error...";
      }
    } else {
      return "Not found...";
    }
  };

  const scheduleAllTalks = async (
    channelId: number,
    channelName: string,
    talkIds: number[],
    talkLink: string
  ) => {
    var chunks = [],
      i = 0,
      n = talkIds.length;
    while (i < n) {
      chunks.push(talkIds.slice(i, Math.min(i + 5, n)));
      i += 5;
    }

    const token = await getAccessTokenSilently();

    for (const ids of chunks) {
      await RSScraping.scheduleTalks(
        url,
        channelId,
        channelName,
        ids,
        talkLink,
        topics[0].id,
        audienceLevel,
        onRegistration ? "Members only" : "Everybody",
        autoAcceptGroup,
        (talks: Talk[]) => {
          setNTalksParsed(nTalksParsed + talks.length);
        },
        token
      );
    }
  };

  const onSubmitClick = async () => {
    // Try if the series indeed exists and create agora
    if (user) {
      const token = await getAccessTokenSilently();

      RSScraping.createAgoraGetTalkIds(
        url,
        user.id,
        topics[0].id,
        (res: {
          isValidSeries: number;
          allTalkIds: number[];
          channelId: number;
          channelName: string;
          talkLink: string;
        }) => {
          setIsValidSeries(res.isValidSeries);
          setAllTalkIds(res.allTalkIds);
          setChannelId(res.channelId);
          setChannelName(res.channelName);
          toggleProgressOverlay();
          scheduleAllTalks(
            res.channelId,
            res.channelName,
            res.allTalkIds,
            res.talkLink
          );
        },
        token
      );
    }
  };

  let auto_accept =
    "'Automatically accepting a registration' means that the person registering " +
    "to your event will automatically receive the details by email if they belong to one of the group you selected below";
  return (
    <>
      <Box
        direction="row"
        onClick={toggleOverlay}
        align="center"
        width="400px"
        height="90px"
        round="xsmall"
        pad="small"
        gap="10px"
        style={{
          border: "2px solid #C2C2C2",
        }}
        background="color1"
        hoverIndicator="color3"
        focusIndicator={false}
        justify="center"
      >
        <Text size="22.5px">🚀</Text>
        <Text size="18px" color="white" weight="bold">
          Import from researchseminars.org
        </Text>
      </Box>

      {showOverlay && (
        <Overlay
          width={600}
          height={580}
          visible={true}
          title={
            user === null ? "Get started!" : "Transport your seminar series"
          }
          submitButtonText="Transport"
          disableSubmitButton={user === null ? true : false}
          onSubmitClick={onSubmitClick}
          contentHeight="430px"
          canProceed={isComplete()}
          isMissing={isMissing()}
          onCancelClick={toggleOverlay}
          onClickOutside={toggleOverlay}
          onEsc={toggleOverlay}
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

          {user !== null && (
            <Box align="start">
              <Text size="14px" weight="bold">
                1. Enter here the url of your series on researchseminars.org
              </Text>
              <TextInput
                style={{ width: "100%", marginTop: "5px" }}
                placeholder="https://researchseminars.org/seminar/yourname"
                onChange={(e) => setUrl(e.target.value)}
              />
              <Text
                size="14px"
                weight="bold"
                margin={{ top: "20px", bottom: "-5px" }}
              >
                2. Choose the most appropriate field
              </Text>
              <ChannelTopicSelector
                onSelectedCallback={selectTopic}
                onCanceledCallback={cancelTopic}
                isPrevTopics={isPrevTopics}
                prevTopics={[]}
                textSize="medium"
              />
              <Text
                size="14px"
                weight="bold"
                margin={{ top: "10px", bottom: "5px" }}
              >
                3. Choose the target audience
              </Text>
              <Select
                dropAlign={{ bottom: "top" }}
                focusIndicator={false}
                id="link-visibility-select"
                options={["General audience", "Bachelor/Master", "PhD+"]}
                value={audienceLevel}
                onChange={({ option }) => setAudienceLevel(option)}
              />
              <Box
                direction="row"
                gap="10px"
                align="center"
                margin={{ top: "20px", bottom: "10px" }}
              >
                <Text size="14px" weight="bold">
                  {" "}
                  4. Do you require registration on your events?{" "}
                </Text>
                <Switch
                  width={60}
                  height={24}
                  checked={onRegistration}
                  textOn="Yes"
                  textOff="No"
                  callback={(checked: boolean) => {
                    setOnRegistration(checked);
                    setAutoAcceptGroup("None");
                    // close sub-switch
                    if (!checked) {
                      setAutoAcceptEnabled(checked);
                    }
                  }}
                />
              </Box>
              {onRegistration && (
                <Box margin={{ bottom: "20px" }} gap="15px">
                  <Box direction="row" gap="small" margin={{ bottom: "0px" }}>
                    <Text size="14px" weight="bold">
                      Automatically accept some users?
                    </Text>
                    <Switch
                      width={60}
                      height={24}
                      checked={autoAcceptEnabled}
                      textOn="Yes"
                      textOff="No"
                      callback={(checked: boolean) => {
                        setAutoAcceptEnabled(checked);
                        if (!checked) {
                          setAutoAcceptGroup("None");
                        }
                      }}
                    />
                    <StatusInfo
                      style={{ marginTop: "3px" }}
                      size="small"
                      data-tip={auto_accept}
                      data-for="automatic-registration"
                    />
                    <ReactTooltip
                      id="automatic-registration"
                      place="right"
                      effect="solid"
                      html={true}
                    />
                  </Box>

                  {autoAcceptEnabled && (
                    <>
                      <CheckBox
                        name="feature"
                        label="Everyone"
                        checked={autoAcceptGroup == "Everybody"}
                        onChange={() => handleCheckBox("Everybody")}
                      />
                      <CheckBox
                        name="bug"
                        label="Verified academics"
                        checked={autoAcceptGroup == "Academics"}
                        onChange={() => handleCheckBox("Academics")}
                      />
                      <Text size="14x" margin={{ top: "20px" }}>
                        <i>Everybody else will need to be manually approved.</i>
                      </Text>
                    </>
                  )}
                </Box>
              )}
              {!onRegistration && (
                <Text size="14px">
                  {" "}
                  Your events are going to be public, and the link to your talk
                  will be shown on mora.stream 15 minutes before the start.{" "}
                </Text>
              )}
            </Box>
          )}
        </Overlay>
      )}
      {showProgressOverlay && (
        <Layer
          onEsc={toggleProgressOverlay}
          // onClickOutside={toggleProgressOverlay}
          modal
          responsive
          animation="fadeIn"
          style={{
            width: "600px",
            height: "300px",
            borderRadius: 15,
            padding: 0,
          }}
        >
          <Box width="100%" style={{ overflowY: "auto" }}>
            <Box
              justify="start"
              width="99.7%"
              background="#eaf1f1"
              direction="row"
              style={{
                borderTopLeftRadius: "15px",
                borderTopRightRadius: "15px",
                position: "sticky",
                top: 0,
                minHeight: "55px",
                zIndex: 10,
              }}
            >
              <Box pad="30px" alignSelf="center" fill={true}>
                <Text size="16px" color="black" weight="bold">
                  {textTitle()}
                </Text>
              </Box>
              <Box pad="32px" alignSelf="center">
                <Close onClick={toggleProgressOverlay} />
              </Box>
            </Box>
            {isValidSeries === 1 && isMigrating() && (
              <Box margin={{ top: "30px", left: "30px", bottom: "40px" }}>
                <Text size="16px" margin={{ bottom: "30px" }}>
                  Migration of your talks in progress...
                </Text>
                <Box align="start">
                  <Box
                    round="xsmall"
                    height="25px"
                    width="540px"
                    align="start"
                    background="#DDDDDD"
                  />
                  <Box
                    height="25px"
                    round="xsmall"
                    style={{
                      width:
                        Math.floor(
                          (540 * nTalksParsed) / allTalkIds.length
                        ).toString() + "px",
                    }}
                    background="#0C385B"
                    margin={{ top: "-25px", bottom: "50px" }}
                    align="start"
                    justify="center"
                  >
                    <Text size="14px" alignSelf="end" margin={{ right: "3px" }}>
                      {Math.floor((100 * nTalksParsed) / allTalkIds.length)}%
                    </Text>
                  </Box>
                </Box>
                <Text
                  size="14px"
                  alignSelf="end"
                  margin={{ right: "30px" }}
                  style={{ fontStyle: "italic" }}
                >
                  Do not close this window
                </Text>
              </Box>
            )}
            {isValidSeries === 1 && !isMigrating() && channelId > 0 && (
              <Box margin={{ top: "30px", left: "30px" }}>
                <Box direction="row" margin={{ bottom: "20px" }} align="center">
                  <Text size="16px">Go to your agora by clicking below</Text>
                </Box>
                <Link
                  className="channel"
                  to={`/${channelName}`}
                  style={{ textDecoration: "none" }}
                >
                  <Box
                    direction="row"
                    gap="xsmall"
                    align="center"
                    round="xsmall"
                    pad={{ vertical: "6px", horizontal: "6px" }}
                  >
                    <Box
                      justify="center"
                      align="center"
                      background="#efeff1"
                      overflow="hidden"
                      style={{
                        minHeight: 30,
                        minWidth: 30,
                        borderRadius: 15,
                      }}
                    >
                      <img
                        src={ChannelService.getAvatar(channelId)}
                        height={30}
                        width={30}
                      />
                    </Box>
                    <Box justify="between">
                      <Text weight="bold" size="16px" color="grey">
                        {channelName}
                      </Text>
                    </Box>
                  </Box>
                </Link>
              </Box>
            )}
            {/*isValidSeries === 1 && !isMigrating() && channelId <= 0 && (
              <Box margin={{top: "30px", left: "30px"}}>
                <Box direction="row" margin={{bottom: "20px"}} align="center" gap="10px">
                  <Close color="red" /> 
                  <Text size="16px"> 
                    There was an error in the processing of your seminars. <br/>
                    Please try again or contact us.
                  </Text> 
                </Box>
              </Box>
            )*/}
            {isValidSeries !== 1 && (
              <Box margin={{ top: "30px", left: "30px" }}>
                <Box
                  direction="row"
                  margin={{ bottom: "20px" }}
                  align="center"
                  gap="10px"
                >
                  <Close color="red" />
                  <Text size="16px">
                    The url you entered does not correspond to any seminar
                    series. <br />
                    Please check that the url is correct or contact us.
                  </Text>
                </Box>
              </Box>
            )}
          </Box>
        </Layer>
      )}
    </>
  );
};
