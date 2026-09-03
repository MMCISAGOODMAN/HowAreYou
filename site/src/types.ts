export type Profile = {
  id: string
  headline: string
  startedAt: string
  year: number | null
  yearsExperience: number | null
  current: string
  side: string
  achievement: string
  struggle: string
  message: string
  easterEgg: string
  hasAchievement: boolean
  hasStruggle: boolean
  badges: {
    first: boolean
    stillHere: boolean
  }
  updatedYears: number[]
  sawCount: number
  sawIssueUrl: string | null
}

export type FilterId =
  | 'all'
  | 'newcomer'
  | 'veteran'
  | 'achievement'
  | 'stuck'
