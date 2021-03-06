import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Flexbox, Icon, Spinner } from 'shared/components/elements'
import { DropImage } from 'shared/components/groups'
import { FirebaseInput } from 'shared/components/partials'
import { withRouter } from 'react-router-dom'

import schema from 'constants/schema'
import avatar from 'images/avatar.png'
import banner from 'images/profile/baby.jpg'

import classes from './style.scss'

class Profile extends Component {
  constructor() {
    super()

    this.state = {
    }
  }
  render() {
    return (
      <Flexbox direction="column">
        <div className={classes.profileBannerCtn}>
          <div className={classes.editProfileBannerCtn}>
            <DropImage
              defaultImage={banner}
              imageURL={this.props.user.bannerURL}
              imageName="bannerURL"
              label="Drop cover photo here"
              className={classes.editBannerPicture}
              path={`users/${this.props.user.uid}`}
              height="70vh"
              width="100%"
            />
          </div>
          <Flexbox className={classes.profileTitle} direction="column" justify="center">
            <h1>{this.props.displayName}</h1>
          </Flexbox>
        </div>
        <div className={classes.profileSummaryCtn}>
          <div className={classes.editProfilePictureCtn}>
            <DropImage
              defaultImage={avatar}
              imageURL={this.props.user.avatarURL}
              path={`users/${this.props.user.uid}`}
              imageName="avatarURL"
              label="Drop profile photo here"
              style={{
                borderRadius: '50%',
                color: 'white',
              }}
              height="250px"
              width="250px"
            />
          </div>
        </div>
      </Flexbox>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps)(Profile)
