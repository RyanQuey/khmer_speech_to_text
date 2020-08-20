import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import info from 'constants/info'
const { supportEmail, instructionVideoEnglishUrl } = info

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  kh: {
    translation: {
      "What is the Khmer Voice App?": "Khmer Voice App ជា​អ្វី?",
      // this one should be the only one reversed, since English page shows Khmer and vice versa
      "ភាសា​ខ្មែរ" : "English",
      "Support": "សូម​ជំនួយ",
      "Khmer Voice App": "Khmer Voice App",

			// TODO
      "Login": "Login",
			"Ready to get started?": "Ready to get started?",
			"Currently this project is still in beta, which means it is ready to use, but there are still issues to work out. ": "Currently this project is still in beta, which means it is ready to use, but there are still issues to work out. ",
			"We welcome users to help us beta test, as long as you understand that there are still issues to work out, and only use the app a reasonable amount (since there is a cost involved in generating these transcripts).": "We welcome users to help us beta test, as long as you understand that there are still issues to work out, and only use the app a reasonable amount (since there is a cost involved in generating these transcripts).",
			"In order to sign up, contact us at ": "In order to sign up, contact us at ",
			"Brought to you by: The Society for Better Books in Cambodia": "Brought to you by: The Society for Better Books in Cambodia",
			"Instructions": "ការណែនាំ",
			"Let's get started!": "Let's get started!",
			"Upload your Khmer audio to start creating a transcript": "Upload your Khmer audio to start creating a transcript",
			"Questions or comments? Contact us at ": "Questions or comments? Contact us at ",
			"Don't have an account? Click here to sign up": "Don't have an account? Click here to sign up",
			"Already have an account? Click here to login": "Already have an account? Click here to login",
			"Signup": "Signup",
			"Login": "Login",
			"Reset Password": "Reset Password",
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

export default i18n;
