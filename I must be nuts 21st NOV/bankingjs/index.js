var express = require("express");
var mysql = require('mysql');
var parser = require('body-parser');
var pg = require('pg');
var app = express();
var CSV = require('csv-string');
const https = require('https');
var request = require('request');

var querytype = "0";
var output_displaytext = {};
var ob = {};
var companyArray = 'companyArray';
var type = 'type';
var displayString = 'displayString';
var dataObject = {};
var data = 'data';
var subObj = {};
var list = 'list';
var multipleFields = 'multipleFields';
var text = 'text';
var graph = 'graph';
var output = "0";
var newoutput = "0";
var premium = 0;
var os = require('os');
var http = require('http');
var fs = require('fs');
var nodemailer = require('nodemailer');
var policyVar = "";
var carvar = "";
var custinfoarr = ['Name','plan_name','start_date','end_date','Premium','phone_number','car_name','registration','email','claimstatus'];
var responseJson = {};
var plansarray = [];
var policyFromOption = "";

/** Neha **/
/** including banking.js **/

var banking = require('./banking');
var insurance = require('./insurance');
var tataAia = require('./tataaia');




/* This comment is there because of combining webhook and service file
var MyMethods = require('./Webhook/index.js');
var transactionFn = MyMethods.transactionFn;
var callTransactionApi = MyMethods.callTransactionApi;
*/

app.use(parser.json());
app.use(parser.urlencoded({
  extended: true
}));



/**
 * Database connection
 * TODO: remove the db credentials
 * from here later on.fhgfhgfghfgfghhsdjfhsdjsdhfsjfsdfasdafdfdky  sffs sdgdkfgsdssdf
 */
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'TNPass100!',
  database: 'experience_schema',
  debug: "true"
});

exports.connection = connection;


function botone(req, res) {
  if (req.body.result.parameters['investorName'] == '' || req.body.result.parameters['cityName'] =='' || req.body.result.parameters['companyName'] == '' || req.body.result.parameters['domain'] == '' || req.body.result.parameters['fund'] == ''){
    var query = "select city from new_transactions";
    var querytype = '0';
  }
  
  else if(req.body.result.metadata['intentName'] == "showDistribution"){
    var query  = "select city, count(distinct company) as no_of_companies from new_transactions where businessmodel like '%" + req.body.result.parameters['plot'] + "%' group by city ORDER BY count(distinct company) DESC";
    querytype = '8';
  }
  
  else if (req.body.result.parameters['investorName'] == '0' && req.body.result.parameters['cityName'] =='0' && req.body.result.parameters['companyName'] == '0' && req.body.result.parameters['domain'] == '0' && req.body.result.parameters['fund'] == '0' && req.body.result.parameters['plot'] == '0'){ 
    var query = "select city from new_transactions";
    var querytype = '0';    
  }
  
  else if (req.body.result.metadata['intentName'] == "Search companies in a city") {
    var query = "select company from new_transactions where city like '" + req.body.result.parameters['cityName'] + "%'";
    querytype = '1';
  }
  else if(req.body.result.metadata['intentName'] == "Search companies invested by an investor"){
    var query = "select distinct company from new_transactions where investors like '" + req.body.result.parameters['investorName'] + "%'";
    querytype = '2';
  }
  //else if(req.body.result.parameters.investor == '0' && req.body.result.parameters.city=='0' && req.body.result.parameters.company != '0' && req.body.result.parameters['moreinfo'] == '0' && req.body.result.parameters['domain'] == '0' && req.body.result.parameters['fund']ing == '0'){
    else if(req.body.result.metadata['intentName'] == "Overview of a company" ){
    var query  = "select overview, company, city, total_funding, year, website from new_transactions where company like '" + req.body.result.parameters['companyName'] + "%'";
    querytype = '3';
  }
  else if(req.body.result.metadata['intentName'] == "Search by domain and subdomain") {
   // var query = "select company from transactions where city like '" + req.body.result.parameters.city + "%'";
    var query = "select company from new_transactions where businessmodel like '%"+req.body.result.parameters['domain']+"%' and businessmodel like '%"+req.body.result.parameters['subdomain']+"%' union select company from new_transactions where businessmodel like '%"+req.body.result.parameters['domain']+"%' and overview like '%"+req.body.result.parameters['subdomain']+"%' union select company from new_transactions where overview like '%"+req.body.result.parameters['domain']+"%' and businessmodel like '%"+req.body.result.parameters['subdomain']+"%'";
    querytype = '4';
  }
  else if(req.body.result.metadata['intentName'] == "SearchaCoByOnlyDomain") {
   // var query = "select company from transactions where city like '" + req.body.result.parameters.city + "%'";
    var query = "select company from new_transactions where businessmodel like '%"+req.body.result.parameters['domain']+"%' union select company from new_transactions where overview like '%"+req.body.result.parameters['domain']+"%'";
    querytype = '6';
  }
  else if(req.body.result.metadata['intentName'] == "Search Domain Specific companies in a city") {
   // var query = "select company from transactions where city like '" + req.body.result.parameters.city + "%'";
    var query = "select company from new_transactions where businessmodel like '%"+req.body.result.parameters['domain']+"%' and city like '%"+req.body.result.parameters['cityName']+"%' union select company from new_transactions where overview like '%"+req.body.result.parameters['domain']+"%' and city like '%"+req.body.result.parameters['cityName']+"%'";
    querytype = '9';
  }
  /*
  else if(req.body.result.parameters.investor == '0' && req.body.result.parameters.city =='0' && req.body.result.parameters.company == '0' && req.body.result.parameters['domain'] != "0" && req.body.result.parameters['fund']ing == '0') {
    
     var query = "select company from transactions where description like '%" + req.body.result.parameters['domain'] + "%'";
     querytype = '4';
   }
   */
  else if(req.body.result.metadata['intentName'] == "Search for funding") {
    // var query = "select company from transactions where city like '" + req.body.result.parameters.city + "%'";
    var query = "select total_funding from new_transactions where company like '" + req.body.result.parameters['companyName'] + "%'";
    querytype = '5';
   }
   
  else if(req.body.result.metadata['intentName'] == "TellMeMoreAboutTheCompany"){
    var query  = "select description from new_transactions where company like '" + req.body.result.parameters['companyName'] + "%'";
    querytype = '7';
  }
  

  connection.query(query, querytype, function(err, rows, fields) {
    if (err) {
      res.json({
        "code": 100,
        "status": "Error in connection database"
      });
      return;
    }
	
    if(querytype == '0'){
      var output = 'Sorry! We could not find anything! Can you try a different query please.';
      
        var ob = {};
        var dataObject = {};
        dataObject[text] = output;
        ob[type] = "description";
        ob[displayString] = "Sorry! We could not find anything! Can you try a different query please.";
        ob[data] = dataObject;
        output_displaytext = ob;

    }
    if(querytype == '1')  {
      var ob = {};
	  var dataObject = {};
      dataObject[list] = [];
	  ob[type] = "list";
	  ob[displayString] = "Showing list of companies in " + req.body.result.parameters['cityName'] + ": ";
	  if(rows.length == 0){
		  output = "There are no companies in " + req.body.result.parameters['cityName'] + " as per our records";
	  }
	  else{
      var output = "Showing list of companies in " + req.body.result.parameters['cityName'] + ": ";
      var index;
      for (index = 0; index < rows.length; ++index) {
		  dataObject[list].push(rows[index].company);
	    //ob[index] = rows[index].company;
        if (index == 0)
        output = output + rows[index].company;
        else if (index != rows.length - 1)
        output = output + ", " + rows[index].company;
        else 
        output = output + " and " + rows[index].company;
	    }
 
	  ob[data] = dataObject;
      output_displaytext = ob;		
    }
    }

    if(querytype == '2'){
		if(rows.length == 0){
	//	output = "There are no companies invested by " + req.body.result.parameters.investor + " as per our records";
      output = "Sorry! We could not find anything! Can you try a different query please.";
      var ob = {};
      var dataObject = {};
      dataObject[text] = output;
      ob[type] = "description";
      ob[displayString] = "Sorry! We could not find anything! Can you try a different query please.";
      ob[data] = dataObject;
      output_displaytext = ob;
	  }
	  else{
	    var ob = {};
	    var dataObject = {};
      dataObject[list] = [];
	    ob[type] = "list";
	    ob[displayString] = "Showing list of companies invested by " + req.body.result.parameters['investorName'] + ": ";
      var output = req.body.result.parameters['investorName'] + " has invested in ";
      var index;
      for (index = 0; index < rows.length; ++index) {
	      dataObject[list].push(rows[index].company);
	      //ob[index] = rows[index].company;
        if (index == 0)
        output = output + rows[index].company;
        else if (index != rows.length - 1)
        output = output + ", " + rows[index].company + "";
        else 
        output = output + " and " + rows[index].company;
      }
	    ob[data] = dataObject;
	    output_displaytext = ob;
	  }
    }
    if(querytype == '3'){
     //var output = rows; 
	    if(rows.length == 0){
	//	output = "We donot have any information about " + req.body.result.parameters.company + " as per our records";
        output = "Sorry! We could not find anything! Can you try a different query please.";
        var ob = {};
        var dataObject = {};
        dataObject[text] = output;
        ob[type] = "description";
        ob[displayString] = "Sorry! We could not find anything! Can you try a different query please.";
        ob[data] = dataObject;
        output_displaytext = ob;
	  }
	    else{
		    var ob = {};
	      var subObj = {};
        var dataObject = {};
	      dataObject[multipleFields] = [];
	      ob[type] = "longDescription";
	
        var output = "The company " + rows[0].company + " deals with " + rows[0].overview + ". The company was established in " + rows[0].year + " and is based out of " + rows[0].city + ". You can vist their website on " + rows[0].website ;
	 
	      ob[displayString] = "Here is some information that I found";
	
		    subObj["key"] = "Company";
        subObj["value"] = rows[0].company;
        subObj["type"] = "description";
        dataObject[multipleFields][0] = subObj;

        var subObj = {};

        subObj["key"] = "Overview";
        subObj["value"] = rows[0].overview;
        subObj["type"] = "description";
        dataObject[multipleFields][1] = subObj;
        var subObj = {};

        subObj["key"] = "Operational since";
        subObj["value"] = rows[0].year;
        subObj["type"] = "description";
        dataObject[multipleFields][2] = subObj;
        var subObj = {};
        subObj["key"] = "Website";
        subObj["value"] = rows[0].website;
        subObj["type"] = "link";
        dataObject[multipleFields][3] = subObj;

		    ob[data] = dataObject;
		    output_displaytext = ob;
    }
	}
    if(querytype == '4'){
		  if(rows.length == 0){
		  output = "There are no companies working in the domains provided by you as per our records";
      // output = "Sorry! We could not find anything! Can you try a different query please.";
        var ob = {};
        var dataObject = {};
        dataObject[text] = output;
        ob[type] = "description";
        ob[displayString] = "Sorry! We could not find anything! Can you try a different query please.";
        ob[data] = dataObject;
        output_displaytext = ob;
	  }
	  else{
		  var ob = {};
	var dataObject = {};
    dataObject[list] = [];
	ob[type] = "list";

	
		var singular = "0";
		var sing = "0";
		if(rows.length == 1){
			singular = 'company';
			sing = 'is';
		}
		
		else {
			singular = 'companies';
			sing = 'are';
		}
		
		
	
	
      var output = "The " + req.body.result.parameters['domain'] + " related " + singular + " in " + req.body.result.parameters['subdomain'] + " ";
      var index;
      ob[displayString] = output + sing + " ";
      for (index = 0; index < rows.length; ++index) {
      dataObject[list].push(rows[index].company);
		//ob[index] = rows[index].company;
        if (index == 0)
		{
			if (rows.length == 1){ output = output + "is ";}
			else{output = output + "are ,";}
        output = output + rows[index].company;
		}
        else if (index != rows.length - 1)
        output = output + ", " + rows[index].company;
        else 
        output = output + " and " + rows[index].company;
	
	    
		
      }
      ob[data] = dataObject;
	  output_displaytext = ob;
	  }
    }
    if(querytype == '5'){
      var output = req.body.result.parameters['companyName'] + " has recieved a funding of " + rows[0].total_funding;
		ob = {};
		ob["funding"] = rows[0].total_funding;
		output_displaytext = ob;
    }
	
	if(querytype == '6'){
		if(rows.length == 0){
		output = "There are no companies working in " + req.body.result.parameters['domain'] + " domain as per our records";

    output = "Sorry! We could not find anything! Can you try a different query please.";
    var ob = {};
        var dataObject = {};
        dataObject[text] = output;
        ob[type] = "description";
        ob[displayString] = "Sorry! We could not find anything! Can you try a different query please.";
        ob[data] = dataObject;
        output_displaytext = ob;
	  }
	  else{
		//if(rows == null){output = null;}
       //else{output = rows;} 
		var ob = {};
	var dataObject = {};
    dataObject[list] = [];
	ob[type] = "list";
		var singular = "0";
		if(rows.length == 1){singular = 'company';}
		else {singular = 'companies';}
		
		
      var output = "The " + req.body.result.parameters['domain'] + " related " + singular + " ";
      var index;
	  ob[displayString] = output;
      for (index = 0; index < rows.length; ++index) {
        
		dataObject[list].push(rows[index].company);
		if (index == 0)
		{
			if (rows.length == 1){ output = output + "is , ";}
			else{output = output + "are ";}
        output = output + rows[index].company;
		}
        else if (index != rows.length - 1)
        output = output + ", " + rows[index].company;
        else 
        output = output + " and " + rows[index].company;
	
      }
	  ob[data] = dataObject;
	  output_displaytext = ob;
	  
	  
	 
    }
	}
	if(querytype == '7'){
		if(rows.length == 0){
		output = "Sorry! We could not find anything! Can you try a different query please.";
  //  output = "Sorry! We could not find anything! Can you try a different query please.";
    var ob = {};
        var dataObject = {};
        dataObject[text] = output;
        ob[type] = "description";
        ob[displayString] = "Sorry! We could not find anything! Can you try a different query please.";
        ob[data] = dataObject;
        output_displaytext = ob;
      }
	  else{
		  var ob = {};
	var dataObject = {};
    dataObject[text] = rows[0].description;
	ob[type] = "description";
	ob[displayString] = "Description";
      var output = rows[0].description;
	  ob[data] = dataObject;
	  output_displaytext = ob;
    }
  }
  
	if(querytype == '8'){
	  if(rows.length == 0){
      output = "There are no results as per our records";
      
              var responseJson = {};
              var msgHdrJson = {};
              msgHdrJson["success"] = "true";
              msgHdrJson["error"] = "";
              msgHdrJson["cd"] = "200";
              msgHdrJson["rsn"] = "";
              responseJson["msgHdr"] = msgHdrJson;
              var msgBdyJson = {};
              msgBdyJson["userId"] = "Sarvesh";
              msgBdyJson["userImage"] = "https://scontent-amt2-1.cdninstagram.com/t51.2885-19/s150x150/14262769_342114716128056_857373176_a.jpg";
              msgBdyJson["text"] = output;
              msgBdyJson["attachments"] = [];
        
              responseJson["msgBdy"] = msgBdyJson;
              output_displaytext = responseJson;
      
          
      }
      else{
        var output = "The distribution of " + req.body.result.parameters['plot'] + " companies is like :" + rows[0].city + "=" + rows[0].no_of_companies + "\n"  + rows[1].city + "=" + rows[1].no_of_companies + "\n"  + rows[2].city + "=" + rows[2].no_of_companies + "\n";;
        var index;
        
        var responseJson = {};
        var msgHdrJson = {};
        msgHdrJson["success"] = "true";
        msgHdrJson["error"] = "";
        msgHdrJson["cd"] = "200";
        msgHdrJson["rsn"] = "";
        responseJson["msgHdr"] = msgHdrJson;
        var msgBdyJson = {};
        msgBdyJson["userId"] = "Sarvesh";
        msgBdyJson["userImage"] = "https://scontent-amt2-1.cdninstagram.com/t51.2885-19/s150x150/14262769_342114716128056_857373176_a.jpg";
        msgBdyJson["text"] = "";
        msgBdyJson["attachments"] = [];
        var attachmentsJson = {};
        var graphJson = {};
        graphJson["type"] = "graph";
        graphJson["title"] = "Distribution of " + req.body.result.parameters['plot'] + " companies.";
        graphJson["titleLink"] = "";
        graphJson["text"] = "";
        graphJson["toggle"] = "true";
        graphJson["graph"] = "bar";
        graphJson["labelHeader"] = "City";
        graphJson["valueHeader"] = "No. of Companies";
        
        
        var dataJson = {};
        graphJson["data"] = [];
        var i = 0;
        for(i = 0; i < 4;i++){
          dataJson = {};
          dataJson["label"] = rows[i].city;
          dataJson["value"] = rows[i].no_of_companies;
          graphJson["data"].push(dataJson);
          }
        msgBdyJson["attachments"].push(graphJson);
        responseJson["msgBdy"] = msgBdyJson;
        output_displaytext = responseJson;
        
    }
	}

if(querytype == '9'){
    if(rows.length == 0){
    output = "There are no results as per our records";

    output = "Sorry! We could not find anything! Can you try a different query please.";
    var ob = {};
        var dataObject = {};
        dataObject[text] = output;
        ob[type] = "description";
        ob[displayString] = "Sorry! We could not find anything! Can you try a different query please.";
        ob[data] = dataObject;
        output_displaytext = ob;
    }
    else{
    //if(rows == null){output = null;}
       //else{output = rows;} 
    var ob = {};
  var dataObject = {};
    dataObject[list] = [];
  ob[type] = "list";
    var singular = "0";
    if(rows.length == 1){singular = 'company';}
    else {singular = 'companies';}
    
    
      var output = "The " + req.body.result.parameters['domain'] + " related " + singular + " working in " + req.body.result.parameters['cityName'];
    ob[displayString] = output;
      for (index = 0; index < rows.length; ++index) {
        
    dataObject[list].push(rows[index].company);
    if (index == 0)
    {
      if (rows.length == 1){ output = output + "is , ";}
      else{output = output + "are ";}
        output = output + rows[index].company;
    }
        else if (index != rows.length - 1)
        output = output + ", " + rows[index].company;
        else 
        output = output + " and " + rows[index].company;
  
      }
    ob[data] = dataObject;
    output_displaytext = ob;
    
    
   
    }
  }
    res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));
    
  });

}
//gfghhjvhvj2324232sbdjhfbsdjfbsdhdsdfsdsfdfssdfssdfs



app.get('/',function(req, res) {
	res.send('Hello World!');
} );

app.post("/fintech", function(req, res) {
  botone(req, res);
}); 

app.post("/insurance", function(req, res) {
  insurance.bottwo(req, res);
});

app.post("/banking", function(req, res) {
  console.log("Hit the banking bot");
  banking.bankingBot(req, res);
});

app.post("/tataaia", function(req, res) {
  tataAia.tatabot(req, res);
});

app.post("/mlTataaia", function(req, res) {
  console.log("Hit the banking bot");
  tataAia.mlBot(req, res);
});

/*
fs.readFile('./ngui/app/index.html', function (err, html) {
    if (err) {
        console.log("Hi there. ");
    }       
    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(5001);
});
*/



var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});


