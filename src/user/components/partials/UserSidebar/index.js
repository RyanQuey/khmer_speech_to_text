import { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Flexbox } from 'shared/components/elements'
import { MenuItem } from 'shared/components/groups'
import { Select } from 'shared/components/groups'
import { withRouter } from 'react-router-dom'
import sbbicLogo from 'images/sbbic-member-small-web.png'

import classes from './Sidebar.scss'

class Sidebar extends Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }

  render() {
    return (
      <div className={`${classes.sidebar} ${this.props.show ? classes.show : ""}`}>

        <div className={classes.nav}>
          <ul className={classes.sidebarNav}>
            <MenuItem link="/upload" text="Upload" nav={true} exact={true} icon="upload" onClick={this.props.toggleSidebar.bind(this, false)}/>
            {false && <MenuItem link="/profile" text="Profile" nav={true} icon="bullhorn" onClick={this.props.toggleSidebar.bind(this, false)}/>}
            <MenuItem link="/transcripts" text="Transcripts" nav={true} exact={true} icon="file" onClick={this.props.toggleSidebar.bind(this, false)}/>
            <MenuItem link="/unfinished-transcripts" text="Unfinished Transcripts" nav={true} icon="cogs" onClick={this.props.toggleSidebar.bind(this, false)}/>
          </ul>
        </div>
        <div className={`${classes.backdrop} ${this.props.show ? classes.show : ""}`} onClick={this.props.toggleSidebar.bind(this, !this.props.show)}></div>

        <div className={`${classes.sbbicLogo}`}>
          <a href="https://www.sbbic.org/" target="_blank">
            <img alt="sbbic member" src={sbbicLogo} />
          </a>
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
