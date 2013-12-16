var json;

$(document).ready(function(){
	//let's load pivotal projects
	getTrackerData("/projects", showProjects);
		
});

function getTrackerData(path, callback, args) {
	// get parameters
	var token = "dd098b861021babc50a586525676c6fa";

	// compose request URL
	var url = 'https://www.pivotaltracker.com/services/v5';
	url += path;

	// do API request to get story names
	$.ajax({
	  url: url,
	  beforeSend: function(xhr) {
	    xhr.setRequestHeader('X-TrackerToken', token);
	  }
	}).done(function(data){
		if(args){
			callback(data, args);
		}else{
			callback(data)	
		}		
	});
}

function showProjects(projects) {
	// debugger;
	var renderProjects = Handlebars.compile( $("#projects").html() );
	
	$('.projects').html(renderProjects(projects));

	projects.forEach(function(item){
		getTrackerData("/projects/"+item.id+"/stories", showProjectSummary)
		getTrackerData("/projects/"+item.id+"/memberships", showProjectMembers, item.id)
	});
}

function showProjectMembers(members, id){
	var renderTeam = Handlebars.compile( $("#team").html() )
	$('.project[data-id="'+id+'"] .team').html(renderTeam(members));
}

function showProjectSummary(stories){
	// debugger;

	var summary = {};
	var renderSummary = Handlebars.compile( $("#stories").html() );
	
	stories.forEach(function(item){

		if(!summary[item.story_type] && (item.current_state == "started" || item.current_state == "unstarted")){
			summary[item.story_type] = {};
			summary[item.story_type].name = item.story_type;
			
			switch(item.story_type){
				case "release":
					summary[item.story_type].icon = "&#9873;";
					break;
				case "bug":
					summary[item.story_type].icon = "&#128165;";
					break;
				case "chore":
					summary[item.story_type].icon = "&#9881;";
					break;
				case "feature":
					summary[item.story_type].icon = "&#128319;";
					break;
			}

			summary[item.story_type].count = 1;
		}else if(item.current_state == "started" || item.current_state == "unstarted"){
			summary[item.story_type].count++;
		}

		summary.stories = [];

		for(prop in summary){
			if(prop != "stories"){
				summary.stories.push(summary[prop]);
				summary.stories.sort(function(a,b){
					var knownOrder = {
						"feature":0,
						"release":1,
						"chore":2,
						"bug":3
					}

					if (knownOrder[a.name] < knownOrder[b.name]){
					     return -1;
					}else{
						return 1;
					}
				})
			}
		}
	});

	$('.project[data-id="'+stories[0].project_id+'"] .stories').html(renderSummary(summary.stories));
}