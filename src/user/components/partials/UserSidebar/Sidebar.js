import { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Flexbox, MenuItem } from 'shared/components/elements'
import { Select } from 'shared/components/groups'
import { withRouter } from 'react-router-dom'

import { firebaseActions } from 'shared/actions'
import classes from './Sidebar.scss'

class Sidebar extends Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }

  render() {
    return (
      <Flexbox className={classes.sidebar} direction="column" background="black">

        <div className={classes.nav}>
          <ul className={classes.sidebarNav}>
            <MenuItem link="/search" nav={true}>
              Search <span className={classes.badge}>1</span>
            </MenuItem>
            <MenuItem link="/profile" nav={true}>
              Profile
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

export default withRouter(connect(mapStateToProps)(Sidebar))
