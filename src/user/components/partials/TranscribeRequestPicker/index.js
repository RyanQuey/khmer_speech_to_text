import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { userActions, errorActions } from 'shared/actions'
import { Button, Flexbox, Input } from 'shared/components/elements'
import { SET_CURRENT_TRANSCRIPT } from 'constants/actionTypes'
import TranscribeRequest from 'models/TranscribeRequest'
import classes from './style.scss'

// TODO migrate over to cards, so is more mobile friendly by default and it's still easy to show lots of different kinds of information without being too crowded
// u
class TranscribeRequestPicker extends Component {
  constructor(props) {
    super(props)

    this.requestTranscription = this.requestTranscription.bind(this)
  }

  // requests server to try transcribing again
  requestTranscription (transcribeRequest, e) {
  //   this.props.setUntranscribedUpload(transcribeRequest)
  //   this.props.history.push(transcribeRequest.showViewUrl())
  }

  render() {
    const { pickable, transcribeRequests } = this.props

    //TODO: set the title using props into the modal container
    return (
      <table >
        <tbody>
        <tr>
          <th>Filename</th>
          <th>Status</th>
          <th>File Last Modified</th>
          <th>File Size</th>
          <th></th>
        </tr>
        {transcribeRequests.map((transcribeRequest, i) => {
          return (
            <tr key={i}>
              <td>
                {transcribeRequest.filename}
              </td>
              <td>
                {transcribeRequest.status}
              </td>
              <td>
                {transcribeRequest.displayFileLastModified()}
              </td>
              <td>
                {transcribeRequest.displayFileSize()}
              </td>
              <td>
                {pickable && <button onClick={this.requestTranscription.bind(this, transcribeRequest)}>View</button>}
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
    //setUntranscribedUpload: (transcribeRequest) => dispatch({type: SET_CURRENT_TRANSCRIPT, payload: transcribeRequest}),
  }
}

const mapStateToProps = (state) => {
  return {
    // transcribeRequests: state.transcribeRequests,
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TranscribeRequestPicker))
