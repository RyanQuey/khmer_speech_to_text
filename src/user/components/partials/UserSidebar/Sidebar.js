import { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Flexbox, MenuItem } from 'shared/components/elements'
import { Select } from 'shared/components/groups'

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
            <MenuItem link="/profile" nav={true}>
              Profile
            </MenuItem>
            <MenuItem link="/stuff" nav={true}>
              Stuff <span className={classes.badge}>1</span>
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
