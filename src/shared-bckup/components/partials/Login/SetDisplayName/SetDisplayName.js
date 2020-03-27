import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Flexbox, Input, Button } from 'shared/components/elements'
import { FirebaseInput } from 'shared/components/partials'
import { Unauthenticated } from 'shared/components/yields'
import schema from 'constants/schema'
import classes from './SetDisplayName.scss'

export default class SetDisplayName extends Component {
  render() {
    return (
      <SignUpTemplate>
        <Flexbox className={classes.fields} direction="column" justify="flex-start" align="center">
          <h1 color="primary">Welcome</h1>
          <div className={classes.form}>
            <h4>Please set your display Name:</h4>
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
