import { Component } from 'react'
import PropTypes from 'prop-types'
import { 
  withRouter,
  Route,
  Switch,
} from 'react-router-dom'
import { Flexbox } from 'shared/components/elements'
import { DropImage } from 'shared/components/groups'
import { Home, Profile, Search } from 'user/components/templates'
import requireAuthenticated from 'utils/requireAuthenticated'
import forbidAuthenticated from 'utils/forbidAuthenticated'
import { connect } from 'react-redux'
import classes from './style.scss'

// [START speech_quickstart]
// async function main() {
//   // Imports the Google Cloud client library
//   const speech = require('@google-cloud/speech');
//   //const fs = require('fs');
// 
//   // Creates a client
//   const client = new speech.SpeechClient();
// 
//   // The name of the audio file to transcribe
//   const fileName = './resources/audio.raw';
// 
//   // Reads a local audio file and converts it to base64
//   const file = fs.readFileSync(fileName);
//   const audioBytes = file.toString('base64');
// 
//   // The audio file's encoding, sample rate in hertz, and BCP-47 language code
//   const audio = {
//     content: audioBytes,
//   };
//   const config = {
//     encoding: 'LINEAR16',
//     sampleRateHertz: 16000,
//     languageCode: 'en-US',
//   };
//   const request = {
//     audio: audio,
//     config: config,
//   };
// 
//   // Detects speech in the audio file
//   const [response] = await client.recognize(request);
//   const transcription = response.results
//     .map(result => result.alternatives[0].transcript)
//     .join('\n');
//   console.log(`Transcription: ${transcription}`);
// }
//main().catch(console.error);

class UploadAudioForm extends Component {
  render() {
    const modalOpen = this.props.currentModal

    return (
      <div>
        <Flexbox className={classes.rightColumn} direction="column">

          <DropImage 
            circle
            defaultImage="/public/images/profile/defaultBanner.jpg"
            label="Drop cover photo here"
            height="70vh"
            width="100%"
          />

        </Flexbox>
      </div>
    )
  }
}

UploadAudioForm.propTypes = {
  history: PropTypes.object,
}
const mapStateToProps = (state) => {
  return { 
    currentModal: state.viewSettings.currentModal,
  }
}

export default withRouter(connect(mapStateToProps)(UploadAudioForm))

