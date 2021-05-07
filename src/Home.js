import React from 'react';
import { json, checkStatus } from './utils';
import './Home.css';

// FontAwesome
import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class CurrencyApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 1.00,
      base: 'USD',
      date: '',
      rates: {},
      conversionCurrency: 'AUD',
      result: '',
      fromCurrencyList: [],
      toCurrencyList: []
    };

    this.updateCurrencyList = this.updateCurrencyList.bind(this);
    this.convertAmount = this.convertAmount.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleFromCurrencyChange = this.handleFromCurrencyChange.bind(this);
    this.handleToCurrencyChange = this.handleToCurrencyChange.bind(this);
    this.handleSwap = this.handleSwap.bind(this);
    this.numberWithCommas = this.numberWithCommas.bind(this);
  }

  componentDidMount () {
    this.updateCurrencyList(this.state.base);
  }

  updateCurrencyList (baseCurrency) {
    fetch(`https://altexchangerateapi.herokuapp.com/latest?from=${baseCurrency}`)
    .then(checkStatus)
    .then(json)
    .then((data) => {
      this.setState({
        base: data.base,
        date: data.date,
        rates: data.rates,
        result: this.convertAmount(this.state.amount, data.rates[this.state.conversionCurrency]),
        fromCurrencyList: [data.base, ...Object.keys(data.rates).filter(e => e !== this.state.conversionCurrency)],
        toCurrencyList: [...Object.keys(data.rates)]
      });
    })
    .then((data) => {
      let toTempList = this.state.toCurrencyList;
      toTempList = this.state.toCurrencyList.filter(e => e !== this.state.conversionCurrency).sort();
      toTempList.unshift(this.state.conversionCurrency);
      this.setState({
        toCurrencyList: toTempList
      });
    })
    .catch((error) => {
      this.setState({ error: error.message });
      console.log(error);
    })
  }

  convertAmount (amount, rate) {
    let convertedAmount = amount * rate;
    switch (true) {
      case (convertedAmount <10):
        convertedAmount = convertedAmount.toFixed(4);
        break;
      case (convertedAmount >10 && convertedAmount <100):
        convertedAmount = convertedAmount.toFixed(3);
        break;
      case (convertedAmount >100 && convertedAmount <1000):
        convertedAmount = convertedAmount.toFixed(2);
        break;
      case (convertedAmount >1000 && convertedAmount <10000):
        convertedAmount = convertedAmount.toFixed(1);
        break;
      default:
        convertedAmount = convertedAmount.toFixed(0);
        break;
    }
    return convertedAmount;
  }

  handleAmountChange (event) {
    const input = parseFloat(event.target.value);
    if (Number.isNaN(input)) {
      this.setState({
        amount: ''
      });
      return;
    }
    const result = this.convertAmount(input, this.state.rates[this.state.toCurrencyList[0]]);
    this.setState({
      amount: input,
      result
    });
  }

  handleFromCurrencyChange (event) {
    this.updateCurrencyList(event.target.value);
    document.getElementById("fromCurrency").selectedIndex = "0";
  }

  handleToCurrencyChange (event) {
    let fromTempList = this.state.fromCurrencyList;
    fromTempList = this.state.fromCurrencyList.filter(e => e !== event.target.value);
    let fromTempList2 = fromTempList.slice(1)
    fromTempList2.unshift(this.state.toCurrencyList[0]);
    fromTempList2.sort();
    fromTempList = [fromTempList[0], ...fromTempList2];

    let toTempList = this.state.toCurrencyList;
    toTempList = this.state.toCurrencyList.filter(e => e !== event.target.value).sort();
    toTempList.unshift(event.target.value);


    const result = this.convertAmount(this.state.amount, this.state.rates[event.target.value]);
    this.setState({
        conversionCurrency: event.target.value,
        toCurrencyList: toTempList,
        fromCurrencyList: fromTempList,
        result
      });

    document.getElementById("toCurrency").selectedIndex = "0";
  }

  handleSwap (event) {
    const base = this.state.conversionCurrency;
    const target = this.state.base;
    let toTempList = this.state.fromCurrencyList;

    const swapAfterFetch = new Promise((resolve, reject) => {
      this.setState({
          conversionCurrency: target,
        });
      this.updateCurrencyList(base);
      setTimeout(() => {
        resolve();
      }, 100);
    })

    swapAfterFetch.then(() => {
      const result = this.convertAmount(this.state.amount, this.state.rates[target]);
      this.setState({
          conversionCurrency: target,
          toCurrencyList: toTempList,
          result
        });
      })
  }

  numberWithCommas (x) {
    if (x > 999) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return x.toString();
    }
  }

  render () {
    const { amount, base, date, rates, result, fromCurrencyList, toCurrencyList } = this.state;
    return (
      <div>
        <div className="container p-4 my-4" id="currencyConverterBox">
          <div className="row text-center">
            <div className="col-12 col-md-4 p-3">
              <p>Amount</p>
              <input value={amount} onChange={this.handleAmountChange} type="number" />
            </div>
            <div className="col-4 col-md-1 p-3">
              <p>From</p>
              <select id="fromCurrency" onChange={this.handleFromCurrencyChange}>
                {fromCurrencyList.map(key => {
                  return (
                    <option value={key}>{key}</option>
                  )
                })}
              </select>
            </div>
            <div className="col-4 col-md-2 my-auto p-3">
              <FontAwesomeIcon icon={faExchangeAlt} size="2x" onClick={this.handleSwap} />
            </div>
            <div className="col-4 col-md-1 p-3">
              <p>To</p>
              <select id="toCurrency" onChange={this.handleToCurrencyChange}>
                {toCurrencyList.map(key => {
                  return (
                    <option value={key}>{key}</option>
                  )
                })}
              </select>
            </div>
            <div className="col-12 col-md-4 p-3 my-auto">
              <div id="toCurrencyValue">{this.numberWithCommas(result)}</div>
            </div>
          </div>
        </div>
        <div className="container mt-4">
          <div className="row text-center">
            <div className="col-12">
              <h3 className="mb-4"><b>Today's date: </b>{date}</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">{base}</th>
                    <th scope="col">1.00 {base}</th>
                    <th scope="col">Inverse</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(rates).map(key => {
                    return (
                      <tr>
                        <td>{key}</td>
                        <td>{(Math.round(rates[key] * 10000) / 10000).toFixed(4)}</td>
                        <td>{(Math.round(1 / rates[key] * 10000) / 10000).toFixed(4)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CurrencyApp;