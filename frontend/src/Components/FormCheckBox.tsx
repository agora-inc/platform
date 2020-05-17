import React, {Component} from 'react';  


interface Props {
  title: string,
  name: string,
  options: string[],
  selectedOptions: string[],
  handleChange: any,
}

export default class FormSelect extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    return( 
      <div>
        <label htmlFor={this.props.name} className="form-label"> {this.props.title} </label>
        <div className="checkbox-group">
        {this.props.options.map( (option: string) => {
          return (
            <label key={option}>
              <input
                className="form-checkbox"
                id = {this.props.name}
                name={this.props.name}
                onChange={this.props.handleChange}
                value={option}
                checked={ this.props.selectedOptions.indexOf(option) > -1 }
                type="checkbox" /> {option}
            </label>
            );
          })}
        </div>
      </div>
    );
  }
}