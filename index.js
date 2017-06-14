module.change_code = 1;
'use strict';

var alexa = require( 'alexa-app' );
var _ = require('lodash');

var ENDPOINT ='https://season-developer-edition.ap2.force.com/services/apexrest/FindLeads';

var app = new alexa.app( 'skill' );

app.launch( function( request, response ) {
	response.say( 'Welcome to your Salesforce.' ).reprompt( 'Way to go. You got it to run. Bad ass.' ).shouldEndSession( false );
} );


app.error = function( exception, request, response ) {
	console.log(exception)
	console.log(request);
	console.log(response);	
	response.say( 'Sorry an error occured ' + error.message);
};

app.intent('sayNumber',
	{
		"slots":{"firstname":"string"}
		,"utterances":[ 
			"say the number {1-100|number}",
			"give me the number {1-100|number}",
			"tell me the number {1-100|number}",
			"I want to hear you say the number {1-100|number}"
		]
	},
	function(request, response) {
	
		var number = request.slot('number');
		//var self = this;
		var reprompt = 'say the number between one to hundred.';
	    if (_.isEmpty(number)) {
	      	var prompt = 'I didn\'t hear a number. Tell me a number.';
	      	response.say(prompt).reprompt(reprompt).shouldEndSession(false);
	      	return true;
	    } else {
	      	
	      	response.say('Hi, I got your number.you have ask for the number ' + number);

	    }
		
    }
);
app.intent('LeadIntent',
	{
		
		"utterances":[ 
			"get my today's leads",
			"get my leads",
			"my leads",
			"leads"
		]
	},
	function(request, response) {
	
		try{
			var request = require('sync-request');
			var res = request('GET', ENDPOINT,{
				timeout:5000
			});
			var leadList = JSON.parse(res.getBody());
			var str = 'Found ' + leadList.length + ' Leads.\n \n';
			for(var i = 0; i < leadList.length; i++) {
				var index = i + 1;
				str += index + '. ' + leadList[i].FirstName + ' ' + leadList[i].LastName + ' with status ' + leadList[i].Status + '\n\n';
				
			}
			console.log(str);
			response.say(str);
		}catch(e){
			response.say('Sorry, Some error occured ');
		}
      	return true;

    }
);
app.intent('ChangeStatusIntent',
	{
		
		"utterances":[ 
			"change status for lead",
			"change status"
		]
	},
	function(request, response) {
		var prompt = 'Ok,Tell me the firstname, lastname and new status of lead.';
		//var reprompt = 'Tell me the firstname, lastname and new status of lead.';
		response.say(prompt).shouldEndSession(false);
      	return true;
    }
);

app.intent('ChangeLeadIntent',
	{	"slots":{
			"Name":"string",
			"status" :"string"
		}
		,"utterances":[
			"{firstname} {lastname} to {status}"
		]
	},
	function(request,response){
		try{
			var name = request.slot('Name');
			var names = name.split(' ');
			var status = request.slot('status');
			var request = require('sync-request');
			var res = request('GET', ENDPOINT + '?fName='+names[0]+'&lName='+names[1]+'&status='+status,{
				timeout:5000
			});
			var leadList = JSON.parse(res.getBody());
			var str = 'No lead found with name ' + name ;
			if(leadList.length != 0)
				str = 'Status is successfully change.';
			
			console.log(str);
			response.say(str);
		}catch(e){
			response.say('Sorry, Some error occured ');
		}
      	return true;	
	}
);

module.exports = app;