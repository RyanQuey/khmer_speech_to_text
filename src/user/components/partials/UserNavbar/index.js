import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Icon, Button, Navbar, NavbarBrand, Flexbox } from 'shared/components/elements'
import { AccountMenu } from 'shared/components/partials'
import { viewSettingActions } from 'shared/actions'
import { StyleSheet, css } from 'aphrodite'
import theme from 'theme'
import classes from './style.scss'
import info from 'constants/info'
import { withTranslation } from 'react-i18next';
const { supportEmail } = info

const styles = StyleSheet.create({
  menu: {
    color: theme.color.white,
  },
})

class UserNavbar extends Component {
  constructor(props) {
    super(props)

    this.state = { }
    this.openLoginModal = this.openLoginModal.bind(this)
    this.nothing = this.nothing.bind(this)
    this.toggleLanguage = this.toggleLanguage.bind(this)
  }

  openLoginModal(e) {
    e.preventDefault()
    viewSettingActions.openModal("UserLogin")
  }

  nothing(e) {
    e.preventDefault()
  }

  toggleLanguage(e) {
    let lang = ""
    if (this.props.i18n.language == "en") {
      lang = "kh"
    } else {
      lang = "en"
    }

    console.log("current language", this.props.i18n.language)
    this.props.i18n.changeLanguage(lang);
  }

  render() {
    const { user, t } = this.props
    const SupportLink = () => <a href={`mailto:${supportEmail}`} target="_blank">{t("Support")}</a>
    const ToggleLangBtn = () => <Button onClick={this.toggleLanguage}>{t("ភាសា​ខ្មែរ")}</Button>

    return (
      <Navbar>
        <Flexbox justify="space-between">
          <NavbarBrand/>
        </Flexbox>

        <div className={classes.mainNav}>
          <Flexbox className={classes.leftNav} align="center" justify="space-between">
            {user && (
              <SupportLink />
            )}
          </Flexbox>

          <Flexbox className={classes.rightNav} align="center" justify="space-between">
          
            <ToggleLangBtn />
            {user ? (
              <div>
                {user.email}
                <AccountMenu />
              </div>
            ) : (
              <div>
                <SupportLink />
                <a href="#" onClick={this.openLoginModal}>{t("Login")}</a>
              </div>
            )}
          </Flexbox>
        </div>

        <div className={classes.mobileNav}>
          <Flexbox className={classes.rightNav} align="center" justify="space-between">
          
            <SupportLink />
            <ToggleLangBtn />
            

            {user ? (
              <div className={classes.userButtonsWrapper}>
                <AccountMenu />
                <Icon name="bars" onClick={this.props.toggleSidebar.bind(this, undefined)} className={classes.hamburger} size="2x"/> 
              </div>
            ) : (
              <a href="#" onClick={this.openLoginModal}>{t("Login")}</a>
            )}
          </Flexbox>
        </div>
      </Navbar>
    )
  }
}

UserNavbar.propTypes = {
  user: PropTypes.object,
}

const mapStateToProps = (state) => {
  return { user: state.user || null }
}

export default connect(mapStateToProps)(withTranslation()(UserNavbar))

