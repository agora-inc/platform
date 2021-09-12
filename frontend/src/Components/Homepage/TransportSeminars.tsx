import React, { Component } from "react";
import { User } from "../../Services/UserService";
import { Box, Text } from "grommet";
import ReactTooltip from "react-tooltip";


interface Props {
	user: User | null;
}

interface State {
	showOverlay: boolean;
}


export default class AgoraCreationPage extends Component<Props, State> {
	constructor(props: any) {
		super(props);		
		this.state = {
			showOverlay: false,
    };
	}
	
	toggleOverlay() {
		this.setState({showOverlay: !this.state.showOverlay})
	}

  render() {
    return (
      <Box
				data-tip data-for="create_agora_button"
				direction="row"
        onClick={this.toggleOverlay}
        align="center"
        width="280px"
        height="70px"
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
        <Text size="16px" color="white" weight="bold">
					Migrate your seminars
        </Text>
        <Text size="22.5px">🚀</Text>
        <ReactTooltip id="create_agora_button" effect="solid">
            Migrate your seminar series on researchseminars.org in less than a minute!
        </ReactTooltip>
      </Box>

  	);
  }
}