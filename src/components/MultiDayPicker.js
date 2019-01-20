import React from 'react'
import 'react-dates/initialize';
import PropTypes from 'prop-types';
import { DayPickerSingleDateController, CalendarDay } from 'react-dates'

export class MultiDayPicker extends React.Component {
  static defaultProps = {
    dates: []
  }

  constructor (props) {
    super(props);
    this.state = {
      dates: props.dates
    }

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (date) {
    const { dates } = this.state

    const newDates = dates.includes(date) ? dates.filter(d => !date.isSame(d)) : [...dates, d]

    this.setState({ dates: newDates })
    this.props.onChange && this.props.onChange(newDates.toJS())
  }

  render () {
    return (
      <DayPickerSingleDateController
        numberOfMonths={1}
        onDateChange={this.handleChange}
        renderCalendarDay={props => {
          const { day, modifiers } = props

          if (this.state.dates.includes(day)) {
            modifiers && modifiers.add('selected')
          }
          else {
            modifiers && modifiers.delete('selected')
          }

          return (
            <CalendarDay { ...props } modifiers={modifiers} />
          )
        }} />
    )
  }
}

export default MultiDayPicker