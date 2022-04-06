import React, { useEffect, useState } from "react";
import LivestreamAdminPage from "./LivestreamAdminPage";
import LivestreamAudiencePage from "./LivestreamAudiencePage";
import LivestreamSpeakerPage from "./LivestreamSpeakerPage";
import LivestreamErrorPage from "./LivestreamErrorPage";
import { UrlEncryption } from "../../Components/Core/Encryption/UrlEncryption";
import { TalkService, Talk } from "../../Services/TalkService";
import { ChannelService } from "../../Services/ChannelService";
import { useStore } from "../../store";
import { useAuth0 } from "@auth0/auth0-react";

const nullTalk: Talk = {
  id: NaN,
  channel_id: NaN,
  channel_name: "",
  channel_colour: "",
  has_avatar: false,
  name: "",
  date: "",
  end_date: "",
  description: "",
  link: "",
  recording_link: "",
  tags: [],
  show_link_offset: NaN,
  visibility: "",
  card_visibility: "",
  topics: [],
  talk_speaker: "",
  talk_speaker_url: "",
  published: 0,
  audience_level: "All",
  has_speaker_photo: 0,
};

interface Props {
  location: { pathname: string };
  // match: {params: {encoded_endpoint: string}};
  // NOTE on why we dont use props.match.params.encoded_endpoint:
  //    As the encoded endpoint contains many "/" because of AES,
  //    calling props.encoded_endpoint does not grab the full endpoint.
}

export const LivestreamPage = (props: Props) => {
  const [talkId, setTalkId] = useState(-1);
  const [talkRole, setTalkRole] = useState<"admin" | "speaker" | "audience">(
    "admin"
  );
  const [talk, setTalk] = useState(nullTalk);
  const [channelRole, setChannelRole] = useState<"owner" | "member" | any>("");
  const [talkNotFound, setTalkNotFound] = useState(false);
  const [talkErrorMsg, setTalkErrorMsg] = useState("");

  const user = useStore((state) => state.loggedInUser);

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    // decode URL
    const token = await getAccessTokenSilently();
    readUrl(() => {
      // fetch talk info
      TalkService.getTalkById(talkId, (talk: Talk) => {
        if (talk !== null) {
          setTalk(talk);
          user &&
            ChannelService.getRoleInChannel(
              user!.id,
              talk.channel_id,
              (channelRole: string) => {
                setChannelRole(channelRole);
              },
              token
            );
        } else {
          setTalkNotFound(true);
          setTalkErrorMsg(
            "This event has been modified or no longer exists. Contact an organiser for a new URL."
          );
        }
      });
    });
  };

  const readUrl = (callback: any) => {
    try {
      setTalkId(
        Number(
          UrlEncryption.getIdFromEncryptedEndpoint(
            props.location.pathname.replace("/livestream/", "")
          )
        )
      );
      setTalkRole(
        UrlEncryption.getRoleFromEncryptedEndpoint(
          props.location.pathname.replace("/livestream/", "")
        )
      );
      if (talkId !== 0) {
        callback();
      } else {
        setTalkNotFound(true);
        setTalkErrorMsg("Badly formatted URL. Could not extract ID.");
      }
    } catch (e) {
      console.log(e);
      setTalkNotFound(true);
      setTalkErrorMsg("Badly formatted URL. Could not extract ID.");
    }
  };

  if (!talkNotFound) {
    if (talkRole == "speaker") {
      console.log("speaker");
      return <LivestreamSpeakerPage talkId={talkId} />;
    } else if (talkRole == "admin" || channelRole == "owner") {
      console.log("admin");
      return <LivestreamAdminPage talkId={talkId} />;
    } else {
      console.log("audience");
      return <LivestreamAudiencePage talkId={talkId} />;
    }
  } else {
    return <LivestreamErrorPage errorMessage={talkErrorMsg} />;
  }
};
