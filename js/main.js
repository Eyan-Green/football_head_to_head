// API variables
const base_url = "https://apifootball.com/api/?action=";
const action = "get_H2H&firstTeam=";
const paramsOne = "&secondTeam=";
const apiKey = "&APIkey=27f5156c09fd624044b909bbb277bcee922a03876c8838798f42ff55decaadd2";

// gets head to head data from API
const getGoalData = (team_one, team_two) => {
	let one = encodeURIComponent(team_one);
	let two = encodeURIComponent(team_two);
	fetch(`${base_url}${action}${one}${paramsOne}${two}${apiKey}`, {
		method: 'GET'
	})
	.then(response => response.json())
	.then(response => {
		prepareChartData(team_one, team_two, response);
		winDrawLoss(team_one, team_two, response);
	})
}
// gets all leagues from API
const getLeagues = () => {
	fetch(`${base_url}get_leagues${apiKey}`, {
		method: 'GET'
	})
	.then(response => response.json())
	.then(response => {
		prepareLeagues(response);
	})
}
// maps country name and league name to an array
const prepareLeagues = (leagues) => {
	let leagueNames = leagues.map(a => `${a.country_name} - ${a.league_name}`)
	populateLeagueSelect(leagueNames);
}
// gets all the league ids and then populates team selectors
// with associated teams
const getLeagueIds = (index) => {
	document.getElementById('goalsLineChart').innerHTML = ''
	document.getElementById('goalsBarChart').innerHTML = ''
	document.getElementById('pieOne').innerHTML = ''
	document.getElementById('pieTwo').innerHTML = ''
	fetch(`${base_url}get_leagues${apiKey}`, {
		method: 'GET'
	})
	.then(response => response.json())
	.then(response => {
		let leagueIds = response.map(a => a.league_id)
		getTeams(leagueIds[index])
	})
}
// gets team data from API
const getTeams = (league_id) => {
	fetch(`${base_url}get_standings&league_id=${league_id}${apiKey}`, {
		method: 'GET'
	})
	.then(response => response.json())
	.then(response => {
		prepareTeams(response);
		getFixtureDate(league_id);
		prepareLeageStandings(response);
		populateLeagueTable(response);
	})
}
// get fixtures from API
const getFixtureDate = (league_id) => {
	let today = new Date();
	let day = (today.getDate() < 10 ? '0' : '') + today.getDate();
	let month = ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1);
	let thisWeek = `${today.getFullYear()}-${month}-${day}` 
	today.setDate(today.getDate() + 7);
	let nextWeekDay = (today.getDate() < 10 ? '0' : '') + today.getDate();
	let nextWeekMonth = ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1);
	let nextWeekYear = today.getFullYear()
	fetch(`${base_url}get_events&from=${thisWeek}&to=${nextWeekYear}-${nextWeekMonth}-${nextWeekDay}&league_id=${league_id}${apiKey}`, {
		method: 'GET'
	})
	.then(response => response.json())
	.then(response => {
		prepareFixtureData(response);
	})
}
// populate's league standings
const prepareLeageStandings = (data) => {
	let body = document.getElementById('league-table-body')
	body.innerHTML = '';
	document.getElementById('league-table').style.display = "block";
	for (let i = 0; i < data.length; i++) {
		body.innerHTML += `<tr><td>${data[i].overall_league_position}</td><td>${data[i].team_name}</td><td>${data[i].overall_league_payed}</td>
		<td>${data[i].overall_league_W}</td><td>${data[i].overall_league_D}</td><td>${data[i].overall_league_L}</td>
		<td>${data[i].overall_league_GF}</td><td>${data[i].overall_league_GA}</td><td>${data[i].overall_league_GF - data[i].overall_league_GA}</td>
		<td>${data[i].overall_league_PTS}</td></tr>`
	}
}
// populates table with fixtures
const prepareFixtureData = (fixtures) => {
	let body = document.getElementById('fixtures-table-body')
	body.innerHTML = '';
	document.getElementById('fixtures-table').style.display = "block";
	document.getElementById('fixtures-table-header').style.display = "block";
	for (let i = 0; i < fixtures.length; i++) {
		body.innerHTML += `<tr><td>${fixtures[i].match_hometeam_name}</td><td>${fixtures[i].match_awayteam_name}</td><td>${fixtures[i].match_time}</td><td>${fixtures[i].match_date}</td></tr>`
	}
}
// gets win loss draw data for both teams 
const winDrawLoss = (team_one, team_two, data) => {
	let stats = data.firstTeam_VS_secondTeam
	let firstTeamWins = 0;
	let firstTeamDraws = 0;
	let firstTeamLosses = 0;
	let secondTeamWins = 0;
	let secondTeamDraws = 0;
	let secondTeamLosses = 0;

	for (let i = 0; i < stats.length; i++) {
		if (stats[i].match_hometeam_name === team_one && stats[i].match_hometeam_score > stats[i].match_awayteam_score) {
			firstTeamWins += 1;
		} else if (stats[i].match_hometeam_name === team_one && stats[i].match_hometeam_score === stats[i].match_awayteam_score) {
			firstTeamDraws += 1;
		} else if (stats[i].match_hometeam_name === team_one && stats[i].match_hometeam_score < stats[i].match_awayteam_score) {
			firstTeamLosses += 1;
		} else if (stats[i].match_awayteam_name === team_one && stats[i].match_awayteam_score > stats[i].match_hometeam_score ) {
			firstTeamWins += 1;
		} else if (stats[i].match_awayteam_name === team_one && stats[i].match_awayteam_score === stats[i].match_hometeam_score) {
			firstTeamDraws += 1;
		} else if (stats[i].match_awayteam_name === team_one && stats[i].match_awayteam_score < stats[i].match_hometeam_score) {
			firstTeamLosses += 1;
		}
	}

	for (let i = 0; i < stats.length; i++) {
		if (stats[i].match_hometeam_name === team_two && stats[i].match_hometeam_score > stats[i].match_awayteam_score) {
			secondTeamWins += 1;
		} else if (stats[i].match_hometeam_name === team_two && stats[i].match_hometeam_score === stats[i].match_awayteam_score) {
			secondTeamDraws += 1;
		} else if (stats[i].match_hometeam_name === team_two && stats[i].match_hometeam_score < stats[i].match_awayteam_score) {
			secondTeamLosses += 1;
		} else if (stats[i].match_awayteam_name === team_two && stats[i].match_awayteam_score > stats[i].match_hometeam_score ) {
			secondTeamWins += 1;
		} else if (stats[i].match_awayteam_name === team_two && stats[i].match_awayteam_score === stats[i].match_hometeam_score) {
			secondTeamDraws += 1;
		} else if (stats[i].match_awayteam_name === team_two && stats[i].match_awayteam_score < stats[i].match_hometeam_score) {
			secondTeamLosses += 1;
		}
	}
	populatePieChart("#pieOne", team_one, firstTeamWins, firstTeamDraws, firstTeamLosses);
	populatePieChart("#pieTwo", team_two, secondTeamWins, secondTeamDraws, secondTeamLosses);
}
// pushes teams from API to an array and then to select tag 
const prepareTeams = (data) => {
	// Get dropdown element from DOM
	document.getElementById("selectTeamOne").options.length = 0;
	document.getElementById("selectTeamTwo").options.length = 0;
	const dropdown = document.getElementById("selectTeamOne");
	const dropdownTwo = document.getElementById("selectTeamTwo");

	let teams = data.map(a => a.team_name);

	teams.sort();
	for (let i = 0; i < teams.length; ++i) {
		dropdown[dropdown.length] = new Option(teams[i], teams[i]);
		dropdownTwo[dropdownTwo.length] = new Option(teams[i], teams[i]);
	}
}
// pushes data to arrays for both line & bar charts
const prepareChartData = (team_one, team_two, data) => {
	let firstTeam = [team_one];
	let secondTeam = [team_two];
	let matchDays = [];
	let vs = data.firstTeam_VS_secondTeam
	for (let i = 0; i < vs.length; i++) {
		if (vs[i].match_hometeam_name === team_one) {
			firstTeam.push(vs[i].match_hometeam_score)
			matchDays.push(vs[i].match_date + " " + vs[i].league_name)
		} else if (vs[i].match_awayteam_name === team_one) {
			firstTeam.push(vs[i].match_awayteam_score)
			matchDays.push(vs[i].match_date + " " + vs[i].league_name)
		}
	}
	for (let i = 0; i < vs.length; i++) {
		if (vs[i].match_hometeam_name === team_two) {
			secondTeam.push(vs[i].match_hometeam_score)
		} else if (vs[i].match_awayteam_name === team_two) {
			secondTeam.push(vs[i].match_awayteam_score)
		}
	}
	populateLineChart("#goalsLineChart", matchDays, firstTeam, secondTeam);
	populateBarChart("#goalsBarChart", team_one, team_two, firstTeam, secondTeam);
}
// loads pie chart with data
const populatePieChart = (div, team_one, win, draw, loss) => {
	var chart = c3.generate({
		bindto: div,
      	data: {
        	type: 'donut',
        	columns: [
        	],
        	hide: true,
	        colors: {
	            Win: '#4BC75D',
	            Draw: '#5a5a5a',
	            Loss: '#DE0000'
	        }
      	},
	    donut: {
	        title: `${team_one}`
	    },
      	legend: {
          	show: false,
          	position: 'inset',
          	inset: {
            	anchor: 'top-right',
            	x: 10,
            	y: 10
          	}
      	},
      	interaction: {
        	enabled: true
      	},
      	axis: {
      		x: {
          		show: true,
			    default: [0, 1]
        	},
        	y: {
          		show: true,
			    default: [0, 1]
      		}
      	},
      	grid: {
        	y: {
          		show: true
        	}
      	},
      	size: {
        	height: 320,
        	width: 480
      	},
      	transition: {
        	duration: 400
      	}
  	}),
  	timeout = 500;

	function addColumn(data, delay){
	
		var dataTmp = [data[0], 0]; 
  		
  		setTimeout(function(){
			chart.internal.d3.transition().duration(100);
    		chart.load({
      			columns: [
        			dataTmp
      			]
    	});
 	}, timeout);
  	timeout += 200; 
 	
 	data.forEach(function(value, index){
    	setTimeout(function(){
	    	dataTmp[index] = value;
      		if(index < 10) dataTmp.push(0);
      			chart.load({
        			columns: [
	        			dataTmp
        			],
        			length:0
      			});
    		}, (timeout + (delay/data.length*index)));
  		});
  	timeout += delay;
	}

	setTimeout(function(){
	  	chart.axis.range({
	    	min: {
	      		x: 0,
	      		y: 1
	    	},
	    	max: {
	      		x: 6,
	      		y: 10
	    	}
	  	});
	}, timeout);
	timeout += 500;

	addColumn(['Win', win], 1000);
	addColumn(['Draw', draw], 1000);
	addColumn(['Loss', loss], 1000);

	timeout += 1500;

	setTimeout(function(){
  		chart.internal.d3.transition().duration(2000);
  		chart.legend.show();
	}, timeout);
}
// Populates line chart with goal data
const populateLineChart = (div, dates, teamArrayOne, teamArrayTwo) => {
	let chart = c3.generate({
		bindto: div,
	    data: {
	        columns: [
	            teamArrayOne,
	            teamArrayTwo
	        ]
	    },
      	legend: {
          	position: 'inset',
          	inset: {
            	anchor: 'top-right',
            	x: 10,
            	y: 10
          	}
      	},
	    axis: {
	        x: {
	            type: 'category',
	            categories: dates
	        }
	    },
	    transition: {
	        duration: 2500
	    },
		tooltip: {
		  	format: {
		    	title: () => { return "Score"; }
		  	}
		}
	})
}
// Populates bar chart with goal data
const populateBarChart = (div, team_one, team_two, teamArrayOne, teamArrayTwo) => {
	teamArrayOne.shift();
	teamArrayTwo.shift();
	let sumOne = teamArrayOne.reduce((a, b) => parseInt(a) + parseInt(b), 0);
	let sumTwo = teamArrayTwo.reduce((a, b) => parseInt(a) + parseInt(b), 0);

	let teamOne = [team_one, sumOne];
	let teamTwo = [team_two, sumTwo];

	var chart = c3.generate({
		bindto: div,
	    data: {
	        columns: [
	            teamOne,
	            teamTwo
	        ],
	        type: 'bar'
	    },
      	legend: {
          	position: 'inset',
          	inset: {
            	anchor: 'top-right',
            	x: 10,
            	y: 10
          	}
      	},
	    bar: {
	        width: {
	            ratio: 0.5
	        }
	    },
		tooltip: {
		  	format: {
		    	title: () => { return "Goals"; }
		  	}
		}
	});	
}
// Populates team one select tag with teams
const populateSelectTeams = (teams) => {
	// Get dropdown element from DOM
	document.getElementById("selectTeamOne").options.length = 0;
	document.getElementById("selectTeamTwo").options.length = 0;
	const dropdown = document.getElementById("selectTeamOne");
	const dropdownTwo = document.getElementById("selectTeamTwo");
	
	// Loop through the array
	for (let i = 0; i < teams.length; ++i) {
	    // Append the element to the end of Array list
	    dropdown[dropdown.length] = new Option(teams[i], teams[i]);
	    dropdownTwo[dropdownTwo.length] = new Option(teams[i], teams[i]);
	}
}
// Populates league select tag
const populateLeagueSelect = (leagues) => {
	const dropdown = document.getElementById("selectLeague");

	for (let i = 0; i < leagues.length; ++i) {
		dropdown[dropdown.length] = new Option(leagues[i], leagues[i]);
	}
}
// populates league table 
const populateLeagueTable = (data) => {
	let tableData = d3.entries(data);
	let table = d3.select('#table').append('table');    
} 
// event listener, loads all charts 
document.getElementById('getGoalDataButton').addEventListener('click', () => {
	const selectTeamOne = document.querySelector('#selectTeamOne').value;
	const selectTeamTwo = document.querySelector('#selectTeamTwo').value;

	if (selectTeamOne !== "Select Team" && selectTeamTwo !== "Select Team") {
		populateLeagueTable();
		getGoalData(selectTeamOne, selectTeamTwo);
	}
});
// event listener, filters teams based on league selection
document.getElementById('selectLeague').addEventListener('change', () => {
	const league = document.querySelector('#selectLeague').value;
	const leagueIndex = document.getElementById('selectLeague').selectedIndex - 1;

	if (league !== "Select League") {
		getLeagueIds(leagueIndex);
	} else {
		document.getElementById("selectTeamOne").options.length = 0;
		document.getElementById("selectTeamTwo").options.length = 0;
	}
})
// callback to populate league select tag 
getLeagues();