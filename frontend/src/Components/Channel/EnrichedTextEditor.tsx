import React, {Component} from 'react';
import { Text } from "grommet"
import PropTypes from "prop-types";
import RichTextEditor from 'react-rte';
import { OmitProps } from 'antd/lib/transfer/renderListBody';


interface Props {
  text: string,
  onModify: Function
}

interface State {
  editorValue: any,
  displayed: boolean
}



export default class EnrichedTextEditor extends Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {
      // editorValue: RichTextEditor.createEmptyValue(),
      editorValue: RichTextEditor.createValueFromString(this.props.text, 'html'),
      displayed: true
    }
  }

  handleEditorChanges = (value: any) => {
    this.setState({editorValue: value});
    // Send the changes up to the parent component as an HTML string.
    // This is here to demonstrate using `.toString()` but in a real app it
    // would be better to avoid generating a string on each change.
    this.props.onModify(value.toString());
  };

  render () {
    // const toolbarConfig = {
    //     // Optionally specify the groups to display (displayed in the order listed).
    //     display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
    //     INLINE_STYLE_BUTTONS: [
    //       {label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
    //       {label: 'Italic', style: 'ITALIC'},
    //       {label: 'Underline', style: 'UNDERLINE'}
    //     ],
    //     BLOCK_TYPE_DROPDOWN: [
    //       // {label: 'Normal', style: 'unstyled'},
    //       // {label: 'Heading Large', style: 'header-one'},
    //       // {label: 'Heading Medium', style: 'header-two'},
    //       // {label: 'Heading Small', style: 'header-three'}
    //     ],
    //     BLOCK_TYPE_BUTTONS: [
    //       {label: 'UL', style: 'unordered-list-item'},
    //       {label: 'OL', style: 'ordered-list-item'}
    //     ]
    //   };

    // Q: how to render on if this.state.displayed is true?
    return (
      <>
      {this.state.displayed && (          
        <RichTextEditor
        value={this.state.editorValue}
        onChange={this.handleEditorChanges}
        // toolbarConfig={toolbarConfig}
        />)}
      {!this.state.displayed && (          
        <Text> {RichTextEditor.createValueFromString(this.props.text, 'html')} </Text>
        )}
      </>
    );
  }
}