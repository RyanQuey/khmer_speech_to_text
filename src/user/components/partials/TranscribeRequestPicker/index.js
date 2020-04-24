import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { userActions, errorActions } from 'shared/actions'
import { Button, Flexbox, Input } from 'shared/components/elements'
import { TranscribeRequestCard } from 'user/components/partials'
import { SET_CURRENT_TRANSCRIPT, RESUME_TRANSCRIBING_REQUEST } from 'constants/actionTypes'
import TranscribeRequest from 'models/TranscribeRequest'
import classes from './style.scss'

// TODO migrate over to cards, so is more mobile friendly by default and it's still easy to show lots of different kinds of information without being too crowded
// u
class TranscribeRequestPicker extends Component {
  constructor(props) {
    super(props)

  }

  render() {
    const { transcribeRequests } = this.props

    return (
      <Flexbox>
        {transcribeRequests.map((t, i) => 
          <TranscribeRequestCard
            key={i}
            transcribeRequest={t}
          />
        )}
      </Flexbox>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

const mapStateToProps = (state) => {
  return {
    // transcribeRequests: state.transcribeRequests,
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TranscribeRequestPicker))
