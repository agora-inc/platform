import React, { Component } from "react";
import { Box, Button, Text } from "grommet";

interface Props {
	txt: string;
	audienceLevel: string[];
	updateAudienceLevel: Function;
}

export default class AudienceCard extends Component<Props> {
	constructor(props: Props) {
		super(props);
	}

	render() {
		return (
			<Box
				onClick={() => {
					this.props.updateAudienceLevel(this.props.txt);
				}}
				background={
					this.props.audienceLevel.includes(this.props.txt)
						? "#0C385B"
						: "white"
				}
				round="xsmall"
				pad="5px"
				width="90%"
				justify="center"
				align="start"
				focusIndicator={false}
				margin="3px"
				hoverIndicator="#DDDDDD"
			>
				<Text size="12px" margin={{ left: "5px" }}>
					{this.props.txt}
				</Text>
			</Box>
		);
	}
}
