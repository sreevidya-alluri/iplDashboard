import {Component} from 'react'
import {withRouter} from 'react-router-dom'
import './index.css'
import Loader from 'react-loader-spinner'
import {PieChart, Pie, Cell, Tooltip, Legend} from 'recharts'
import MatchCard from '../MatchCard'
import LatestMatch from '../LatestMatch'

const TeamMatchesApiUrl = 'https://apis.ccbp.in/ipl/'

class TeamMatches extends Component {
  constructor(props) {
    super(props)
    this.state = {teamIndividualData: {}, isLoading: true}
  }

  componentDidMount() {
    this.getTeamMatchesData()
  }

  getFormattedData = data => ({
    umpires: data.umpires,
    result: data.result,
    manOfTheMatch: data.man_of_the_match,
    id: data.id,
    date: data.date,
    venue: data.venue,
    competingTeam: data.competing_team,
    firstInnings: data.first_innings,
    competingTeamLogo: data.competing_team_logo,
    secondInnings: data.second_innings,
    matchStatus: data.match_status,
  })

  getTeamMatchesData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const response = await fetch(`${TeamMatchesApiUrl}${id}`)
    const fetchedData = await response.json()
    const formattedData = {
      teamBannerUrl: fetchedData.team_banner_url,
      latestMatchDetails: this.getFormattedData(
        fetchedData.latest_match_details,
      ),
      recentMatches: fetchedData.recent_matches.map(eachMatch =>
        this.getFormattedData(eachMatch),
      ),
    }
    this.setState({teamIndividualData: formattedData, isLoading: false})
  }

  renderRecentMatchesList = () => {
    const {teamIndividualData} = this.state
    const {recentMatches} = teamIndividualData
    return (
      <ul className="recent-matches-list">
        {recentMatches.map(each => (
          <MatchCard matchDetails={each} key={each.id} />
        ))}
      </ul>
    )
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="Oval" color="#ffffff" height={50} width={50} />
    </div>
  )

  getRouteClassName = () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    switch (id) {
      case 'RCB':
        return 'rcb'
      case 'KKR':
        return 'kkr'
      case 'KXP':
        return 'kxp'
      case 'CSK':
        return 'csk'
      case 'RR':
        return 'rr'
      case 'MI':
        return 'mi'
      case 'SH':
        return 'srh'
      case 'DC':
        return 'dc'
      default:
        return ''
    }
  }

  navigateToHome = () => {
    const {history} = this.props
    history.push('/')
  }

  calculateMatchStats = matches => {
    let won = 0
    let lost = 0
    let drawn = 0

    matches.forEach(match => {
      if (match.matchStatus === 'Won') {
        won += 1
      } else if (match.matchStatus === 'Lost') {
        lost += 1
      } else {
        drawn += 1
      }
    })

    return {won, lost, drawn}
  }

  renderTeamMatches = () => {
    const {teamIndividualData} = this.state
    const {
      teamBannerUrl,
      latestMatchDetails,
      recentMatches,
    } = teamIndividualData
    const matchStats = this.calculateMatchStats(recentMatches)

    const data = [
      {name: 'Won', value: matchStats.won},
      {name: 'Lost', value: matchStats.lost},
      {name: 'Drawn', value: matchStats.drawn},
    ]

    const COLORS = ['#4CAF50', '#F44336', '#FFC107']

    return (
      <div className="responsive-container">
        <img src={teamBannerUrl} alt="team banner" className="team-banner" />
        <div className="pie-chart-container">
          <h2 className="pie-chart-heading">Match Statistics</h2>
          <PieChart width={400} height={400}>
            <Pie
              data={data}
              cx={200}
              cy={200}
              labelLine={false}
              label={({name, percent}) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`${entry.name}-${entry.value}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
        <button
          type="button"
          className="back-button"
          onClick={this.navigateToHome}
        >
          Back
        </button>

        <LatestMatch latestMatchDetails={latestMatchDetails} />
        {this.renderRecentMatchesList()}
      </div>
    )
  }

  render() {
    const {isLoading} = this.state
    const className = `team-matches-container ${this.getRouteClassName()}`
    return (
      <div className={className}>
        {isLoading ? this.renderLoader() : this.renderTeamMatches()}
      </div>
    )
  }
}

export default withRouter(TeamMatches)
