import React, { Component } from 'react'
import marketplaceService from '../services/Marketplace'
import { withAlert } from 'react-alert'
import ShopRow from './ShopRow'
import Helpers from '../utils/Helpers'

class Shops extends Component {
    constructor(props) {
        super(props)

        this.state = {
            roles: props.roles,
            pageSize: 10,
            stopPaging: false,
            list: [],
            readInProgress: false
        }

        this.events = {}

        this.handleShowMoreClick = this.handleShowMoreClick.bind(this);
    }

    componentWillMount() {
        this.readState()
        this.addWatchers()
    }

    componentWillUnmount() {
        Helpers.stopWatchers(this.events)
    }

    addWatchers() {

        this.events.shopDeleted = marketplaceService.getWatcherShopDeleted()
        this.events.shopDeleted.watch( (err, result) => {
            this.readState()
        })
        this.events.shopAdded = marketplaceService.getWatcherShopAdded()
        this.events.shopAdded.watch( (err, result) => {
            this.readState()
        })
    }

    handleShowMoreClick() {
        if (this.state.list.length){
            this.getNext(this.state.list[this.state.list.length-1].id, 0);
        }
    }

    readState() {
        if (this.state.readInProgress) return

        this.setState({
            list: [],
            readInProgress: true
        })
        this.getNext(0, 0);
    }

    getNext(id, showed) {
        if (showed >= this.state.pageSize) {
            this.setState({
                readInProgress: false
            })
            return
        }

        marketplaceService.getNext(id).then(result => {
            //console.log(result)
            const row = {
                id: result[0].toString(),
                key: result[0].toString(),
                name: result[1],
                description: result[2],
                address: result[3],
                owner:  result[4],
            }
            this.getNext(row.id, showed+1)
            let shops = this.state.list
            shops.push(row)
            this.setState({
                list: shops
            })
        }).catch((error) => {
            this.setState({stopPaging: true})
            this.setState({
                readInProgress: false
            })
            console.log("Can't get shop. Stop paging")
        })
    }

    render() {

        let owner = (this.props.roles.owner) ? "Owner" : ''
        let admin = (this.props.roles.admin) ? "Admin" : ''
        let seller = (this.props.roles.seller) ? "Seller" : ''
        let buyer = (!owner && !admin && !seller) ? "Buyer" : ''

        console.log("Shops", this.state)

        return (
            <div>
                <h1>Shops</h1>
                <h3>You are: {owner} {admin} {seller} {buyer}</h3>
                <div>&nbsp;</div>
                <table className="pure-table" width="100%">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.list.map((row, i) => <ShopRow {...row} index={i} />)}
                    </tbody>
                    <tfoot>
                        {!this.state.stopPaging &&
                            <tr>
                                <td colSpan="3" align="center">
                                    <button className=" pure-button" onClick={this.handleShowMoreClick}>Show more</button>
                                </td>
                            </tr>
                        }
                    </tfoot>
                </table>
            </div>
        );
    }
}

export default withAlert(Shops)
