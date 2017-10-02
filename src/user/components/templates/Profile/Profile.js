import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setImage } from 'shared/actions'
import { Button, Flexbox, Heading, Icon, Spinner } from 'shared/components/elements'
import { DropImage } from 'shared/components/groups'
import { FirebaseInput } from 'shared/components/partials'
import { Authenticated } from 'shared/components/yields'

import schema from 'constants/schema'
import {
  EMAIL,
  CREATE_WITH_EMAIL,
  PROVIDER,
} from 'constants/signIn'

import {
  FACEBOOK,
  GITHUB,
  GOOGLE,
} from 'constants/providers'
import avatar from 'images/avatar.png'
import banner from 'images/profile/baby.jpg'

import classes from './Profile.scss'

class Profile extends Component {
  constructor() {
    super()

    this.state = {
      activeSocial: FACEBOOK,
    }
  }
  setActiveIcon(e) {
    this.setState({ activeSocial: e.target.id })
  }
  render() {
    const addFieldButton = (
      <Icon
        className="fa fa-plus"
        size="2x"
        color="primary"
        id="addSkillButton"
        name="addSkillButton"
      />
    )
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
              uid={this.props.uid}
              height="70vh"
              width="100%"
            />
          </div>
          <Flexbox className={classes.profileTitle} direction="column" justify="center">
            <Heading align="center" color="white" level={1}>{this.props.displayName}</Heading>
          </Flexbox>
        </div>
        <div className={classes.profileSummaryCtn}>
          <div className={classes.editProfilePictureCtn}>
            <DropImage
              defaultImage={avatar}
              imageURL={this.props.user.avatarURL}
              uid={this.props.uid}
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
          <div className={classes.summaryText}>
            <Flexbox justify="flex-start" flexWrap="wrap">
              <div className={classes.summaryStats}>
              </div>
              <Button className="chatButton" disabled={true}>Open Chat</Button>
              <Flexbox justify="flex-start" className={classes.socialLinks} >
                <span className="fa-stack fa-lg">
                  <Icon
                    border={this.state.activeSocial === FACEBOOK}
                    className="fa-stack-2x"
                    color="primary"
                    name="circle"
                  />
                  <Icon
                    className="fa-stack-1x"
                    color="white"
                    id={FACEBOOK}
                    name={FACEBOOK}
                    onClick={e => this.setActiveIcon(e)}
                  />
                </span>
                <span className="fa-stack fa-lg">
                  <Icon
                    border={this.state.activeSocial === LINKEDIN}
                    className="fa-stack-2x"
                    color="primary"
                    name="circle"
                  />
                  <Icon
                    className="fa-stack-1x"
                    color="white"
                    id={LINKEDIN}
                    name={LINKEDIN}
                    onClick={e => this.setActiveIcon(e)}
                  />
                </span>
                <span className="fa-stack fa-lg">
                  <Icon
                    border={this.state.activeSocial === TWITTER}
                    className="fa-stack-2x"
                    color="primary"
                    name="circle"
                  />
                  <Icon
                    className="fa-stack-1x"
                    color="white"
                    id={TWITTER}
                    name={TWITTER}
                    onClick={e => this.setActiveIcon(e)}
                  />
                </span>
                <FirebaseInput
                  color="primary"
                  name={`${this.state.activeSocial.toLowerCase()}URL`}
                  placeholder={`Add a ${this.state.activeSocial} Account`}
                  type="text"
                />
              </Flexbox>
            </Flexbox>
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
