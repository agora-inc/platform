import React, { useState, Fragment } from "react";
import { Redirect } from "react-router-dom";
import { Box, Text, TextInput, Layer } from "grommet";
import { Close } from "grommet-icons";

import { ChannelService } from "../../Services/ChannelService";
import { useAuth0 } from "@auth0/auth0-react";

type Props = {
  name: string;
  id: number;
};

const DeleteAgoraButton = ({ name, id }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [typedName, setTypedName] = useState("");
  const [finished, setFinished] = useState(false);

  const { getAccessTokenSilently } = useAuth0();

  const onDeleteClicked = async () => {
    const token = await getAccessTokenSilently();
    ChannelService.deleteAgora(
      id,
      () => {
        setFinished(true);
      },
      token
    );
  };

  return finished ? (
    <Redirect to="/" />
  ) : (
    <Fragment>
      <Box
        background="#EAF1F1"
        round="xsmall"
        width="120px"
        height="35px"
        justify="center"
        align="center"
        focusIndicator={true}
        hoverIndicator="#DDDDDD"
        onClick={() => setShowModal(true)}
      >
        <Text size="13px" weight="bold" color="grey">
          Delete agora
        </Text>
      </Box>
      {showModal && (
        <Layer
          onEsc={() => setShowModal(false)}
          onClickOutside={() => setShowModal(false)}
          modal
          responsive
          animation="fadeIn"
          style={{
            width: 375,
            border: "2.5px solid black",
            borderRadius: 10,
            overflow: "hidden",
            padding: 0,
          }}
        >
          <div
            style={{
              background: "#EAF1F1",
              padding: 10,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <b style={{ fontSize: 22, color: "black" }}>Are you sure?</b>
            <div
              onClick={() => setShowModal(false)}
              style={{
                height: 25,
                width: 25,
                borderRadius: 12.5,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#E2E2E2",
                cursor: "pointer",
              }}
            >
              <Close size="13px" color="black" />
            </div>
          </div>
          <div style={{ background: "white", padding: 10, paddingTop: 70 }}>
            <div style={{ marginBottom: 10 }}>
              This action <b>cannot</b> be undone. This will <b>permanently</b>{" "}
              delete the agora, along with all future and past talks
            </div>
            <div style={{ marginBottom: 5 }}>
              Please type the agora name to confirm
            </div>
            <TextInput
              style={{
                borderRadius: 10,
                background: "#EBEBEB",
                outline: "none",
                border: "none",
              }}
              focusIndicator={false}
              onChange={(e) => setTypedName(e.target.value)}
            />
          </div>
          <div style={{ background: "#EAF1F1", padding: 10 }}>
            <div
              onClick={onDeleteClicked}
              style={{
                opacity: typedName === name ? 1 : 0.5,
                pointerEvents: typedName === name ? "auto" : "none",
                cursor: "pointer",
                background: "#FF4040",
                borderRadius: 10,
                width: "100%",
                padding: 10,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "white",
                  textAlign: "center",
                }}
              >
                I understand, delete this agora
              </span>
            </div>
          </div>
        </Layer>
      )}
    </Fragment>
  );
};

export default DeleteAgoraButton;
