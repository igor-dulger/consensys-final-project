import React, { Component } from 'react'
import marketplaceService from '../services/Marketplace'
import { withAlert } from 'react-alert'
import Helpers from '../utils/Helpers'

class SellerManagement extends Component {
    constructor(props) {
        super(props)

        this.state = {
            add: '',
            remove: '',
            check: '',
        }

        this.events = {}
        
        this.handleCheckChange = this.handleCheckChange.bind(this);
        this.handleCheckSubmit = this.handleCheckSubmit.bind(this);

        this.handleAddChange = this.handleAddChange.bind(this);
        this.handleAddSubmit = this.handleAddSubmit.bind(this);

        this.handleRemoveChange = this.handleRemoveChange.bind(this);
        this.handleRemoveSubmit = this.handleRemoveSubmit.bind(this);
    }

    componentWillMount() {
        this.addWatchers()
    }

    componentWillUnmount() {
        Helpers.stopWatchers(this.events)
    }

    addWatchers() {
        this.events.AddRole = marketplaceService.getWatcherAddRole('seller')
        this.events.AddRole.watch( (err, result) => {
            console.log("Watcher add seller", result)
            if (result.args.operator === this.state.add) {
                this.setState({
                    add: ''
                })
                this.props.alert.success("Seller was added")
            }
        })

        this.events.RemoveRole = marketplaceService.getWatcherRemoveRole('seller')
        this.events.RemoveRole.watch( (err, result) => {
            console.log("Watcher remove seller", result)
            if (result.args.operator === this.state.remove) {
                this.setState({
                    remove: ''
                })
                this.props.alert.success("Seller was deleted")
            }
        })
    }

    handleCheckChange(event) {
        this.setState({check: event.target.value});
    }

    handleCheckSubmit(event) {
        event.preventDefault();
        marketplaceService.isSeller(this.state.check).then((result)=>{
            console.log(result)
            this.props.alert.info((result) ? "Has seller role" : "Doesn't have seller role")
        }).catch((error) => {
            console.log(error)
            this.props.alert.error("Error can't check seller role")
        });
    }

    handleAddChange(event) {
        this.setState({add: event.target.value});
    }

    handleAddSubmit(event) {
        event.preventDefault();
        marketplaceService.addSeller(this.state.add).then((result)=>{
            console.log(result)
            this.props.alert.info("Wait for confirmation")
        }).catch((error) => {
            console.log(error)
            this.props.alert.error("Error can't add seller")
        });
    }

    handleRemoveChange(event) {
        this.setState({remove: event.target.value});
    }

    handleRemoveSubmit(event) {
        event.preventDefault();
        marketplaceService.removeSeller(this.state.remove).then((result)=>{
            console.log(result)
            this.props.alert.info("Wait for confirmation")
        }).catch((error) => {
            console.log(error)
            this.props.alert.error("Error can't delete seller")
        });
    }

    render() {
        return (
            <div>
                <h1>Seller management</h1>

                <form className="pure-form" onSubmit={this.handleCheckSubmit}>
                    <fieldset>
                        <legend>Is seller</legend>
                        <input
                            type="text"
                            name="is_seller"
                            placeholder="address"
                            className="pure-input-2-3"
                            value={this.state.check}
                            onChange={this.handleCheckChange}
                        />
                        <button type="submit" className="pure-button pure-button-primary">check</button>
                    </fieldset>
                </form>

                <form className="pure-form" onSubmit={this.handleAddSubmit}>
                    <fieldset>
                        <legend>Add new seller</legend>
                        <input
                            type="text"
                            name="add_seller"
                            placeholder="address"
                            className="pure-input-2-3"
                            value={this.state.add}
                            onChange={this.handleAddChange}
                        />
                        <button type="submit" className="pure-button pure-button-primary">add</button>
                    </fieldset>
                </form>

                <form className="pure-form" onSubmit={this.handleRemoveSubmit}>
                    <fieldset>
                        <legend>Remove seller</legend>
                        <input
                            type="text"
                            name="delete_seller"
                            className="pure-input-2-3"
                            placeholder="address"
                            value={this.state.remove}
                            onChange={this.handleRemoveChange}
                        />
                        <button type="submit" className="pure-button pure-button-primary">remove</button>
                    </fieldset>
                </form>
            </div>
        )
    }
}

export default withAlert(SellerManagement)
