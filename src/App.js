import React, { Component } from 'react';
import { render } from 'react-dom'
import logo from './DefenseIntelligence.gif';
import './App.css';
import { Pie, Bar } from 'react-chartjs-2';
import { FilterSection } from './components/filterSection'
import { width, limitHeight, boxForFilter, maintainAspectRatio, heightForHeader, styleForChart, paddingStyle, paginationButtons } from './components/style'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button } from 'react-bootstrap';

class App extends Component {

  constructor() {
    super();
    this.onSexSelect = this.onSexSelect.bind(this);
    this.onRaceSelect = this.onRaceSelect.bind(this);
    this.onRelationShipSelect = this.onRelationShipSelect.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrevious = this.handlePrevious.bind(this);
    this.currentPage = 1;
    this.relationship = {};
    this.race = {};
    this.state = {
      isLoading: false,
      isClear: false,
      sex: 'Male',
      relationship: 'Husband',
      race: 'White',
      value: '',
      data: '',
      products: [{}],
      chart1: {
        labels: ["Male ", "Female"],
        datasets: [{
          label: "Male/Female Ratio",
          backgroundColor: ['rgb(255, 232, 0)', "rgb(237, 66, 45)"],
          borderColor: 'rgb(255, 99, 132)',
          data: [5]
        }]
      },
      chart2: {
        labels: ["relation 1"],
        datasets: [{
          label: "Relationship status Chart",
          backgroundColor: ['rgb(65, 99, 132)'],
          borderColor: 'rgb(255, 99, 132)',
          data: [1]
        }]
      }
    };

  }

  checkIfKeysAreValid(FilterRequest) {
    if (!this.state.sex) {
      delete FilterRequest["sex"]
    }
    if (!this.state.relationship) {
      delete FilterRequest["relationship"]
    }
    if (!this.state.race) {
      delete FilterRequest["race"]
    }
    let request = {}
    if (FilterRequest) {
      request = JSON.stringify(FilterRequest)
    }
    return request;
  }

  setRequestObject() {
    let FilterRequest = {
      "sex": this.state.sex,
      "relationship": this.state.relationship,
      "race": this.state.race
    }
    return FilterRequest
  }

  onSexSelect(target) {
    this.setState({ sex: target });
  }

  onRelationShipSelect(target) {
    this.setState({ relationship: target });
  }

  onRaceSelect(target) {
    this.setState({ race: target });
  }

  handleNext(target) {
    let FilterRequest = this.setRequestObject();
    let request = this.checkIfKeysAreValid(FilterRequest);
    this.currentPage = this.currentPage + 1
    fetch("http://127.0.0.1:9199/" + this.currentPage, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: request
    }).then(result => result.json())
      .then(json => {
        if (json.length > 0) {
          this.setState({ products: json })
        } else {
          this.currentPage = this.currentPage - 1
        }
      })
  }

  handlePrevious(target) {
    let FilterRequest = this.setRequestObject();
    let request = this.checkIfKeysAreValid(FilterRequest);
    if (this.currentPage > 1) {
      this.currentPage = this.currentPage - 1
      fetch("http://127.0.0.1:9199/" + this.currentPage, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: request
      }).then(result => result.json())
        .then(json => this.setState({ products: json }))
    }
  }

  handleClick() {
    let FilterRequest = this.setRequestObject();
    let request = this.checkIfKeysAreValid(FilterRequest);
    this.setState({ isLoading: true });
    fetch("http://127.0.0.1:9199/filter", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: request

    }).then(result => result.json())
      .then(json => {
        this.setState({ products: json })
        this.setState({ isLoading: false })
      })
  }


  handleClear() {
    this.state.sex = ''
    this.state.relationship = ''
    this.state.race = ''
    this.setState({ isClear: true });
    fetch("http://127.0.0.1:9199/", {
      method: 'GET',
      dataType: 'json'
    }).then(result => result.json())
      .then(json => {
        this.setState({ products: json })
        this.setState({ isClear: false })
      })
  }


  componentDidMount() {
    document.querySelector('.react-bs-container-body').style.overflow = "auto"
    fetch("http://127.0.0.1:9199/", {
      method: 'GET',
      dataType: 'json'
    }).then(result => result.json())
      .then(json => this.setState({ products: json }))

    if (localStorage.getItem('statisticalData') == null) {
      fetch("http://127.0.0.1:9199/getStats", {
        method: 'GET',
        dataType: 'json'
      }).then(result => result.json())
        .then((json) => {
          localStorage.setItem('statisticalData', JSON.stringify(json[0]));
          this.processContent(json[0])
        })
    } else {
      let json = localStorage.getItem('statisticalData');
      this.processContent(JSON.parse(json))
    }

    if (localStorage.getItem('races') == null) {
      fetch("http://127.0.0.1:9199/getRaces", {
        method: 'GET',
        dataType: 'json'
      }).then(result => result.json())
        .then(json => {
          localStorage.setItem('races', JSON.stringify(json));
          json.forEach((e) => {
            this.race[e] = e
          })
          this.setState({ isLoading: false })
        })
    } else {
      let json = localStorage.getItem('races');
      json = JSON.parse(json);
      json.forEach((e) => {
        this.race[e] = e
      })
      this.setState({ isLoading: false })
    }
  }

  processContent(json) {
    let a = json["male"];
    let b = json["female"];
    let copy = Object.assign({}, this.state.chart1);
    copy.datasets[0].data = [a, b];
    let copy1 = Object.assign({}, this.state.chart2);
    let i = 0;
    let data = [];
    let labels = [];
    let backgroundColor = []
    Object.keys(json).forEach((e) => {
      if (e !== 'male' && e !== 'female' && e !== '_id') {
        labels.push(e);
        data.push(json[e]);
        this.relationship[e] = e;
        let r = Math.floor(Math.random() * 128);
        let g = Math.floor(Math.random() * 255);
        let b = Math.floor(Math.random() * 255);
        backgroundColor.push("rgb(" + r + "," + g + "," + b + ")");
        i++;
      }
    })
    copy1.datasets[0].data = data;
    copy1.labels = labels;
    copy1.datasets[0].backgroundColor = backgroundColor;
    this.setState({ chart2: copy1 });
    this.setState({ chart1: copy });
  }

  render() {
    let dict = {
      "Male": "Male",
      "Female": "Female"
    }
    const { isLoading, isClear } = this.state;
    return (
      <div className="App">
        <header style={heightForHeader} className="App-header">
          <img src={logo} style={limitHeight} alt="logo" />
          <h1 className="App-title">Population Statistics</h1>
        </header>
        <div style={styleForChart}>
          <div>
            < Pie height={300} width={300} data={this.state.chart1} options={{ maintainAspectRatio: false }} />
          </div>
          <div>
            < Bar height={300} width={500} data={this.state.chart2} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <hr />
        <div style={boxForFilter}>
          <FilterSection param={this.state.sex} onselect={this.onSexSelect} dict={dict}
          ></FilterSection>
          <FilterSection param={this.state.race} onselect={this.onRaceSelect} dict={this.race}
          ></FilterSection>
          <FilterSection param={this.state.relationship} onselect={this.onRelationShipSelect} dict={this.relationship}
          ></FilterSection>
          <Button style={paddingStyle} bsStyle="success" disabled={isLoading} onClick={!isLoading ? this.handleClick : null}>
            {isLoading ? 'Loading...' : 'Search'}
          </Button>
          <Button style={paddingStyle} bsStyle="primary" disabled={isClear} onClick={!isClear ? this.handleClear : null}>
            {isClear ? 'Loading...' : 'Clear'}
          </Button>
        </div>
        <div>
          <div style={paginationButtons}>
            <Button style={paddingStyle} bsStyle="primary" disabled={isClear} onClick={!isClear ? this.handlePrevious : null}>
              {'<'}
            </Button>
            <Button style={paddingStyle} bsStyle="primary" disabled={isClear} onClick={!isClear ? this.handleNext : null}>
              {'>'}
            </Button>
          </div>
          <BootstrapTable height={500} overFlow={"auto"} noCaret className="table-striped" data={this.state.products} hover={true}>
            <TableHeaderColumn width='150' dataField="education" isKey={true} dataAlign="center">Education</TableHeaderColumn>
            <TableHeaderColumn width='150' dataField="age">Age</TableHeaderColumn>
            <TableHeaderColumn width='150' dataField="sex">Sex</TableHeaderColumn>
            <TableHeaderColumn width='150' dataField="marital-status">Marital status</TableHeaderColumn>
            <TableHeaderColumn width='150' dataField="occupation">occupation</TableHeaderColumn>
            <TableHeaderColumn width='150' dataField="hours-per-week">Hours-per-week</TableHeaderColumn>
            <TableHeaderColumn width='150' dataField="race">Race</TableHeaderColumn>
            <TableHeaderColumn width='150' dataField="native-country">Native Country</TableHeaderColumn>
            <TableHeaderColumn width='150' dataField="relationship">RelationShip</TableHeaderColumn>
          </BootstrapTable >
        </div>
      </div>
    );
  }
}



export default App;
