import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import info from 'constants/info'
const { supportEmail, instructionVideoEnglishUrl } = info

// the translations
// (tip move them in a JSON file and import them)
// TODO more translations
// TODO move this and all toggling of languages into REDUX
const resources = {
  kh: {
    translation: {
      /////////////////////////////
      // unauthenticated view
      "What is the Khmer Voice App?": "Khmer Voice App ជា​អ្វី?",
			"Brought to you by: The Society for Better Books in Cambodia": "Brought to you by: The Society for Better Books in Cambodia",

      ////////////////////////////
      // navbar
      // this one should be the only one reversed, since English page shows Khmer and vice versa
      "ភាសា​ខ្មែរ" : "English",
      "Support": "សូម​ជំនួយ",
			"Settings": "Settings",
			"Sign Out": "Sign Out",

      /////////////////////
      // home
      "Khmer Voice App": "Khmer Voice App",
			"Instructions": "ការណែនាំ",
			"Ready to get started?": "Ready to get started?",
			"Currently this project is still in beta, which means it is ready to use, but there are still issues to work out. ": "Currently this project is still in beta, which means it is ready to use, but there are still issues to work out. ",
			"We welcome users to help us beta test, as long as you understand that there are still issues to work out, and only use the app a reasonable amount (since there is a cost involved in generating these transcripts).": "We welcome users to help us beta test, as long as you understand that there are still issues to work out, and only use the app a reasonable amount (since there is a cost involved in generating these transcripts).",
			"In order to sign up, contact us at ": "In order to sign up, contact us at ",
			"Let's get started!": "Let's get started!",
			"Questions or comments? Contact us at ": "Questions or comments? Contact us at ",
			"Upload your Khmer audio to start creating a transcript": "Upload your Khmer audio to start creating a transcript",

			
      //////////////////////////
      // Login modal
      "Login": "Login",
			"Don't have an account? Click here to sign up": "Don't have an account? Click here to sign up",
			"Already have an account? Click here to login": "Already have an account? Click here to login",
			"Signup": "Signup",
			"Reset Password": "Reset Password",

      ///////////////////////////
      // sidebar
      "Profile": "Profile",
      "Transcripts": "Transcripts",
      "Unfinished Transcripts": "Unfinished Transcripts",

      ///////////////////////////
      // upload
			"Upload your audio file": "Upload your audio file",
			"Upload your Khmer audio to generate a transcript.": "Upload your Khmer audio to generate a transcript.",
			"Upload an audio file to get started. FLAC files are best. WAV, MP3s and MP4s might work, but there is a good chance they won't, especially MP4s": "Upload an audio file to get started. FLAC files are best. WAV, MP3s and MP4s might work, but there is a good chance they won't, especially MP4s",
			"Best options to use when recording:": "Best options to use when recording:",
			"No noise cancellation": "No noise cancellation",
			"High fidelity": "High fidelity",
			"Drop audio or click to upload": "Drop audio or click to upload",

      ///////////////////////////
      // view transcripts
			"Filename": "Filename",
			"Transcript Created At": "Transcript Created At",
			"File Last Modified": "File Last Modified",
			"File Size": "File Size",
			"View": "View",
			"Transcripts": "Transcripts",

			"Created At:": "Created At:",
			"Size:": "Size:",
			"Copy Text": "Copy Text",
			"Google returned a single word with letters and numbers: ": "Google returned a single word with letters and numbers: ",
			"Confidence Level": "Confidence Level",
      
      ///////////////////////////
      // view transcript requests
			"File Last Modified": "File Last Modified",
			"Last Updated": "Last Updated",
			"File Size": "File Size",
			"Last Error": "Last Error",
			"Status": "Status",
			"Click to try again": "Click to try again",
			"Transcript Request History": "Transcript Request History",

      ///////////////////////////
      // settings
			"Settings": "Settings",
      "Coming soon...": "Coming soon...",
    }
  }
};

i18n
.use(initReactI18next) // passes i18n down to react-i18next
.init({
	resources,
	lng: "en",

	keySeparator: false, // we do not use keys in form messages.welcome

	interpolation: {
		escapeValue: false // react already safes from xss
	}
});



// for exporting to csv
exports.i18nResources = resources

export default i18n;
