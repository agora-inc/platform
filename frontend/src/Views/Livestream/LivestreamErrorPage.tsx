import React, { Component} from "react";
import { Box, Text} from "grommet";
import '../../Styles/all-stream-page.css'


interface Props {
  errorMessage: string;
}

export default class LivestreamErrorPage extends Component<Props> {
    constructor(props: Props) {
      super(props);
      this.state = {
      };
    }

    render() {
      return(
        <Box margin={{top: "120px", left: "20px"}} align="center">
            <Text size="48px" weight="bold">
              404
              </Text>
            <Text size="24px" weight="bold">
              Oops!
              </Text>
            <Text size="24px" weight="bold">
              {this.props.errorMessage}
              </Text>
            </Box>
      )
    }
}