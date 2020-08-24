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
      "Brought to you by: The Society for Better Books in Cambodia": "នាំ​មក​ជូន​លោក​អ្នក​ដោយ៖ សមាគម​សៀវភៅ​ឈាន​មុខ​នៅ​កម្ពុជា ",

      ////////////////////////////
      // navbar
      // this one should be the only one reversed, since English page shows Khmer and vice versa
      "ភាសា​ខ្មែរ" : "English",
      "Support": "សូម​ជំនួយ",

      /////////////////////
      // home

      "Khmer Voice App": "ការ​ប្ដូរ​សំឡេង​ក្នុង​ភាសា​ខ្មែរ​ទៅ​ជា​អក្សរ",
      "Instructions": "ការណែនាំ",
      "Ready to get started?": "តើ​លោក​អ្នក​ត្រៀម​ខ្លួន​ក្នុង​ការ​ចាប់​ផ្ដើម​ហើយ​ឬ​នៅ?",
      "Currently this project is still in beta, which means it is ready to use, but there are still issues to work out. ": "ឥឡូវ​កម្មវិធី​នេះ​នៅ​ជា​បែតា (beta launch) នៅ​ឡើយ ដែល​មាន​ន័យ​ថា​យើង​អាច​ប្រើ​ប្រាស់​បាន ប៉ុន្តែ​នៅ​មាន​បញ្ហា​ខ្លះៗ​ដែល​យើង​ត្រូវ​ដោះ​ស្រាយ។",
      "We welcome users to help us beta test, as long as you understand that there are still issues to work out, and only use the app a reasonable amount (since there is a cost involved in generating these transcripts).": "យើង​សូម​អញ្ជើញ​អ្នក​ប្រើ​ប្រាស់​ឲ្យ​ជួយ​សាក​ល្បង​បែតា​នេះ​សម្រាប់​យើង ខណៈ​ពេល​ដែល​លោក​អ្នក​យល់​ថា​នៅ​មាន​បញ្ហា​ខ្លះៗ​ដែល​យើង​ត្រូវ​ដោះ​ស្រាយ ហើយ​សូម​មេត្តា​ប្រើ​ប្រាស់​កម្មវិធី​នេះ​ឲ្យ​បាន​សមរម្យ (ដោយ​សារ​យើង​ត្រូវ​បង់​ប្រាក់​ក្នុង​ការ​បង្កើត​ជា​អក្សរ)។",
      "In order to sign up, contact us at ": "ដើម្បី​ចុះ​ឈ្មោះ សូម​មេត្តា​ទាក់​ទង​មក​កាន់​យើង​នៅ",
      "Let's get started!": "តោះ​ចាប់​ផ្ដើម!",
      "Questions or comments? Contact us at ": "មាន​សំណួរ ឬ​ក៏​យោបល់? សូម​មេត្តា​ទាក់​ទង​មក​កាន់​យើង​នៅ",
      "Upload your Khmer audio to start creating a transcript": "សូម​ផ្ទុក​ឡើង​សំឡេង​ជា​ភាសា​ខ្មែរ​របស់​លោក​អ្នក ដើម្បី​ចាប់​ផ្ដើម​បម្លែង​ទៅ​ជាអត្ថ​បទ ",

      //////////////////////////
      // Login modal
      "Login": "ពិនិត្យ​ចូល ",
      "Don't have an account? Click here to sign up": "មិន​មាន​គណនី? សូម​ចុច​ទី​នេះ​ដើម្បី​ចុះ​ឈ្មោះ ",
      "Already have an account? Click here to login": "មាន​គណនី​ហើយ? សូម​ចុច​ទី​នេះ​ដើម្បី​ពិនិត្យ​ចូល ",
      "Signup": "ចុះ​ឈ្មោះ",
      "Reset Password": "កំណត់​ពាក្យ​សម្ងាត់​ឡើង​វិញ",

      ///////////////////////////
      // sidebar
      "Profile": "ប្រវត្តិ​រូប",
      "Transcripts": "អត្ថ​បទ",
      "Unfinished Transcripts": "អត្ថ​បទ​មិន​ទាន់​ហើយ",

      ///////////////////////////
      // upload
      "Upload your audio file": "ផ្ទុក​ឯកសារ​សំឡេង​ឡើង",
      "Upload your Khmer audio to generate a transcript.": "ផ្ទុក​ឯកសារ​ជា​សំឡេង​ក្នុង​ភាសា​ខ្មែរ​ឡើង​ដើម្បី​បង្កើត​ជា​អក្សរ។",
      "Upload an audio file to get started. FLAC files are best. WAV, MP3s and MP4s might work, but there is a good chance they won't, especially MP4s": "ផ្ទុក​ឯកសារ​សំឡេង​ឡើង​ដើម្បី​ចាប់​ផ្ដើម។ ឯកសារ​ដែល​មាន​ទ្រង់​ទ្រាយ​ជា FLAC គឺ​ឯកសារ​ដ៏​ល្អ​បំផុត។ WAV, MP3s និង MP4s អាច​ដំណើរ​ការ​បាន ប៉ុន្តែ​វា​ក៏​អាច​នឹង​មិន​ដែល​បាន​ដែរ ជា​ពិសេស MP4s",
      "Best options to use when recording:": "ជម្រើស​ដ៏​ល្អ​បំផុត​ក្នុង​ការ​ប្រើ​ប្រាស់​ពេល​ថត​សំឡេង៖",
      "No noise cancellation": "កុំ​បិទ​ចោល​សំលេង​រំខាន",
      "High fidelity": "ភាព​ជាក់​លាក់​ដ៏​ខ្ពស់​បំផុត ",
      "Drop audio or click to upload": "ទម្លាក់​សំឡេង ឬ​ក៏​ចុច​ដើម្បី​ផ្ទុក​សំឡេង​ឡើង",

      ///////////////////////////
      // view transcripts
      "Filename": "ឈ្មោះ​ឯកសារ",
      "Transcript Created At": "ឯកសារ​បង្កើត​នៅ",

      ///////////////////////////
      // view transcript requests
      "File Last Modified": "ការ​កែ​ឯកសារ​ចុង​ក្រោយ",
      "File Size": "ទំហំ​ឯកសារ",
      "View": "ចូលមើល",
      "Created At:": "បង្កើត​នៅ៖",
      "Size:": "ទំហំ៖",
      "Copy Text": "ចម្លង​អត្ថ​បទ",
      "Google returned a single word with letters and numbers: ": "Google ផ្ដល់​ជូន​មក​វិញ​នូវ​ពាក្យ​តែ​មួយ​ជា​មួយ​នឹង​អក្សរ និង​លេខ៖",
      "Confidence Level": "រង្វាស់​ទំនុក​ចិត្ត",
      "Last Updated": "កំណែ​ចុង​ក្រោយ",
      "Last Error": "កំហុស​ចុង​ក្រោយ",
      "Status": "ស្ថានភាព",
      "Click to try again": "ចុច​ដើម្បី​ព្យាយាម​ម្ដង​ទៀត",
      "Transcript Request History": "ស្នើ​សុំ​ឯកសារចាស់ៗ",

      
      ///////////////////////////
      // settings
      "Coming soon...": "មក​ដល់​ឆាប់ៗ​នេះ...",
      "Settings": "ការ​កំណត់",
      "Sign Out": "ចាក​ចេញ",
    }
  }
}



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
