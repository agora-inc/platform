import React, {Component} from 'react';  


interface Props {
  title: string
  type: string 
  action: any,
  style: any,
}

export default class FormInput extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  
  render() {
    console.log(this.props.style);
    return(
      <button 
        style= {this.props.style} 
        onClick= {this.props.action}
      >    
      {this.props.title} 
      </button>
    )
  }
}
