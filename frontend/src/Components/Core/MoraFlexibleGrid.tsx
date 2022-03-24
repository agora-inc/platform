import React, {
  Component,
  Children,
  isValidElement,
  cloneElement,
} from "react";
import { Box, Text, Heading, Layer } from "grommet";

interface Props {
  windowWidth: number;
  gridBreakpoints: { screenSize: number; columns: number }[];
  gap: number;
  childElements: React.ReactNode[] | undefined;
  align?: string | null;
  justify?:
    | "stretch"
    | "start"
    | "center"
    | "end"
    | "around"
    | "between"
    | "evenly"
    | undefined;
}

export default class MoraFlexibleGrid extends Component<Props> {
  constructor(props: any) {
    super(props);
  }

  sortBreakpoints(breakpoints: { screenSize: number; columns: number }[]) {
    breakpoints.sort((a, b) => b.screenSize - a.screenSize);
    return [
      breakpoints.map((breakpoint) => breakpoint.screenSize),
      breakpoints.map((column) => column.columns),
    ];
  }

  render() {
    let gap = this.props.gap + "px";
    let columnWidth: string | null = null;
    let gridBreakpoints = this.props.gridBreakpoints;
    let [breakpoints, columns] = this.sortBreakpoints(gridBreakpoints);

    for (let i = 0; i < breakpoints.length; i++) {
      if (breakpoints[i] <= this.props.windowWidth) {
        columnWidth = ((1 / columns[i]) * 100).toFixed(2) + "%";
        break;
      }
    }

    const gridItems = Children.toArray(this.props.childElements);

    return (
      <Box
        direction="row"
        wrap={true}
        align="stretch"
        width="100%"
        justify={this.props.justify ? this.props.justify : "around"}
        style={{ gap: gap }}
      >
        {Children.map(gridItems, (gridItem, index) => {
          return (
            isValidElement(gridItem) && (
              <Box
                width={
                  columnWidth == null ? "100%" : `calc(${columnWidth} - ${gap})`
                }
                style={{
                  alignItems: this.props.align ? this.props.align : "start",
                }}
              >
                {gridItem}
              </Box>
            )
          );
        })}
      </Box>
    );
  }
}

// background: #c4d6e0;
// margin-bottom: 10px;
// padding: 3px 5px;
// border-radius: 5px;
// box-shadow: rgb(0 0 0 / 20%) 0px 2px 2px -1px;
