import { Component } from 'react'
import PropTypes from 'prop-types'
import { Alert, Flexbox, Navbar } from 'shared/components/elements'
import { 
  withRouter,
  Route,
  Switch,
  Link,
} from 'react-router-dom'
import classes from './style.scss'
import { UserNavbar, UserSidebar } from 'user/components/partials'
import { UserContent } from 'user/components/templates'
import {
  BrowserRouter,
} from 'react-router-dom'
import { connect } from 'react-redux'
import info from 'constants/info'
const { supportEmail, instructionVideoKhmerUrl, instructionVideoEnglishUrl } = info

class Home extends Component {
  
  render() {
    const { children } = this.props
    const alerts = _.values(this.props.alerts)
    const modalOpen = this.props.currentModal
     
    return (
      <div>
          <Flexbox direction="column">
            <Flexbox className={classes.mainContainer}>
              <div className={classes.content}>
                <h1>Khmer Voice App</h1>
                <h2>
                  Instructions
                </h2>
                <div className={classes.iframeWrapper}>
                  <iframe width="300" height="169" src={instructionVideoKhmerUrl} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
                <br />
                <h2>
                  Let's get started!
                </h2>
                <p>
                  <Link to="/upload">Upload your Khmer audio to start creating a transcript</Link>
                <p>
                </p>
                  Questions or comments? Contact us at <a href={`mailto:${supportEmail}`} target="_blank">{supportEmail}</a>.
                </p>
              </div>
            </Flexbox>
          </Flexbox>
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return { 
    alerts: state.alerts,
    currentModal: state.viewSettings.currentModal,
  }
}

export default withRouter(connect(mapStateToProps)(Home))
