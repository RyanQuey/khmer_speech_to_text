import { Component } from 'react';
import PropTypes from 'prop-types'
import classes from './style.scss'
import { StyleSheet, css } from 'aphrodite'
import { Icon } from 'shared/components/elements'
import theme from 'theme'

const STYLES = {
  primary: {
    regular: {
      background: theme.color.white,
      color: theme.color.black,
      //border: "none",
    },
  },
  inverted: {
    regular: {
      background: theme.color.white,
      color: theme.color.primary,
      //border: `${theme.color.primary} solid 2px`,
    },
  },
  dark: {
    regular: {
      background: theme.color.darkGray,
      color: theme.color.primary,
      //border: `${theme.color.primary} solid 2px`,
    },
  },
}
//takes the style prop and outputs preset popup types
const styles = (style, disabled, selected) => {
  let status = "regular"
  const popupStyle = STYLES[style][status]

  return StyleSheet.create({
    popup: {
      background: popupStyle.background,
      color: popupStyle.color,
      //border-color: popupStyle.borderColor,
    },
  })

}



//use containerClass to define padding etc on container
class Popup extends Component {
  constructor() {
    super()

    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  componentWillReceiveProps(props) {
    if (props.show && !this.props.show) {
      document.addEventListener('mousedown', this.handleClickOutside);
    } else if (!props.show && this.props.show) {
      document.removeEventListener('mousedown', this.handleClickOutside);
    }
  }

  handleClickOutside(e) {
    if (this.refs.wrapperRef && !this.refs.wrapperRef.contains(e.target)) {
      this.props.handleClickOutside(e)
    }
  }

  render () {
    const { show, style, children, onClick, type, className, body, float, side, containerClass } = this.props

    const scrim = (
      <div className={`${classes.scrim}`}>
        <span className={`${css(styles(style).popup)} ${classes.caret}`}/>
      </div>
    )

    if (!show) {
      return null
    }

    // TODO this is obviously broken, not using hte float var at all, and reusing body haha

    return (
      <div
        className={`${classes.popup} ${classes[`float-${body}`]} ${classes[`body-${body}`]} ${classes[`side-${side}`]} ${className}`}
        onClick={onClick}
      >
        {side === "bottom" && scrim}
        <div className={`${css(styles(style).popup)}  ${classes.container} ${containerClass}`} ref="wrapperRef">
          {children}
        </div>
        {side === "top" && scrim}
      </div>
    )
  }
}

Popup.propTypes = {
  onClick: PropTypes.func,
}

Popup.defaultProps = {
  show: false,
  style: "primary",
  body: "left",
  float: "right",
  side: "bottom",
}

export default Popup

