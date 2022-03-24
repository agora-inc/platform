import React, { Component } from "react";
import { Box, Text, Heading, Layer } from "grommet";

interface Props {
	headericon?: React.ReactNode;
	headertext: string;
	content: string;
	videolink?: string;
	action?: React.ReactNode;
}

export default class MoraGridBox extends Component<Props> {
	constructor(props: any) {
		super(props);
	}

	render() {
		return (
			<Box
				style={{ minWidth: "250px", maxWidth: "300px" }}
				height="auto"
				background="color2"
				direction="column"
				justify="between"
			>
				<Box pad="medium" gap="10px">
					<Box
						direction="row"
						height="60px"
						width="100%"
						align="center"
					>
						{this.props.headericon && (
							<Box width="70px">{this.props.headericon}</Box>
						)}
						<Box>
							<Text
								size="24px"
								weight="bold"
								margin={{ left: "5px" }}
								color="color7"
							>
								{this.props.headertext}
							</Text>
						</Box>
					</Box>
					<Text size="18px" style={{ alignContent: "start" }}>
						<div
							dangerouslySetInnerHTML={{
								__html: this.props.content,
							}}
						/>
					</Text>
				</Box>
				{this.props.videolink &&
					this.props.videolink.trim().length > 0 && (
						<Box height="200px" alignSelf="center" direction="row">
							<video
								autoPlay
								loop
								muted
								style={{
									height: "100%",
									width: "auto",
									alignSelf: "center",
									maxWidth: "100%",
								}}
							>
								<source
									src={this.props.videolink}
									type="video/mp4"
								/>
							</video>
						</Box>
					)}
				{this.props.action && this.props.action}
			</Box>
		);
	}
}
