import React, {Component} from 'react';
import PropTypes from "prop-types";
import RichTextEditor from 'react-rte';


export default class EnrichedTextEditor extends Component {
  // static propTypes = {
  //   onChange: PropTypes.func
  // };

  state = {
    editorValue: RichTextEditor.createEmptyValue(),
    displayed: false
  }

  // handleEditorChanges = (value) => {
  //   this.setState({value});
  //   if (this.props.onChange) {
  //     // Send the changes up to the parent component as an HTML string.
  //     // This is here to demonstrate using `.toString()` but in a real app it
  //     // would be better to avoid generating a string on each change.
  //     this.props.onChange(
  //       value.toString('html')
  //     );<div dangerouslySetInnerHTML={{__html: this.state.channel?.long_description ? this.state.channel?.long_description : "" }} />
  //   }
  // };

  render () {
    const toolbarConfig = {
        // Optionally specify the groups to display (displayed in the order listed).
        display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
        INLINE_STYLE_BUTTONS: [
          {label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
          {label: 'Italic', style: 'ITALIC'},
          {label: 'Underline', style: 'UNDERLINE'}
        ],
        BLOCK_TYPE_DROPDOWN: [
          {label: 'Normal', style: 'unstyled'},
          {label: 'Heading Large', style: 'header-one'},
          {label: 'Heading Medium', style: 'header-two'},
          {label: 'Heading Small', style: 'header-three'}
        ],
        BLOCK_TYPE_BUTTONS: [
          {label: 'UL', style: 'unordered-list-item'},
          {label: 'OL', style: 'ordered-list-item'}
        ]
      };

    // Q: how to render onl if this.steate.displayed is true?
    return (
        <RichTextEditor
          value={this.state.editorValue}
          // onChange={this.handleEditorChanges}
          // toolbarConfig={toolbarConfig}
        />
    );
  }
}