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
      conversionCurrency: 'EUR',
      result: ''
    };

    this.convertAmount = this.convertAmount.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
  }

  componentDidMount () {
    fetch(`https://altexchangerateapi.herokuapp.com/latest?from=USD`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        this.setState({
          amount: data.amount,
          base: data.base,
          date: data.date,
          rates: data.rates,
          result: data.rates[this.state.conversionCurrency]
        });
      })
      .catch((error) => {
        this.setState({ error: error.message });
        console.log(error);
      })
  }

  convertAmount (amount, rate) {
    return amount * rate;
  }

  handleAmountChange (event) {
    const input = parseFloat(event.target.value);
    if (Number.isNaN(input)) {
      this.setState({
        amount: ''
      });
      return;
    }
    const result = this.convertAmount(input, this.state.rates[this.state.conversionCurrency]).toFixed(4);
    this.setState({
      amount: input,
      result
    });
  }

  render () {
    const { amount, base, rates, conversionCurrency, result } = this.state;
    return (
      <div>
        <div className="container p-4 my-4" id="currencyConverterBox">
          <div className="row text-center">
            <div className="col-3">
              <p>Amount</p>
              <input value={amount} onChange={this.handleAmountChange} type="number" />
            </div>
            <div className="col-2">
              <p>From</p>
              <select id="fromCurrency">
                <option value="{base}">{base}</option>
              </select>
            </div>
            <div className="col-2">
              <FontAwesomeIcon icon={faExchangeAlt} size="2x" />
            </div>
            <div className="col-2">
              <p>To</p>
              <select id="toCurrency">
                <option value="{conversionCurrency}">{conversionCurrency}</option>
              </select>
            </div>
            <div className="col-3">
              <div id="toCurrencyValue">{result}</div>
            </div>
          </div>
        </div>
        <div className="container p-4 my-4">
          <div className="row text-center">
            <div className="col-12">
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