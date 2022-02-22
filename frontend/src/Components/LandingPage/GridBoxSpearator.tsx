import React, { Component } from "react";
import { Box } from "grommet";

interface Props {
	windowWidth: number;
	breakpoint: number;
	rowViewComponent?: string;
	columnViewComponent?: string;
}

export default class GridBoxSpearator extends Component<Props> {
	constructor(props: any) {
		super(props);
	}

	render() {
		return (
			<Box
				style={{
					flexGrow: 1,
					margin:
						this.props.windowWidth > this.props.breakpoint
							? "0px 5px"
							: "5px 0px",
				}}
				direction="column"
				alignSelf="center"
			>
				<img
					src={
						this.props.windowWidth > this.props.breakpoint
							? this.props.rowViewComponent
							: this.props.columnViewComponent
					}
					style={
						this.props.windowWidth <= this.props.breakpoint
							? { alignSelf: "center", height: "70px" }
							: { alignSelf: "center", width: "100%" }
					}
				/>
			</Box>
		);
	}
}
