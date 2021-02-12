import React from 'react';

const RiskTable = (props) => {
  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Current Amount</th>
          <th>Difference</th>
          <th>New Amount</th>
          <th>Recommended Transfers</th>
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