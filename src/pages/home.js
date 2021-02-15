import React from 'react'
import {riskNo, riskData} from '../DummyData'
import {connect} from 'react-redux'
import RiskPreference from './../components/RiskPreference'
import RiskTable from './../components/RiskTable'
import Donut from './../components/Donut'
import { withRouter } from 'react-router-dom';

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showPie: false
    }
  }
  
  setRiskPrefernce = (val) => {
    /* this is used to manage the risk level in redux store
    while managing the data in the whole application */
    this.props.onSetRiskPreference(val)
  }

  render () {
    return (
      <div className='container'>
        <div className='text-center'>
          <h3>Please Select A Risk Level For Your Investment Portfolio</h3>
          <RiskPreference {...this.props}
            setRiskPrefernce={this.setRiskPrefernce}
            riskNo={riskNo} />
        </div>
        <div className='text-right mt-40' style={{display: 'flex'}}>
          {
            !this.state.showPie 
            ?
            <RiskTable data={riskData} selectedRow = {this.props.selectedRow} />
            :
            <div className="donut-container">
              <Donut riskPreference = {this.props.riskPreference}/>
            </div>
          }
          <div className="pie-icon-container" onClick={() => this.setState({showPie:!this.state.showPie})}>
            {
              this.state.showPie 
              ?
              <i className="fa fa-line-chart line-icon"></i>
              :
              <i className="fa fa-pie-chart pie-icon"></i>
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    selectedRow: state.selectedRiskPreference,
    riskPreference: state.selectedRiskData
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSetRiskPreference: (value) => dispatch({type: 'SELECT_RISK_ROW', value: value})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Home))