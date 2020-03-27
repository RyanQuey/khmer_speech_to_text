import PropTypes from 'prop-types'
import avatar from 'images/avatar.png'
import classes from './Avatar.scss'

const Avatar = ({ onClick, size, src }) => {
  return (
    <img
      alt="avatar"
      className={classes.avatar}
      width={size}
      onClick={onClick}
      src={src}
    />
  )
}

Avatar.defaultProps = {
  src: avatar,
  size: '100px',
}

Avatar.propTypes = {
  onClick: PropTypes.func,
  size: PropTypes.string,
  src: PropTypes.string,
}

export default Avatar

