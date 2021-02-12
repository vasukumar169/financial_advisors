import React from 'react';

const RiskPreference = (props) => {
  let {riskNo, setRiskPrefernce, selectedRow, history} = props
  let redirect = () => {
    if (selectedRow > 0) {
      history.push('/calculator')
    }
  }
  return (
    <div className='risk-preference-container'>
      <div className='risk-preference-ul-label'>
        <p>Low</p>
        <p>High</p>
      </div>
      <ul className='risk-preference-ul'>
        {
          riskNo.map((item, id) => {
            return (
              <li 
                className='risk-preference-li'
                style={selectedRow === item ? {backgroundColor: '#e6ff3f'}: null}
                onClick={() => setRiskPrefernce(item)} 
                key={id}>
                  {item}
                </li>
            )}
          )
        }
        <li onClick={redirect} className='risk-preference-continue' style={selectedRow === 0 ? {opacity: '0.3'}: null}>Continue</li>
      </ul>
    </div>
  )
}

export default RiskPreference