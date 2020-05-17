import React, {Component} from 'react';  


interface Props {
  inputType: string,
  title: string,
  name: string,
  value: string,
  placeholder: string,
  handleChange: any,
}

export default class FormInput extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  
  render() {
    return (
      <div className="form-group">
        <label htmlFor={this.props.name} className="form-label">{this.props.title}</label>
          <input
            className="form-input"
            id={this.props.name}
            name={this.props.name}
            type={this.props.inputType}
            value={this.props.value}
            onChange={this.props.handleChange}
            placeholder={this.props.placeholder} 
          />
      </div>
    );
  }
}