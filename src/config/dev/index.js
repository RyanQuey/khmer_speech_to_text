'use strict';
import firebase from './firebase';
import baseConfig from '../base';

let config = {
  appEnv: 'dev',  // feel free to remove the appEnv property here
  firebase
};

export default Object.freeze(Object.assign({}, baseConfig, config));