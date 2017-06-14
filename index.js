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
		"slots":{"number":"AMAZON.NUMBER"}
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
app.intent('todaysLead',
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
			var str = 'Found ' + leadList.length + ' Leads.\n';
			for(var i = 0; i < leadList.length; i++) {
				var index = i + 1;
				str += index + '. ' + leadList[i].FirstName + ' ' + leadList[i].LastName + ' with status ' + leadList[i].Status ;
				if(i < leadList.length -1) str += ', ';
				else str += '.';
			}
			console.log(str);
			response.say(str);
		}catch(e){
			response.say('Sorry, Some error occured ');
		}
      	return true;

    }
);

module.exports = app;