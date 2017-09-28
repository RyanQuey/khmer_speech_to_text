import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Flexbox, Input, Heading, Button } from 'shared/components/elements'
import { FirebaseInput } from 'shared/components/partials'
import { Unauthenticated } from 'shared/components/yields'
import schema from 'constants/schema'
import classes from './SetDisplayName.scss'

export default class SetDisplayName extends Component {
  render() {
    return (
      <SignUpTemplate>
        <Flexbox className={classes.fields} direction="column" justify="flex-start" align="center">
          <Heading level={1} color="primary">Welcome</Heading>
          <div className={classes.form}>
            <Heading level={4}>Please set your display Name:</Heading>
            <FirebaseInput
              color="primary"
              name={schema.user.DISPLAY_NAME.column_name}
              placeholder="Name as it will display on your profile"
              type="text"
            />

          </div>
        </Flexbox>
      </SignUpTemplate>
    )
  }
}
