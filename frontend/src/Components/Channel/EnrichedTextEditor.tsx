import React, {Component} from 'react';
import { Text } from "grommet"
import PropTypes from "prop-types";
import RichTextEditor from 'react-rte';
import { OmitProps } from 'antd/lib/transfer/renderListBody';
import { Js } from 'grommet-icons';

// TODO: react-rte has not been updated in the last 4 years. Write our own using
//draft Js. 


interface Props {
  text: any,
  onModify: Function,
  onSave: Function
}

interface State {
  currentText: any,
  editorValue: any,
  editing_mode: boolean,
  toolbarButtonsToDisplay: GroupName[]
}


// To understand why creating this, check "index.d.ts" in the react-rte library l.123
type GroupName =
    "INLINE_STYLE_BUTTONS"
    | "BLOCK_TYPE_BUTTONS"
    | "LINK_BUTTONS"
    | "BLOCK_TYPE_DROPDOWN"
    | "HISTORY_BUTTONS"

let GroupNameButton1 : GroupName = "INLINE_STYLE_BUTTONS"
let GroupNameButton2 : GroupName = "BLOCK_TYPE_BUTTONS"
let GroupNameButton3 : GroupName = "HISTORY_BUTTONS"
let GroupNameButton4 : GroupName = "LINK_BUTTONS"


export default class EnrichedTextEditor extends Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {
      currentText: this.props.text,
      editorValue: RichTextEditor.createValueFromString(this.props.text, 'html'),
      editing_mode: false,
      toolbarButtonsToDisplay: [GroupNameButton1, GroupNameButton2, GroupNameButton3, GroupNameButton4]
    };
  }

  handleEditorChanges = (value: any) => {
    this.setState({editorValue: value});
  };

  onClick = () => {
    if (this.state.editing_mode){
      this.props.onSave(this.state.editorValue.toString('html'));
      
    }
    this.setState({
      editing_mode: !this.state.editing_mode,
      currentText: this.state.editorValue.toString('html')
    });
  }

  render () {
    const toolbarConfig = {
      // Optionally specify the groups to display (displayed in the order listed).
      display: this.state.toolbarButtonsToDisplay,
      INLINE_STYLE_BUTTONS: [
        {label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
        {label: 'Italic', style: 'ITALIC'},
        {label: 'Underline', style: 'UNDERLINE'}
      ],
      BLOCK_TYPE_DROPDOWN: [
        // {label: 'Normal', style: 'unstyled'},
        // {label: 'Heading Large', style: 'header-one'},
        // {label: 'Heading Medium', style: 'header-two'},
        // {label: 'Heading Small', style: 'header-three'}
      ],
      BLOCK_TYPE_BUTTONS: [
        {label: 'UL', style: 'unordered-list-item'},
        {label: 'OL', style: 'ordered-list-item'}
      ]
    };

    return (
      <>
      {this.state.editing_mode && (        
        <>  
          <RichTextEditor
            value={this.state.editorValue}
            onChange={this.handleEditorChanges}
            toolbarConfig={toolbarConfig}
          />
          <Text
            style={{
              textDecoration: "underline",
              marginLeft: 5,
              cursor: "pointer",
              color: "blue",
            }}
            size="20px"
            onClick={this.onClick}
            contentEditable={false}
          >
          {this.state.editing_mode ? "Save description" : "Edit description"}
          </Text>
          </>
        
        )}
      {!this.state.editing_mode && (
        <> 
          <Text
            size="20px"
            style={{ textAlign: "justify", fontWeight: 450 }}
            margin={{ horizontal: "16px", bottom: "16px" }}
          >
          <div dangerouslySetInnerHTML={{__html: this.state.currentText}} />
          </Text>
          
          <Text
          style={{
            textDecoration: "underline",
            marginLeft: 5,
            cursor: "pointer",
            color: "blue",
          }}
          size="20px"
          onClick={this.onClick}
          contentEditable={false}
        >
          {this.state.editing_mode ? "Save description" : "Edit description"}
        </Text>
      </>)
        }
      </>
    );
  }
}