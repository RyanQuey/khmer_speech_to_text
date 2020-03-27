import { Component } from 'react';
import PropTypes from 'prop-types'
import classes from './style.scss'
import { StyleSheet, css } from 'aphrodite'
import { Icon, Button, Input } from 'shared/components/elements'
import { Popup } from 'shared/components/groups'
import theme from 'theme'

//use containerClass to define padding etc on container
class ContactUsButton extends Component {
  constructor() {
    super()

    this.state = {
      open: false,
      message: "",
    }

    this.openForm = this.openForm.bind(this)
    this.closeForm = this.closeForm.bind(this)
    this.submit = this.submit.bind(this)
    this.handleText = this.handleText.bind(this)
  }

  closeForm (e) {
    e.preventDefault()
    this.setState({open: false})
  }

  openForm (e) {
    e.preventDefault()
    this.setState({open: true})
  }

  submit (e) {
    e.preventDefault()

    this.setState({pending: true})
    axios.post("/api/notifications/contactUs", {
      userId: store.getState().user.id, //if no user, should throw error right now
      message: this.state.message,
    })
    .then(() => {
      this.setState({pending: false, message: "", open: false})

      alertActions.newAlert({
        title: "Thanks for your feedback!",
        level: "SUCCESS",
      })
    })
    .catch((err) => {
      console.log(err);
      this.setState({pending: false})
    })
  }

  handleText (value) {
    this.setState({message: value})
  }
  render () {
    return (
      <div
        className={`${classes.container}`}
      >
        <div className={classes.wrapper}>
          <div className={`${classes.contactUsButton}`} onClick={this.openForm}>
            Contact Us&nbsp;<Icon name="comments" size="1x"/>
          </div>

          {this.state.open && <Popup
            containerClass={classes.formContainer}
            float="left"
            body="left"
            side="top"
            show={this.state.open}
          >
            <h3>Send us an email</h3>
            <form className={``} onSubmit={this.submit} >
              <label>Please provide details of your comment/question</label>
              <Input
                textarea={true}
                value={this.state.message || ""}
                placeholder={`Your message`}
                onChange={this.handleText}
                type="text"
             />


              <div className={classes.buttonSet}>
                <Button style="inverted" small={true} onClick={this.closeForm} disabled={this.state.pending}>Cancel</Button>
                <Button type="submit" small={true} pending={this.state.pending}>Send</Button>
              </div>
            </form>
          </Popup>}

        </div>
      </div>
    )
  }
}

ContactUsButton.propTypes = {
  onClick: PropTypes.func,
}

export default ContactUsButton

