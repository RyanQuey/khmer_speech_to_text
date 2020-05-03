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
    }, 300);
    
  }

  componentWillUnmount() {
    clearInterval(this.intervalID)
  }

  render () {
    const { transcribeRequest, selected, onClick, className = classes["request-card"], subtitle, small, wrapperClass, smallIcon} = this.props

    const status = transcribeRequest.hasError() ? "error" : "transcribing"

    return (
      <Card selected={selected} onClick={onClick} wrapperClass={wrapperClass} className={`${className} ${classes[status]} ${small ? classes.small : ""}`}>
        <CardHeader className={small ? classes.smallHeader : ""} title={transcribeRequest.filename} subtitle={subtitle || transcribeRequest.contentType} icon={"icon"} iconColor={"blue"}/>

        <Flexbox>
          <Flexbox className={classes.progressCircleContainer}>
            <CircularProgressbar value={this.state.progressPercentage} text={`${this.state.progressPercentage.toFixed(1)}%`} />
          </Flexbox>

          <Flexbox className={classes.infoContainer} direction="column">
            {[
              [transcribeRequest.displayFileLastModified(), "File Last Modified"],
              [transcribeRequest.displayLastUpdated(), "Last Updated"],
              [transcribeRequest.displayFileSize(), "File Size"],
              ["status", "Status"],
              [_.truncate(transcribeRequest.error, {length: 33}), "Last Error"],
            ].map((set, index) => {
              let label = set[1]
              // defaults to a key, if not, just display the string
              let value = transcribeRequest[set[0]] || set[0]

              if (!value) {
                return null
              } 
              let additionalClasses

              if (label != "Status") {
                additionalClasses = "desktopOnly"
              }

              return <div key={index} className={`${classes.content} ${additionalClasses ? classes[additionalClasses] : ""}`}>
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
        </Flexbox>

        {transcribeRequest.canRetry() && (
          <Button 
            title={"Click to try again"} 
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TranscribeRequestCard))
