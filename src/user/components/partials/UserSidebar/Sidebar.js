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
    console.log("can show", this.props.show)

    return (
      <div className={`${classes.sidebar} ${this.props.show ? classes.show : ""}`}>

        <div className={classes.nav}>
          <ul className={classes.sidebarNav}>
            <MenuItem link="/upload" text="Upload" nav={true} exact={true} icon="upload"/>
            {false && <MenuItem link="/profile" text="Profile" nav={true} icon="bullhorn"/>}
            <MenuItem link="/transcripts" text="Transcripts" nav={true} exact={true} icon="file-alt"/>
            <MenuItem link="/unfinished-transcripts" text="Unfinished Transcripts" nav={true} icon="cogs"/>
          </ul>
        </div>
      </div>
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
