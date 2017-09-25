import React from 'react'
import { storiesOf } from '@kadira/storybook'
import Heading from '.'
import theme from 'theme'

storiesOf('Heading', module)
  .add('default', () => (
    <Heading level={1}>Heading Level 1</Heading>
  ))
  .add('h1', () => (
    <Heading level={1} color={'primary'}>Hello</Heading>
  ))
  .add('h2', () => (
    <Heading level={2} color={'primary'}>Hello</Heading>
  ))
  .add('h3', () => (
    <Heading level={3} color={'primary'}>Hello</Heading>
  ))
  .add('h4', () => (
    <Heading level={4} color={'primary'}>Hello</Heading>
  ))
  .add('h5', () => (
    <Heading level={5} color={'primary'}>Hello</Heading>
  ))
