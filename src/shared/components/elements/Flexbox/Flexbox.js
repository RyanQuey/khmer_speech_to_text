import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, css } from 'aphrodite'
import theme from 'theme'

const Flexbox = ({ align, background, className, direction, justify, flexWrap, children, name }) => {
  const styles = StyleSheet.create({
    flex: {
      backgroundColor: theme.color[background],
      display: 'flex',
      flexDirection: direction,
      justifyContent: justify,
      alignItems: align,
      flexWrap: flexWrap,
    },
  })
  return (
    <div id={name} name={name} className={`${css(styles.flex)} ${className || ''}`}>{children}</div>
  )
}

Flexbox.defaultProps = {
  background: 'transparent',
  direction: 'row',
  flexWrap: 'nowrap',
}

Flexbox.propTypes = {
  align: PropTypes.string,
  background: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  direction: PropTypes.string,
  justify: PropTypes.string,
  flexWrap: PropTypes.string,
  name: PropTypes.string,
}

export default Flexbox

