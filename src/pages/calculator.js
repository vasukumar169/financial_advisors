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
    let allValues = Object.values(this.props.portfolioData).map(Number)
    let isInvalid = allValues.some(i => (isNaN(Number(i)) || Number(i) < 0))
    this.setState({isInvalid})
    if (!isInvalid) {
      let sum = allValues.reduce((a, b) => a + b, 0)
      let labelMap = {
        0: 'bond',
        1: 'largeCap',
        2: 'midCap',
        3: 'foreign',
        4: 'smallCap'
      }
      let riskPreferenceValues = Object.values(this.props.riskPreference[0])
      console.log(JSON.stringify(this.props.riskPreference))
      console.log(JSON.stringify(riskPreferenceValues))
      riskPreferenceValues.shift()
      let newAmount = riskPreferenceValues.map((item, id) => {
        return {
          label: labelMap[id],
          new: Number((sum * item/100).toFixed(2)),
          difference: Number(((sum * item/100) - allValues[id]).toFixed(2))
        }
      })
      this.setState({newAmount}, () => {
        let sortNewAmount = this.state.newAmount
        sortNewAmount.sort((itemA, itemB)=> itemA.difference - itemB.difference)
        let t1 = `Transfer $${sortNewAmount[4].difference} from ${sortNewAmount[0].label} to ${sortNewAmount[4].label}`
        let t1Diff = (sortNewAmount[4].difference + sortNewAmount[0].difference).toFixed(2)
        console.log(t1, t1Diff)
      })
    }
  }

  recommendTransfers = () => {

  }
  onHandleChange = (e) => {
    let payload = { ...this.props.portfolioData }
    payload[e.target.name] = e.target.value
    this.props.onSetPayLoad(payload)
    this.activateRebalance(payload)
  }
  activateRebalance = (data) => {
    let allPortFolioAmounts = Object.values(data).filter(i => i).length === 5 
    this.setState({allPortFolioAmounts})
  }

  getDiffAndNewCols = (key) => {
    if (this.state.newAmount.length > 0) {
      let value = {
        bond: this.state.newAmount[0].new,
        largeCap: this.state.newAmount[1].new,
        midCap: this.state.newAmount[2].new,
        foreign: this.state.newAmount[3].new,
        smallCap: this.state.newAmount[4].new,
        bondDif: this.state.newAmount[0].difference > 0 ? '+'+this.state.newAmount[0].difference : this.state.newAmount[0].difference,
        largeCapDif: this.state.newAmount[1].difference > 0 ? '+'+this.state.newAmount[1].difference : this.state.newAmount[1].difference,
        midCapDif: this.state.newAmount[2].difference > 0 ? '+'+this.state.newAmount[2].difference : this.state.newAmount[2].difference,
        foreignDif: this.state.newAmount[3].difference > 0 ? '+'+this.state.newAmount[3].difference : this.state.newAmount[3].difference,
        smallCapDif: this.state.newAmount[4].difference > 0 ? '+'+this.state.newAmount[4].difference : this.state.newAmount[4].difference
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
                  null
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