import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Text } from "grommet";

type Props = {
	agora: { id: number; colour: string; name: string };
	channelCoverImage: string;
	channelAvatar: string;
	windowWidth: number;
};

const ChannelAgoraCard = (props: Props) => {
	return (
		<Link
			className="agora-card"
			to={`/${props.agora.name}`}
			style={props.windowWidth < 450 ? { width: "300px" } : {}}
		>
			<div
				className="agora-card-banner"
				style={{ background: props.agora.colour }}
			>
				{<img src={props.channelCoverImage} width={420} height={140} />}
			</div>
			<div className="avatar-and-name">
				<div className="agora-card-avatar">
					<img src={props.channelAvatar} height={30} width={30} />
				</div>
				<span className="agora-card-name">{props.agora.name}</span>
			</div>
		</Link>
	);
};

export default ChannelAgoraCard;
