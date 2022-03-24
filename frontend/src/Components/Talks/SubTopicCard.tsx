import React, { Component } from "react";
import { Box, Button, Text } from "grommet";
import { Topic } from "../../Services/TopicService";

interface Props {
	topic: Topic;
	chosenSubtopics: Topic[];
	updateSubTopics: Function;
}

export default class SubTopicCard extends Component<Props> {
	constructor(props: Props) {
		super(props);
	}

	render() {
		return (
			<Box
				onClick={() => {
					this.props.updateSubTopics(this.props.topic);
				}}
				background={
					this.props.chosenSubtopics.includes(this.props.topic)
						? "#0C385B"
						: "white"
				}
				round="xsmall"
				pad="5px"
				width="80%"
				justify="center"
				align="start"
				focusIndicator={false}
				margin="3px"
				hoverIndicator="#DDDDDD"
			>
				<Text size="12px" margin={{ left: "5px" }}>
					{this.props.topic.field}
					{/* {`${topic.field} (${
			    this.state.audienceLevel.length != 0 ? 
			    String(this.getTalksByTopicsAndAudience(this.state.allTalks, [topic.id] , this.state.audienceLevel).length) :
			    String(this.getTalksByTopicOnly(this.state.allTalks, [topic.id]).length)
			    })`} */}
				</Text>
			</Box>
		);
	}
}
