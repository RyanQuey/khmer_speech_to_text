import { Component } from 'react'
import { connect } from 'react-redux'
import { viewSettingActions } from 'shared/actions'
import { Alert } from 'shared/components/elements'
import classes from './style.scss'

class ModalContainer extends Component {
  componentWillReceiveProps (nextProps){
    const html = document.querySelector("html").style.overflowY != "hidden"
    const body = document.querySelector("body").style.overflowY != "hidden"

    if (nextProps.visible) {
      document.querySelector("html").style.overflowY = "hidden"
      document.querySelector("body").style.overflowY = "hidden"

    } else if (!nextProps.visible) {
      document.querySelector("html").style.overflowY = "auto"
      document.querySelector("body").style.overflowY = "auto"

    }
  }
  componentWillUnmount (){
    document.querySelector("html").style.overflowY = "auto"
    document.querySelector("body").style.overflowY = "auto"
  }

  close() {
    viewSettingActions.closeModal()
    this.props.onClose()
  }

  render (){
    const {
      modal,
      modalDialog,
      modalContent,
      modalHeader,
      modalTitle,
      modalBody,
      closeButton
    } = (classes);

    const handleSubmit = this.props.handleSubmit
    let innerContent = [];

    const alerts = _.values(this.props.alerts)
    if (alerts) {
      alerts.forEach((alert) => {

        const alertForModal = Helpers.safeDataPath(alert, `options.forComponent`, false) === this.props.currentModal

        if (alertForModal) {
          innerContent.push(<Alert alert={alert} />)
        }
      })
    }

    //if (!this.props.bare) {
      innerContent.push(
        <div key="header" className={modalHeader}>
          <button type="button" className={closeButton} data-dismiss="modal" aria-label="Close" onClick={this.close}>
            <span aria-hidden="true">×</span>
          </button>
          
          <h1 className={modalTitle}>{this.props.title}</h1>
        </div>
      )
    //}
    
    innerContent.push(this.props.children)

    if (this.props.visible) {
      return (
        <div className={[modal || ""].join(" ")}>
          {this.props.bare ? (
            innerContent
          ) : (
            <div className={modalDialog}>
              <div className={modalContent}>
                {handleSubmit ? (
                  <form onSubmit={handleSubmit}>
                    {innerContent}
                  </form>
                ) : (
                  innerContent
                )}
              </div>
            </div>
          )}
        </div>
      )
    } else {
      return <span />
    }
  }
}

const mapStateToProps = (state) => {
  return { 
    alerts: state.shared.alerts,
    currentModal: state.shared.viewSettings.currentModal,
  }
}

export default connect(mapStateToProps)(ModalContainer)

