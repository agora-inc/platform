import React, {Component} from 'react';  


interface Props {
  title: string
  type: string 
  action: any,
  style: any,
}

export default class FormButton extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  
  render() {
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
