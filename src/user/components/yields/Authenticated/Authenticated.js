import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Flexbox } from 'shared/components/elements'
import { Navbar, Sidebar, UserMenu } from 'shared/components/groups'
import classes from './Authenticated.scss'

export default class AuthenticatedTemplate extends Component {
  render() {
    const { children } = this.props
    return (
      <Flexbox>

        <Sidebar />

        <Flexbox className={classes.rightColumn} direction="column">

          <Navbar>
            <div className={classes.headerStats}>
              <ul className={classes.headerList}>
                <li><UserMenu /></li>
              </ul>
            </div>
          </Navbar>

          <main>
            {children}
          </main>
        </Flexbox>
      </Flexbox>
    )
  }
}

AuthenticatedTemplate.propTypes = {
  children: PropTypes.node.isRequired,
  donutchart: PropTypes.node,
}
