import React, { Component } from 'react'
import marketplaceService from '../services/Marketplace'
import { withAlert } from 'react-alert'

class createShop extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: '',
            description: '',
        }

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleNameChange(event) {
        this.setState({name: event.target.value});
    }

    handleDescriptionChange(event) {
        this.setState({description: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        marketplaceService.createShop(
            this.state.name,
            this.state.description
        ).then((result)=>{
            console.log(result)
            this.setState({
                name: '',
                description: ''
            })
            this.props.alert.success("Shop was created")

        }).catch((error) => {
            console.log(error)
            this.props.alert.error("Error can't create shop")
        });
    }

    render() {
        return (
            <div>
                <h1>Create shop</h1>
                <form className="pure-form pure-form-aligned" onSubmit={this.handleCheckSubmit}>
                    <fieldset>
                        <div className="pure-control-group">
                            <label htmlFor="name">Shop name *</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                className="pure-input-2-3"
                                value={this.state.name}
                                onChange={this.handleNameChange}
                            />
                        </div>
                        <div className="pure-control-group">
                            <label htmlFor="name">Description *</label>
                            <textarea
                                name="description"
                                placeholder="Description"
                                className="pure-input-2-3"
                                value={this.state.description}
                                onChange={this.handleDescriptionChange}
                            />
                        </div>
                        <div className="pure-controls">
                            <button
                                type="submit"
                                className="pure-button pure-button-primary"
                                onClick={this.handleSubmit}
                            >
                                Create
                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>
        )
    }
}

export default withAlert(createShop)
