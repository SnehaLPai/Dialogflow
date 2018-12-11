var express = require("express");
var mysql = require('mysql');
var parser = require('body-parser');
var pg = require('pg');
var app = express();
var CSV = require('csv-string');
const https = require('https');
var index = require('./index');
var request = require('request');

exports.vabot = function vabot(req,res){
    console.log("yeah i am inside this function which is exported from virtualassistant.js");
    if(req.body.result.metadata['intentName'] == "ShowPayslip"){ 
        showpayslips(req,res);
       }
    
}

function showpayslips(req,res){
              var timespan = 1;
              if(req.body.result.parameters['timespan']){timespan = req.body.result.parameters['timespan'];}
              var output = "";
              var output_displaytext = "";
              var output = "Here you go. The password to view your payslips is your employee ID";
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
              msgBdyJson["text"] = "Sure, Let me get some details for you.";
              msgBdyJson["attachments"] = [];
              var attachmentsJson = {};
              var textJson = {};
              textJson["type"] = "text";

              if(timespan == 1){textJson["title"] = "Payslips for the last month. The password to view your payslips is your employee ID. \n\n ";}
              else{textJson["title"] = "Payslips for the last "+ timespan +" months. The password to view your payslips is your employee ID. \n\n ";}
              
              textJson["titleLink"] = "";
              textJson["subTitle"] = "";
              textJson["subTitleType"] = "";
              textJson["text"] = "";
              var query = "select * from payslips";
              index.connection.query(query, function(error,rows,fields){
                var dataJson ={};
                textJson["data"] = [];
                var i = 0;
                //console.log("these are the rows",JSON.stringify(rows[1]));
                console.log("these are the rows",rows[1]["month"]);
                //console.log("these are the rows",JSON.stringify(rows[1],month));
                
                for(i=0;i<timespan;i++){
                  dataJson = {};
                  dataJson["label"] = "";
                  dataJson["value"] = "View "+ rows[i]["month"] +" Payslip";
                  dataJson["short"] = "false";
                  dataJson["type"] = "pdf";
                  dataJson["link"] = rows[i]["link"];
                  textJson["data"].push(dataJson);
                  textJson["postText"] = "";
                  //console.log("these are the rows",JSON.stringify(rows[i]["month"]));
                  console.log(JSON.stringify(dataJson),"This is the stringified JSON for i = ",i);
                }
                           

              msgBdyJson["attachments"].push(textJson);
              console.log("This is the stringified pdf links ka json::",JSON.stringify(msgBdyJson["attachments"]));
              var buttonJson = {};
              buttonJson["type"] = "buttons";
              buttonJson["title"] = "";
              buttonJson["titleLink"] = "";
              buttonJson["text"] = "";
              buttonJson["buttonType"] = "button";
              buttonJson["callBackFn"] = "";
              buttonJson["postText"] = "";
              buttonJson["data"] = [];

              var dataJson = {};
              dataJson["name"] = "";
              dataJson["text"] = "Email self";
              dataJson["value"] = "";
              dataJson["type"] = "regular";
              dataJson["successMessage"] = "";
              dataJson["callBackFn"] = "Email self";
              
              buttonJson["data"].push(dataJson);

              var dataJson = {};
              dataJson["name"] = "";
              dataJson["text"] = "Salary Structure";
              dataJson["value"] = "";
              dataJson["type"] = "regular";
              dataJson["successMessage"] = "";
              dataJson["callBackFn"] = "Salary Structure";
             
              buttonJson["data"].push(dataJson);
              
              var dataJson = {};
              dataJson["name"] = "";
              dataJson["text"] = "Form 16";
              dataJson["value"] = "";
              dataJson["type"] = "regular";
              dataJson["successMessage"] = "";
              dataJson["callBackFn"] = "Form 16";
             
              buttonJson["data"].push(dataJson);

              
              
              msgBdyJson["attachments"].push(buttonJson);

              //console.log("This is the strigified msgbdy jason",JSON.stringify(msgBdyJson["attachments"][1]));

              responseJson["msgBdy"] = msgBdyJson;
              output_displaytext = responseJson;    
              //console.log(output, "here is the biutohfsidbfsdfihsdfjksbf")

              //console.log(output_displaytext, "here is the output un derscrope displaytext")
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));
                
            });
}