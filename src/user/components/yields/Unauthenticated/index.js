import { Component } from 'react'
import PropTypes from 'prop-types'
import { Alert, Flexbox, Navbar } from 'shared/components/elements'
import { 
  withRouter,
  Route,
  Switch,
} from 'react-router-dom'
import classes from './Unauthenticated.scss'
import { UserNavbar, UserSidebar } from 'user/components/partials'
import { UserLogin, UserContent } from 'user/components/templates'
import {
  BrowserRouter,
} from 'react-router-dom'
import { connect } from 'react-redux'
import info from 'constants/info'
import { withTranslation } from 'react-i18next';

const { supportEmail, instructionVideoEnglishUrl, instructionVideoKhmerUrl } = info

class Unauthenticated extends Component {
  
  render() {
    const { children, t, i18n } = this.props
    const alerts = _.values(this.props.alerts)
    const modalOpen = this.props.currentModal
     
    return (
      <div>
          <Flexbox direction="column">
            <UserNavbar unauthenticated={true} />
            <Flexbox className={classes.mainContainer}>
              <div className={classes.content}>
                <h1>
                  {t("Khmer Voice App")}
                </h1>
                <h2>
                  {t("What is the Khmer Voice App?")}
                </h2>
                <div className={classes.iframeWrapper}>
                  {i18n.language == "en" ? (
                    <iframe width="300" height="169" src={instructionVideoEnglishUrl} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                  ) : (
                    <iframe width="300" height="169" src={i18n.getFixedT("kh", instructionVideoKhmerUrl)} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                  )}
                </div>
                <br />
                <h2>
                  {t("Ready to get started?")}
                </h2>
                <p>
                  {t("Currently this project is still in beta, which means it is ready to use, but there are still issues to work out. ")}
                </p>
                <p>
                  {t("We welcome users to help us beta test, as long as you understand that there are still issues to work out, and only use the app a reasonable amount (since there is a cost involved in generating these transcripts).")}
                </p>
                <p>
                  {t("In order to sign up, contact us at ")}
                  <a href={`mailto:${supportEmail}`} target="_blank">{supportEmail}</a>.
                </p>
                <div className={classes.broughtToYouBy}>
                  <a href="https://sbbic.org/" target="_blank">
                    {t("Brought to you by: The Society for Better Books in Cambodia")}
                  </a>
                </div>
              </div>
            </Flexbox>
          </Flexbox>

        <UserLogin />
      </div>
    )
  }
}

Unauthenticated.propTypes = {
}

const mapStateToProps = (state) => {
  return { 
    alerts: state.alerts,
    currentModal: state.viewSettings.currentModal,
  }
}

export default withRouter(connect(mapStateToProps)(withTranslation()(Unauthenticated)))
