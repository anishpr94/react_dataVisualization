import React from "react";
import PropTypes from 'prop-types';
import { DropdownButton, SplitButton, MenuItem, FormControl } from 'react-bootstrap';
  let paddingStyle={
    padding:"10px"
  }


export class FilterSection extends React.Component {
    constructor(){
        super();       
    }
   
   
    render() {
        return (
            <div style={paddingStyle}>
            <DropdownButton  title={this.props.param} id="dropdown-target1"  noCaret >
             {Object.keys(this.props.dict).map(key => <MenuItem key={this.props.dict[key]} href={`#${this.props.dict[key]}`} onSelect={() => this.props.onselect(this.props.dict[key]) }>{key}</MenuItem>) }
           </DropdownButton>     
       </div>
        )
    }
}