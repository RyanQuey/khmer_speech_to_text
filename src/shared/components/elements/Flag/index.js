import { StyleSheet, css } from 'aphrodite'
import PropTypes from 'prop-types'
import classes from './style.scss'

const Flag = ({ background, children, color, border, onClick, className, hover = {}}) => {
  const inlineStyles = StyleSheet.create({
    flag: {
      background,
      color,
      //should always have a border, in case is in same btn group as a button with style that has border, and would end up smaller than that btn
      border: border || `${background} 2px solid`,
      ':hover': {
        background: hover.background || "",
      },
    },
  })

  return (
    <span
      className={`${className} ${classes.flag} ${css(inlineStyles.flag)}`}
      onClick={onClick}
    >
      {children}
    </span>
  )
}

Flag.defaultProps = {
  background: 'primary',
  color: 'white',
}

Flag.propTypes = {
  background: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  color: PropTypes.string,
  onClick: PropTypes.func,
  border: PropTypes.string,
}

export default Flag

