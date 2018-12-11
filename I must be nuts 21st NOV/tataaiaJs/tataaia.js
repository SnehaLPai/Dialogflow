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
var index = require('./index');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'TNPass100!',
    database: 'experience_schema',
    debug: "true"
  });


module.exports = {
  tatabot: function (req,res) {
  console.log("inside tatabot");

  
   if((req.body.result.metadata['intentName'] == "3.0.1 Callback - Yes") ||(req.body.result.metadata['intentName'] == "3.0.1 Callback - Yes") ){ 
    formattime(req,res);
   }
   if(req.body.result.metadata['intentName'] == "7.0 Confirmation" ){ 
    formattimeAppointment(req,res);
   }
}
  }

  function formattimeAppointment(req,res){
    if(req.body.result.parameters.compositeTime['time']){
        console.log("Hi, IDK what i am doing!");
        var timestring = req.body.result.parameters.compositeTime['time'];
        var truetime = "";
        truetime = processAmPm(timestring);
        var output = "Perfect, Scheduling a meeting with our expert on 2018-01-18 at "+truetime +" . He will visit you at B 310 Oberoi Splendor, Saki naka, Mumbai. You should receive a call from him, before his arrival. Is that okay?";
        var output_displaytext = output;
      }
    else if(req.body.result.parameters.compositeTime['time-period']){
        console.log("Hi. Reached output from backend");
        var timestring = req.body.result.parameters.compositeTime['time-period'];
        var arr = timestring.split("/");  
        var truetime1 = "";
        var truetime2 = "";
        truetime1 = processAmPm(arr[0]);
        truetime2 = processAmPm(arr[1]);
        
        var output = "Perfect, Scheduling a meeting with our expert on 2018-01-18 between "+truetime1 +" and "+truetime2+" . He will visit you at B 310 Oberoi Splendor, Saki naka, Mumbai. You should receive a call from him, before his arrival. Is that okay?";
        var output_displaytext = output;
      
        //var output = "Hi. Reached output from backend";
        //var output_displaytext = "Hi. Reached output from backend";

    }              
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));
            
  }


  function formattime(req,res){
    if(req.body.result.parameters.compositeTime['time']){
        console.log("Hi, IDK what i am doing!");
        var timestring = req.body.result.parameters.compositeTime['time'];
        var truetime = "";
        truetime = processAmPm(timestring);
        var output = "Thank you Mr Sachin Goel. I will call you back on 2017-12-28 at  "+truetime +". Thank you for your time. Have a nice day!";
        var output_displaytext = "Thank you Mr Sachin Goel. I will call you back on 2017-12-28 between "+truetime+". Thank you for your time. Have a nice day!";
     }
    else if(req.body.result.parameters.compositeTime['time-period']){
        console.log("Hi. Reached output from backend");
        var timestring = req.body.result.parameters.compositeTime['time-period'];
        var arr = timestring.split("/");  
        var truetime1 = "";
        var truetime2 = "";
        truetime1 = processAmPm(arr[0]);
        truetime2 = processAmPm(arr[1]);
        
        var output = "Thank you Mr Sachin Goel. I will call you back on 2017-12-28 between "+truetime1 +" and "+truetime2+". Thank you for your time. Have a nice day!";
        var output_displaytext = "Thank you Mr Sachin Goel. I will call you back on 2017-12-28 between "+truetime1 +" and "+truetime2+". Thank you for your time. Have a nice day!";
  
        //var output = "Hi. Reached output from backend";
        //var output_displaytext = "Hi. Reached output from backend";

    }              
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));
            
  }

  function processAmPm(timestring){
    var arr = timestring.split(":");  
    var timearr = "";
    var ampm = "a-m";
    if(arr[0]>12){
      arr[0] = arr[0]-12;
      ampm = "p-m"
    }
    if (arr[1] == 0){ 
      timearr = arr[0];
      timearr = timearr + " " +ampm;
    }
    else{
      timearr = arr[0]+","+arr[1];
      timearr = timearr + " " +ampm;
    }
    return (timearr);
  }


  



