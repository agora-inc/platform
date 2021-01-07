import React, { Component } from "react";
import { Box, Text } from "grommet";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";


export const textToLatex = (rawText: string) => {
  const textArr = rawText.split("$");
  return (
    <div>
      {textArr.map((textElement: string, index) => {
        if (index % 2 == 0) {
          return (
            <Text
              color="black"
              style={{
              //  marginLeft: 3,
              //  marginRight: 3,
                whiteSpace: "initial",
              //  overflowWrap: "break-word",
              //  wordWrap: "break-word"
              }}
              size="14px"
            >
              {textElement}
            </Text>
          );
        } else {
          if (textElement.length >= 60 ) {
            const tooLongArray = (textElement.match(/.{1,60}/g) || []);
            const componentLatex = [];
            tooLongArray.map((segment: string) => {
              if (segment[0] != "$") {
                segment = "$" + segment;
              }
              if (segment[-1] != "$") {
                segment = segment + "$";
              }
            });
            for (let i=0; i < tooLongArray.length; i++) {
              if (tooLongArray[i] != "") {
                componentLatex.push(<InlineMath math={tooLongArray[i]} />);
              }
            }
            return componentLatex;
          }
          if (textElement != "" && index != textArr.length - 1) {
            return <InlineMath math={textElement} />;
          }
        }
      })}
    </div>
  );
};