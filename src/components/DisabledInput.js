import React from 'react';
/*
  This is reusable component to show data disabled compenets on basis of props
*/
const DisabledInput = (props) => {
  return (
    <input 
      value={props.value}
      disabled
      name="difference"
      style={!props.new ?  props.value > 0 ? {color: 'green'}: {color:'red'} : {color: 'blue'}}
      className='input-table-2 text-right' type="text"/>
  )
}

export default DisabledInput