import { Component } from 'react';
import classes from './style.scss'

const Checkbox = ({value, onChange, label}) => {
  let checked = typeof value === 'string' ? value === 'true' : value;

  return (
    <div className={`${classes.checkbox} ${checked ? 'checked' : ''}`} onClick={onChange.bind(this, !checked)}>
      <i className={`fa fa-lg ${checked ? 'fa-check-square-o' : 'fa-square-o'}`} />&nbsp;
      {label && <label>{label}</label>}
    </div>
  );
}

export default Checkbox
