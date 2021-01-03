import React, { Component, useState, Fragment } from "react";
import { Box, Text, TextInput, Layer } from "grommet";
import { Close } from "grommet-icons";

type Props = {
    name: string;
    id: number;
  };
  
  const SocialMediaButton = ({ name, id }: Props) => {
    const [showModal, setShowModal] = useState(false);
    const [typedWebsite, setWebsiteLink] = useState("");
    const [typedTwitter, setTwitterLink] = useState("");
    const [typedFacebook, setFacebookLink] = useState("");
    const [typedLinkedin, setLinkedinLink] = useState("");
    const [finished, setFinished] = useState(false);
  
    const onSaveClicked = () => {
      
    };

    

    return (
        <Fragment>
            <Box pad="none">
                <Box
                onClick={() => setShowModal(true)}
                background="white"
                border="all"
                round="xsmall"
                pad={{bottom: "small", top: "small", left: "small", right: "small"}}
                height="40px"
                width="200px"
                justify="center"
                align="center"
                focusIndicator={false}
                style={{ cursor:"pointer" }}
                >
                <Text size="14px" weight="bold"> Add Social Media Links </Text>
                </Box>
                
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
                        background: "#F5F5F5",
                        padding: 10,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        }}
                    >
                        <b style={{ fontSize: 22, color: "black" }}>Add Social Media Links!</b>
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
                    <div style={{ background: "white", padding: 10, paddingTop: 10 }}>
                        <div style={{ marginBottom: 10 }}>
                        Here you can add relevant links to your social media
                        pages on the following platforms. You can fill in as
                        many links as you want.
                        </div>
                        <div style={{ marginBottom: 5 }}>
                        Website:
                        </div>
                        <TextInput
                        placeholder="https://agora.stream/"
                        style={{
                            borderRadius: 10,
                            background: "#EBEBEB",
                            outline: "none",
                            border: "none",
                            
                        }}
                        focusIndicator={false}
                        onChange={(e) => setWebsiteLink(e.target.value)}
                        />
                        <div style={{ marginTop: 5, marginBottom: 5 }}>
                        Twitter:
                        </div>
                        <TextInput
                        placeholder="@Agora"
                        style={{
                            borderRadius: 10,
                            background: "#EBEBEB",
                            outline: "none",
                            border: "none",
                        }}
                        focusIndicator={false}
                        onChange={(e) => setTwitterLink(e.target.value)}
                        />
                        <div style={{ marginTop: 5, marginBottom: 5 }}>
                        Facebook:
                        </div>
                        <TextInput
                        placeholder="Facebook link"
                        style={{
                            borderRadius: 10,
                            background: "#EBEBEB",
                            outline: "none",
                            border: "none",
                        }}
                        focusIndicator={false}
                        onChange={(e) => setFacebookLink(e.target.value)}
                        />
                        <div style={{ marginTop: 5, marginBottom: 5 }}>
                        Linkedin:
                        </div>
                        <TextInput
                        placeholder="Linkedin Name"
                        style={{
                            borderRadius: 10,
                            background: "#EBEBEB",
                            outline: "none",
                            border: "none",
                        }}
                        focusIndicator={false}
                        onChange={(e) => setLinkedinLink(e.target.value)}
                        />
                    </div>
                    <div style={{ background: "#F5F5F5", padding: 10 }}>
                        <div
                        style={{
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
                            //onclick={onSaveClicked}
                            style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            color: "white",
                            textAlign: "center",
                            }}
                        >
                            Save
                        </span>
                        </div>
                    </div>
                </Layer>
            )}
        </Fragment>
    );
    
}

export default SocialMediaButton;