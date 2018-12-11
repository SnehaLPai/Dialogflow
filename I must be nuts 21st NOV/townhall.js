
/**
Copyright (c) Microsoft Corporation
All rights reserved. 
MIT License
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the ""Software""), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**/
var express = require("express");
var mysql = require('mysql');
var parser = require('body-parser');
var pg = require('pg');
var app = express();
var CSV = require('csv-string');
const https = require('https');


var request = require('request'),
    xmlbuilder = require('xmlbuilder'),
    wav = require('wav');
 //   Speaker = require('speaker');

exports.formatTime = function formatTime(req,res){
    if(req.body.result.metadata['intentName'] == "4.2 appointmentTime"){ 
        thformattime(req,res);
       }
    
}

function thformattime(req,res){
    if(req.body.result.parameters.compTime['time']){
        console.log("Hi, IDK what i am doing!");
        var timestring = req.body.result.parameters.compTime['time'];
        var date = req.body.result.parameters['date'];
        var truetime = "";
        truetime = processAmPm(timestring);
        var output = "Great. Mr. Karan Singh will meet you at P-W-C, Shivaji Park office on "+ date +" at "+ truetime +".";
        var output_displaytext = "Great. Mr. Karan Singh will meet you at P-W-C, Shivaji Park office on "+ date +" at "+ truetime +".";
     }
    else if(req.body.result.parameters.compTime['time-period']){
        console.log("Hi. Reached output from backend");
        var timestring = req.body.result.parameters.compTime['time-period'];
        var date = req.body.result.parameters['date'];
        var arr = timestring.split("/");  
        var truetime1 = "";
        var truetime2 = "";
        truetime1 = processAmPm(arr[0]);
        truetime2 = processAmPm(arr[1]);
        
        var output = "Great. Mr. Karan Singh will meet you at P-W-C, Shivaji Park office on "+ date +" between "+truetime1 +" and "+truetime2+". Thank you for your time. Have a nice day!";
        var output_displaytext = "Great. Mr. Karan Singh will meet you at P-W-C, Shivaji Park office on "+ date +" between "+truetime1 +" and "+truetime2+". Thank you for your time. Have a nice day!";
  
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
