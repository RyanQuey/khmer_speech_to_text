[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/RyanQuey/khmer_speech_to_text)

A Firebase app that connects to a [Django backend](https://github.com/RyanQuey/python-heroku-khmer-speech-to-text) for uploading audio files to transcribe from speech to text, particularly so users can record audio when internet is slow or down and still get transcripts.

## Uploads and Transcription Dashboard
We track and display progress as the file uploads to Google Storage, as it is transcribed to Google Speech API, and as it is returned and stored by Firebase.

![Uploading audio](https://github.com/RyanQuey/python-heroku-khmer-speech-to-text/raw/master/screenshots/uploading-audio-file.png)

## Transcript Results
Transcript includes highlights based on accuracy percentage, and lists possible alternatives on hover. Metadata about the file and the transcription is persisted for future reference.

![Transcript Result](https://github.com/RyanQuey/python-heroku-khmer-speech-to-text/raw/master/screenshots/transcript-result.png)

## Using the Transcript
### Copy To clipboard 
Easily copy to clipboard by clicking on the "Copy Text" button

## Generate Captions for Video
You can also generate an ["srt" file](https://blog.hubspot.com/marketing/srt-file) which can be [uploaded to Youtube directly and edited within Youtube](https://support.google.com/youtube/answer/2734796?hl=en), or uploaded to several other video editing programs, such as [Adobe Premiere](https://www.rev.com/blog/how-to-upload-captions-and-subtitles-in-adobe-premiere-pro-and-amazon-direct), [Filmora](https://www.rev.com/blog/resources/how-to-add-captions-and-subtitles-in-filmora9), [Davinci](https://www.rev.com/blog/how-to-add-captions-and-subtitles-to-davinci-resolve-studio).

Just click the "Generate Captions" button and it will download a file for you. This will split words up whenever this is a space between words, and provide timestamps for each phrase. 

You can also set the maximum words per caption, which will keep a single caption entry from getting too long.

# Installation Instructions

> Make sure you have node 8.x installed

1. Clone the project
2. Make sure you are using the right node version. Can use `nvm use` if you have nvm.
3. Run `npm i`
4. Copy config template to set some env vars: `cp ./src/config/dev/firebase.example.js ./src/config/dev/firebase.js` 
5. Set the firebase api key in that firebase.js file `vim ./src/config/dev/firebase.js`
6. Setup firebase using the firebase CLI (at a minimum will have to do: `firebase use default`)

## Running Locally
6. Then run `npm run local`
7. Make sure to also start the [Python API](https://github.com/RyanQuey/python-heroku-khmer-speech-to-text) locally, or else you can read transcripts, but not do any uploads. 
- Your python api in development is expected to be running at localhost. 

    `"PRODUCTION" ? "https://khmer-speech-to-text-api.herokuapp.com/" : http://${window.location.hostname}:5000`
- To run local frontend against prod backend: in `src/index.js` change to `true || "PRODUCTION" ? "https://khmer-speech-to-text-api.herokuapp.com/" : http://${window.location.hostname}:5000`

### Creating a user
- In order to sign up a user, your email will have to be whitelisted in our firestore db. 
- Or of course you could setup your own firestore db and run the whole thing on your own.

# Deploying

```sh
npm run deploy
```


# Contribution Guidelines
There's a lot of TODOs throughout the project, and we would love to have your help!

* Please follow [elemental design patterns](https://github.com/embark-studio/elemental)
* Make sure you have `Node 8.x` installed. Node 10.x would be in use if we are using cloud functions, but currently we are not (TODO move both to same Node version; upgrade to Node 12)
* Please send **PRs** rather than push directly to a branch
* Most of our development work will be handled on the `development` branch (TODO make a development branch)
* If you have an idea, we recommend that you let us know ahead of time before working on it. PRs for features that have not been preapproved might not get accepted.

# Other notes
## Highlighting based on Accuracy Confidence
Along with the actual transcript, Google Speech API also provides how confident they are about their transcript, given in a percent. Since users will often want to double check their transcript before using it, we have provided highlighting based on this confidence level. The different highlights are from yellow to red. For details on the highlight categories, see the [Word Component](https://github.com/RyanQuey/khmer_speech_to_text/blob/master/src/user/components/groups/Word/index.js#L28). We have also highlighted some of the reformatting we performed, since we recognize that users will probably want to double check the reformatting we performed.

Eventually it would be nice to make this toggleable for users.

We are also persisting accuracy confidence and alternatives on the utterance level, but not currently displaying it. 

## Word Timing
Google Speech API also returns the start and end time for each word. We are persisting this as well, and eventually would like to incorporate this within the UI. 

## Remappings from Google Speech API
Google speech recognition API is incredible, and really we could say that this entire app is a fairly thin wrapper around what they have done. However, there are certain spelling, punctuation, and formatting decisions that they have made which don't fit our use case perfectly. Accordingly, we persist what we received from Google in Firestore DB, we have decided to remap certain words and punctuations according to our preferences.

### Spelling
Spellings have been standardized according to [this list](https://github.com/languagetool-org/languagetool/blob/master/languagetool-language-modules/km/src/main/resources/org/languagetool/rules/km/coherency.txt). For example, we have chosen to spell the Khmer word "to give" as ឲ្យ instead of អោយ, etc. Again, we are persisting whatever spelling we received from Google so that we still have the raw transcript if we want to revert to the original or change things as standards change. (We also store the original on the Word React component, so if you are using React Dev tools you can quickly see the original word returned by Google as well, straight from the browser).

### Punctuation
Google does not currently support Khmer punctuation, and so we have implemented a basic remapping to allow for recognition of certain punctuation marks. Unfortunately, because Google does not support it on its own, these voice commands that we have added do not have a strong level of accuracy. However, they can still be helpful.

The remapping is performed in the [Utterance component](https://github.com/RyanQuey/khmer_speech_to_text/blob/master/src/user/components/partials/Utterance/index.js#L26-L243) which uses our [khmer-helper.js](https://github.com/RyanQuey/khmer_speech_to_text/blob/master/src/helpers/khmer-helpers.js) file. (Note that this code could definitely use some refactoring and cleaning up if someone has the time, both for performance and readability).

Below are listed the latest settings as of 06/2020. Please note though that since this project is still in beta, the README might become out of date and it is best to check the [khmer-helper.js](https://github.com/RyanQuey/khmer_speech_to_text/blob/master/src/helpers/khmer-helpers.js) file.

#### Punctuation to say by prefixing with the word "សញ្ញា"
These punctuations said by prefixing the word "សញ្ញា", i.e., "សញ្ញា​ខ័ណ្ឌ"
* "ខណ្ឌ" or "ខ័ណ្ឌ" (Google returns both):  "។"
* "សួរ":  "?"
* "ឧទាន": "!"

#### Punctuation to say without prefixing the word "សញ្ញា"
* ល៉ៈ ": "។ល។"
* "បើកវង់ក្រចក": "("
* "បិតវង់ក្រចក": ")"
* "ចំណុចពីរគូស": "៖"
* "បើកសញ្ញាអញ្ញប្រកាស" or "បើកសញ្ញាអញ្ញ" or "សញ្ញាអញ្ញបើក":  "«"
  - In order to handle misunderstandings by the Google API, we also recognize "អាច" or "ៗ" in place of "អញ្ញ" in these phrases.
* (the same thing for "បិទ" and "»")

### Formatting
Formatting is implemented by combining and adding tags to words. These tags and the original words (ie, as they were returned by Google) can be seen using React Dev tools from a browser.

#### Spacing
All words are spaced by either a zero width space or, for certain key words and phrases that we have marked out, by a non-breaking space.

#### Numbers
Numbers preceded by the word "លេខ" will be read as a Khmer numeral (i.e., "១", "២", "៣", etc). Numbers NOT preceded by the word "លេខ" will be written out (i.e., "មួយ", "ពីរ", "បី"). 

This number system could itself use a lot of testing and fixes, I would imagine especially for long numbers, punctuation, complex numbers, etc. However, it works well for common use cases.

#### Bible References
Scripture references are reformatted so that they are displayed in a more reader friendly and recognizable way. Saying the words "ពង្សាវតាក្សត្រ​ខ្សែ​ទី​មួយ​ជំពូក​មួយ​ខ​ប្រាំ" is returned as "១ ពង្សាវតាក្សត្រ ១:៥". This can also be separated out, so that if the user does not say a particular chapter or verse (e.g., "ពង្សាវតាក្សត្រ​ខ្សែ​ទី​មួយ") it should be returned with just the book name (e.g., "១ ពង្សាវតាក្សត្") and just saying chapter and verse should also be reformatted (e.g., "ជំពូក​មួយ​ខ​ប្រ" > "១:៥").

We also accomodate for certain mistakes that Google makes, under the assumption that if enough words match, it is probably meant to be a reference. For example, "ខ្សែ​ទាមួយ" is accepted as "ខ្សែ​ទីមួយ" (we accept "ទៀត" in the same way). Sometimes "ទាមួយ" is even returned as a single word. "ចំពោះ" is often returned instead of "ជំពូក", and so we adjusted for that as well. "ខល" is often returned instead of "ខ".

More testing needs to be done with this. For example, books of the Bible where Google returns their name as two words rather than one word will probably not get recognized, but this is something we want to support.

## Filesize limits

- Because we are using Google storage, there is [about a 480 minute limitation on their end](https://cloud.google.com/speech-to-text/quotas#content)
- However, we are setting a default of 50MB limit for files. 
    * This can be overridden by manually adding values in firestore console (customQuotas > audioFileSizeMB). There is currently no UI for changing these values, it has to be done in google firestore console.
    * We set this in backend in file: "transcription/transcribe_class.py" and in frontend in file: "src/user/components/partials/UploadAudioForm/index.js" which reads fields set when retrieving user (see "src/shared/sagas/userSaga.js")

## WAV
Google Speech does support WAV files (see under `Linear16`, 
- So it is possible to get WAV working, but we would have to do more testing to get it working, especially it seems like making the right audio file and right settings (particularly, Sample rate hertz and number of channels. Maybe bit rate). 



#### Technical details about what we might try to fix this: 
Might try dynamically changing settings based on what is in the file (which you can test using `python-heroku-khmer-speech-to-text/scripts/check-audio-file.sh`). Would require downloading the file in the python server and doing some checking and conversion. 

Or might try requiring users to use a certain setting (would have to find a good format for us). 

## Converting FLAC to WAV
This works great from my Sony recorder: 
```
ffmpeg -i 221231_2149.wav -af aformat=s16:44100 out.flac
```

## Converting MP3s to Flac
MP3s might work ok for you as in within this app. However, sometime we found that flac worked better even when converting from mp3 > flac. On the other hand, it is worth noting that sometimes MP3 worked better...or even, sometimes it would be some words are better for flac, some better in mp3. So...it's a toss up. Might not be worth the hassle to convert at all. But if you want to: 

We might have the app do this for you in the future, but it seems like it's more of a hack than a solution - ideally Google just figures out how to do mp3s for us :) In the meantime, here's [a script you can use](https://github.com/RyanQuey/python-heroku-khmer-speech-to-text/blob/master/scripts/convert-mp3-to-flac.sh).


## Duplicate results
Sometimes flac files will return duplicate results. The reason is that if a flac file has 2 channels (i.e., is stereo) then we are making an assumption that this is on purpose, and that each channel is a different speaker (or something along those lines). Accordingly, either change your flac to single channel (mono) or expect to get double the transcript generated. 

Note that this will mean twice the cost on our end for transcription costs from Google. 

This behavior could be changed on our end in the future.

**Side Note**: You can check channels using the following script
```
ffprobe -i ./<filename>.flac  -show_streams -select_streams a:0 | grep channel
```

Output will include something like this, which tells you what it is: 

> channels=2

> channel_layout=stereo

## Punctuation in filesize
Please be reasonable with your punctuation. Don't put `#` signs in your audiofile filenames (e.g., `#fun-tags.flac`). Just take those out before uploading (e.g., to `fun-tags.flac`). 

(TODO add better error handling, currently we just show a spinner indefinitely). 

#### Punctuation Signs that are definitely ok: 
```
-
«
»
៖
_
.
    (i.e., spaces)
  
```
And probably some more. 

#### Punctuation Signs that will break the app currently:

```
#

```
And probably some more. 

## What's going on with `npm run local`?

* if you are using ssh to access your development environment, run the development environment using `npm run local`, and open up the at in the browser at www.local.test:3000, to get around Webpack's host check
* I am always SSHing into my localserver, and don't always want to bother using SSH tunneling, so that's why it's there.

## TODOs:
There's several TODO tags throughout the project. But apart from that:

* upgrade to webpack 3...or at this point, webpack 5
* make sure that sass files can import from the theme folder
* probably remove the cloud functions, since we stopped using them but never removed the directory


* download new .txt file from https://github.com/languagetool-org/languagetool/blob/master/languagetool-language-modules/km/src/main/resources/org/languagetool/rules/km/coherency.txt
    (make sure to download, don't copy and paste since it might not copy correctly due to data encoding etc)
* remove any comments or whatever from the top (e.g., "#KhmerMultipleSpellings")
* convert to json using `node private/convert-preferred-spellings.js`

# Released under MIT License

Copyright (c) 2020 Ryan Quey.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
