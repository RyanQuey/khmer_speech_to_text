import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { userActions, errorActions } from 'shared/actions'
import { Button, Flexbox, Input } from 'shared/components/elements'
import { SET_CURRENT_TRANSCRIPT } from 'constants/actionTypes'


import classes from './style.scss'

// TODO migrate over to cards, so is more mobile friendly by default and it's still easy to show lots of different kinds of information without being too crowded
class TranscriptPicker extends Component {
  constructor(props) {
    super(props)

    this.viewTranscript = this.viewTranscript.bind(this)
  }

  viewTranscript (transcript, e) {
    this.props.setTranscript(transcript)
    this.props.history.push(Helpers.transcriptUrl(transcript))
  }

  render() {
    const { pickable, transcripts } = this.props

    //TODO: set the title using props into the modal container
    return (
      <table >
        <tbody>
        <tr>
          <th>Filename</th>
          <th>Transcript Created At</th>
          <th>File Last Modified</th>
          <th>File Size</th>
          <th></th>
        </tr>
        {transcripts && Object.keys(transcripts).map((transcriptId) => {
          const transcript = transcripts[transcriptId]
          return (
            <tr key={transcriptId}>
              <td>
                {transcript.filename}
              </td>
              <td>
                {transcript.createdAt.includes("Z") ? 
                  moment.tz(parseInt(transcript.createdAt, "YYYYMMDDHHMMssZ").tz(moment.tz.guess()).format('MMMM Do YYYY, h:mm:ss a'))
                  : moment(transcript.createdAt, "YYYYMMDDHHMMss").format('MMMM Do YYYY, h:mm:ss a')
                }
              </td>
              <td>
                {moment(parseInt(transcript.fileLastModified)).tz(moment.tz.guess()).format(('MMMM Do YYYY, h:mm:ss a'))}
              </td>
              <td>
                {(transcript.fileSize / 1048576).toFixed(2)} MB
              </td>
              <td>
                {pickable && <button onClick={this.viewTranscript.bind(this, transcript)}>View</button>}
              </td>
            </tr>
          )
        })}
        </tbody>
      </table>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setTranscript: (transcript) => dispatch({type: SET_CURRENT_TRANSCRIPT, payload: transcript}),
  }
}

const mapStateToProps = (state) => {
  return {
    //transcripts: state.transcripts,
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TranscriptPicker))
