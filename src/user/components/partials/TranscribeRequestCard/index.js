import { Component } from 'react';
import { connect } from 'react-redux'
import { PROVIDERS } from 'constants/providers'
import { FAKE } from 'constants/actionTypes'
import {
  withRouter,
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
      progressPercentage: props.transcribeRequest.progressPercentage(),
    }

    this.tick = this.tick.bind(this)
  }

  tick () {
    this.setState({progressPercentage: this.props.transcribeRequest.progressPercentage()})
  }

  componentDidMount() {
    console.log("displaying transcribed request:", this.props.transcribeRequest)
    this.intervalID = setInterval(() => {
      this.tick()

      // if there is an error, want to update status to 0 one time, and then stop watching, unless
      // they start new request
      if (this.props.transcribeRequest.hasError()) {
        clearInterval(this.intervalID);
      }
    }, 500);
    
  }

  componentWillUnmount() {
    clearInterval(this.intervalID)
  }

  render () {
    const { transcribeRequest, selected, onClick, className = "request-card", subtitle, small, wrapperClass, smallIcon} = this.props

    const status = transcribeRequest.hasError() ? "error" : "transcribing"

    return (
      <Card selected={selected} onClick={onClick} height={250} maxWidth={450} wrapperClass={wrapperClass} className={`${className} ${classes[status]} ${small ? classes.small : ""}`}>
        <CardHeader className={small ? classes.smallHeader : ""} title={transcribeRequest.filename} subtitle={subtitle || transcribeRequest.contentType} icon={"icon"} iconColor={"blue"}/>

        <Flexbox>
          <Flexbox className={classes.progressCircleContainer}>
            <CircularProgressbar value={this.state.progressPercentage} text={`${String(this.state.progressPercentage).slice(0, 5)}%`} />
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

              return <Flexbox key={index} direction="column" className={classes.content}>
                <div className={classes.contentSection}>
                  <span className={classes.cardLabel}>
                    {label}:
                  </span>
                  &nbsp;
                  {value}
                </div>
              </Flexbox>
            })}
          </Flexbox>
        </Flexbox>

        {transcribeRequest.canRetry() ? (
          <button 
            title={transcribeRequest.displayCanRetryMessage()} 
            onClick={this.props.requestResume.bind(this, transcribeRequest)}
          >
            Resume Transcribing File
          </button>
        ) : (
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
