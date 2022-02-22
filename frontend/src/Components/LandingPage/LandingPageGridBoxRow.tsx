import React, { Component, Children, cloneElement } from "react";
import GridBoxSpearator from "../../Components/LandingPage/GridBoxSpearator";

import { Box } from "grommet";

interface Props {
	windowWidth: number;
	breakpoint: number;
	rowImage: string;
	columnImage: string;
}

export default class LandingPageGridBoxRow extends Component<Props> {
	constructor(props: any) {
		super(props);
	}

	render() {
		const boxArray = Children.toArray(this.props.children);
		return (
			<Box
				width="100%"
				direction={
					this.props.windowWidth > this.props.breakpoint
						? "row"
						: "column"
				}
				style={{
					alignItems:
						this.props.windowWidth > this.props.breakpoint
							? "inherit"
							: "center",
				}}
			>
				{Children.map(boxArray, (box, index) => {
					const isLast = index === boxArray.length - 1;
					return (
						<>
							{/*{cloneElement(box as ReactElement)}*/}
							{React.isValidElement(box) &&
								React.cloneElement(box, {})}
							{!isLast && (
								<GridBoxSpearator
									windowWidth={this.props.windowWidth}
									breakpoint={this.props.breakpoint}
									rowViewComponent={this.props.rowImage}
									columnViewComponent={this.props.columnImage}
								/>
							)}
						</>
					);
				})}
			</Box>
		);
	}
}
