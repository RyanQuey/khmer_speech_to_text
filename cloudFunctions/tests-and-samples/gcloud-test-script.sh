#!/bin/sh

# Helpful for testing just to see what should return we send the file.
# I don't think this is returned can result yet though, it might have something to do with sending LINEAR16 instead of flac, though google says they send flac
# to add multiple channels, do this: 
#         "audioChannelCount": 2,
#        "enableSeparateRecognitionPerChannel": true
# see here for docs: https://cloud.google.com/speech-to-text/docs/multi-channel#speech_transcribe_multichannel_gcs-protocol

source_audio_file="/media/sf_shared_with_vm/Sound recordings/With Flexymic and sound adapter (loud background audio).m4a"
# dest_audio_file="base64_audio_file" 

# OPTION #1
# base64 encode the file (whether it's a m4a or flac, need to base64 it)
# by writing/reading files: 
#base64 "$source_audio_file" -w 0 > "$dest_audio_file"
#content=`cat dest_audio_file`

# OPTIONE #2
# by just setting it straight to the var:
# ends up with the base64 ending with vdW5kIGF1ZGlvKQAAAAhYdHJh
content=$( cat "$source_audio_file" | base64)

# OPTION #3
# by sending content of Google's base64 (to test process)
# using this, get: ប្រតិភូកម្ពុជាទៅនឹងខ្ញុំប្រើកុំព្យូទ័រតើម៉េចមិនដែលលើកខ្ញុំមេក្រូហ្វូនបាទ"
#base64_file="/media/sf_shared_with_vm/Sound recordings/google-base64-for-flexymic-audio"
#content=$(cat "$base64_file")

# OPTION #4


# -d @- reads from stdin, which is receiving everything from the echo
# make sure to set to 16000 for m4a, 48000 for flac or wav
json="{
  'config': {
    'encoding': 'LINEAR16',
    'sampleRateHertz': 48000, 
    'languageCode': 'km-KH',
    'enableWordTimeOffsets': false
  },
  'audio': {
    'content': '$content'
  }
}"
echo $json | curl -X POST "https://speech.googleapis.com/v1/speech:recognize"\
     -H "Authorization: Bearer "$(gcloud auth application-default print-access-token) \
     -H "Content-Type: application/json; charset=utf-8" \
     -d @- 

