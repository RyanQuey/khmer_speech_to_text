[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/RyanQuey/khmer_speech_to_text)

# Installation Instructions

> Make sure you have node 8.x installed

1. Clone the project
2. Run `npm i`
3. Copy config template to set some env vars: `cp ./src/config/dev/firebase.example.js ./src/config/dev/firebase.js` 
4. Set the firebase api key in that firebase.js file
5. Setup firebase using the firebase CLI (at a minimum will have to do: `firebase use default`)
6. Then run `npm run local`

# Deploying

```sh
npm run deploy
```


# Contribution Guidelines

* Please follow [elemental design patterns](https://github.com/embark-studio/elemental)
* Make sure you have `Node 8.x` installed
* Use an editor that has **eslint** and **editorConfig** installed and adhere to error messages as they arise
* Please send **PRs** rather than push directly to a branch
* Most of our development work will be handled on the `development` branch

# Other notes

* if you are using ssh to access your development environment, run the development environment using `npm run local`, and open up the at in the browser at www.local.dev:3000, to get around Webpack's host check

#TODO:
* upgrade to webpack 3
* make sure that sass files can import from the theme folder
* probably remove the cloud functions, since we stopped using them but never removed the directory


* download new .txt file from https://github.com/languagetool-org/languagetool/blob/master/languagetool-language-modules/km/src/main/resources/org/languagetool/rules/km/coherency.txt
    (make sure to download, don't copy and paste since it might not copy correctly due to data encoding etc)
* remove any comments or whatever from the top (e.g., "#KhmerMultipleSpellings")
* convert to json using `node private/convert-preferred-spellings.js`

