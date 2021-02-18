import { Component } from 'react';
import { connect } from 'react-redux'
import { PROVIDERS } from 'constants/providers'
import { FAKE } from 'constants/actionTypes'
import {
  withRouter,
  Link
} from 'react-router-dom'
import { Card, CardHeader, Flexbox, Button, Icon } from 'shared/components/elements'
import { SET_CURRENT_TRANSCRIPT, RESUME_TRANSCRIBING_REQUEST } from 'constants/actionTypes'
import classes from './style.scss'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { withTranslation } from "react-i18next";

class TranscribeRequestCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      progressPercentage: parseFloat(props.transcribeRequest.progressPercentage()),
    }

    this.tick = this.tick.bind(this)
  }

  tick () {
    this.setState({progressPercentage: this.props.transcribeRequest.progressPercentage()})
  }

  componentDidMount() {
    this.intervalID = setInterval(() => {
      this.tick()

      // if there is an error, want to update status to 0 one time, and then stop watching, unless
      // they start new request
      if (this.props.transcribeRequest.hasError() || this.props.transcribeRequest.transcriptionComplete()) {
        clearInterval(this.intervalID);
      }
      // change this number to have a slower or faster time in between updating the percentage bar
    }, 100);
    
  }

  componentWillUnmount() {
    clearInterval(this.intervalID)
  }

  render () {
    const { transcribeRequest, selected, onClick, className = classes["request-card"], subtitle, small, wrapperClass, smallIcon, t} = this.props

    const status = transcribeRequest.hasError() ? "error" : "transcribing"

    return (
      <Card selected={selected} onClick={onClick} wrapperClass={wrapperClass} className={`${className} ${classes[status]} ${small ? classes.small : ""}`} height="320px">
        <CardHeader className={small ? classes.smallHeader : ""} title={transcribeRequest.filename} subtitle={subtitle || transcribeRequest.contentType} icon={"icon"} iconColor={"blue"}/>

        <div className={classes.chartAndInfoContainer}>
          <Flexbox className={classes.progressCircleContainer}>
            <CircularProgressbar value={this.state.progressPercentage} text={`${this.state.progressPercentage.toFixed(1)}%`} />
          </Flexbox>

          <Flexbox className={classes.infoContainer} direction="column">
            {[
              [transcribeRequest.displayFileLastModified(), t("File Last Modified"), "Date and time the file that was uploaded was last updated"],
              [transcribeRequest.displayLastUpdated(), t("Last Updated"), "Date and time transcript was last updated"],
              [transcribeRequest.displayFileSize(), t("File Size"), "File size in MB"],
              ["status", t("Status")],
              [_.truncate(transcribeRequest.error, {length: 33}), t("Last Error"), `Full error message: ${transcribeRequest.error}`],
            ].map((set, index) => {
              // above is array, 
              // - first item is either a key for the transcribeRequest object or just a string to
              // put there 
              // - second item is label

              let label = set[1]
              const title = set[2] || ""

              // defaults to a key, if not, just display the string
              let value = transcribeRequest[set[0]] || set[0]

              if (!value) {
                return null
              } 
              let additionalClasses

              if (label != "Status") {
                additionalClasses = "desktopOnly"
              }

              return <div key={index} className={`${classes.content} ${additionalClasses ? classes[additionalClasses] : ""}`} title={title}>
                <div className={classes.contentSection}>
                  <span className={classes.cardLabel}>
                    {label}:
                  </span>
                  &nbsp;
                  {value}
                </div>
              </div>
            })}
          </Flexbox>
        </div>

        <div className={classes.nextStepCtn}>
          {transcribeRequest.canRetry() && (
            <Button 
              title={t("Click to try again")} 
              onClick={this.props.requestResume.bind(this, transcribeRequest)}
            >
              {transcribeRequest.displayCanRetryMessage()}
            </Button>
          )}
          {transcribeRequest.transcriptionComplete() && (
            <Link to={transcribeRequest.transcriptUrl()}>
              <Button 
                title={transcribeRequest.displayNextStepMessage()} 
              >
                {transcribeRequest.displayNextStepMessage()}
              </Button>
            </Link>
          )}
          {!transcribeRequest.canRetry() && !transcribeRequest.transcriptionComplete() && (
            <div>
              <hr />
              {transcribeRequest.displayCanRetryMessage()}
            </div>
          )}
        </div>
      </Card>
    )
  }
}

const mapStateToProps = state => {
  return {
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    requestResume: (transcribeRequest) => dispatch({type: RESUME_TRANSCRIBING_REQUEST, payload: transcribeRequest}),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(TranscribeRequestCard)))
