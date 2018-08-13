import React, { Component } from 'react'
import shopService from '../services/Shop'
import { withAlert } from 'react-alert'
class ProductBuy extends Component {
    constructor(props) {
        super(props)

        this.state = {
            count: 1
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleBuyClick = this.handleBuyClick.bind(this);
    }

    handleBuyClick(event) {
        event.stopPropagation()
        event.preventDefault()
        console.log("Trying to buy id " + this.props.id + " count " + this.state.count)
        shopService.buyProduct(this.props.id, this.state.count, this.props.price).then(result => {
            console.log(result)
            this.props.alert.info('Transaction was sent wainting for confirmation')
        }).catch((error) => {
            console.log("Error can't buy product.", error)
        })
    }

    handleChange(event) {
        this.setState({
            count: event.target.value
        })
    }

    render() {
        return (
            <form className="pure-form pure-g">
                <div className="pure-g">
                    <div className="pure-u-3-8">
                        <input type="text" className="pure-input-1" value={this.state.count} onChange={this.handleChange} />&nbsp;
                    </div>
                    <div className="pure-u-5-8">
                        &nbsp;<button className="button-success pure-button" onClick={this.handleBuyClick}>Buy</button>
                    </div>
                </div>
            </form>
        )
    }
}

export default withAlert(ProductBuy)
