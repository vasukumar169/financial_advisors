import React from 'react'
import {connect} from 'react-redux'
import RiskTable from './../components/RiskTable'
import DisabledInput from './../components/DisabledInput'
import { withRouter } from 'react-router-dom';

class Calculator extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      allPortFolioAmounts: false,
      isInvalid: false,
      newAmount: [],
      transfers: []
    }
  }
  componentDidMount () {
    if (this.props.riskPreference.length === 0) {
      this.props.history.push('/home')
    }
    this.activateRebalance(this.props.portfolioData)
  }
  rebalance = () => {
    // show error message on basis of invalid and set data on disabled other columns
    let allValues = Object.values(this.props.portfolioData).map(Number)
    let isInvalid = allValues.some(i => (isNaN(Number(i)) || Number(i) < 0))
    this.setState({isInvalid})
    if (!isInvalid) {
      let sum = allValues.reduce((a, b) => a + b, 0)
      let labelMap = {
        0: 'Bonds',
        1: 'Large Cap',
        2: 'Mid Cap',
        3: 'Foreign',
        4: 'Small Cap'
      }
      let riskPreferenceValues = Object.values(this.props.riskPreference[0])
      riskPreferenceValues.shift()
      let values = [...riskPreferenceValues]
      let newAmount = values.map((item, id) => {
        return {
          label: labelMap[id],
          new: this.setFixedDecimal(Number((sum * item/100))),
          difference: Number(this.setFixedDecimal((sum * item/100) - allValues[id])),
          balance: Number(this.setFixedDecimal((sum * item/100) - allValues[id]))
        }
      })
      let amt = newAmount.slice(0)
      this.setState({newAmount: amt})
      this.recommendTransfers(amt) 
    }
  }

  getTransferStatement = (amount, from, to) => {
    // Create tarnnsfer statements
    return `Transfer $${this.setFixedDecimal(amount)} from ${from} to ${to}`
  } 
  /* A Kind of utility funciton */
  setFixedDecimal = (val) => (Math.round(100 * val)/100)

  recommendTransfers = (data) => {
    /*
      This function is used to show trnasfers on recommennd Transfer column.
      Here the logic works when rebalance is triggered.
      We break the whole structure in 2 sections positive data annd negative data
      After that we sort both and thenn we run two nested loops annd create transfer statements
    */
    
    let transfers = []
    let negativeAmount = [...data].filter(item => item.difference < 0)
    let postiveAmount = [...data].filter(item => item.difference > 0)
    negativeAmount.sort((a, b) => a.difference - b.difference)
    postiveAmount.sort((a, b) => a.difference - b.difference)
    negativeAmount.forEach((nitem, i) => {
      postiveAmount.forEach((pitem, j) => {
        if(Math.abs(nitem.balance) > pitem.balance) {
          nitem.balance = this.setFixedDecimal(nitem.balance + pitem.balance)
          if (pitem.balance > 0) {
            transfers.push(this.getTransferStatement(pitem.balance, nitem.label, pitem.label ))
          }
          pitem.balance = 0
        } else {
          transfers.push(this.getTransferStatement(-nitem.balance, nitem.label, pitem.label ))
          pitem.balance = pitem.balance + nitem.balance
          nitem.balance = 0
        }
      })
    })
    this.setState({transfers})
  }
  onHandleChange = (e) => {
    /*
      This function is called on event handler
    */
    let payload = { ...this.props.portfolioData }
    payload[e.target.name] = e.target.value
    this.props.onSetPayLoad(payload)
    this.activateRebalance(payload)
  }
  activateRebalance = (data) => {
    /*
      This function is used enable the Rebalance button
      as all the 5 fields are filled
    */
    let allPortFolioAmounts = Object.values(data).filter(i => i).length === 5 
    this.setState({allPortFolioAmounts})
  }

  getDiffAndNewCols = (key) => {
    /*
      This function is used to get label values 
      for Differences and New Amount column on basis of parameter
    */
    let newAmount = [...this.state.newAmount]
    if (newAmount.length > 0) {
      let value = {
        bond: newAmount[0].new,
        largeCap: newAmount[1].new,
        midCap: newAmount[2].new,
        foreign: newAmount[3].new,
        smallCap: newAmount[4].new,
        bondDif: newAmount[0].difference > 0 ? '+'+newAmount[0].difference : newAmount[0].difference,
        largeCapDif: newAmount[1].difference > 0 ? '+'+newAmount[1].difference : newAmount[1].difference,
        midCapDif: newAmount[2].difference > 0 ? '+'+newAmount[2].difference : newAmount[2].difference,
        foreignDif: newAmount[3].difference > 0 ? '+'+newAmount[3].difference : newAmount[3].difference,
        smallCapDif: newAmount[4].difference > 0 ? '+'+newAmount[4].difference : newAmount[4].difference
      }
      return value[key]
    } 
    return ''
  }
  render () {
    let {bond, largeCap, midCap, smallCap, foreign} = this.props.portfolioData
    let {riskPreference, selectedRow} = this.props
    return (
      <div className='container wid-50-percent'>
        <div className='text-center'>
          <h3>Personalized Portfolio</h3>
        </div>
        <div className='text-left'>
          <h3>Risk Level {selectedRow}</h3>
          <RiskTable data={riskPreference}/>
        </div>
        <div className='text-left portfolio-label'>
          <h2>Please Enter Your Current Portfolio</h2>
          <span onClick={this.rebalance} 
          style={!this.state.allPortFolioAmounts ? {opacity:0.3} : null}
            className='portfolio-rebalance'>
              Rebalance
          </span>
        </div>
        <table className="table table-bordered wid-20-percent">
          <thead>
            <tr>
              <th>Current Amount</th>
              <th>Difference</th>
              <th>New Amount</th>
              <th>Recommended Transfers</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span>Bonds $:</span> 
                <input 
                  name="bond" 
                  onChange={this.onHandleChange} 
                  value={bond} 
                  className='input-table text-right'
                  type="text"/>
              </td>
              <td>
                <DisabledInput value={this.getDiffAndNewCols('bondDif')} />
              </td>
              <td>
                <DisabledInput new value={this.getDiffAndNewCols('bond')} />
              </td>
              <td rowSpan='0' style={{color: 'red'}}>
                {
                  this.state.isInvalid 
                  ?
                  'Please use only positive digits or zero when entering current amounts. Please enter all inputs correctly.'
                  :
                  <ul>{this.state.transfers.map((v,i) => <li key={i}>{v}</li>)}</ul>
                }
              </td>
            </tr>
            <tr>
              <td>
                <span>Large Cap $:</span>
                <input 
                  name='largeCap'
                  onChange={this.onHandleChange} 
                  value={largeCap}
                  className='input-table text-right' type="text"/>
              </td>
              <td>
                <DisabledInput value={this.getDiffAndNewCols('largeCapDif')} />
              </td>
              <td>
                <DisabledInput new value={this.getDiffAndNewCols('largeCap')} />
              </td>
            </tr>
            <tr>
              <td>
                <span>Mid Cap $:</span> 
                <input name='midCap'
                  onChange={this.onHandleChange} 
                  value={midCap}
                  className='input-table text-right' type="text"/>
              </td>
              <td>
                <DisabledInput value={this.getDiffAndNewCols('midCapDif')} />
              </td>
              <td>
                <DisabledInput new value={this.getDiffAndNewCols('midCap')} />
              </td>
            </tr>
            <tr>
              <td>
                <span>Foreign $:</span> 
                <input name='foreign'
                  onChange={this.onHandleChange} 
                  value={foreign}
                  className='input-table text-right' type="text"/>
              </td>
              <td>
                <DisabledInput value={this.getDiffAndNewCols('foreignDif')} />
              </td>
              <td>
                <DisabledInput new value={this.getDiffAndNewCols('foreign')} />
              </td>
            </tr>
            <tr>
              <td>
                <span>Small Cap $:</span>
                <input name='smallCap'
                  onChange={this.onHandleChange} 
                  value={smallCap}
                  className='input-table text-right' type="text"/>
              </td>
              <td>
                <DisabledInput value={this.getDiffAndNewCols('smallCapDif')} />
              </td>
              <td>
                <DisabledInput new value={this.getDiffAndNewCols('smallCap')} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    selectedRow: state.selectedRiskPreference,
    riskPreference: state.selectedRiskData,
    portfolioData: state.portfolioData
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSetPayLoad: (payload) => dispatch({type: 'INPUT_DATA', payload: payload})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Calculator))