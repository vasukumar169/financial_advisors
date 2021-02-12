import {riskData} from '../DummyData'

const initialState = {
  selectedRiskPreference: 0,
  selectedRiskData: [],
  portfolioData: {
    bond: '',
    largeCap: '',
    midCap: '',
    foreign: '',
    smallCap: ''
  }
}

const reducer = (state = initialState, action) => {
  if (action.type === 'SELECT_RISK_ROW') {
    let selectedRiskData = riskData.filter(data => data.riskPreference === action.value)
    return {
      selectedRiskPreference: action.value,
      selectedRiskData: [...selectedRiskData],
      portfolioData: state.portfolioData
    }
  }
  if (action.type === 'INPUT_DATA') {
    return {
      selectedRiskPreference: state.selectedRiskPreference,
      selectedRiskData: state.selectedRiskData,
      portfolioData: {...action.payload},
    }
  }
  return state
}

export default reducer