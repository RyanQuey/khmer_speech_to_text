export default ({children, className}) => {
  return (
   <div className={["modal-footer", className || ""].join(" ")}>
     {children}
   </div>
  )
}
