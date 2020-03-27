import { Component } from 'react'
import PropTypes from 'prop-types'
import firebase from 'refire/firebase'
import Dropzone from 'react-dropzone'
import { setImage } from 'shared/actions'
import { Flexbox, Icon } from 'shared/components/elements'
import { StyleSheet, css } from 'aphrodite'
import classes from './DropImage.scss'

class DropImage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      pending: false,
    }
    this.styles = StyleSheet.create({
      dropzone: {
        backgroundImage: `url(${props.imageURL || props.defaultImage})`,
        height: props.height,
        width: props.width,
      },
    })

    this.onDrop = this.onDrop.bind(this)
  }

  onDrop (acceptedFiles, rejectedFiles) {
    console.log('acceptedFiles', acceptedFiles)
    console.log('rejectedFiles', rejectedFiles)
    const file = acceptedFiles[0]

    setImage(this.props.imageName, this.props.path, file, )
  }  

  render() {
    return (
      <Flexbox align="center" direction="column" justify="center" >
        <Dropzone
          className={`${css(this.styles.dropzone)} ${classes.dropzone}`}
          multiple={false}
          onDrop={this.onDrop}
          style={this.props.style}
        >
          <Flexbox align="center" direction="column">
            <div>{this.props.label}</div>
            <Icon color="black" name="picture-o" />
          </Flexbox>
        </Dropzone>
      </Flexbox>
    )
  }
}

DropImage.propTypes = {
  defaultImage: PropTypes.string.isRequired,
  height: PropTypes.string,
  imageURL: PropTypes.string,
  label: PropTypes.string.isRequired,
  imageName: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  style: PropTypes.object,
  width: PropTypes.string,
}

export default DropImage
