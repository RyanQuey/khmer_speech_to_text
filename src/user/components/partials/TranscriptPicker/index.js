import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { userActions, errorActions } from 'shared/actions'
import { Button, Flexbox, Input } from 'shared/components/elements'
import { SET_CURRENT_TRANSCRIPT } from 'constants/actionTypes'
import Transcript from 'models/Transcript'
import classes from './style.scss'
import { withTranslation } from "react-i18next";

// TODO migrate over to cards, so is more mobile friendly by default and it's still easy to show lots of different kinds of information without being too crowded
class TranscriptPicker extends Component {
  constructor(props) {
    super(props)

    this.viewTranscript = this.viewTranscript.bind(this)
  }

  viewTranscript (transcript, e) {
    this.props.setTranscript(transcript)
    this.props.history.push(transcript.showViewUrl())
  }

  render() {
    const { pickable, transcripts, summaryOnly, t } = this.props

    //TODO: set the title using props into the modal container
    return (
      <table >
        <tbody>
        <tr>
          {!summaryOnly && <th>{t("Filename")}</th>}
          <th className={classes.desktopOnly}>{t("Transcript Created At")}</th>
          {!summaryOnly && <th className={classes.desktopOnly}>{t("File Last Modified")}</th>}
          {!summaryOnly && <th className={classes.desktopOnly}>{t("File Size")}</th>}
          <th></th>
        </tr>
        {transcripts.map((transcript, index) => {
          return (
            <tr key={index}>
              {!summaryOnly && <td>
                {transcript.filename}
              </td>}
              <td className={classes.desktopOnly}>
                {transcript.displayCreatedAt()}
              </td>
              {!summaryOnly && <td className={classes.desktopOnly}>
                {transcript.displayFileLastModified()}
              </td>}
              {!summaryOnly && <td className={classes.desktopOnly}>
                {transcript.displayFileSize()}
              </td>}
              <td>
                {pickable && <button onClick={this.viewTranscript.bind(this, transcript)}>{t("View")}</button>}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(TranscriptPicker)))
