import { Component } from 'react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'
import { formActions, alertActions } from 'shared/actions'
import { Flexbox, Icon } from 'shared/components/elements'
import classes from './style.scss'
import theme from 'theme'
import { StyleSheet, css } from 'aphrodite'

const defaultMaxSize = 100*1000*1000 // 100 MB ish// TODO what is good max?

class DropAudio extends Component {
  constructor(props) {
    super(props)

    this.state = {
      pending: false,
      
    }
    this.styles = StyleSheet.create({
      dropzone: {
        background: theme.color.white,
        backgroundSize: "cover",
        height: props.height || "100%",
        width: props.width || "100%",
      },
    })
    this.onDrop = this.onDrop.bind(this)
    this.getMaxFileSize = this.getMaxFileSize.bind(this)
  }

  handleError(e, a) {
    console.error(e, a);
  }

  getMaxFileSize() {
    return this.props.maxSizeBytes || this.props.maxSizeMB * 1000 * 1000 || defaultMaxSize
  }

  // setup for sending to google apis
  onDrop (acceptedFiles, rejectedFiles) {
    const acceptedFile = acceptedFiles[0]
    const rejectedFile = rejectedFiles[0]

    const maxSizeBytes = this.getMaxFileSize()

    if (rejectedFile) {
      console.error("rejected file", rejectedFile)
      
      let message
      if (rejectedFile.size > maxSizeBytes) { 
        const maxMB = maxSizeBytes/1000/1000
        const rejectedMB = rejectedFile.size/1000/1000

        message = `Maximum file size is ${maxMB.toFixed(2)} MB, but this file is ${rejectedMB.toFixed(2)} MB`
      } else if (!rejectedFile.type.includes("audio/")) {
        message = "File must be an audio"
      } else {
        message = "Unknown error"
      }

      alertActions.closeAlerts() 
      alertActions.newAlert({
        title: "Failed to upload:",
        message: message,
        level: "DANGER",
      })

    } else {
      this.setState({pending: true})
      this.props.onStart && this.props.onStart(acceptedFile, rejectedFile)

      formActions.uploadAudioFile(acceptedFile, this.props.cb, this.props.onFailure, this.props.onStartUploading)

      //clear url from browser memory to avoid memory leak
      //TODO might not need; disabling preview
      window.URL.revokeObjectURL(acceptedFile.preview)
    }
  }

  onDragOver () {

  }

  render() {
    // NOTE currently mp4 doesn't work. when it does, can do 

    // max file size in bytes for this audio file
    const maxSizeBytes = this.getMaxFileSize()

    return (
      <Flexbox align="center" direction="column" justify="center" className={this.props.className || ""}>
        <Dropzone
          activeClassName={classes.draggingOver}
          disabled={this.state.pending}
          className={`${css(this.styles.dropzone)} ${classes.dropzone}`}
          multiple={false}
          onDrop={this.onDrop}
          style={this.props.style}
          accept="audio/*, video/mp4"
          maxSize={maxSizeBytes} 
          onDragOver={this.onDragOver}
          preventDropOnDocument={true}
        >
          <Flexbox align="center" direction="column">
            <div>{this.props.label}</div>
            {this.state.pending ? <Icon color="black" name="spinner" /> : <Icon color="black" name="file-audio-o" size="2x"/>}
          </Flexbox>
        </Dropzone>
      </Flexbox>
    )
  }
}

DropAudio.propTypes = {
  defaultAudio: PropTypes.string,
  height: PropTypes.string,
  audioUrl: PropTypes.string,
  label: PropTypes.string,
  style: PropTypes.object,
  width: PropTypes.string,
}

export default DropAudio
