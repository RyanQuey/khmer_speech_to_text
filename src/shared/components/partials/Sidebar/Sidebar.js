import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { DropDown, Flexbox, MenuItem } from 'shared/components/elements'

import { firebaseActions } from 'shared/actions'
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
    firebaseActions(`users/${this.props.user}/status`, this.state.status)
  }
  render() {
    return (
      <Flexbox className={classes.sidebar} direction="column" background="black">

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
  return { 
    user: state.shared.user }
}

export default connect(mapStateToProps)(Sidebar)
