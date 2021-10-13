import React, { Component, RefObject } from "react";
import { Box, Text, TextArea, Heading } from "grommet";
import { InlineMath } from "react-katex";
import Switch from "../../Core/Switch";
import Loading from "../../Core/Loading";
import "katex/dist/katex.min.css";

interface State {
  text: string;
  focused: boolean;
  latex: boolean;
  submitting: boolean;
}

interface Props {
  title: string;
  callback: any;
}

export default class LatexInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      text: "",
      focused: false,
      latex: false,
      submitting: false,
    };
  }

  updateText = (e: any) => {
    this.setState({
      text: e.target.value,
    });
  };

  onSubmitClicked = () => {
    this.setState({ submitting: true }, () => {
      this.props.callback(this.state.text);
    });
  };

  parse = (rawText: string) => {
    const textArr = rawText.split("$");
    return (
      <Box
        width="100%"
        height="100%"
        margin={{ left: "15px" }}
        overflow="scroll"
      >
        <Box
          //   height="100%"
          direction="row"
          wrap
          align="center"
          style={{
            overflowWrap: "break-word",
            wordBreak: "break-all",
          }}
        >
          {textArr.map((textElement: string, index) => {
            if (index % 2 == 0) {
              return (
                <Text
                  color="black"
                  style={{
                    marginLeft: 3,
                    marginRight: 3,
                    // whiteSpace: "pre",
                    overflowWrap: "break-word",
                    wordBreak: "break-all",
                  }}
                  size="18px"
                >
                  {textElement}
                </Text>
              );
            } else {
              if (textElement != "" && index != textArr.length - 1) {
                return <InlineMath math={textElement} />;
              }
            }
          })}
        </Box>
      </Box>
    );
  };

  renderWithoutLatex = () => {
    return (
      <TextArea
        style={{
          paddingTop: 15,
          paddingLeft: 15,
          paddingRight: 15,
          //   marginBottom: 5,
          height: "67%",
          //   height: "13.5vh",
          //   border: "1px solid pink",
        }}
        onChange={this.updateText}
        onFocus={() => {
          this.setState({ focused: true });
        }}
        onBlur={() => {
          this.setState({ focused: false });
        }}
        focusIndicator={false}
        plain={true}
        resize={false}
      />
    );
  };

  renderWithLatex = () => {
    return (
      <Box
        direction="row"
        width="100%"
        height="67%"
        pad={{ horizontal: "15px" }}
        margin="none"
      >
        <TextArea
          style={{
            paddingTop: 15,
            paddingLeft: 0,
            paddingRight: 15,
            marginBottom: 5,
            height: "100%",
            width: "50%",
            //   border: "1px solid pink",
          }}
          onChange={this.updateText}
          onFocus={() => {
            this.setState({ focused: true });
          }}
          onBlur={() => {
            this.setState({ focused: false });
          }}
          focusIndicator={false}
          plain={true}
          resize={false}
        />
        <Box
          width="50%"
          height="100%"
          direction="row"
          pad={{ top: "15px" }}
          style={{ minHeight: "100%", borderLeft: "2px solid grey" }}
        >
          {this.parse(this.state.text)}
        </Box>
      </Box>
    );
  };

  render() {
    const title = this.props.title.includes("@") ? (
      <Box direction="row" margin="none" pad="none">
        <Heading level={3} margin="none" style={{ lineHeight: "26px" }}>
          {this.props.title.split(" ")[0]}
        </Heading>
        <Heading
          level={3}
          margin="none"
          style={{ color: "#fd6fff", whiteSpace: "pre", lineHeight: "26px" }}
        >
          {" " + this.props.title.split(" ")[1]}
        </Heading>
      </Box>
    ) : (
      <Heading level={3} margin="none" style={{ lineHeight: "26px" }}>
        {this.props.title}
      </Heading>
    );

    return this.state.submitting ? (
      <Box
        justify="center"
        align="center"
        height="20vh"
        background="#f2f2f2"
        round="small"
      >
        <Loading size={50} color="black"></Loading>
      </Box>
    ) : (
      <Box
        background="#f2f2f2"
        round="small"
        pad={{ top: "small", bottom: "none", horizontal: "none" }}
        height="20vh"
        // direction="row"
        id="latex-input"
      >
        <Box width="100%" height="33%">
          <Box
            direction="row"
            justify="between"
            pad={{ bottom: "medium", horizontal: "small" }}
            margin="none"
            align="start"
            style={{ borderBottom: "2px solid grey" }}
          >
            {title}
            <Box direction="row" gap="small">
              <Box
                direction="row"
                background="#fce1ef"
                align="center"
                round="small"
                pad="small"
                gap="small"
                height="35px"
              >
                <Text>Enable inline math</Text>
                <Switch
                  height={25}
                  width={70}
                  checked={this.state.latex}
                  callback={(checked: boolean) => {
                    this.setState({ latex: checked });
                  }}
                />
              </Box>
              <Box
                direction="row"
                width="80px"
                height="35px"
                round="small"
                background="#61EC9F"
                margin="none"
                justify="center"
                align="center"
                gap="small"
                onClick={this.onSubmitClicked}
                focusIndicator={false}
              >
                <Text color="white" weight="bold">
                  Submit
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
        {this.state.latex ? this.renderWithLatex() : this.renderWithoutLatex()}
      </Box>
    );
  }
}
