import PropTypes from 'prop-types'
import { Link, NavLink, withRouter } from 'react-router-dom'
import { Icon } from 'shared/components/elements'
import classes from './style.scss'

//potentially could combine back with MenuItem....maybe later
//might be better to keep separate in case they become more different
const MenuChild = ({ text, children, link, icon, nav, badge, onClick, hoverType, exact }) => {
  let content = (
    <div>
      {badge && <span className={classes.badge}>{badge}</span>}
      {icon && <Icon name={icon}  className={classes.icon}/>}
      &nbsp;{text}
    </div>
  )

  const clickWrapper = (e) => {
    e && e.stopPropagation()
    onClick && onClick(e)
  }

  return (
    <li className={classes.menuChild} onClick={clickWrapper} >
      {link && nav &&
        <NavLink to={link} exact={exact} activeClassName={`${classes.navActive} ${hoverType ? classes[hoverType] : ""}`}>
          {content}
        </NavLink>
      }
      {link && !nav &&
        <Link to={link} className={`${hoverType ? classes[hoverType] : ""}`}>
          {content}
        </Link>
      }
      {!link &&
        <a className={`${classes.noLink} ${false && selected ? classes.navActive : ""}`} onClick={e => e.preventDefault()}>{content}</a>
      }
      {location.pathname.includes(link) && children}
    </li>
  )

}

MenuChild.propTypes = {
  children: PropTypes.node,
  nav: PropTypes.bool,
}

export default withRouter(MenuChild)
