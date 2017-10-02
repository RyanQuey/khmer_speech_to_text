import React from 'react'
import { storiesOf } from '@kadira/storybook'
import Select from '.'

storiesOf('Select', module)
  .add('default', () => (
    <Select
      name="Ryan's Dropdown"
      items={['I\'m not busy', 'I\'m kinda busy', 'I\'m crazy busy']}
    />
  ))
