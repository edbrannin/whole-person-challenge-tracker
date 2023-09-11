import { differenceInCalendarDays } from 'date-fns'

export const CHALLENGE_START_DAY = new Date('2023-09-06');
export const CHALLENGE_END_DAY = new Date('2023-10-31');
export const CHALLENGE_LENGTH_DAYS = differenceInCalendarDays(CHALLENGE_END_DAY, CHALLENGE_START_DAY);

export const CHALLENGE_URL = "https://bandwidth-jira.atlassian.net/wiki/spaces/PS/pages/4715380737/Full-On-Fall+Challenge+Sep.+6+Oct.+31"
