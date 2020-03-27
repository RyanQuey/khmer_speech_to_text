import classes from './style.scss'

export default ({children, className}) => {
  return (
    <div className={[classes.modalBody, className || ""].join(" ")} key="modalBody">
      {children}
    </div>
  )
}
