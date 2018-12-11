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
    if(req.body.result.metadata['intentName'] == 'showForm16'){
      showform16(req,res);
    }
    if(req.body.result.metadata['intentName'] == 'showSalaryStructure'){
      showSalaryStrucutre(req,res);
    }
    
}

function showSalaryStrucutre(req,res){
  var output = "";
  var output_displaytext = "";
  var output = "Here you go. This PDF below contains your Salary Structure document.";
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

  textJson["title"] = "Here you go. This PDF below contains your Salary Structure document.";

  
  textJson["titleLink"] = "";
  textJson["subTitle"] = "";
  textJson["subTitleType"] = "";
  textJson["text"] = "";
  //var query = "select * from payslips";

 
    var dataJson ={};
    textJson["data"] = [];
   
    //console.log("these are the rows",JSON.stringify(rows[1]));
    //console.log("these are the rows",rows[1]['month']);
    //console.log("these are the rows",JSON.stringify(rows[1],month));

    
    dataJson = {};
    dataJson["label"] = "";
    dataJson["value"] = "View Salary Structure.";
    dataJson["short"] = "false";
    dataJson["type"] = "pdf";
    dataJson["link"] = "https://boi.gov.in/sites/default/files/MONTHLY%20SALARY%20CERTIFICATE%20.pdf";
    textJson["data"].push(dataJson);
    textJson["postText"] = "";
      //console.log("these are the rows",JSON.stringify(rows[i]["month"]));
      
    
               

  msgBdyJson["attachments"].push(textJson);
  console.log("This is the stringified pdf links ka json::",JSON.stringify(msgBdyJson["attachments"]));
 

  //console.log("This is the strigified msgbdy jason",JSON.stringify(msgBdyJson["attachments"][1]));

  responseJson["msgBdy"] = msgBdyJson;
  output_displaytext = responseJson;    
  //console.log(output, "here is the biutohfsidbfsdfihsdfjksbf")

  //console.log(output_displaytext, "here is the output un derscrope displaytext")
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));
    




}




function showform16(req,res){
              var output = "";
              var output_displaytext = "";
              var output = "Here you go. This PDF below contains the form 16 document.";
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

              textJson["title"] = "Here you go. This PDF below contains the form 16 document.";
            
              
              textJson["titleLink"] = "";
              textJson["subTitle"] = "";
              textJson["subTitleType"] = "";
              textJson["text"] = "";
              //var query = "select * from payslips";

             
                var dataJson ={};
                textJson["data"] = [];
               
                //console.log("these are the rows",JSON.stringify(rows[1]));
                //console.log("these are the rows",rows[1]['month']);
                //console.log("these are the rows",JSON.stringify(rows[1],month));

                
                dataJson = {};
                dataJson["label"] = "";
                dataJson["value"] = "View Form 16.";
                dataJson["short"] = "false";
                dataJson["type"] = "pdf";
                dataJson["link"] = "https://www.incometaxindia.gov.in/forms/income-tax%20rules/103120000000007849.pdf";
                textJson["data"].push(dataJson);
                textJson["postText"] = "";
                  //console.log("these are the rows",JSON.stringify(rows[i]["month"]));
                  
                
                           

              msgBdyJson["attachments"].push(textJson);
              console.log("This is the stringified pdf links ka json::",JSON.stringify(msgBdyJson["attachments"]));
             

              //console.log("This is the strigified msgbdy jason",JSON.stringify(msgBdyJson["attachments"][1]));

              responseJson["msgBdy"] = msgBdyJson;
              output_displaytext = responseJson;    
              //console.log(output, "here is the biutohfsidbfsdfihsdfjksbf")

              //console.log(output_displaytext, "here is the output un derscrope displaytext")
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));
                
          



}







var arr1 = [];
var arr2 = [];
var arr = [];
var timespan = 1;
var month_number = 0;
var end_month = 0;
var query = "";
var for_loop_parameter = 0;
var start_year = 0;
var end_year = 0;

function showpayslips(req,res){
              var date1 = "2017-12-01";
              var date2 = "2018-01-01";
              
              if(date1 > date2){console.log("Hi date 1 is greater than date2")}
              if(date1 < date2){console.log("Hi date 1 is less than date2")}
              if((!req.body.result.parameters['date-period'])&&(!req.body.result.parameters['timespan'])){
                query = "select * from payslips";
                for_loop_parameter = 1;
              }
              if(req.body.result.parameters['date-period']){
                console.log("Hey I am inside the date-period and not the timespan");
                timespan = req.body.result.parameters['date-period'];
                console.log("This is the timespan ",timespan);
               
                arr = timespan.split('/');
                console.log("This is the arr ",arr[0]);
                console.log("This is the arr ",arr[1]);
                
                arr1 = arr[0].split('-');
                arr2 = arr[1].split('-');
                console.log("This is the arr1 ",arr1[0]);
                console.log("This is the arr2 ",arr2[0]);
                if(arr1[0] == arr2[0]){ // if same year
                  if(arr1[1] == arr2[1]){ //if same month
                    month_number = arr1[1];
                    console.log("This is the month_number when arr1[0] == arr2[0] ", month_number);
                    query = "select * from payslips where month_number >= " + month_number;
                    for_loop_parameter = month_number;
                  }
                  else if(arr1[1] !== arr2[1]){ //if different month

                    month_number = parseInt(arr1[1],10);
                    end_month = parseInt(arr2[1],10);
                    end_month = end_month + 1;
                    console.log("This is the month_number when arr1[1] !== arr2[0] ", month_number);
                    console.log("This is the end_month when arr1[0] == arr2[0] ", end_month);
                    query = "select * from payslips where month_date >= " + arr[0] + " and month_number <= " + arr[1];
                    for_loop_parameter = 99;
                  }
                }

                if(arr1[0] !== arr2[0]){ // if not same year
                  month_number = parseInt(arr1[1],10);
                  end_month = parseInt(arr2[1],10);
                  end_month = end_month + 1;

                  start_year = parseInt(arr1[0],10);
                  end_year = parseInt(arr2[0],10);
                  query = "select * from payslips where month_date >= " + arr[0] + " and month_number <= " + arr[1];
                  //query = "select * from payslips where month_number >= " + month_number + " and month_number <= 12 union select * from payslips where month_number <= " + end_month; //This is logic is a bit flawed but I will fix it once we scale to a bigger database.
                  //for_loop_parameter = 13 - month_number;
                  //for_loop_parameter = for_loop_parameter + end_month;
                  for_loop_parameter = 99;
                }

              }
              if(req.body.result.parameters['timespan']){
                
                timespan = req.body.result.parameters['timespan'];
                console.log("This is the timespan frmo inside timepsan block", timespan);
                query = "select * from payslips";
                for_loop_parameter = timespan;

              }
    
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
              //var query = "select * from payslips";

              index.connection.query(query, function(error,rows,fields){
                var dataJson ={};
                textJson["data"] = [];
                var i = 0;
                //console.log("these are the rows",JSON.stringify(rows[1]));
                //console.log("these are the rows",rows[1]['month']);
                //console.log("these are the rows",JSON.stringify(rows[1],month));

                if(for_loop_parameter == 99){for_loop_parameter = rows.length};
                for(i=0;i<for_loop_parameter;i++){
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


function sendEmail(req,res){

  //console.log(policyFromOption);
  //console.log("Showing policyFromOption from outside of if clause");
  if(req.body.result.parameters['policy'] == ""){
  console.log(policyFromOption);
  console.log("Showing policyFromOption from inside of if clause");
  var query  = "select policy_Name, overview, pdf_link, features, rating, video_link from policytable where policy_Name = '"+policyFromOption +"'";
  }
  else
  {
    var query  = "select policy_Name, overview, pdf_link, features, rating, video_link from policytable where policy_Name = '"+req.body.result.parameters['policy']+"'";
  }
  
  connection.query(query, function(err,rows,fields){

    if(rows.length == '0'){
      output = "Sorry I couldnot find any information about the policy.";

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
  else {    
    
    var senderEmail = "sarveshvaidya92@gmail.com";
    var receiverEmail = req.body.result.parameters['email'];

    //req.body.result.parameters['emailid'];
    var mailSubject = rows[0].policy_Name + " Insurance plan details";
    var mailbody = rows[0].overview + "          " + " Product Brochure : " + rows[0].pdf_link + "             " + " Product Video Link "+ rows[0].video_link;
    var htmlbody = '<p>Dear Customer,</p><br><p>Sharing some details about <b>'+rows[0].policy_Name+'</b> insurance plan that you showed interest in.</p><br><table align="center" border="1" cellpadding="0" cellspacing="0" width="600"><tr><td>Description :</td><td>'+rows[0].overview+'</td></tr><tr><td>Product Brochure :</td><td><a href="'+rows[0].pdf_link+'">Insurance Policy PDF</a></td></tr><tr><td>Product Brochure :</td><td><a href="'+rows[0].video_link+'">Insurance Policy Video</a></td></tr></table><br><p>We would be happy to assist you for any more information or if you require help purchasing this insurance plan.</p><br><p>Reach out to us at <a href="http://125.22.109.58:8090/chatbot">XYZ Insurance Assistant</a></p><br><p>Warm Regards,</p><br><p>XYZ Insurance Team</p>';
var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: senderEmail,
        pass: 'gEsundheit$92'
      }
    });
    
    var mailOptions = {
      from: senderEmail,
      to: receiverEmail,
      subject: mailSubject,
      text: mailbody,
      html: htmlbody
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    output = "Email containing the requested information has been sent to you.";
    
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
    
          
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));
    });





}