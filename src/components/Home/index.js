// Write your code here
import {Component} from 'react'

import Loader from 'react-loader-spinner'
import TeamCard from '../TeamCard'

import './index.css'

class Home extends Component {
  state = {teamsData: [], isLoading: true}
  componentDidMount() {
    this.getTeamsData()
  }
  getTeamsData = async () => {
    const response = await fetch('https://apis.ccbp.in/ipl')
    const data = await response.json()

    const updatedData = data.teams.map(team => ({
      name: team.name,
      id: team.id,
      teamImgUrl: team.team_image_url,
    }))
    this.setState({teamsData: updatedData, isLoading: false})
  }
  renderTeamsList = () => {
    const {teamsData} = this.state
    return (
      <ul className="teams-list">
        {teamsData.map(each => (
          <TeamCard eachDetails={each} key={each.id} />
        ))}
      </ul>
    )
  }
  renderLoader = () => (
    <div testid="loader" className="loader-container">
      <Loader type="Oval" color="#ffffff" height={50} />
    </div>
  )
  render() {
    const {isLoading} = this.state
    return (
      <div className="container-home">
        <div className="headings-part">
          <img
            src="https://assets.ccbp.in/frontend/react-js/ipl-logo-img.png"
            alt="ipl logo"
            className="logo-image-home"
          />
          <h1>IPL Dashboard</h1>
        </div>
        {isLoading ? this.renderLoader() : this.renderTeamsList()}
      </div>
    )
  }
}
export default Home
