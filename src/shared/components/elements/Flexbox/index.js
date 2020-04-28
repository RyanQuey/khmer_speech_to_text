import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, css } from 'aphrodite'
import theme from 'theme'

const Flexbox = ({ align, background, className, direction, justify, flexWrap, wrap, children, name, color, onClick }) => {
  const styles = StyleSheet.create({
    flex: {
      backgroundColor: theme.color[background] || background,
      display: 'flex',
      flexDirection: direction,
      justifyContent: justify,
      alignItems: align,
      flexWrap: flexWrap || wrap,
      color: theme.color[color] || color,
    },
  })
  return (
    <div id={name} name={name} className={`${css(styles.flex)} ${className || ''}`} onClick={onClick}>{children}</div>
  )
}

Flexbox.defaultProps = {
  direction: 'row',
  wrap: 'nowrap',
}

Flexbox.propTypes = {
  align: PropTypes.string,
  background: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  direction: PropTypes.string,
  justify: PropTypes.string,
  flexWrap: PropTypes.string,
  name: PropTypes.string,
}

export default Flexbox

