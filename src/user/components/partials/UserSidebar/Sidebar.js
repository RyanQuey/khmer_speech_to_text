import { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Flexbox } from 'shared/components/elements'
import { MenuItem } from 'shared/components/groups'
import { Select } from 'shared/components/groups'
import { withRouter } from 'react-router-dom'

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
            <MenuItem link="/upload" text="Upload" nav={true} exact={true} icon="bullhorn"/>
            <MenuItem link="/profile" text="Profile" nav={true} exact={true} icon="bullhorn"/>
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
    user: state.user }
}

export default withRouter(connect(mapStateToProps)(Sidebar))
