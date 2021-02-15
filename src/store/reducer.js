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
/*
This reducer function is used to return new state on basis of action type.
When a row is slected in by risk prefernce level, it stores the data in redux store
and is used at calculator route.
Also data entered at calculator route, needs to be shown on the same route while traversing so stored in store
*/ 
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