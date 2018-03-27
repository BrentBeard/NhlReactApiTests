import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

class App extends React.Component {
  constructor() {
    super();
    this.state={
      player : "",
      playerObject: {} 
    };
    this.search = this.search.bind(this);
    this.handleChange = this.handleChange.bind(this);
    // this.secondStats = this.secondStats.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.id] : e.target.value
    });
  }

  search(e) {
    e.preventDefault();
    axios.get(`https://statsapi.web.nhl.com/api/v1/teams/`, {
    }).then((res) => {
      const teams = res.data.teams;
      teams.map((team) => {
      const teamID = team.id;
        axios.get(`https://statsapi.web.nhl.com/api/v1/teams/${teamID}/roster`, {
        }).then((newRes) => {
          const roster = newRes.data.roster;
          roster.map((player) => {
            const playerID = player.person.id;
            axios.get(`https://statsapi.web.nhl.com/api/v1/people/${playerID}/?expand=person.stats&stats=gameLog`, {
            }).then((playerList) => {
              const playerObject = playerList.data.people[0];
              if (playerObject.fullName === this.state.player) {
                this.setState({
                  playerObject
                }) 

                console.log(playerObject.stats[0].splits[0].season)
                console.log(playerObject.stats[0].splits[0].stat);
                let secondID = this.state.playerObject.id
                console.log(playerObject)
                axios.get(`https://statsapi.web.nhl.com/api/v1/people/${secondID}/?expand=person.stats&stats=yearByYear`, {
                }).then((res) => {
                  let secondStats = res.data.people[0];
                  // console.log(secondStats);
                  let seasons = secondStats.stats[0].splits;
                  seasons.map((season) => {
                    if(season.league.name === `National Hockey League`) {
                      console.log(season.stat.shotPct);
                    }
                  })
                }) 
              } 

            })
          })
        })

      })
    }) 
  }

  // secondStats() {
  //   if(this.state.playerObject !== '') {
  //     let secondID = this.state.playerObject.id
  //     axios.get(`https://statsapi.web.nhl.com/api/v1/people/${secondID}/?expand=person.stats&stats=yearByYear`, {
  //     }).then((res) => {
  //       console.log(res);
  //     }) 
  //   } 
  // } 


    render() {
      return (
        <div>
          <form onSubmit={this.search}>
          <label htmlFor="player">Player Name:</label>
            <input type="text" value={this.state.player} id="player" onChange={this.handleChange} />
            <input type="submit"/>
            <p>{this.state.playerObject.fullName}</p>
          </form>
          
        </div>
      )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
