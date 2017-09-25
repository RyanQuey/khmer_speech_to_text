import React from 'react'
import { storiesOf } from '@kadira/storybook'
import DropDown from '.'

storiesOf('DropDown', module)
  .add('default', () => (
    <DropDown
      name="Ryan's Dropdown"
      items={['I\'m not busy', 'I\'m kinda busy', 'I\'m crazy busy']}
    />
  ))
