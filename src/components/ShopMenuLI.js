import React, { Component } from 'react'

class ShopMenuLI extends Component {
    render() {
        if (!this.props.show) {
            return null
        }
        const className = (this.props.current === this.props.url)
        ?
        "pure-menu-item pure-menu-selected"
        :
        "pure-menu-item"

        return (
                <li className={className}>
                    <a href={this.props.url} className="pure-menu-link">{this.props.label}</a>
                </li>
        );
    }
}

export default ShopMenuLI
