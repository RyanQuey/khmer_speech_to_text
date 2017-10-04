import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setImage } from 'shared/actions'
import { Button, Flexbox, Icon, Spinner } from 'shared/components/elements'
import { DropImage } from 'shared/components/groups'
import { FirebaseInput } from 'shared/components/partials'
import { Authenticated } from 'shared/components/yields'

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
              setImage={this.props.setImage}
              imageName="bannerURL"
              label="Drop cover photo here"
              className={classes.editBannerPicture}
              path={`users/${this.props.uid}`}
              uid={this.props.uid}
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
              path={`users/${this.props.uid}`}
              imageName="avatarURL"
              setImage={this.props.setImage}
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
    user: state.shared.user,
  }
}

export default connect(mapStateToProps, { setImage })(Profile)
