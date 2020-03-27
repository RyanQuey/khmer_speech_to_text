import PropTypes from 'prop-types'
import { Link, NavLink, withRouter, Switch, Route } from 'react-router-dom'
import { Icon } from 'shared/components/elements'
import classes from './style.scss'

//hoverType:
//  noHover turns off changes on hover altogether
//  textOnly only changes the font color on hover
const MenuItem = ({ text, children, icon, link, nav, onClick, location, badge, hoverType, exact = false, selected }) => {
  let content = (
    <div>
      {badge && <span className={classes.badge}>{badge}</span>}
      {icon && <Icon name={icon} className={classes.icon} />}
      {text}
    </div>
  )

  return (
    <li className={`${classes.menuItem} `} onClick={onClick}>
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
        <a href="#" className={`${classes.noLink} ${false && selected ? classes.navActive : ""}`} onClick={e => e.preventDefault()}>{content}</a>
      }
      {(location.pathname.includes(link) || selected) && children}
    </li>
  )
}

MenuItem.propTypes = {
  children: PropTypes.node,
  nav: PropTypes.bool,
}

export default withRouter(MenuItem)
