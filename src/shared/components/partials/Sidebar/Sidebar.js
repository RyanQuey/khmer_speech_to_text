import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { setInputVal } from 'actions'
import { DropDown, Flexbox, MenuItem } from 'shared/components/elements'
import {
  NOT_WORKING,
  REALLY_LIGHT,
  KINDA_LIGHT,
  NOT_THAT_BUSY,
  KINDA_BUSY,
  REALLY_BUSY,
  SLAMMED,
} from 'utils/constants'

import classes from './Sidebar.scss'

class Sidebar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      dirty: false,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleChange(e) {
    console.log('changing')
    const status = e.target.value
    this.setState({
      dirty: true,
      status,
      value: this.setDonutValue(status),
    })
  }
  handleSubmit() {
    console.log('submitting', this.state.status)
    this.setState({ dirty: false })
    this.props.setInputVal({ name: 'status', value: this.state.status })
  }
  render() {
    return (
      <Flexbox className={classes.sidebar} direction="column" background="black">

        <div className={classes.statusCtn}>
          <DropDown
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
            items={this.state.items}
            name="profile-dropdown"
            placeholder="How busy are you?"
            value={this.state.status}
            label="This week I am:"
            submitButton={this.state.dirty ? {
              classes: classes.btnPrimary,
              text: 'Update Availability',
            } : {}
            }
          />

          {this.state.dirty ? false : (
            <p className={classes.statusMsg}>
              <span>You are up to date.</span>
              <br />
              Last Updated: Today
              <br />
              Expires in: 7 days
            </p>
          )}
        </div>

        <div className={classes.nav}>
          <ul className={classes.sidebarNav}>
            <MenuItem link="/profile">
              Profile<span className={classes.profileEdit}>edit</span>
            </MenuItem>
            <MenuItem link="/contacts">
              Contacts <span className={classes.badge}>1</span>
            </MenuItem>
            <MenuItem link="/chat">
              Chat <span className={classes.badge}>1</span>
            </MenuItem>
            <MenuItem link="/collab">
              Collab Sessions <span className={classes.badge}>2</span>
            </MenuItem>
          </ul>
        </div>
      </Flexbox>
    )
  }
}

Sidebar.propTypes = {
  status: PropTypes.string,
}

const mapStateToProps = (state) => {
  return { status: state.user.status }
}

export default connect(mapStateToProps, { setInputVal })(Sidebar)
