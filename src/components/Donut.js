import React, { Component } from 'react';
import Chart from 'react-apexcharts'

class Donut extends Component {

  constructor(props) {
    super(props);
    this.state = {
      options: {},
      series: [20, 20, 20, 20, 20]
    }
  }

  componentDidMount () {
    let options = {
      dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          opts.w.globals.seriesNames = ['Bonds', 'Large Cap', 'Mid Cap', 'Foreign', 'Small Cap']
          return val.toFixed(0) + "%"
        }
      }
    }
    this.setState({options})
    this.updateDonut()
  }
  updateDonut = () => {
    if (this.props.riskPreference.length > 0) {
      let data = [...Object.values(this.props.riskPreference[0])]
      if (data.length > 0) {
        data.shift()
        this.setState({series: data})
      }
    }
  }

  componentDidUpdate(prevProps) {
    if ((prevProps.riskPreference[0] || [{riskPreference: ''}]).riskPreference !== (this.props.riskPreference[0] || [{riskPreference: ''}]).riskPreference) {
      this.updateDonut()
    }
  }

  render() {

    return (
      <div className="donut">
        <Chart 
          options={this.state.options} 
          series={this.state.series} type="donut" width="580" />
      </div>
    );
  }
}

export default Donut;