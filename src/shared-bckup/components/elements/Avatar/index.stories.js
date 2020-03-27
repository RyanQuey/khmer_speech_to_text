import React from 'react'
import { storiesOf } from '@kadira/storybook'
import Avatar from '.'
import avatar from 'images/yeoman.png'

storiesOf('Avatar', module)
  .add('default', () => (
    <Avatar />
  ))
  .add('user ', () => (
    <Avatar src={avatar} />
  ))
