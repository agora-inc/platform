import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Text } from "grommet";

type Props = {
	windowWidth: number;
	breakpoint: number;
	title: boolean;
};

const TalksLinks = (props: Props) => {
	return (
		<Box
			width="100%"
			direction={props.windowWidth < props.breakpoint ? "column" : "row"}
			gap="medium"
			align={props.windowWidth < props.breakpoint ? "center" : "end"}
			margin={{
				bottom: "15px",
			}}
		>
			{props.title && (
				<>
					<Box
						alignContent="start"
						direction={
							props.windowWidth < props.breakpoint
								? "column"
								: "row"
						}
						flex="grow"
						width={
							props.windowWidth < props.breakpoint
								? "100%"
								: "auto"
						}
					>
						<Link
							to={{ pathname: "/browse" }}
							style={{
								textDecoration: "none",
								marginRight:
									props.windowWidth < props.breakpoint
										? "0px"
										: "5px",
								marginBottom:
									props.windowWidth < props.breakpoint
										? "15px"
										: "0px",
							}}
						>
							<Box
								onClick={() => {}}
								background="color2"
								round="xsmall"
								pad="xsmall"
								height={
									props.windowWidth < props.breakpoint
										? "50px"
										: "30px"
								}
								width={
									props.windowWidth < props.breakpoint
										? "100%"
										: "170px"
								}
								justify="center"
								alignContent="center"
								focusIndicator={false}
								hoverIndicator="color2"
								margin={{ left: "0px" }}
								direction="row"
							>
								<Text
									size="14px"
									weight="bold"
									style={{
										lineHeight:
											props.windowWidth < props.breakpoint
												? "44px"
												: "normal",
									}}
								>
									{" "}
									Upcoming seminars
								</Text>
							</Box>
						</Link>

						<Link
							to={{ pathname: "/past" }}
							style={{
								textDecoration: "none",
								marginBottom:
									props.windowWidth < props.breakpoint
										? "15px"
										: "0px",
							}}
						>
							<Box
								onClick={() => {}}
								background="color5"
								round="xsmall"
								pad="xsmall"
								height={
									props.windowWidth < props.breakpoint
										? "50px"
										: "30px"
								}
								width={
									props.windowWidth < props.breakpoint
										? "100%"
										: "170px"
								}
								justify="center"
								align="center"
								focusIndicator={false}
								hoverIndicator="color2"
								margin={{ left: "0px" }}
								direction="row"
							>
								<Text
									size="14px"
									weight="bold"
									style={{
										lineHeight:
											props.windowWidth < props.breakpoint
												? "44px"
												: "normal",
									}}
								>
									{" "}
									Past seminars
								</Text>
							</Box>
						</Link>
					</Box>

					<Box
						justify="end"
						align="end"
						width={
							props.windowWidth < props.breakpoint
								? "100%"
								: "auto"
						}
					>
						{/*{!state.renderMobile && (*/}
						<Link
							to={{ pathname: "/agoras" }}
							style={{
								textDecoration: "none",
								width:
									props.windowWidth < props.breakpoint
										? "100%"
										: "auto",
							}}
						>
							<Box
								onClick={() => {}}
								background="color7"
								round="xsmall"
								pad="xsmall"
								height={
									props.windowWidth < props.breakpoint
										? "50px"
										: "30px"
								}
								width={
									props.windowWidth < props.breakpoint
										? "100%"
										: "170px"
								}
								justify="center"
								align="center"
								focusIndicator={false}
								hoverIndicator="color6"
								margin={{ left: "0px" }}
								direction="row"
							>
								<Text
									size="14px"
									weight="bold"
									style={{
										lineHeight:
											props.windowWidth < props.breakpoint
												? "44px"
												: "normal",
									}}
								>
									{" "}
									Give a talk
								</Text>
							</Box>
						</Link>
						{/*)}*/}
					</Box>
				</>
			)}
		</Box>
	);
};

export default TalksLinks;
