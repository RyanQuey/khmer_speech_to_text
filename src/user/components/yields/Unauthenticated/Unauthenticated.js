import { Component } from 'react'
import PropTypes from 'prop-types'
import { Flexbox, Navbar } from 'shared/components/elements'
import classes from './Unauthenticated.scss'
import { UserNavbar, UserSidebar, UserContent } from 'user/components/partials'
import { UserLogin } from 'user/components/templates'
import {
  BrowserRouter,
} from 'react-router-dom'

class Unauthenticated extends Component {
  
  render() {
    return (
      <div>
        <BrowserRouter>
          <Flexbox direction="column">
            <UserNavbar />
      
            <Flexbox>
              <UserSidebar />
      
              <UserContent />
            </Flexbox>
          </Flexbox>
        </BrowserRouter>

        <UserLogin />
      </div>
    )
  }
}

Unauthenticated.propTypes = {
}

export default Unauthenticated
