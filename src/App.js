import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import getAccounts from './utils/getAccounts'
import dataProvider from './services/DataProvider'
import marketplaceService from './services/Marketplace'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            setPageSize: 0,
            roles: {
                owner: false,
                admin: false,
                seller: false
            }
        }
    }

    componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
        getWeb3.then(results => {
            dataProvider.set({web3: results.web3})
        // Instantiate contract once web3 provided.
            this.instantiateContract()
        }).catch(() => {
            console.log('Error finding web3.')
        })
    }

    async instantiateContract() {
        const accounts = await getAccounts()
        dataProvider.set({
            account: accounts[0],
            marketplace: await marketplaceService.getContract()
        })

        return this.setState({
            roles: await marketplaceService.getRoles()
        });
    }

    async handleClick(event) {
        const contract = dataProvider.marketplace
        const account = dataProvider.account

        // await contract.setPageSize(5, {from: account})
        // let result = await contract.getPageSize()
        // return this.setState({ pageSizeValue: result.toString() })

        contract.setPageSize(5, {from: account}).then(result => {
            console.log(result)
            return contract.getPageSize()
        }).then(result => {
            return this.setState({ pageSizeValue: result.toString() })
        })
    }

    render() {
        let owner = (this.state.roles.owner) ? "Owner" : ''
        let admin = (this.state.roles.admin) ? "Admin" : ''
        let seller = (this.state.roles.seller) ? "Seller" : ''

      console.log(this.state, dataProvider, owner, admin, seller)
        return (
          <div className="App">
            <nav className="navbar pure-menu pure-menu-horizontal">
                <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
            </nav>
            <main className="container">
              <div className="pure-g">
                <div className="pure-u-1-1">
                  <h1>Good to Go!</h1>
                  You are: {owner} {admin} {seller}
                  <p>Your Truffle Box is installed and ready.</p>
                  <h2>Smart Contract Example</h2>
                  <p>If your contracts compiled and migrated successfully, below will show a stored value of 17 (by default).</p>
                  <p>Try changing the value stored on <strong>line 59</strong> of App.js.</p>
                  <p>The stored value is: {this.state.pageSizeValue}</p>
                  <button onClick={this.handleClick.bind(this)}>Set Page Button</button>
                </div>
              </div>
            </main>
          </div>
        );
    }
}

export default App
