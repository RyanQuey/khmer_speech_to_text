import React from 'react'
import PropTypes from 'prop-types'
import theme from 'theme'

const Heading = ({ align, className, color, children, display, level }) => {
  const Header = `h${level}`

  return (
    <Header
      className={className}
      style={{ color: theme.color[color], display, textAlign: align }}
    >
      {children}
    </Header>
  )
}

Heading.propTypes = {
  align: PropTypes.string,
  className: PropTypes.string,
  color: PropTypes.string,
  children: PropTypes.node,
  display: PropTypes.string,
  level: PropTypes.number.isRequired,
}

Heading.defaultProps = {
  color: 'black',
}

export default Heading
