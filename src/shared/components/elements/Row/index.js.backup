import PropTypes from 'prop-types'
import classes from './style.scss'

const Row = ({ background, children, color, border, onClick, className}) => {
  return (
    <div
      className={`${className} ${classes.row}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

Row.defaultProps = {
  background: 'primary',
  color: 'white',
}

Row.propTypes = {
  background: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  color: PropTypes.string,
  onClick: PropTypes.func,
  border: PropTypes.string,
}

export default Row

