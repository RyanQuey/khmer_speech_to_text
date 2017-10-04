import React from 'react'
import { storiesOf } from '@kadira/storybook'
import Heading from '.'
import theme from 'theme'

storiesOf('Heading', module)
  .add('default', () => (
    <h1>Heading Level 1</h1>
  ))
  .add('h1', () => (
    <h1 color={'primary'}>Hello</h1>
  ))
  .add('h2', () => (
    <h2 color={'primary'}>Hello</h2>
  ))
  .add('h3', () => (
    <h3 color={'primary'}>Hello</h3>
  ))
  .add('h4', () => (
    <h4 color={'primary'}>Hello</h4>
  ))
  .add('h5', () => (
    <h5 color={'primary'}>Hello</h5>
  ))
