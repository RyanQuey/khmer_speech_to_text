import PropTypes from 'prop-types'
import classes from './style.scss'
import { Icon, Button } from 'shared/components/elements'
import { Popup } from 'shared/components/groups'
import theme from 'theme'

//use containerClass to define padding etc on container
const ConfirmationPopup = ({ onConfirm, onCancel, confirmationText, dangerous, pending, className, body = "left", float = "right", side, handleClickOutside, show}) => {

  return (
    <Popup
      containerClass={classes.container}
      float={float}
      body={body}
      side={side}
      handleClickOutside={handleClickOutside}
      show={show}
    >
      <div className={``}>
        {confirmationText || "Are you sure you want to do this?"}
      </div>

      <div className={classes.buttonSet}>
        <Button style={dangerous ? "danger" : "primary"} onClick={onConfirm} pending={pending}>Confirm</Button>
        <Button style="inverted" onClick={onCancel} disabled={pending}>Cancel</Button>
      </div>
    </Popup>
  )
}

ConfirmationPopup.propTypes = {
}

export default ConfirmationPopup

