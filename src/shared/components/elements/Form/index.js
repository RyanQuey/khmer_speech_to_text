import PropTypes from 'prop-types'
import classes from './style.scss'

const Form = ({ background, children, color, border, onClick, className, formClasses, onSubmit}) => {
  return (
    <form
      className={`${className} ${classes.form} ${formClasses ? formClasses.map((c) => classes[c]) : ""}`}
      onClick={onClick}
      onSubmit={onSubmit}
    >
      {children}
    </form>
  )
}

Form.defaultProps = {
  background: 'primary',
  color: 'white',
}

Form.propTypes = {
  background: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  color: PropTypes.string,
  onClick: PropTypes.func,
  border: PropTypes.string,
}

export default Form

