import PropTypes from 'prop-types'
import classes from './style.scss'
import { StyleSheet, css } from 'aphrodite'
import { Icon } from 'shared/components/elements'
import theme from 'theme'

const CardHeader = ({
  className,
  headerImgUrl,
  title,
  subtitle,
  icon,
  iconColor,
}) => {
  const headerLine = title || subtitle
  const styles = StyleSheet.create({
    card: {
      'border-bottom': headerLine ? `1px solid ${theme.color.moduleGrayOne}` : "",
      'padding-bottom': headerLine ? "20px" : "",
    },
  })
  return (
    <div
      className={`${className} ${classes.cardHeader} ${css(styles.card)}`}
    >
      {headerImgUrl && <img className={classes.headerImg} src={headerImgUrl} />}
      {icon && <Icon className={classes.icon} name={icon} size="3x" color={iconColor} />}
      <h2>{title}</h2>
      <h5 className={classes.subtitle}>{subtitle}</h5>
    </div>
  )
}

export default CardHeader

