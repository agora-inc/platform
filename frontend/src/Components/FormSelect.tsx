import React, {Component} from 'react';  


interface Props {
  title: string,
  name: string,
  value: string,
  placeholder: string,
  handleChange: any,
  options: any,
}

export default class FormSelect extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    return(
      <div className="form-group">
        <label htmlFor={this.props.name}> {this.props.title} </label>
        <select
          name={this.props.name}
          value={this.props.value}
          onChange={this.props.handleChange}
        >
          <option value="" disabled> {this.props.placeholder} </option>
            {this.props.options.map( (option: string) => {
              return (
                <option
                  key={option}
                  value={option}
                  label={option}>{option}
                </option>
              );
            })}
          </select>
      </div>
    )
  }
}