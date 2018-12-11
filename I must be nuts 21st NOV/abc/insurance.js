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
  bottwo: function (req,res) {
  console.log("inside bottwo");

  if (req.body.result.parameters['category'] == '' || req.body.result.parameters['domain'] =='' || req.body.result.parameters['policy'] == '' || req.body.result.parameters['cartype'] == '' || req.body.result.parameters['age'] == '' || req.body.result.parameters['claimsno'] == '' || req.body.result.parameters['year'] == ''){
    var query = "select insurancedomains from insurancedomaintable";
    var querytype = '0';
  }
  
  
if(req.body.result.metadata['intentName'] == "GetCarDetails"){
  calculatePremiumFn(req,res);
  console.log("inside switch case");
}

   if(req.body.result.metadata['intentName'] == "ShowDomains"){
    getAllInsuranceProducts(req,res);
    console.log("inside show domains fn switch case");
  }

  if((req.body.result.metadata['intentName'] == "ShowPlans") || (req.body.result.metadata['intentName'] == 'ShowPlansbyContext')){
    showPlansFn(req,res);
  }

  if((req.body.result.metadata['intentName'] == "ShowPlanDescription") ||(req.body.result.metadata['intentName'] == "ShowPlanDescriptionbyContext")){
    showPlanDescriptionFn(req,res);
    
  }

  if(req.body.result.metadata['intentName'] == "BuyInsuranceGetReg"){ 
   // var query  = "insert into cust_table(Name,phoneNumber,timeofcreation) values('"+req.body.result.parameters['customer']+"','"+req.body.result.parameters['phoneNumber']+"',NOW())";
   // querytype = '5';
    buyInsuranceFn(req,res);

  }

  if(req.body.result.metadata['intentName'] == "ShowCustInfo"){ 
    showCustInfoFn(req,res);
  }

  if(req.body.result.metadata['intentName'] == "SendEmail"){ 
    sendEmailFn(req,res);
    
  }

  if(req.body.result.metadata['intentName'] == "SearchPlanWithDesc"){
    var query  = "select * from policytable where domain_name like '%"+req.body.result.parameters['domain']+"%' and features like '%" + req.body.result.parameters['feature'] + "%'";
    querytype = '8'; 
  }

  if(req.body.result.metadata['intentName'] == "SendQuoteEmail"){ 
    sendQuoteEmailFn(req,res);  
  }

  if(req.body.result.metadata['intentName'] == "ShowPremiumBreakup"){ 
    showPremiumBreakupFn(req,res);
  }

  if(req.body.result.metadata['intentName'] == "ShowPlansbyOption"){ 
    showPlansbyOptionFn(req,res);
  }

  if(req.body.result.metadata['intentName'] == "SearchCarRepair"){ 
    searchCarRepairFn(req,res);
  }
  if(req.body.result.metadata['intentName'] == "SendClaimsEmail"){ 
    sendClaimsEmailFn(req,res);
  }
  if(req.body.result.metadata['intentName'] == "ContactCustCare"){ 
   contactCustCareFn(req,res);
  }
  if(req.body.result.metadata['intentName'] == "InitiateClaim"){ 
    initiateClaimFn(req,res);
   }
   if(req.body.result.metadata['intentName'] == "InitiateClaimConfirm"){ 
    initiateClaimConfirmFn(req,res);
   }
   if(req.body.result.metadata['intentName'] == "ShowPlansYesNo"){ 
    showPlansYesNo(req,res);
   }
   if(req.body.result.metadata['intentName'] == "showProcessDescription"){ 
    getProcess(req,res);
   }
  


  
}
  }


  function showPlansYesNo(req,res){
    if(req.body.result.parameters['option'] == 'yes'){
      var query = "select policy_Name, overview, features from policytable";
      if(req.body.result.parameters['feature']){
        var arr = req.body.result.parameters['feature'];
        var query1  = "select policy_Name, overview, features from policytable where ";
        
        if(typeof(req.body.result.parameters['feature']) == 'object'){   
            var i=0;
            for(i=0;i<arr.length;i++){
                if(i==0){query = query + " where features like '%" + arr[i] + "%'";}
                else {query = query +" union "+ query1+ " features like '%" + arr[i] + "%'";}
               
             }  
          }
        else if(typeof(req.body.result.parameters['feature']) == 'string'){
          query = query + " where features like '%" + req.body.result.parameters['feature'] + "%'";
        }
      }

      connection.query(query, function(err,rows,fields){
        if(rows.length == 0){
      var query1 = "select policy_Name, overview, features from policytable";
      connection.query(query1, function(error,rows,fields){
        var output = "Here are some policies that I found : ";
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
        msgBdyJson["text"] = "Yes! We do have some insurance plans. Let me get some details for you.";
        msgBdyJson["attachments"] = [];
        var attachmentsJson = {};
        var cardJson = {};
        cardJson["type"] = "cards";
        var dataJson ={};
        cardJson["data"] = [];
        
        var rowlen = 4;
        if (rowlen > rows.length) {rowlen = rows.length};
  
        for(index = 0; index < rowlen; ++index){
          dataJson = {};
          plansarray[index] = rows[index].policy_Name;
          if (index == 0)
          output = output + rows[index].policy_Name;
          else if (index != rowlen - 1)
          output = output + ", " + rows[index].policy_Name;
          else 
          output = output + " and " + rows[index].policy_Name;
  
          dataJson["image"] = "https://etimg.etb2bimg.com/photo/55579807.cms";
          dataJson["title"] = rows[index].policy_Name;
          dataJson["subtitle"] = "";
          dataJson["description"] = rows[index].features;
          dataJson["postText"] = "Get more details.";
          dataJson["callBackFn"] = "Tell me more about "+rows[index].policy_Name;
          cardJson["data"].push(dataJson);
          msgBdyJson["attachments"].push(cardJson);
          responseJson["msgBdy"] = msgBdyJson;
          output_displaytext = responseJson;
      
  
          }
       
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));
      });
      
}
      });
    }
  }


  
  function initiateClaimConfirmFn(req,res){
    var query  = "select * from cust_info where phone_number='"+req.body.result.parameters['phoneNumber']+"'";
    querytype = '6';
connection.query(query, function(err,rows,fields){
  output = rows;
  output_displaytext = rows;
  
    if(rows.length == "0"){
      output = "Sorry, I could not find any customer registered with the phone number you provided. Please check the number you have entered.";
      
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
      var output = "Your policy status is " + rows[0].claimstatus;
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
      

      var itemListJson = {};
      itemListJson["type"] = "itemList";
      itemListJson["title"] = "";
      itemListJson["data"] = [];
      var itemJson = {};
      itemJson["item"] = "Policy Details";
      itemJson["details"] = [];
    
      var detailsJson = {};
      detailsJson["label"] = "Name";
      detailsJson["value"] = rows[0].Name;
      itemJson["details"].push(detailsJson);
      var detailsJson = {};
      detailsJson["label"] = "Car";
      detailsJson["value"] = rows[0].car_name;
      itemJson["details"].push(detailsJson);
      var detailsJson = {};
      detailsJson["label"] = "Registration";
      detailsJson["value"] = rows[0].registration;
      itemJson["details"].push(detailsJson);
      var detailsJson = {};
      detailsJson["label"] = "Plan";
      detailsJson["value"] = rows[0].plan_name;
      itemJson["details"].push(detailsJson);
      var detailsJson = {};
      detailsJson["label"] = "Insurance Premium";
      detailsJson["value"] = "&#8377" + " " + rows[0].Premium;
      itemJson["details"].push(detailsJson);
      var detailsJson = {};
      detailsJson["label"] = "Start Date";
      detailsJson["value"] = rows[0].start_date;
      itemJson["details"].push(detailsJson);
      var detailsJson = {};
      detailsJson["label"] = "End Date";
      detailsJson["value"] = rows[0].end_date;
      itemJson["details"].push(detailsJson);
      var detailsJson = {};
      detailsJson["label"] = "Claim Status";
      detailsJson["value"] = rows[0].claimstatus;
      itemJson["details"].push(detailsJson);
    
      itemListJson["data"].push(itemJson);
      msgBdyJson["attachments"].push(itemListJson);

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
      dataJson["text"] = "Email Details";
      dataJson["value"] = "";
      dataJson["type"] = "regular";
      dataJson["successMessage"] = "";
      dataJson["callBackFn"] = "email me the details";
      
      buttonJson["data"].push(dataJson);
    
      var dataJson = {};
      dataJson["name"] = "";
      dataJson["text"] = "Initiate Claim";
      dataJson["value"] = "";
      dataJson["type"] = "regular";
      dataJson["successMessage"] = "";
      dataJson["callBackFn"] = "Confirm claim initiation.";
     
      buttonJson["data"].push(dataJson);
    
      msgBdyJson["attachments"].push(buttonJson);


      responseJson["msgBdy"] = msgBdyJson;
      output_displaytext = responseJson;    
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.send({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext)});
  }); 

  }



  function initiateClaimFn(req,res){
    query = "update cust_info set claimstatus ='Claim Initiated' where phone_number = '"+ req.body.result.parameters['phoneNumber']+"'";
    connection.query(query,function(error,rows,fields){
      if(error){
        output = "Sorry, I could not find any customer registered with the phone number you provided. Please check the number you have entered.";
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
        output = "Your claim has been initiated.";
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
      res.send({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext)});
     
    });
  }



  function contactCustCareFn(req,res){
    output = "Our executives will soon contact you.";
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
    res.setHeader('Content-Type', 'application/json');
    res.send({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext)});
   
    
  }


  function sendClaimsEmailFn(req,res){
    query = "select 1";
    connection.query(query, function(err,rows,fields){
      
            if(rows.length == '0'){
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
          else {    
            
            var senderEmail = "sarveshvaidya92@gmail.com";
            var receiverEmail = req.body.result.parameters['email'];
        
            //req.body.result.parameters['emailid'];
            var mailSubject = "Insurance Claims Details";
            var mailbody = "Lets see. can be composed later.";
      
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
              text: mailbody
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



  function showCustInfoFn(req,res){
    var query  = "select * from cust_info where phone_number='"+req.body.result.parameters['phoneNumber']+"'";
    querytype = '6';
connection.query(query, function(err,rows,fields){
  output = rows;
  output_displaytext = rows;
  
    if(rows.length == "0"){
      output = "Sorry, I could not find any customer registered with the phone number you provided. Please check the number you have entered.";
      
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
      var output = "Your policy status is " + rows[0].claimstatus;
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
      

      var itemListJson = {};
      itemListJson["type"] = "itemList";
      itemListJson["title"] = "";
      itemListJson["data"] = [];
      var itemJson = {};
      itemJson["item"] = "Policy Details";
      itemJson["details"] = [];
    
      var detailsJson = {};
      detailsJson["label"] = "Name";
      detailsJson["value"] = rows[0].Name;
      itemJson["details"].push(detailsJson);
      var detailsJson = {};
      detailsJson["label"] = "Car";
      detailsJson["value"] = rows[0].car_name;
      itemJson["details"].push(detailsJson);
      var detailsJson = {};
      detailsJson["label"] = "Registration No.";
      detailsJson["value"] = rows[0].registration;
      itemJson["details"].push(detailsJson);
      var detailsJson = {};
      detailsJson["label"] = "Plan";
      detailsJson["value"] = rows[0].plan_name;
      itemJson["details"].push(detailsJson);
      var detailsJson = {};
      detailsJson["label"] = "Insurance Premium";
      detailsJson["value"] = rows[0].Premium;
      itemJson["details"].push(detailsJson);
      var detailsJson = {};
      detailsJson["label"] = "Start Date";
      detailsJson["value"] = rows[0].start_date;
      itemJson["details"].push(detailsJson);
      var detailsJson = {};
      detailsJson["label"] = "End Date";
      detailsJson["value"] = rows[0].end_date;
      itemJson["details"].push(detailsJson);
      var detailsJson = {};
      detailsJson["label"] = "Claim Status";
      detailsJson["value"] = rows[0].claimstatus;
      itemJson["details"].push(detailsJson);
    
      itemListJson["data"].push(itemJson);
      msgBdyJson["attachments"].push(itemListJson);

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
      dataJson["text"] = "Email Details";
      dataJson["value"] = "";
      dataJson["type"] = "regular";
      dataJson["successMessage"] = "";
      dataJson["callBackFn"] = "email me the details";
      
      buttonJson["data"].push(dataJson);
    
      var dataJson = {};
      dataJson["name"] = "";
      dataJson["text"] = "Contact Us";
      dataJson["value"] = "";
      dataJson["type"] = "regular";
      dataJson["successMessage"] = "";
      dataJson["callBackFn"] = "Connect me to customer care";
     
      buttonJson["data"].push(dataJson);
    
      msgBdyJson["attachments"].push(buttonJson);


      responseJson["msgBdy"] = msgBdyJson;
      output_displaytext = responseJson;    
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.send({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext)});
  }); 

  }



  function buyInsuranceFn(req,res){
    if(policyVar != ""){var policy_name = policyVar;}
    else{var policy_name = policyFromOption;}

    //var query  = "insert into cust_table(Name,phoneNumber,timeofcreation) values('"+req.body.result.parameters['customer']+"','"+req.body.result.parameters['phoneNumber']+"',NOW())";
    var query = "insert into cust_info values('"+req.body.result.parameters['customer']+"','"+policy_name+"',"+"CURDATE()"+","+"CURDATE() + INTERVAL 365 DAY"+",'"+premium+"','"+req.body.result.parameters['phoneNumber']+"','"+carvar+"','"+req.body.result.parameters['regno']+"','"+req.body.result.parameters['email']+"','"+"None"+"')";
    // querytype = '5';
   connection.query(query, function(error,rows,fields){
    if(error){
      output = "I am sorry. Something went wrong in gathering your details.";
      
      var responseJson = {};
      var msgHdrJson = {};
      msgHdrJson["success"] = "false";
      msgHdrJson["error"] = "";
      msgHdrJson["cd"] = "400";
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
     output = "Thank you for the information. Your details have been recorded. Our executives will soon get in touch with you.";
     
     
     
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
     res.send({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext)});
  
   });

   //var newquery = 'select ID from cust_table ORDER BY ID DESC LIMIT 1';
   //connection.query(newquery, function(err, rows, fields) { 
   //newoutput = rows[0].ID;
   
  policyFromOption = "";
  policy_name = "";
  }
  

  /**method for calling google maps places api */
  function searchPlaces(path,res,res){
    console.log(path);
    //var path = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=19.150269,72.853025&rankby=distance&types=car_wash&key=AIzaSyBYCwlMeu0bsC6oApIS3-T7ilX9wtaZoVE";
    request.get(path, function(error, response, body) {
    if (error){
      output = "I am sorry. Map services are currently down.";
      
      
      
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
      console.log("inside response");  			
      var parsedOutput = JSON.parse(response.body);
     
    
      for (var i = 0; i < 3; i++) {
        if (i == 0)
        output = output + parsedOutput.results[i]['name'];
        else if (i != parsedOutput.results.length - 1)
        output = output + ", " + parsedOutput.results[i]['name'];
        else 
        output = output + " and " + parsedOutput.results[i]['name'];
      }



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
      var mapJson = {};
      mapJson["type"] = "map";
      mapJson["title"] = "Car Repair Shops";
      mapJson["titleLink"] = "";
      mapJson["text"] = "";
      
      mapJson["data"] = [];

      for(var j = 0; j<3; j++){
        var dataJson = {};
        dataJson['name'] = parsedOutput.results[j].name;
        dataJson['latitude'] = parsedOutput.results[j]['geometry']['location']['lat'];
        dataJson['longitude'] = parsedOutput.results[j]['geometry']['location']['lng'];
        dataJson['vicinity'] = parsedOutput.results[j].vicinity;
        mapJson["data"].push(dataJson);
      }

      msgBdyJson["attachments"].push(mapJson);

      
      responseJson["msgBdy"] = msgBdyJson;




      output_displaytext = responseJson;
      res.setHeader('Content-Type', 'application/json');
      res.send({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext)});
     
    }
  });
  }

  function branchsearchfn(req,res){
    query = "select * from branchTable";
    connection.query(query, function(err,rows,fields){
      output = "I found some of our offices nearby. ";
      
      for (var i = 0; i < rows.length; i++) {
        if (i == 0)
        output = output + rows[i].branchName;
        else if (i != rows.length - 1)
        output = output + ", " + rows[i].branchName;
        else 
        output = output + " and " + rows[i].branchName;
      }

      console.log(rows);
      console.log(err);

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
      var mapJson = {};
      mapJson["type"] = "map";
      mapJson["title"] = "";
      mapJson["titleLink"] = "";
      mapJson["text"] = "";
      
      mapJson["data"] = [];

      for(var j = 0; j<rows.length; j++){
        var dataJson = {};
        dataJson['name'] = rows[j].branchName;
        dataJson['latitude'] = rows[j].lat;
        dataJson['longitude'] = rows[j].lng;
        dataJson['vicinity'] = rows[j].vicinity;
        mapJson["data"].push(dataJson);
      }

      msgBdyJson["attachments"].push(mapJson);

      
      responseJson["msgBdy"] = msgBdyJson;




      output_displaytext = responseJson;

      res.setHeader('Content-Type', 'application/json');
      res.send({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext)});
    });
  }


  function searchCarRepairFn(req,res){
    var path="";
    if(req.body.result.parameters['placefeature']){
      if(req.body.result.parameters['placefeature']=='branch'){branchsearchfn(req,res);}
      else {
      if(req.body.result.parameters['placefeature'] == "carwash"){var mapvar = "car_wash";output = "I found some Car repair shops nearby. ";}
      else if(req.body.result.parameters['placefeature'] == "hospital"){var mapvar = "hospital";output = "I found some Hospitals nearby. ";}
       path= "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + req.body.result.parameters['lat'] + "," + req.body.result.parameters['long'] + "&rankby=distance&types=" + mapvar + "&key=AIzaSyBYCwlMeu0bsC6oApIS3-T7ilX9wtaZoVE"; 
       searchPlaces(path,req,res);
      
      }
      }
    else{
      path = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + req.body.result.parameters['lat'] + "," + req.body.result.parameters['long'] + "&rankby=distance&types=" + "car_wash" + "&key=AIzaSyBYCwlMeu0bsC6oApIS3-T7ilX9wtaZoVE";
      output = "I found some Car repair shops nearby. ";
    
  }

}




  function showPlansbyOptionFn(req,res){
    var optionNumber = req.body.result.parameters['optionNumber'];
    optionNumber = optionNumber - 1;
    console.log(optionNumber);
    console.log("Hey, above is the option number and below is the policyfromoption");
    policyFromOption = plansarray[optionNumber];
    console.log(policyFromOption);
  
    var query  = "select policy_Name, overview, pdf_link, features, rating, video_link from policytable where policy_Name = '"+policyFromOption+"'";
    querytype = '4';
  
    connection.query(query, function(err,rows,fields){
        if(rows.length == 0){ 
          output = "I couldnot find any such plan";
          output = output + ". I do have some interesting auto insurance plans providing Cashless Claims, Third party coverage, Breakdown assistance and much more. Would you like me to show them?";   
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
          dataJson["text"] = "Yes";
          dataJson["value"] = "";
          dataJson["type"] = "regular";
          dataJson["successMessage"] = "";
          dataJson["callBackFn"] = "Show me auto insurance plans";
          
          buttonJson["data"].push(dataJson);
        
          var dataJson = {};
          dataJson["name"] = "";
          dataJson["text"] = "No";
          dataJson["value"] = "";
          dataJson["type"] = "regular";
          dataJson["successMessage"] = "";
          dataJson["callBackFn"] = "No";
         
          buttonJson["data"].push(dataJson);
          
          
          responseJson["msgBdy"] = msgBdyJson;
          output_displaytext = responseJson;
  
            }
        
            else{ 
              var output = policyFromOption + " is a plan that provides " + rows[0].features;
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
              textJson["title"] = rows[0].policy_Name;
              textJson["titleLink"] = "";
              textJson["subTitle"] = rows[0].rating;
              console.log(typeof rows[0].rating);
              console.log("showing the type of rating stars");
              textJson["subTitleType"] = "stars";
              textJson["text"] = "";
              
              var dataJson ={};
              textJson["data"] = [];
              var i = 0;
              var str = rows[0].features;
              var arr = str.split(",");
              for(i = 0; i < arr.length;i++){
                dataJson = {};
                console.log(typeof(rows[0].features));
                console.log("console log : in showplandescFn .... Hi this is the type of features.......................");
                dataJson["label"] = "";
                dataJson["value"] = arr[i];
                dataJson["short"] = "false";
                dataJson["type"] = "text";
                dataJson["link"] = "";
                textJson["data"].push(dataJson);
                }
              dataJson = {};
              dataJson["label"] = "";
              dataJson["value"] = "View Product Video";
              dataJson["short"] = "true";
              dataJson["type"] = "video";
              dataJson["link"] = rows[0].video_link;
              textJson["data"].push(dataJson);

              dataJson = {};
              dataJson["label"] = "";
              dataJson["value"] = "View Product Brochure";
              dataJson["short"] = "true";
              dataJson["type"] = "pdf";
              dataJson["link"] = rows[0].pdf_link;
              textJson["data"].push(dataJson);
              textJson["postText"] = "";

              msgBdyJson["attachments"].push(textJson);

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
              dataJson["text"] = "Email Details";
              dataJson["value"] = "";
              dataJson["type"] = "regular";
              dataJson["successMessage"] = "";
              dataJson["callBackFn"] = "Email me the details";
              
              buttonJson["data"].push(dataJson);

              var dataJson = {};
              dataJson["name"] = "";
              dataJson["text"] = "Calculate Premium";
              dataJson["value"] = "";
              dataJson["type"] = "regular";
              dataJson["successMessage"] = "";
              dataJson["callBackFn"] = "Calculate my insurance premium";
             
              buttonJson["data"].push(dataJson);

              msgBdyJson["attachments"].push(buttonJson);

              responseJson["msgBdy"] = msgBdyJson;
              output_displaytext = responseJson;    
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));
  });


  }



  function showPremiumBreakupFn(req,res){
    var query = "select value as brandvalue, brand as brandName from car_brands where model_name like '%" + req.body.result.parameters['model'] + "%'";
    querytype = '1';

    connection.query(query, function(err,rows,fields){

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
     var discount = 0.35 * premium;   
     var tempPrem = premium + discount - 150;
     var odPrem = 0.6 * tempPrem;
     var tpPrem = 0.4 * tempPrem;
     

     var output = "The premium breakup consists of Basic OD Premium amounting to rupees "+ odPrem + ", Basic TP premium amounting to rupees "+tpPrem+", PA Owner-Driver charges of rupees 100 and LL Driver charges of rupees 50. Also OD discount of rupees "+discount+" has been deducted.";

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

var quoteJson = {};
quoteJson["type"] = "doubleColumnText";

quoteJson["leftTitle"] = rows[0].brandName + " " + req.body.result.parameters['model'];
quoteJson["leftSubTitle"] = "";


quoteJson["leftTitleLink"] = "";
quoteJson["lefTitleType"] = "text";

quoteJson["leftSubTitleCallbackFn"] = "";
quoteJson["leftData"] = [];
var leftData = req.body.result.parameters['engineType'];
quoteJson["leftData"].push(leftData);
var leftData = req.body.result.parameters['transmissionType'];
quoteJson["leftData"].push(leftData);

quoteJson["rightTitle"] = "&#8377"+ " " + premium + "/-";
quoteJson["rightTitleLink"] = "";
quoteJson["rightTitleType"] = "price";
quoteJson["rightSubTitle"] = "";
quoteJson["rightSubTitleCallbackFn"] = "";
quoteJson["rightData"] = [];

msgBdyJson["attachments"].push(quoteJson);

  var itemListJson = {};
  itemListJson["type"] = "itemList";
  itemListJson["title"] = "";
  itemListJson["data"] = [];
  var itemJson = {};
  itemJson["item"] = "Basic Covers";
  itemJson["details"] = [];

  var detailsJson = {};
  detailsJson["label"] = "Basic OD Premium";
  detailsJson["value"] = "&#8377 " + odPrem + "/-";
  itemJson["details"].push(detailsJson);

  var detailsJson = {};
  detailsJson["label"] = "Basic TP Premium";
  detailsJson["value"] = "&#8377 " + tpPrem + "/-";
  itemJson["details"].push(detailsJson);

  var detailsJson = {};
  detailsJson["label"] = "PA Owner-Driver";
  detailsJson["value"] = "&#8377 150/-";
  itemJson["details"].push(detailsJson);

  var detailsJson = {};
  detailsJson["label"] = "LL Driver";
  detailsJson["value"] = "&#8377 50/-";
  itemJson["details"].push(detailsJson);
  itemListJson["data"].push(itemJson);

  var itemJson = {};
  itemJson["item"] = "Addon Covers";
  itemJson["details"] = [];

  var detailsJson = {};
  detailsJson["label"] = "No Addon";
  detailsJson["value"] = "";
  itemJson["details"].push(detailsJson);
  itemListJson["data"].push(itemJson);

  var itemJson = {};
  itemJson["item"] = "Discount";
  itemJson["details"] = [];

  var detailsJson = {};
  detailsJson["label"] = "OD Discount";
  discount = discount.toFixed(2);
  detailsJson["value"] = "- &#8377 "+discount;
  itemJson["details"].push(detailsJson);
  itemListJson["data"].push(itemJson);

  msgBdyJson["attachments"].push(itemListJson);

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
  dataJson["text"] = "Email Details";
  dataJson["value"] = "";
  dataJson["type"] = "regular";
  dataJson["successMessage"] = "";
  dataJson["callBackFn"] = "Email me the details";
  
  buttonJson["data"].push(dataJson);

  var dataJson = {};
  dataJson["name"] = "";
  dataJson["text"] = "Buy";
  dataJson["value"] = "";
  dataJson["type"] = "regular";
  dataJson["successMessage"] = "";
  dataJson["callBackFn"] = "I am interested in purchasing this insurance plan.";
 
  buttonJson["data"].push(dataJson);

  msgBdyJson["attachments"].push(buttonJson);

  responseJson["msgBdy"] = msgBdyJson;
  output_displaytext = responseJson;    
}

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));
});
  
  
      }
  




  
  function sendQuoteEmailFn(req,res){
    query = "select 1";
    connection.query(query, function(err,rows,fields){
      
            if(rows.length == '0'){
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
          else {    
            
            var senderEmail = "sarveshvaidya92@gmail.com";
            var receiverEmail = req.body.result.parameters['email'];
        
            //req.body.result.parameters['emailid'];
            var mailSubject = "Auto Insurance Quotation";
            var mailbody = "The premium is " + premium;
            var idvvalue = premium * 19;
            var htmlbody = '<p>Dear Customer,</p><br><p>Sharing some details about insurance premium. </p><br><table align="center" border="1" cellpadding="0" cellspacing="0" width="600"><tr><td>Car :</td><td>'+req.body.result.parameters['category']+'</td></tr><tr><td>Engine Type :</td><td>'+req.body.result.parameters['engineType']+'</td></tr></tr><tr><td>Transmission Type :</td><td>'+req.body.result.parameters['transmissionType']+'</td></tr></table><br><table align="center" border="1" cellpadding="0" cellspacing="0" width="600"><tr><td>Insurance Premium :</td><td>'+premium+'</td></tr><td>IDV :</td><td>'+idvvalue+'</td></tr><tr><td>Zero Depreciation. No Additional Cover.</td></tr></table><br><p>We would be happy to assist you for any more information or if you require help purchasing this insurance plan.</p><br><p>Reach out to us at <a href="http://125.22.109.58:8090/chatbot">XYZ Insurance Assistant</a></p><br><p>Warm Regards,</p><br><p>XYZ Insurance Team</p>';
      
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




  function calculatePremiumFn(req,res){
    
    var query = "select value as brandvalue, brand as brandName from car_brands where model_name like '%" + req.body.result.parameters['model'] + "%'";
   // var query  = "select value as categoryValue from car_category where brand like '%" + req.body.result.parameters['category'] + "%'" ;
    querytype = '1';
    console.log("query composed");
    carvar = req.body.result.parameters['model'];
    if(req.body.result.parameters['brand']){carvar = req.body.result.parameters['brand'] + " " + carvar;}
    connection.query(query, function(err,rows,fields){
    
    if(rows.length == '0'){
      output = "Sorry, I could not calculate insurance premium for your car.";
      
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
        
      var brandValue = rows[0].brandvalue;
      var calculatedAge = "0";
      var eValue = "0";
      var tValue = "0";
      console.log("inside else"); 
      if(req.body.result.parameters['engineType'] == "petrol"){eValue = "1";}
      else if(req.body.result.parameters['engineType'] == "diesel"){eValue = "2"}
      else if(req.body.result.parameters['engineType'] == "electric"){eValue = "3"}

      if(req.body.result.parameters['transmissionType'] == "automatic"){tValue = "1";}
      else if(req.body.result.parameters['transmissionType'] == "manual"){tValue = "2"}


      var ageValue = req.body.result.parameters['age'];
      var totalValue = "0";
  
      brandValue = brandValue*100;
      ageValue = ageValue*25;
      tValue = tValue*50;
      eValue = eValue*50;
      console.log(brandValue);
      console.log('Hi, this is the brand value');
      //claimValue = claimValue*50;
  
      var totalValue = brandValue + tValue + ageValue + eValue;
  
      premium = totalValue * 30;
      var output = "I found an insurance plan best suited for your vehicle. The plan amounts to a annual premium of Rupees " + premium +". Would you be interested in purchasing it?";

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
  msgBdyJson["text"] = "Here is some information about the annual premium for the Insurance plan.";
  msgBdyJson["attachments"] = [];
  var attachmentsJson = {};
  var quoteJson = {};
  quoteJson["type"] = "doubleColumnText";

  quoteJson["leftTitle"] = rows[0].brandName + " " + req.body.result.parameters['model'];
  quoteJson["leftSubTitle"] = "";
  
  
  quoteJson["leftTitleLink"] = "";
  quoteJson["leftTitleType"] = "text";
  
  quoteJson["leftSubTitleCallbackFn"] = "";
  quoteJson["leftData"] = [];
  var leftData = req.body.result.parameters['engineType'];
  quoteJson["leftData"].push(leftData);
  var leftData = req.body.result.parameters['transmissionType'];
  quoteJson["leftData"].push(leftData);
  var value = String(premium).replace(/(.)(?=(\d{3})+$)/g,'$1,');
  var idvvalue = String(premium * 19).replace(/(.)(?=(\d{3})+$)/g,'$1,')
  
  console.log(value);
  console.log(typeof premium);
  
  quoteJson["rightTitle"] = "&#8377"+ " " + value + "/-";
  quoteJson["rightTitleLink"] = "";
  quoteJson["rightTitleType"] = "price";
  quoteJson["rightSubTitle"] = "Premium Breakup";
  quoteJson["rightSubTitleCallbackFn"] = "Show me the Premium Breakup";
  quoteJson["rightData"] = [];

  msgBdyJson["attachments"].push(quoteJson);

  var quoteJson = {};
  quoteJson["type"] = "doubleColumnText";
  quoteJson["leftTitle"] = "IDV";
  quoteJson["leftTitleLink"] = "";
  quoteJson["leftTitleType"] = "text";
  quoteJson["leftSubTitle"] = "&#8377"+ " " + idvvalue + "/-";
  quoteJson["leftSubTitleCallbackFn"] = "";
  quoteJson["leftData"] = [];
  

  quoteJson["rightTitle"] = "";
  quoteJson["rightTitleLink"] = "";
  quoteJson["rightTitleType"] = "text";
  quoteJson["rightSubTitle"] = "";
  quoteJson["rightSubTitleCallbackFn"] = "";
  quoteJson["rightData"] = ["Zero Depreciation","No Additional Cover"];

  msgBdyJson["attachments"].push(quoteJson);



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
  dataJson["text"] = "Email Details";
  dataJson["value"] = "";
  dataJson["type"] = "regular";
  dataJson["successMessage"] = "";
  dataJson["callBackFn"] = "email me the details";
  
  buttonJson["data"].push(dataJson);

  var dataJson = {};
  dataJson["name"] = "";
  dataJson["text"] = "Buy";
  dataJson["value"] = "";
  dataJson["type"] = "regular";
  dataJson["successMessage"] = "";
  dataJson["callBackFn"] = "I am interested in purchasing this insurance";
 
  buttonJson["data"].push(dataJson);

  msgBdyJson["attachments"].push(buttonJson);

  responseJson["msgBdy"] = msgBdyJson;
  output_displaytext = responseJson;    
}

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));
});
  
  
      }
  


  function sendEmailFn(req,res){
    console.log(policyFromOption);
    console.log("Showing policyFromOption from outside of if clause");
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


  function showPlanDescriptionFn(req,res){
    var query  = "select policy_Name, overview, pdf_link, features, rating, video_link from policytable where policy_Name = '"+req.body.result.parameters['policy']+"'";
    querytype = '4';
  
    connection.query(query, function(err,rows,fields){
        if(rows.length == 0){ 
          output = "I couldnot find any such plan";
          output = output + ". I do have some interesting auto insurance plans providing Cashless Claims, Third party coverage, Breakdown assistance and much more. Would you like me to show them?";   
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
          dataJson["text"] = "Yes";
          dataJson["value"] = "";
          dataJson["type"] = "regular";
          dataJson["successMessage"] = "";
          dataJson["callBackFn"] = "Show me auto insurance plans";
          
          buttonJson["data"].push(dataJson);
        
          var dataJson = {};
          dataJson["name"] = "";
          dataJson["text"] = "No";
          dataJson["value"] = "";
          dataJson["type"] = "regular";
          dataJson["successMessage"] = "";
          dataJson["callBackFn"] = "No";
         
          buttonJson["data"].push(dataJson);
        
          msgBdyJson["attachments"].push(buttonJson);
          
          responseJson["msgBdy"] = msgBdyJson;
          output_displaytext = responseJson;
  
            }
        
            else{ 
              var output = req.body.result.parameters['policy'] + " is a plan that provides " + rows[0].features;
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
              textJson["title"] = rows[0].policy_Name;
              textJson["titleLink"] = "";
              textJson["subTitle"] = rows[0].rating;
              console.log(typeof rows[0].rating);
              console.log("showing the type of rating stars");
              textJson["subTitleType"] = "stars";
              textJson["text"] = "";
              policyVar = rows[0].policy_Name;

              var dataJson ={};
              textJson["data"] = [];
              var i = 0;
              var str = rows[0].features;
              var arr = str.split(",");
              for(i = 0; i < arr.length;i++){
                dataJson = {};
                console.log(typeof(rows[0].features));
                console.log("console log : in showplandescFn .... Hi this is the type of features.......................");
                dataJson["label"] = "";
                dataJson["value"] = arr[i];
                dataJson["short"] = "false";
                dataJson["type"] = "text";
                dataJson["link"] = "";
                textJson["data"].push(dataJson);
                }
              dataJson = {};
              dataJson["label"] = "";
              dataJson["value"] = "View Product Video";
              dataJson["short"] = "true";
              dataJson["type"] = "video";
              dataJson["link"] = rows[0].video_link;
              textJson["data"].push(dataJson);

              dataJson = {};
              dataJson["label"] = "";
              dataJson["value"] = "View Product Brochure";
              dataJson["short"] = "true";
              dataJson["type"] = "pdf";
              dataJson["link"] = rows[0].pdf_link;
              textJson["data"].push(dataJson);
              textJson["postText"] = "";

              msgBdyJson["attachments"].push(textJson);

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
              dataJson["text"] = "Email Details";
              dataJson["value"] = "";
              dataJson["type"] = "regular";
              dataJson["successMessage"] = "";
              dataJson["callBackFn"] = "Email me the details";
              
              buttonJson["data"].push(dataJson);

              var dataJson = {};
              dataJson["name"] = "";
              dataJson["text"] = "Calculate Premium";
              dataJson["value"] = "";
              dataJson["type"] = "regular";
              dataJson["successMessage"] = "";
              dataJson["callBackFn"] = "Calculate my insurance premium";
             
              buttonJson["data"].push(dataJson);

              msgBdyJson["attachments"].push(buttonJson);

              responseJson["msgBdy"] = msgBdyJson;
              output_displaytext = responseJson;    
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));
  });
}

  function getAllInsuranceProducts(req,res)
  {
    var query  = "select insurancedomains from insurancedomaintable";
    querytype = '2';
    console.log("insude getAllInsuranceProducts function..........");
    connection.query(query, function(err,rows,fields){
          
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
          var output = "Here are the different insurance products that we offer : ";
          var index;
            for (index = 0; index < rows.length; ++index) {
              if (index == 0)
              output = output + rows[index].insurancedomains;
              else if (index != rows.length - 1)
              output = output + ", " + rows[index].insurancedomains;
              else 
              output = output + " and " + rows[index].insurancedomains;
            }
          output = output + ". Would you be interested in knowing about any specific type of insurance. ";

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
          msgBdyJson["text"] = "Here are the different insurance products that we offer. Would you be interested in knowing about any specific type of insurance.";
          msgBdyJson["attachments"] = [];
          var attachmentsJson = {};
          var textJson = {};
          textJson["type"] = "text";
          textJson["title"] = "";
          textJson["titleLink"] = "";
          textJson["subTitle"] = "";
          textJson["subTitleType"] = "";
          textJson["text"] = "";
          
          var dataJson = {};
          textJson["data"] = [];
          var i = 0;
          for(i = 0; i < rows.length;i++){
            dataJson = {};
            console.log("re initializing dataJson");
            console.log(dataJson);
            dataJson["label"] = "";
            dataJson["value"] = rows[i].insurancedomains;
            dataJson["short"] = "false";
            dataJson["type"] = "text";
            dataJson["link"] = "";
            textJson["data"].push(dataJson);
            }
          msgBdyJson["attachments"].push(textJson);

          responseJson["msgBdy"] = msgBdyJson;
          output_displaytext = responseJson;
          
      }
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));

    });
  }

function showPlansFn(req,res)
{
  console.log("Here me out. here is the type of variable");
  console.log(typeof(req.body.result.parameters['feature']));
  var query = "select policy_Name, overview, features from policytable";

if(req.body.result.parameters['feature']){
  var arr = req.body.result.parameters['feature'];
  var query1  = "select policy_Name, overview, features from policytable where ";
  
  if(typeof(req.body.result.parameters['feature']) == 'object'){   
      var i=0;
      for(i=0;i<arr.length;i++){
          if(i==0){query = query + " where features like '%" + arr[i] + "%'";}
          else {query = query +" union "+ query1+ " features like '%" + arr[i] + "%'";}
         
       }  
    }
  else if(typeof(req.body.result.parameters['feature']) == 'string'){
    query = query + " where features like '%" + req.body.result.parameters['feature'] + "%'";
  }
}  
  
  querytype = '3';

  connection.query(query, function(err,rows,fields){
          if(rows.length == 0){
          output = "I couldnot find any plans which provide ";
          if(typeof(req.body.result.parameters['feature']) == 'object'){   
            var i=0;
            for(i=0;i<arr.length;i++){
                if(i==0){output = output + " "+ arr[i];}
                else if(i != arr.length-1){output = output + ", "+ arr[i];}
                else{output = output + " or " + arr[i];}
               
             }  
          }
          else if(typeof(req.body.result.parameters['feature']) == 'string'){
            output = output + req.body.result.parameters['feature'];
          }
          

         output = output + ". I do have some interesting auto insurance plans providing Cashless Claims, Third party coverage, Breakdown assistance and much more. Would you like me to show them?";   
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
        dataJson["text"] = "Yes";
        dataJson["value"] = "";
        dataJson["type"] = "regular";
        dataJson["successMessage"] = "";
        dataJson["callBackFn"] = "Show me auto insurance plans";
        
        buttonJson["data"].push(dataJson);
      
        var dataJson = {};
        dataJson["name"] = "";
        dataJson["text"] = "No";
        dataJson["value"] = "";
        dataJson["type"] = "regular";
        dataJson["successMessage"] = "";
        dataJson["callBackFn"] = "No";
       
        buttonJson["data"].push(dataJson);
      
        msgBdyJson["attachments"].push(buttonJson);

        
        responseJson["msgBdy"] = msgBdyJson;
        output_displaytext = responseJson;

          }
      
          else{
            var encodedImage = "0";
            var decodedImage = "0"; 
            fs.readFile('insurance_image.jpg', function(err, data) {
              if (err) throw err;
            
              // Encode to base64
              var encodedImage = new Buffer(data, 'binary').toString('base64');
            
              // Decode from base64
              var decodedImage = new Buffer(encodedImage, 'base64').toString('binary');
            });
            console.log(encodedImage);  
            console.log(decodedImage); 
            console.log("Heyy,, here is encoded and decoded images from ShowPlansFn");    
        var output = "Here are some policies that I found : ";
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
        msgBdyJson["text"] = "Yes! We do have some insurance plans. Let me get some details for you.";
        msgBdyJson["attachments"] = [];
        var attachmentsJson = {};
        var cardJson = {};
        cardJson["type"] = "cards";
        var dataJson ={};
        cardJson["data"] = [];
        
        var rowlen = 4;
        if (rowlen > rows.length) {rowlen = rows.length};

        for(index = 0; index < rowlen; ++index){
          dataJson = {};
          plansarray[index] = rows[index].policy_Name;
          if (index == 0)
          output = output + rows[index].policy_Name;
          else if (index != rowlen - 1)
          output = output + ", " + rows[index].policy_Name;
          else 
          output = output + " and " + rows[index].policy_Name;

          dataJson["image"] = "https://etimg.etb2bimg.com/photo/55579807.cms";
          dataJson["title"] = rows[index].policy_Name;
          dataJson["subtitle"] = "";
          dataJson["description"] = rows[index].features;
          dataJson["postText"] = "Get more details.";
          dataJson["callBackFn"] = "Tell me more about "+rows[index].policy_Name;
          cardJson["data"].push(dataJson);
         }
      
        
        msgBdyJson["attachments"].push(cardJson);
        responseJson["msgBdy"] = msgBdyJson;
        output_displaytext = responseJson;
          }
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));
  });
}

function getProcess(req,res) {
  
var output = "";
var query = "select * from insurance_process where process like '%"+req.body.result.parameters['process']+"%'";




connection.query(query, function(error,rows,fields){
  var str = "";
  var arr = "";
  if(error){
    output = "Sorry, we were unable to get you the requested information.";
      
}
else if(rows.length == '0'){
      output = "Sorry, we did not find any information.";
      console.log(output);
}
else{
  str = rows[0].description;
  arr = str.split("|");

      output = "";
}
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
msgBdyJson["text"] = "Let me get some details about "+req.body.result.parameters['process']+ " process";
msgBdyJson["attachments"] = [];
var textJson = {};
textJson["type"] = "text";
textJson["title"] = req.body.result.parameters['process']+" Process details.";
textJson["titleLink"] = "";
textJson["subTitle"] = "";
textJson["subTitleType"] = "text";
textJson["text"] = "";

var dataJson ={};
textJson["data"] = [];
var i = 0;
for(i = 0; i < arr.length;i++){
  dataJson = {};
  dataJson["label"] = "";
  dataJson["value"] = i+1 +") "+arr[i]; 
  dataJson["short"] = "false";
  dataJson["type"] = "text";
  dataJson["link"] = "";
  textJson["data"].push(dataJson);
  }

textJson["postText"] = "";

msgBdyJson["attachments"].push(textJson);

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
dataJson["text"] = "Email Details";
dataJson["value"] = "";
dataJson["type"] = "regular";
dataJson["successMessage"] = "";
dataJson["callBackFn"] = "Yes";

buttonJson["data"].push(dataJson);

var dataJson = {};
dataJson["name"] = "";
dataJson["text"] = "Claim Insurance";
dataJson["value"] = "";
dataJson["type"] = "regular";
dataJson["successMessage"] = "";
dataJson["callBackFn"] = "I want to claim my insurance";

buttonJson["data"].push(dataJson);

msgBdyJson["attachments"].push(buttonJson);

responseJson["msgBdy"] = msgBdyJson;
output_displaytext = responseJson; 
res.setHeader('Content-Type', 'application/json');
res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));    
})

}


