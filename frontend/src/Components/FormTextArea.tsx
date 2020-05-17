import React, {Component} from 'react';  


interface Props {
  title: string,
  name: string,
  value: string,
  rows: number,
  cols: number,
  placeholder: string,
  handleChange: any,
}

export default class FormTextArea extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  
  render() {
    return (
      <div className="form-group">
        <label htmlFor={this.props.name} className="form-label">{this.props.title}</label>
          <textarea
            className="form-control"
            name={this.props.name}
            rows={this.props.rows}
            cols={this.props.cols}
            value={this.props.value}
            onChange={this.props.handleChange}
            placeholder={this.props.placeholder} 
          />
      </div>
    );
  }
}