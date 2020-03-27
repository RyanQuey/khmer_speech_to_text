import React from 'react'
import { storiesOf } from '@kadira/storybook'
import Flexbox from '.'

storiesOf('Flexbox', module)
  .add('default row', () => (
    <Flexbox>
      <h1>hello</h1>
      <h2>there</h2>
    </Flexbox>
  ))
  .add('column', () => (
    <Flexbox direction="column">
      <h1>hello</h1>
      <h2>there</h2>
    </Flexbox>
  ))
