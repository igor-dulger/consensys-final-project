import React, { Component } from 'react'
import shopService from '../services/Shop'
import dataProvider from '../services/DataProvider'
import { withAlert } from 'react-alert'


class CreateProduct extends Component {
    constructor(props) {
        super(props)

        this.state = {
            address: props.address,
            value: '',
            balance: '',
            submitDisabled: "",
        }

        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        this.getBallance()
    }

    getBallance() {
        shopService.getBalance().then(result => {
            this.setState({
                balance: dataProvider.web3.fromWei(result).toString()
            })
        }).catch((error) => {
            console.log("Can't get balance.")
        })
    }

    handleValueChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        event.stopPropagation()
        event.preventDefault()

        shopService.withdraw(
            dataProvider.web3.toWei(this.state.value, 'ether')
        ).then((result)=>{
            console.log(result)
            this.setState({
                value: '',
            })
            this.props.alert.success("Withdraw was done. Wait for confirmation")
        }).catch((error) => {
            console.log(error)
            this.props.alert.error("Error can't withdraw")
        });
    }

    render() {
        return (
            <div>
                <h1>Withdraw</h1>

                <form className="pure-form pure-form-aligned" onSubmit={this.handleCheckSubmit}>
                    <fieldset>
                        <div className="pure-control-group">
                            <label htmlFor="name">Shop balance</label>
                            {this.state.balance} ether
                        </div>
                        <div className="pure-control-group">
                            <label htmlFor="name">Withdraw *</label>
                            <input
                                type="text"
                                name="value"
                                placeholder="value"
                                className="pure-input-1-3"
                                value={this.state.value}
                                onChange={this.handleValueChange}
                            /> ether
                        </div>
                        <div className="pure-controls">
                            <button
                                type="submit"
                                disabled={this.state.submitDisabled}
                                className="pure-button pure-button-primary"
                                onClick={this.handleSubmit}
                            >
                                Withdraw
                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>
        )
    }
}

export default withAlert(CreateProduct)
