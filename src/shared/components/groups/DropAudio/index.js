import { Component } from 'react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'
import { formActions, alertActions } from 'shared/actions'
import { Flexbox, Icon } from 'shared/components/elements'
import classes from './style.scss'
import theme from 'theme'
import { StyleSheet, css } from 'aphrodite'

class DropAudio extends Component {
  constructor(props) {
    super(props)

    this.state = {
      pending: false,
      maxSize: 100*1000*1000, // 10 MB ish// TODO what is good max?
    }
    this.styles = StyleSheet.create({
      dropzone: {
        background: (props.audioUrl || props.defaultAudio) ? `url(${encodeURI(props.audioUrl) || props.defaultAudio}) no-repeat center center` : this.props.backgroundColor || theme.color.white,
        backgroundSize: "cover",
        height: props.height || "100%",
        width: props.width || "100%",
      },
    })
    this.onDrop = this.onDrop.bind(this)
  }

  handleError(e, a) {
    console.error(e, a);
  }

  // setup for sending to google apis
  onDrop (acceptedFiles, rejectedFiles) {
    const acceptedFile = acceptedFiles[0]
    const rejectedFile = rejectedFiles[0]

    if (rejectedFile) {
      console.error("rejected file", rejectedFile)
      
      let message
      if (rejectedFile.size > this.state.maxSize) { 
        message = "Maximum file size is 100MB"
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

      formActions.uploadAudioFile(acceptedFile, this.props.cb, this.props.onFailure)

      //clear url from browser memory to avoid memory leak
      //TODO might not need; disabling preview
      window.URL.revokeObjectURL(acceptedFile.preview)
    }
  }

  onDragOver () {

  }

  render() {
    // NOTE currently mp4 doesn't work. when it does, can do 
    // 
    return (
      <Flexbox align="center" direction="column" justify="center" className={this.props.className || ""}>
        <Dropzone
          activeClassName={classes.draggingOver}
          disabled={this.state.pending}
          disablePreview={true}
          className={`${css(this.styles.dropzone)} ${classes.dropzone}`}
          multiple={false}
          onDrop={this.onDrop}
          style={this.props.style}
          accept="audio/*, video/mp4"
          maxSize={this.state.maxSize} 
          onDragOver={this.onDragOver}
          preventDropOnDocument={true}
        >
          <Flexbox align="center" direction="column">
            <div>{this.props.label}</div>
            {this.state.pending ? <Icon color="black" name="spinner" /> : <Icon color="black" name="picture-o" />}
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
