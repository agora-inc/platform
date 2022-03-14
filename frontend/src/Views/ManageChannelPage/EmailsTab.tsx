import React, { Component, useEffect, useState } from "react";
import { Box, Select, Text, TextArea } from "grommet";
import ReactTooltip from "react-tooltip";
import { StatusInfo, Close } from "grommet-icons";
import { ChannelService } from "../../Services/ChannelService";
import { useStore } from "../../store";
import { useAuth0 } from "@auth0/auth0-react";

const reminders_email =
  "A reminder email will be sent to <br/>" +
  "- your mailing list <br/>" +
  "- your followers <br/>" +
  "- the registered participants <br/>" +
  "before the start of your seminars. Decide how much time before, with up to two reminders.";
const mailing_list = "Separate emails with a comma";

const range = (end: number) => {
  return Array.from(Array(end).keys());
};

type Reminder = {
  exist: boolean;
  days: number;
  hours: number;
};

interface Props {
  channelId: number;
}

export const EmailsTab = (props: Props) => {
  const [reminders, setReminders] = useState<Reminder[]>([
    { exist: false, days: 0, hours: 0 },
    { exist: false, days: 0, hours: 0 },
  ]);
  const [mailingList, setMailingList] = useState("");
  const [listEmailCorrect, setListEmailCorrect] = useState<string[]>([]);
  const [strEmailWrong, setStrEmailWrong] = useState("");

  const user = useStore((state) => state.loggedInUser);

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    getListEmail();
  }, []);

  const getListEmail = async () => {
    const token = await getAccessTokenSilently();
    ChannelService.getMailingList(
      props.channelId,
      (listEmailCorrect: string[]) => {
        setListEmailCorrect(listEmailCorrect);
      },
      token
    );
  };

  const toggleReminder = (i: number) => {
    let r = reminders;
    r[i].exist = !r[i].exist;
    setReminders(r);
  };

  const pushDays = (i: number, n_days: string) => {
    let r = reminders;
    r[i].days = Number(n_days);
    setReminders(r);
  };

  const pushHours = (i: number, n_hours: string) => {
    let r = reminders;
    r[i].hours = Number(n_hours);
    setReminders(r);
  };

  const handleMailingList = (e: any) => {
    setMailingList(e.target.value);
  };

  const parseMailingList = async () => {
    let oldListEmail = listEmailCorrect;
    // get all emails constructed using non-alphanumerical characters except "@", ".", "_", and "-"
    let regExtraction = mailingList.match(
      /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi
    );
    if (regExtraction === null) {
      regExtraction = [];
    }

    // filtering new admissibles emails from badly formatted ones
    let newListEmail = [];
    let strEmailWrong = mailingList;
    for (var email of regExtraction) {
      let emailLower = email.toLowerCase();
      if (!oldListEmail.includes(emailLower)) {
        newListEmail.push(emailLower);
      }
      strEmailWrong = strEmailWrong.replace(email, "");
    }

    // clean box if empty
    strEmailWrong = strEmailWrong.replace(/[/\n\;\,]/g, " ");
    if (strEmailWrong.replace(/[\s]/g, "") === "") {
      strEmailWrong = "";
    }

    const token = await getAccessTokenSilently();

    // add admissible emails to database
    ChannelService.addToMailingList(
      props.channelId,
      newListEmail,
      () => {},
      token
    );

    setListEmailCorrect(oldListEmail.concat(newListEmail));
    setStrEmailWrong(strEmailWrong);
    setMailingList(strEmailWrong);
  };

  const renderReminder = (j: number) => {
    return (
      <Box direction="row" gap="6px" align="center">
        <Text size="16px" color="grey" margin={{ right: "20px" }}>
          Reminder {j + 1}
        </Text>
        {!reminders[j].exist && (
          <Box
            focusIndicator={false}
            background="white"
            round="xsmall"
            pad={{ vertical: "2px", horizontal: "xsmall" }}
            onClick={() => {
              toggleReminder(j);
            }}
            style={{
              width: "60px",
              height: "26px",
              border: "1px solid #C2C2C2",
            }}
            hoverIndicator={true}
            align="center"
          >
            <Text color="grey" size="small">
              + Add
            </Text>
          </Box>
        )}
        {reminders[j].exist && (
          <Box direction="row" gap="6px" align="center" justify="center">
            <input
              value={reminders[j].days}
              onChange={(e) => pushDays(j, e.target.value)}
              style={{
                width: "30px",
                height: "26px",
                padding: "4px",
                border: "1px solid #C2C2C2",
                borderRadius: "5px",
              }}
            />
            <Text size="16px" color="grey" margin={{ right: "15px" }}>
              {" "}
              day(s){" "}
            </Text>
            <input
              value={reminders[j].hours}
              onChange={(e) => pushHours(j, e.target.value)}
              style={{
                width: "30px",
                height: "26px",
                padding: "4px",
                border: "1px solid #C2C2C2",
                borderRadius: "5px",
              }}
            />
            <Text size="16px" color="grey" margin={{ right: "20px" }}>
              {" "}
              hour(s){" "}
            </Text>
            <Close size="20px" onClick={() => toggleReminder(j)} />
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box direction="column" gap="20px">
      {/* <Box direction="row" gap="small" margin={{ bottom: "0px" }}>
          <Text size="16px" weight="bold" color="black"> 
            Email reminders
          </Text>
          <Text size="14px" style={{fontStyle: "italic", marginTop: "1.7px"}}  color="black"> 
            Default settings 
          </Text>
          <StatusInfo style={{marginTop: "3px"}} size="small" data-tip={reminders_email} data-for='reminder-emails'/>
          <ReactTooltip id='reminder-emails' place="right" effect="solid" html={true}/>
        </Box>
        {renderReminder(0)}
        {renderReminder(1)}
    */}
      <Text
        size="16px"
        style={{ fontStyle: "italic" }}
        margin={{ top: "15px" }}
      >
        Securely upload your mailing list and send automatic email reminders
        when you create your talk!
      </Text>

      <Box direction="row" width="100%" gap="25%" margin={{ top: "12px" }}>
        <Box direction="column" width="50%" margin={{ bottom: "50px" }}>
          <Box direction="row" gap="small" margin={{ bottom: "12px" }}>
            <Text size="16px" color="black" weight="bold">
              Add contacts
            </Text>
            <StatusInfo
              style={{ marginTop: "3px" }}
              size="small"
              data-tip={mailing_list}
              data-for="mailing-list"
            />
            <ReactTooltip
              id="mailing-list"
              place="right"
              effect="solid"
              html={true}
            />
          </Box>

          <TextArea
            placeholder="joe@uni.ac.uk, jack@company.com"
            value={mailingList}
            onChange={(e: any) => handleMailingList(e)}
            rows={4}
            style={{
              border:
                strEmailWrong.length === 0
                  ? "2px solid black"
                  : "2px solid red",
            }}
            data-tip
            data-for="email"
          />
          <Box direction="row" width="100%" margin={{ top: "15px" }}>
            <Box width="100%" direction="column">
              {listEmailCorrect.length > 0 && (
                <Text color="green" size="14px" margin={{ bottom: "6px" }}>
                  Emails successfully extracted from text.
                </Text>
              )}
              {strEmailWrong.length > 0 && (
                <Text color="red" size="14px">
                  Some emails are in the wrong format.
                </Text>
              )}
            </Box>
            <Box
              onClick={parseMailingList}
              background="#0C385B"
              round="xsmall"
              // pad="xsmall"
              height="30px"
              width="18%"
              justify="center"
              align="center"
              focusIndicator={false}
              hoverIndicator="#BAD6DB"
            >
              <Text size="14px"> Add </Text>
            </Box>
          </Box>
        </Box>
        <Box direction="column" width="25%">
          <Text
            size="16px"
            color="black"
            weight="bold"
            margin={{ bottom: "12px" }}
          >
            Your mailing list ({listEmailCorrect.length})
          </Text>
          <Box
            height="134px"
            gap="4px"
            overflow="auto"
            margin={{ bottom: "15px", left: "8px" }}
          >
            {listEmailCorrect.map((email: string) => (
              <Text size="13px" color="grey">
                {" "}
                {email}{" "}
              </Text>
            ))}
          </Box>
        </Box>
      </Box>

      {/* <Box direction="row" gap="small">
          <Text size="16px" weight="bold" color="black"> 
            Send custom email to your audience
          </Text>
          <StatusInfo style={{marginTop: "3px"}} size="small" data-tip={reminders_email} data-for='reminder-emails'/>
          <ReactTooltip id='reminder-emails' place="right" effect="solid" html={true}/>
        </Box>
        
        <Text size="18px" weight="bold" color="#6DA3C7"> 
          Available soon!
        </Text> */}
    </Box>
  );
};
