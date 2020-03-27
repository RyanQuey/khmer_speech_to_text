import { Component } from 'react';
import { connect } from 'react-redux'
import {
} from 'constants/actionTypes'
import { Button, Flexbox, Icon, Form, Input } from 'shared/components/elements'
import { Select } from 'shared/components/groups'
import { SocialLogin } from 'shared/components/partials'
import { PROVIDERS, PROVIDER_IDS_MAP } from 'constants/providers'
import {formActions, alertActions} from 'shared/actions'
import {
  withRouter,
} from 'react-router-dom'
import classes from './style.scss'

class PaginationMenu extends Component {
  constructor() {
    super()
    this.selectPageSizeOption = this.selectPageSizeOption.bind(this)
    this.changePage = this.changePage.bind(this)
    //this.nextPage = this.nextPage.bind(this)
    //this.previousPage = this.previousPage.bind(this)
  }

  pageSizeOptions () {
    //default is first option, one week, which is what GA defaults to
    return [
      {
        label: 10,
        value: 10,
      },
      {
        label: 25,
        value: 25,
      },
      {
        label: 50,
        value: 50,
      },
      {
        label: 100,
        value: 100,
      },
      {
        label: 250,
        value: 250,
      },
      {
        label: 500,
        value: 500,
      },
    ]
  }

  changePage(value, autoReload = false) {
    this.props.onPageChange(value)
  }

  selectPageSizeOption(option) {
    this.props.onPageSizeChange(option.value)
  }

  render () {
    const {pageSizeParam, pageParam, currentPage, pending, currentPageSize, totalRecords} = this.props
    const startingRecord = currentPage * currentPageSize - (currentPageSize) + 1
    const potentialEndingRecord = startingRecord + currentPageSize -1
    const endingRecord = potentialEndingRecord > totalRecords ? totalRecords : potentialEndingRecord
    //set by function so date will refresh, in case goes past midnight and they didn't refresh browser or something
    const pageSizeOptions = this.pageSizeOptions()

    return (
      <Form className={classes.paginationMenu} onSubmit={this.props.onSubmit} >
        <Flexbox justify="space-between" align="center">
          <div>Page Size:&nbsp;</div>
          <Select
            className={classes.pageSizeSelect}
            options={pageSizeOptions}
            onChange={this.selectPageSizeOption}
            currentOption={pageSizeParam || pageSizeOptions[0]}
            name="page-size"
          />

          <div>Jump to Page:</div>
          <Input
            value={pageParam || ""}
            className={classes.pageInput}
            onChange={this.changePage}
          />

          <Button type="submit" small={true} pending={pending}>Go</Button>
          {<div>Showing {startingRecord} - {endingRecord} of {totalRecords}</div>}
          <div >
            <Button disabled={pending || pageParam === 1} onClick={this.changePage.bind(this, currentPage -1, true)} small={true}><Icon name="angle-left"/></Button>
            <Button disabled={pending || endingRecord === totalRecords} onClick={this.changePage.bind(this, currentPage +1, true)} small={true}><Icon name="angle-right"/></Button>
          </div>
        </Flexbox>
      </Form>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllGAAccounts: (payload, cb, onFailure) => dispatch({type: FETCH_ALL_GA_ACCOUNTS_REQUEST, payload, cb, onFailure}),

  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    campaigns: state.campaigns,
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PaginationMenu))
