const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

const ffmpeg_static = require('ffmpeg-static');
  function promisifyCommand (command) {
    return new Promise((resolve, reject) => {
      command.on('end', resolve).on('error', reject).run();
    });
  }


   async function makeItFlac () {
    try {
      console.log("flacify it")
		  
      const tempFilePath = "/media/sf_shared_with_vm/Sound recordings/Bora_audioclip-1585717115000-202780.mp4"
      const targetFilePath = "/media/sf_shared_with_vm/Sound recordings/Bora_audioclip-1585717098000-202780_output.flac"
		  console.log('Audio downloaded locally to', tempFilePath);
		  // Convert the audio to mono channel using FFMPEG.
		  
		  let command = ffmpeg(tempFilePath)
		    .setFfmpegPath(ffmpeg_static)
        .withNoVideo()
        .audioCodec('flac')
		    .output(targetFilePath)
		  
		  await promisifyCommand(command);
      console.log("done")

    } catch (error) {
      // 
      console.error("Error flacifying file: ", error);
      console.log("just try it without flacifying");

    }
  }

makeItFlac()

