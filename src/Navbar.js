import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar(props) {
  let iconStyle= {fontSize: '48px', color: '#ffffff',}
  let headerStyle= {padding:'15px', color: '#ffffff', display: 'flex', backgroundColor:'#0285b8', justifyContent:'space-between'}
  return (
    <header style={headerStyle}>
      <div>
        <Link to='/home'><i className='fa fa-home' style={iconStyle}></i></Link>
      </div>
      <div>
        <h1 style={{margin: '5px'}}>Financial Advisor</h1>
      </div>
      <div>
      </div>
    </header>  
  )
}