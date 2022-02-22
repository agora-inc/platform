import React, { Component } from "react";
import { Box } from "grommet";
interface Props {
	isMobile: boolean;
	mainContent: React.ReactNode;
	image: React.ReactNode;
}

export default class LandingPageBanner extends Component<Props> {
	constructor(props: any) {
		super(props);
	}

	render() {
		return (
			<Box height="100%" width="100%">
				<Box
					width="100%"
					style={{
						maxWidth: "800px",
					}}
					// height={this.state.isMobile ? "1480px" : "750px"}
					direction={this.props.isMobile ? "column" : "row"}
					alignSelf="center"
				>
					<Box
						// width={this.state.isMobile ? "100%" : "60%"}
						// height={this.state.isMobile ? "1250px" : "100%"}
						// style={this.state.isMobile ? {} : { minWidth: "780px" }}
						margin={
							this.props.isMobile
								? { left: "20px", right: "20px" }
								: { top: "120px", bottom: "60px" }
						}
						style={{
							padding: this.props.isMobile ? "50px 0" : "0 0",
						}}
					>
						{this.props.mainContent}
					</Box>
					<Box
						width={this.props.isMobile ? "0px" : "40%"}
						height={this.props.isMobile ? "0px" : "100%"}
					>
						{this.props.image}
					</Box>
				</Box>
			</Box>
		);
	}
}
