import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Logo, Button, Flexbox } from 'shared/components/elements'
import theme from 'theme'
import classes from './LandingPage.scss'

export default class LandingPage extends Component {
  render() {
    return (
      <div className={classes.landingPageCtn}>
        <div className={classes.headerCtn}>
          <div className={classes.headerContentCtn}>
            <Logo />
          </div>
        </div>

        <main>
          <div className={classes.middleCtn}>
            <Flexbox flexWrap="wrap" justify="center" align="center" className={`${classes.aboutCtn} ${classes.layerCtn}`}>
              <h1>Main Header</h1>

              <div className={classes.leftCtn}>
                <div className='text-ctn'>
                  <h2>Header</h2>
                  <h5>Text</h5>
                </div>
              </div>
            </Flexbox>
          </div>

          <div className={classes.bottomCtn}>
            <Flexbox flexWrap="wrap" justify="flex-start" align="center" className={classes.layerCtn}>
              <p className={classes.bottomText}>
                Footer text&nbsp;
              </p>
              <Link to="/signup/create-account"><Button background="white" color="primary">Setup profile</Button></Link>
            </Flexbox>
          </div>
        </main>
      </div>
    )
  }
}
