[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/RyanQuey/khmer_speech_to_text)

# Installation Instructions

> Make sure you have node 8.x installed

1. Clone the project
2. Run `npm i`
3. Then run `npm run local`

That's it! Now go party on `localhost:3000` !

For running cloud server locally as well, do `firebase serve --only functions --host 0.0.0.0`


![](https://media.giphy.com/media/fsULJFFGv8X3G/giphy.gif)

# Contribution Guidelines

* Please follow [elemental design patterns](https://github.com/embark-studio/elemental)
* Make sure you have `Node 8.x` installed
* Use an editor that has **eslint** and **editorConfig** installed and adhere to error messages as they arise
* Please send **PRs** rather than push directly to a branch
* Most of our development work will be handled on the `development` branch

# Using the boilerplate

* This is set up for when there is a user section and a separate admin section.
* Replace "userResource" and "adminResource" with actual resources, in initializers and reducers
* Admin initializers will only run in the admin view, end-user initializers will only run in the user view
* refire is for keeping the redux store up-to-date when the database makes a change. Set up listeners in refire which will then call actions (ask Carson for details)
* if you are using ssh to access your development environment, run the development environment using `npm run local`, and open up the at in the browser at www.local.dev:3000, to get around Webpack's host check

#TODO:
* upgrade to webpack 3
* make sure that sass files can import from the theme folder

# If need to update the preferred spellings doc: 
  * download new .txt file from https://github.com/languagetool-org/languagetool/blob/master/languagetool-language-modules/km/src/main/resources/org/languagetool/rules/km/coherency.txt
      (make sure to download, don't copy and paste since it might not copy correctly due to data encoding etc)
  * remove any comments or whatever from the top (e.g., "#KhmerMultipleSpellings")
  * convert to json using `node private/convert-preferred-spellings.js`

