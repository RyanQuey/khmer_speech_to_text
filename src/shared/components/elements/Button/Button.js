import React from 'react'
import PropTypes from 'prop-types'
import classes from './Button.scss'
import { StyleSheet, css } from 'aphrodite'
import theme from 'theme'

const Button = ({ background, children, color, border, onClick, hover, disabled }) => {
  const bg = (disabled && background == 'primary') ? 'white' : background
  const clr = (disabled && color == 'white') ? 'accent1' : color
  const bdr = (disabled && !border) ? `${theme.color.accent1} 1px solid` : border || 'none'

  const styles = StyleSheet.create({
    button: {
      background: theme.color[bg],
      color: theme.color[clr],
      border: bdr,
      ':hover': {
        background: theme.color[hover],
      },
    },
  })
  return (
    <button
      className={`${css(styles.button)} ${classes.button}`}
      onClick={onClick}
      disabled={(disabled || disabled == 'disabled') ? 'disabled' : false}
    >
      {children}
    </button>
  )
}

Button.defaultProps = {
  background: 'primary',
  color: 'white',
}

Button.propTypes = {
  background: PropTypes.string,
  children: PropTypes.string.isRequired,
  color: PropTypes.string,
  onClick: PropTypes.func,
  hover: PropTypes.string,
  disabled: PropTypes.bool,
  border: PropTypes.string,
}

export default Button

