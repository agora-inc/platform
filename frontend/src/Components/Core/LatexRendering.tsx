import React, { Component } from "react";
import { Box, Text } from "grommet";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";


export const textToLatex = (rawText: string, height: string) => {
  const textArr = rawText.split("$");
  return (
    <Box 
      height={height}
      width="100%"
      style={{ border: "1px solid #C2C2C2" }}
      round="xsmall"
      pad="small"
      overflow={{"vertical": "scroll"}}
      direction="row"
    >
      {textArr.map((textElement: string, index) => {
        if (index % 2 == 0) {
          return (
            <Text
              color="black"
              style={{
                marginLeft: 3,
                marginRight: 3,
                whiteSpace: "pre",
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
  );
};