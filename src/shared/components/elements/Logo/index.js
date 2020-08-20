import React from 'react'
//import logo from 'images/khmervoiceapp.png'
import logo from 'images/sbbic-logo-text-high-km.png'
import svglogo from 'images/khmervoice-logo-clear-bkgd.svg'
import classes from './style.scss'

// not getting this working right
const both = false 
const Logo = () => (
  both ? (
    <div className="container">
      <img id="navbar-brand-svg" className={classes.darkBg} alt="logo2" src={svglogo} />
      <img id="navbar-brand" alt="logo" src={logo} />
    </div>
  ) : (
    <img id="navbar-brand" alt="logo" src={logo} />
  )
)

export default Logo
