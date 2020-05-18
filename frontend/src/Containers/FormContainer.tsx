import React, {Component} from 'react';
import "../Styles/form-container.css"

import FormCheckBox from '../Components/FormCheckBox';  
import FormInput from '../Components/FormInput';  
import FormTextArea from '../Components/FormTextArea';  
import FormSelect from '../Components/FormSelect';
import FormButton from '../Components/FormButton'


interface State {
  style: any,
  user: any,
  genderOptions: string[],
  reportOptions: string[]
}

export default class FormContainer extends Component< {}, State> {  
  constructor(props: any) {
    super(props);
    this.state = {
      style: {width: 0},
      user: {
        name: '',
        channel: '',
        gender: '',
        email: '',
        subject: '',
        reports: [],
        description: ''
      },
      genderOptions: ['Male', 'Female', 'God'],
      reportOptions: ['Report a bug', 'Suggest a feature']
    }

    this.handleFullName = this.handleFullName.bind(this)
    this.handleAge = this.handleAge.bind(this)
    this.handleInput = this.handleInput.bind(this)
    this.handleCheckBox = this.handleCheckBox.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleClearForm = this.handleClearForm.bind(this);
    this.openNav = this.openNav.bind(this);
    this.closeNav = this.closeNav.bind(this);
  }

  handleFullName(e: any) {
    let value = e.target.value;
    this.setState( (prevState: any) => (
      { user : {...prevState.user, name: value} }
    ))
  }

  handleAge(e: any) {
    let value = e.target.value;
    this.setState( (prevState: any) => (
      { user : {...prevState.user, age: value} }
    ))
  }

  handleInput(e: any) {
    let value = e.target.value;
    let name = e.target.name;
    this.setState( (prevState: any) => (
       { user: {...prevState.user, [name]: value} }
    ))
  }

  handleCheckBox(e: any) {
    const newSelection = e.target.value;
    let newSelectionArray: string[];

    if(this.state.user.reports.indexOf(newSelection) > -1) {
      newSelectionArray = this.state.user.reports.filter((r: string) => r !== newSelection)
    } else {
      newSelectionArray = [...this.state.user.reports, newSelection];
    }

    this.setState( (prevState : any) => (
      { user: {...prevState.user, reports: newSelectionArray } }
    ))
  }

  handleFormSubmit(e: any) {
    // prevents the page from being refreshed on form submission
    e.preventDefault();
    let userData = this.state.user;

    // Send it somewhere
    console.log(userData);
  }

  handleClearForm(e: any) {
    // prevents the page from being refreshed on form submission
    e.preventDefault();
    this.setState({ 
      user: {
        name: '',
        age: '',
        gender: '',
        reports: [],
        description: ''
      },
    })
  }

  // Opens the overlay
  openNav() {
    const style = { width : 350 };
    this.setState({ style });
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
    document.addEventListener("click", this.closeNav);
  }

  // Closes the overlay
  closeNav() {
    document.removeEventListener("click", this.closeNav);
    const style = { width : 0 };
    this.setState({ style });
    document.body.style.backgroundColor = "#F3F3F3";
  }

  render() {
    return (
      <>

      <button> onClick={this.openNav} </button>

  
      <form onSubmit={this.handleFormSubmit}>
        <FormInput 
          inputType={'text'}
          title= {'Full Name'} 
          name= {'name'}
          value={this.state.user.name} 
          placeholder = {'Enter your name'}
          handleChange = {this.handleInput}
        /> {/* Name of the user */}
   
        <FormInput 
          inputType={'number'} 
          name={'age'}
          title= {'Age'} 
          value={this.state.user.age} 
          placeholder = {'Enter your age'}
          handleChange={this.handleAge} 
        /> {/* Age */} 
        
        <FormSelect 
          title={'Gender'}
          name={'gender'}
          options = {this.state.genderOptions} 
          value = {this.state.user.gender}
          placeholder = {'Select Gender'}
          handleChange = {this.handleInput}
        /> {/* Age Selection */}

        <FormCheckBox  
          title={'About'}
          name={'reports'}
          options={this.state.reportOptions}
          selectedOptions = {this.state.user.reports}
          handleChange={this.handleCheckBox}
        /> {/* Reports */}

        <FormTextArea
          title={'Description.'}
          name={'description'}
          rows={10}
          cols={80}
          value={this.state.user.description}
          placeholder={'We are happy to hear about your input'}
          handleChange={this.handleInput}
        /> {/* Description of the bug/feature */}

        <FormButton
          title = {'Submit'}
          type = {'primary'} 
          action = {this.handleFormSubmit}
          style={buttonStyle}
        /> { /*Submit */ }
     
        <FormButton
          title = {'Clear'}
          type = {'secondary'}
          action = {this.handleClearForm}
          style={buttonStyle}
        /> {/* Clear the form */}
     
      </form>
      
      </>
    );
  }
}

const buttonStyle = {
  margin : '10px 10px 10px 10px'
}


//       <button className="buttonForm" onClick={this.openNav}> Contact </button>