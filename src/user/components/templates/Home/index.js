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
import { withTranslation } from 'react-i18next';
const { supportEmail, instructionVideoKhmerUrl, instructionVideoEnglishUrl } = info

class Home extends Component {
  
  render() {
    const { children, t, i18n } = this.props
    const alerts = _.values(this.props.alerts)
    const modalOpen = this.props.currentModal
     
    return (
      <div>
          <Flexbox direction="column">
            <Flexbox className={classes.mainContainer}>
              <div className={classes.content}>
                <h1>
                  {t("Khmer Voice App")}
                </h1>
                <h2>
                  {t("Instructions")}
                </h2>
                <div className={classes.iframeWrapper}>
                  {i18n.language == "en" ? (
                    <iframe width="300" height="169" src={instructionVideoEnglishUrl} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                  ) : (
                    <iframe width="300" height="169" src={instructionVideoKhmerUrl} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                  )}
                </div>
                <br />
                <h2>
                  {t("Let's get started!")}
                </h2>
                <p>
                  <Link to="/upload">
                    {t("Upload your Khmer audio to start creating a transcript")}
                  </Link>
                <p>
                </p>
                  {t("Questions or comments? Contact us at ")}
                  <a href={`mailto:${supportEmail}`} target="_blank">{supportEmail}</a>.
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

export default withRouter(connect(mapStateToProps)(withTranslation()(Home)))
