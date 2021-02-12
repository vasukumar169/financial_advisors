import React from 'react';

const RiskTable = (props) => {
  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Risk</th>
          <th>Bonds %</th>
          <th>Large Cap %</th>
          <th>Mid Cap %</th>
          <th>Foreign %</th>
          <th>Small Cap %</th>
        </tr>
      </thead>
      <tbody>
        {
          props.data.map((item) => {
            let {riskPreference, bonds, large_cap, mid_cap, foreign, small_cap} = item
            return (
              <tr style={props.selectedRow === riskPreference ? {backgroundColor: '#e6ff3f'}: null} key={riskPreference}>
                <td>{riskPreference}</td>
                <td>{bonds}</td>
                <td>{large_cap}</td>
                <td>{mid_cap}</td>
                <td>{foreign}</td>
                <td>{small_cap}</td>
              </tr>
            )
          })
        }
      </tbody>
    </table>
  )
}

export default RiskTable