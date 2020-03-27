import React, { Component } from 'react'
import theme from 'theme'
import PropTypes from 'prop-types'
import classes from './Input.scss'

// validations for react-validation
const rules = {
  required: {
    test: (value) => {
      return (value.toString().trim().length > 0)
    },
    hint: () => {
      return 'Required'
    },
  },
  email: {
    test: (value) => {
      const base = value.toString().trim()
      const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

      return re.test(base)
    },
    hint: () => {
      return 'Please check email format'
    },
  },
  newPassword: {
    test: (value) => {
      const base = value.toString().trim()

      return (base.length > 7)
    },
    hint: () => {
      return 'Password needs to be 8 characters or longer'
    },
  },
}

class Input extends Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.state = {
      errors: [],
    }
  }

  handleChange(e) {
    const errors = this.validate(e)
    this.props.onChange(e, errors, this.props.index)
  }

  validate(e) {
    const errors = []
    if (this.props.validations) {
      this.props.validations.forEach((v) => {
        // if current value doesn't pass validation
        if (!rules[v].test(e.target.value)) {
          errors.push(v)
        }
      })
      this.setState({ errors })
    }
    return errors
  }

  render() {
    const label = this.props.label ? (<label htmlFor={this.props.name}>{this.props.label}</label>) : null

    return (
      <div className={this.props.className}>
        {!this.props.labelAfter && label}
        <input
          className={
            `input-${this.props.type}
            ${this.props.className || ''}
            ${classes.input}
            ${(this.state.errors.length > 0) && classes.formError}`
          }
          name={this.props.name}
          onBlur={this.props.onBlur}
          onChange={this.handleChange}
          placeholder={this.props.placeholder}
          style={{ border: (
            (this.props.color && this.state.errors.length === 0) && `2px solid ${theme.color[this.props.color]}`
          ) }}
          type={this.props.type}
          value={this.props.value}
        />
        {this.props.labelAfter && label}
        <div className={classes.errorMessages}>
          {this.state.errors.map((err) => { return rules[err].hint(this.props.name) }).join('; ')}
        </div>
      </div>
    )
  }
}

Input.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  name: PropTypes.string,
  validations: PropTypes.array,
  overrideValidation: PropTypes.bool,
  type: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  checked: PropTypes.bool,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  labelAfter: PropTypes.bool,
  color: PropTypes.string,
  hint: PropTypes.string,
  index: PropTypes.number,
}

export default Input
