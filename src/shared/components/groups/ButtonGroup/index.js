import PropTypes from 'prop-types'
import classes from './style.scss'
import { StyleSheet, css } from 'aphrodite'
import theme from 'theme'

// default is horizontal
// TODO vertical vs horizontal doesn't actually do anything yet
// children should be buttons
const ButtonGroup = ({ vertical = false, children }) => {

  return (
    <div
      className={`${vertical ? classes.vertical : classes.horizontal} ${classes.buttonGroup}`}
    >
      {children.map((child, index) =>
        <div className={classes.container} key={index}>
          {child}
        </div>
      )}
    </div>
  )
}

ButtonGroup.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
}

export default ButtonGroup

