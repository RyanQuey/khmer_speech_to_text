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

class TranscribeRequestCard extends Component {
  constructor() {
    super()

  }

  render () {
    const { transcribeRequest, selected, onClick, height, maxWidth, className, subtitle, small, wrapperClass, smallIcon} = this.props
    if (!transcribeRequest) {return null} //shouldn't happen, but whatever

    console.log(transcribeRequest)

    return (
      <Card selected={selected} onClick={onClick} height={height} maxWidth={maxWidth} wrapperClass={wrapperClass} className={`${className} ${classes[status]} ${small ? classes.small : ""}`}>
        <CardHeader className={small ? classes.smallHeader : ""} title={transcribeRequest.filename} subtitle={subtitle || transcribeRequest.contentType} icon={"icon"} iconColor={"blue"}/>

        File Last Modified: {transcribeRequest.displayFileLastModified()}
        <br />
        File Size:        {transcribeRequest.displayFileSize()}
        <br />

        {[
          ["status", "Status"],
          // not yet implemented
          ["currentError", "Last Error"],
          [transcribeRequest.displayLastUpdated(), "Last Updated", {customValue: true}],
        ].map((set, index) => {
          let stringKey = typeof set[0] == "string" && (!set[2] || !set[2].customValue)
          let label = set[1]
          let value = stringKey ? transcribeRequest[set[0]] : set[0]

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
        {transcribeRequest.requestable() && <button onClick={this.props.requestResume.bind(this, transcribeRequest)}>Resume Transcribing File</button>}
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
