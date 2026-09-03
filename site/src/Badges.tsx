import type { Profile } from './types'

export function Badges({ profile }: { profile: Profile }) {
  return (
    <ul className="badges">
      {profile.badges.first ? <li className="badge">留下了自己</li> : null}
      {profile.badges.stillHere ? <li className="badge still">还在</li> : null}
    </ul>
  )
}
