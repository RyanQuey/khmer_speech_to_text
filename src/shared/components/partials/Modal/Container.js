import { Component } from 'react'
import { connect } from 'react-redux'
import { Alert } from 'shared/components/elements'
import classes from './style.scss'

class ModalContainer extends Component {
  componentWillReceiveProps (nextProps){
    const html = document.querySelector("html").style.overflowY != "hidden"
    const body = document.querySelector("body").style.overflowY != "hidden"

    if (nextProps.visible && !this.props.visible) {
      document.querySelector("html").style.overflowY = "hidden"
      document.querySelector("body").style.overflowY = "hidden"

    } else if (this.props.visible && !nextProps.visible) {
      document.querySelector("html").style.overflowY = "auto"
      document.querySelector("body").style.overflowY = "auto"
    }
  }
  componentWillUnmount (){
    document.querySelector("html").style.overflowY = "auto"
    document.querySelector("body").style.overflowY = "auto"
  }

  render (){

    //TODO might just do if currentModal === this.props.name, as was doing for ST, at least for some time
    if (!this.props.visible) {
      return null
    }

    const {
      modal,
      modalDialog,
      modalContent,
      modalHeader,
      modalTitle,
      modalSubtitle,
      modalBody,
      closeButton,
    } = (classes);

    const handleSubmit = this.props.handleSubmit
    let innerContent = [];

    if (!this.props.disableClose || this.props.title || this.props.subtitle) { //Maybe also || this.props.headerImgUrl...but haven't ran into anything yet so wait
      let hasBorder = this.props.title || this.props.subtitle || this.props.headerImgUrl
      innerContent.push(
        <div key="header" className={`${modalHeader} ${hasBorder ? classes.hasBorder : ""}`}>
          {!this.props.disableClose && <button type="button" className={closeButton} data-dismiss="modal" aria-label="Close" onClick={this.props.onClose}>
            <span aria-hidden="true">×</span>
          </button>}

          {this.props.headerImgUrl && <img className={classes.headerImg} src={this.props.headerImgUrl} />}
          {this.props.title && <h1 className={modalTitle}>{this.props.title}</h1>}
          {this.props.subtitle && <h2 className={modalSubtitle}>{this.props.subtitle}</h2>}
        </div>
      )
    }

    //convert to array
    //don't make children part of this array, or when the alerts rerender, might cause the children to rerender (key might solve it)
    /*const alerts = _.values(this.props.alerts)
    if (alerts) {
      alerts.forEach((alert) => {
        const alertForModal = Helpers.safeDataPath(alert, `options.forComponent`, false) === this.props.currentModal

        if (alertForModal) {
          innerContent.push(<Alert key={`alert-${alert.id}`} alert={alert} />)
        }
      })
    }*/

    return (
      <div className={[modal || ""].join(" ")}>
        <div className={modalDialog}>
          <div className={modalContent}>
            {handleSubmit ? (
              <form onSubmit={handleSubmit}>
                {innerContent}
                {this.props.children}
              </form>
            ) : (
              <div>
                {innerContent}
                {this.props.children}
              </div>
            )}
          </div>
        </div>
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

export default connect(mapStateToProps)(ModalContainer)

