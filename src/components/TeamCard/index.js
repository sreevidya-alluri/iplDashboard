// Write your code here
import {Link} from 'react-router-dom'

import './index.css'

const TeamCard = props => {
  const {eachDetails} = props
  const {name, id, teamImgUrl} = eachDetails
  return (
    <li className="container-team-card">
      <Link to={`/team-matches/${id}`} className="link-element">
        <img src={teamImgUrl} alt="name" className="image-card" />
        <p className="para-card">{name}</p>
      </Link>
    </li>
  )
}
export default TeamCard
