import moment from 'moment'

export const now = () => moment().format()

export const prevMinute = () => moment().add(-1, 'minute')
export const prevHour = () => moment().add(-1, 'hour')
export const yesterday = () => moment().add(-1, 'day')
export const prevWeek = () => moment().add(-1, 'week')
export const prevMonth = () => moment().add(-1, 'month')
export const prevYear = () => moment().add(-1, 'year')

export const nextMinute = () => moment().add(1, 'minute')
export const nextHour = () => moment().add(1, 'hour')
export const tomorrow = () => moment().add(1, 'day')
export const nextWeek = () => moment().add(1, 'week')
export const nextMonth = () => moment().add(1, 'month')
export const nextYear = () => moment().add(1, 'year')

export const startDay = () => moment().startOf('day')
export const startMonth = () => moment().startOf('month')
export const startYear = () => moment().startOf('year')

export const endDay = () => moment().endOf('day')
export const endMonth = () => moment().endOf('month')
export const endYear = () => moment().endOf('year')
