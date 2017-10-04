import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { 
  ModalContainer,
  ModalBody,
  ModalFooter,
} from 'shared/components/partials/Modal'
import { Login } from 'shared/components/partials'
import { viewSettingActions } from 'shared/actions'

class UserLogin extends Component {
  constructor() {
    super()
    this.onSuccess = this.onSuccess.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }
  handleClose (){
    viewSettingActions.closeModal()
  }

  onSuccess () {
    this.handleClose();

    if (typeof this.props.onSuccess === 'function') {
      this.props.onSuccess();
    }
  }

  render (){
    return (
      <ModalContainer
        visible={this.props.currentModal === "UserLogin"}
        onClose={this.handleClose}
        >
          <ModalBody>
            <Login modal={true} onSuccess={this.onSuccess} onCancel={this.handleClose} />
          </ModalBody>
      </ModalContainer>
    )
  }
}

const mapStateToProps = (state) => {
  return { currentModal: state.shared.viewSettings.currentModal }
}

export default connect(mapStateToProps)(UserLogin)
