import { Component } from 'react'
import { viewSettingActions } from 'shared/actions'
import classes from './style.scss'

export default class ModalContainer extends Component {

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
    let innerContent;
    if (this.props.bare) {
      innerContent = []
    } else {
      innerContent = [
        <div key="header" className={modalHeader}>
          <button type="button" className={closeButton} data-dismiss="modal" aria-label="Close" onClick={this.close}>
            <span aria-hidden="true">×</span>
          </button>
          <h1 className={modalTitle}>{this.props.title}</h1>
        </div>
      ]
    }
    
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
