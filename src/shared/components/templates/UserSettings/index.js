import { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter, Prompt } from 'react-router-dom'
import { Navbar } from 'shared/components/elements'
import { AccountSubscription, ConfigureWebsites, AccountSettings } from 'shared/components/partials'
import { WebsiteSettingsModal } from 'user/components/partials'
import {  } from 'constants/actionTypes'
import theme from 'theme'
import { formActions } from 'shared/actions'
import classes from './style.scss'
import { withTranslation } from "react-i18next";

const sections = {
  websites: { //key should be url param
    title: "Configure Websites",
    component: ConfigureWebsites,
  },
  paymentDetails: { //key should be url param
    title: "Payment Details",
    component: AccountSubscription,
  },
  accountSettings: { //key should be url param
    title: "Account Settings",
    component: AccountSettings,
  },
}
const defaultSection = Object.keys(sections)[0]

class UserSettings extends Component {
  constructor() {
    super()
    this.state = {
    }

    this.switchTo = this.switchTo.bind(this)
    this.handleUnload = this.handleUnload.bind(this)
    this._checkUrl = this._checkUrl.bind(this)
  }

 componentDidMount() {
    //set current campaign based on the url params, no matter what it was before
   /*
    const campaignId = this.props.match.params.campaignId
    this._checkUrl(this.props)
    window.onbeforeunload = this.handleUnload//TODO maybe use window.addEventListener("beforeunload") instead. Make sure to do for plans and campaign
    */
  }

  componentWillUnmount () {
    /*
    window.onbeforeunload = null
    */
  }

  handleUnload(e) {
    if (this.props.dirty) {
      var dialogText = 'Form not saved; Are you sure you want to leave?';//doesn't seem to show in Chrome at least
      e.returnValue = dialogText;
      return dialogText;
    }
  }

  componentWillReceiveProps (props) {
    //if changes the settings from the AccountMenu, while this is already mounted
    if (props.match.params.view !== this.props.match.params.view) {
      this._checkUrl(props)
    }
  }

  _checkUrl (props) {
    const currentSection = props.match.params.view
    if (!sections[currentSection]) {
      this.props.history.push((`/settings/${defaultSection}`))
    }
  }

  //basically unsets currentPost and makes sure not adding post, in case we left the view dirty from before
  resetComposeView () {
    this.props.setCurrentPost(null)
  }

  //can be called from the UserSettingsFooter or each of the 4 sections
  //initial opening should only be called from the section's componentWillReceiveProps/componentDidMount (and should be false, except once)
  switchTo(next) {
    this.props.history.push((`/settings/${next}`))
  }

  render() {
    // TODO remove this when we change what's below here
    const { t } = this.props
    return (
      <div>
        <h1>{t("Settings")}</h1>
        <div>{t("Coming soon...")}</div>
      </div>
    )
    
    const currentSection = this.props.match.params.view
    const Tag = (sections[currentSection] && sections[currentSection].component) || ConfigureWebsites


    //TODO can borrow code from the content audit tabs
    return (
      <main className={classes.userSettings}>
        <Prompt when={this.props.dirty} message={(location) => "Form not saved; Are you sure you want to leave?"}/>
        <h1>{t("Settings")}</h1>
        <Navbar className="" justifyTabs="flex-start" background={theme.color.moduleGrayOne} color={theme.color.text} tabs={true}>
          <ul>
            {Object.keys(sections).map((section) => {
              const title = sections[section].title

              return <li
                key={title}
                ref={title}
                className={`${classes.tab} ${currentSection === section ? classes.selected : ""}`}
                onClick={this.switchTo.bind(this, section)}
              >
                <span>{title}</span>
              </li>
            })}
          </ul>
        </Navbar>

        <div className={classes.tabContent}>
          <Tag
            pending={this.state.pending}
            switchTo={this.switchTo}
            initialOpening={this.state.initialOpening}
            resetComposeView={this.resetComposeView}
          />
        </div>
        <WebsiteSettingsModal />
      </main>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    //if either form is dirty
    dirty: Helpers.safeDataPath(state.forms, "UserSettings.posts.dirty", false) || Helpers.safeDataPath(state.forms, "UserSettings.other.dirty", false) ,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentCampaign: (data) => dispatch({type: SET_CURRENT_CAMPAIGN, payload: data}),
    setCurrentPost: (payload, options) => dispatch({type: SET_CURRENT_POST, payload, options}),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(UserSettings)))


