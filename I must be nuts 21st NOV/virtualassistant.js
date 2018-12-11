var express = require("express");
var mysql = require('mysql');
var parser = require('body-parser');
var pg = require('pg');
var app = express();
var CSV = require('csv-string');
const https = require('https');
var index = require('./index');
var request = require('request');
var nodemailer = require('nodemailer');

var imagelinkarray = [];
imagelinkarray.push("zero");



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
    if(req.body.result.metadata['intentName'] == 'EmailPayslip'){
      sendEmail(req,res);
    }
    if(req.body.result.metadata['intentName'] == 'ShowSexualHarassmentPolicy'){
      showSHP(req,res);
    }
    if(req.body.result.metadata['intentName'] == 'searchProfile'){
      searchProfile(req,res);
    }
    if(req.body.result.metadata['intentName'] == 'profileDetails'){
      profileDetails(req,res);
    }
    if(req.body.result.metadata['intentName'] == 'applyLeaves'){
      applyLeaves(req,res);
    }
    if(req.body.result.metadata['intentName'] == 'searchProfileBySpecialisation'){
      searchProfileBySpecialisation(req,res);
    }
    if(req.body.result.metadata['intentName'] == 'LeavePolicy'){
      LeavePolicy(req,res);
    }
    if(req.body.result.metadata['intentName'] == 'FindRelationship'){
      FindRelationship(req,res);
    }
    if((req.body.result.metadata['intentName'] == 'ReimbursableBenifits')||(req.body.result.metadata['intentName'] == 'Reimbursements-LTA')||(req.body.result.metadata['intentName'] == 'ReimbursableBenifits - Telephone')||(req.body.result.metadata['intentName'] == 'ReimbursableBenifits - medical')||(req.body.result.metadata['intentName'] == 'ReimbursableBenifits - Carlease')){
      readPdf(req,res);
    }
    if(req.body.result.metadata['intentName'] == 'RFB.Document'){
      showPdf(req,res);
    }
    if((req.body.result.metadata['intentName'] == 'Reimbursements-LTA - info')||(req.body.result.metadata['intentName'] == 'ReimbursableBenifits - Telephone - info')||(req.body.result.metadata['intentName'] == 'ReimbursableBenifits - medical - info')||(req.body.result.metadata['intentName'] == 'ReimbursableBenifits - Carlease - info')){
      detailPdf(req,res);
    }
}

function detailPdf(req,res){
  var fakeparam = "";
  if(req.body.result.parameters['pdfkey'] == "lta.limit"){fakeparam = "lta.compliance"}
  if(req.body.result.parameters['pdfkey'] == "medical.limits"){fakeparam = "medical.compliance"}
  if(req.body.result.parameters['pdfkey'] == "telephone.limits"){fakeparam = "telephone.compliance"}
  if(req.body.result.parameters['pdfkey'] == "carlease.limits"){fakeparam = "carlease.compliance"}
  
  var reqbody = {};
  var messagelistarr = [];
  var insideobject = {};

  insideobject["text"] = fakeparam;
 
 
  messagelistarr.push(insideobject)
 
  reqbody["messageList"] = messagelistarr;
  console.log("this is the stringified request",reqbody);
  
  var headers = {
    'Content-Type':     'application/json'
  }

  // Configure the request
  var options = {
    uri: 'http://ec2-13-126-19-209.ap-south-1.compute.amazonaws.com:8082/ml/v1/document/messages',
    method: 'POST',
    json: reqbody
  }

  request(options, function(error, response, body) {
    if (error){
      output = "I am sorry. My services are currently down.";
      console.log("error has come bro...")
      
      
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
      //console.log("This is the reponseeeeee,", response)
      //var parsedOutput = JSON.parse(response.body);
      var output = "";
      var output_displaytext = "";
      output = response.body.data.messageList[0].text;
      var splitstring = output.split("\n")
      
      output_displaytext = response.body.data.messageList[0].text;
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
      msgBdyJson["text"] = "Sure, let me get some details.";
      msgBdyJson["attachments"] = [];
      var textJson = {};
      textJson["type"] = "text";
      textJson["title"] = "";
      textJson["titleLink"] = "";
      textJson["subTitle"] = "";
      textJson["subTitleType"] = "text";
      textJson["text"] = "";
      
      var dataJson ={};
      textJson["data"] = [];
      var parsedresponse = JSON.stringify(response);
      console.log("This is the stringified response",parsedresponse);
      for(var i = 0; i < splitstring.length; i++)
      {
        dataJson = {};
        dataJson["label"] = "";
        dataJson["value"] =  splitstring[i];
        dataJson["short"] = "false";
        dataJson["type"] = "text";
        dataJson["link"] = "";
        textJson["data"].push(dataJson);
      } 
    
      textJson["postText"] = "";

      msgBdyJson["attachments"].push(textJson);

      /**Insert button jason here*/
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
      dataJson["callBackFn"] = "";
      
      buttonJson["data"].push(dataJson);
    
      var dataJson = {};
      dataJson["name"] = "";
      dataJson["text"] = "Share";
      dataJson["value"] = "";
      dataJson["type"] = "regular";
      dataJson["successMessage"] = "";
      dataJson["callBackFn"] = "";
     
      buttonJson["data"].push(dataJson);

      var dataJson = {};
      dataJson["name"] = "";
      dataJson["text"] = "View Document";
      dataJson["value"] = "";
      dataJson["type"] = "regular";
      dataJson["successMessage"] = "";
      dataJson["callBackFn"] = "Show me RFB document";
     
      buttonJson["data"].push(dataJson);
    
      msgBdyJson["attachments"].push(buttonJson);
      responseJson["msgBdy"] = msgBdyJson;
      output_displaytext = responseJson;
      res.setHeader('Content-Type', 'application/json');
      res.send({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext)});
     
    }
  });


}


function showPdf(req,res){
  var output = "";
  var output_displaytext = "";
  var output = "Here is the document for the company's R-F-B policy.";
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
  msgBdyJson["text"] = "Here is the document for the company's Reimbursable flexible benefits policy.";
  msgBdyJson["attachments"] = [];
  var attachmentsJson = {};
  var textJson = {};
  textJson["type"] = "text";
  textJson["title"] = ""; 
  textJson["titleLink"] = "";
  textJson["subTitle"] = "";
  textJson["subTitleType"] = "";
  textJson["text"] = "";
  //var query = "select * from payslips";

 
  var dataJson ={};
  textJson["data"] = [];

  dataJson = {};
  dataJson["label"] = "";
  dataJson["value"] = "Employee's RFB policy.";
  dataJson["short"] = "false";
  dataJson["type"] = "pdf";
  dataJson["link"] = "https://storage.googleapis.com/databasesearch/abc/Employee%20perks%20handbook.pdf";
  textJson["data"].push(dataJson);
  textJson["postText"] = "";
      //console.log("these are the rows",JSON.stringify(rows[i]["month"]));
      
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
  dataJson["callBackFn"] = "";
  
  buttonJson["data"].push(dataJson);

  var dataJson = {};
  dataJson["name"] = "";
  dataJson["text"] = "Share";
  dataJson["value"] = "";
  dataJson["type"] = "regular";
  dataJson["successMessage"] = "";
  dataJson["callBackFn"] = "";
 
  buttonJson["data"].push(dataJson);
 
  
  msgBdyJson["attachments"].push(buttonJson);
  responseJson["msgBdy"] = msgBdyJson;
  output_displaytext = responseJson;    
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));
    
}


function readPdf(req,res){
  var reqbody = {};
  var messagelistarr = [];
  var insideobject = {};

  insideobject["text"] = req.body.result.parameters['pdfkey'];
 
 
  messagelistarr.push(insideobject)
 
  reqbody["messageList"] = messagelistarr;
  console.log("this is the stringified request",reqbody);
  
  var headers = {
    'Content-Type':     'application/json'
  }

  // Configure the request
  var options = {
    uri: 'http://ec2-13-126-19-209.ap-south-1.compute.amazonaws.com:8082/ml/v1/document/messages',
    method: 'POST',
    json: reqbody
  }

  request(options, function(error, response, body) {
    if (error){
      output = "I am sorry. My services are currently down.";
      console.log("error has come bro...")
      
      
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
      //console.log("This is the reponseeeeee,", response)
      //var parsedOutput = JSON.parse(response.body);
      var output = "";
      var output_displaytext = "";
      output = response.body.data.messageList[0].text;
      var splitstring = output.split("\n")
      
      output_displaytext = response.body.data.messageList[0].text;
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
      msgBdyJson["text"] = "Sure, let me get some details.";
      msgBdyJson["attachments"] = [];
      var textJson = {};
      textJson["type"] = "text";
      textJson["title"] = "";
      textJson["titleLink"] = "";
      textJson["subTitle"] = "";
      textJson["subTitleType"] = "text";
      textJson["text"] = "";
      
      var dataJson ={};
      textJson["data"] = [];
      var parsedresponse = JSON.stringify(response);
      console.log("This is the stringified response",parsedresponse);
      for(var i = 0; i < splitstring.length; i++)
      {
        dataJson = {};
        dataJson["label"] = "";
        dataJson["value"] =  splitstring[i];
        dataJson["short"] = "false";
        dataJson["type"] = "text";
        dataJson["link"] = "";
        textJson["data"].push(dataJson);
      } 
    
      textJson["postText"] = "";

      msgBdyJson["attachments"].push(textJson);

      /**Insert button jason here*/
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
      dataJson["callBackFn"] = "";
      
      buttonJson["data"].push(dataJson);
    
      var dataJson = {};
      dataJson["name"] = "";
      if(req.body.result.metadata['intentName'] == 'ReimbursableBenifits')
      {
        dataJson["text"] = "Share";
      }
      else
      {
        dataJson["text"] = "More details";
      }
      dataJson["value"] = "";
      dataJson["type"] = "regular";
      dataJson["successMessage"] = "";
      if(req.body.result.metadata['intentName'] == 'ReimbursableBenifits')
      {
        dataJson["callBackFn"] = "";
      }
      else
      {
        dataJson["callBackFn"] = "More details about " + req.body.result.parameters['pdfkey'];
      }
      
     
      buttonJson["data"].push(dataJson);

      var dataJson = {};
      dataJson["name"] = "";
      dataJson["text"] = "View Document";
      dataJson["value"] = "";
      dataJson["type"] = "regular";
      dataJson["successMessage"] = "";
      dataJson["callBackFn"] = "Show me RFB document";
     
      buttonJson["data"].push(dataJson);
    
      msgBdyJson["attachments"].push(buttonJson);


     
      responseJson["msgBdy"] = msgBdyJson;




      output_displaytext = responseJson;
      res.setHeader('Content-Type', 'application/json');
      res.send({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext)});
     
    }
  });

}

function FindRelationship(req,res){
  imagelinkarray = [];
  imagelinkarray.push("zero");

  if(req.body.result.parameters['specialisation']){
    var query = "select * from employeetable where relationship like '%"+req.body.result.parameters['relationship']+"%' and specialisation like '%"+req.body.result.parameters['specialisation']+"%'";
  }
  else{  
    var query = "select * from employeetable where relationship like '%"+req.body.result.parameters['relationship']+"%'";
  }
  index.connection.query(query, function(err,rows,fields){
          if(rows.length == 0){
          output = "I am sorry. I could not find anyone meeting that criteria.";
             
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
        if(rows.length == 1){var output = "Here are some details about "+ rows[0].employee_name;}
        else{var output = "Here are some profiles that I found ";}
        
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

        if(rows.length == 1){msgBdyJson["text"] = "Here are some details about our associate who works with "+req.body.result.parameters['relationship'] ;}
        else{msgBdyJson["text"] = "Here are some people who work with "+req.body.result.parameters['relationship'];}
       
        msgBdyJson["attachments"] = [];
        var attachmentsJson = {};
        var cardJson = {};
        cardJson["type"] = "profile";
        var dataJson ={};
        cardJson["data"] = [];
        //var contactSplit = [];

        var rowlen = 4;
        if (rowlen > rows.length) {rowlen = rows.length};
        var i = 0;
        var k = 0;
        
        for(i = 0; i < rowlen; ++i){
          dataJson = {};
          var contactSplit = rows[i].contact_details.split("|");
          console.log(contactSplit[0],"jeez... this is cntct split"); 
          dataJson["image"] = rows[i].image_link;
          dataJson["title"] = rows[i].employee_name;
          dataJson["subtitle"] = "";
          dataJson["description"] = rows[i].contact_details;
          dataJson["description1"] = contactSplit[0];
          dataJson["description2"] = contactSplit[1];
          console.log("This is the datajason description::",dataJson["description1"]);
          console.log("This is the datajason description::",dataJson["description2"]);
          console.log("This is the datajason description::",dataJson["description"]);
          dataJson["postText"] = "Get more details.";
          k = i + 1;
          dataJson["callBackFn"] = "Give me more detaiils about match "+ k;
          cardJson["data"].push(dataJson);
          imagelinkarray.push(rows[i].image_link);
         }
      
        console.log("This is the card jason ",cardJson);

        msgBdyJson["attachments"].push(cardJson);
        responseJson["msgBdy"] = msgBdyJson;
        output_displaytext = responseJson;
          }
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));
  });

}

function LeavePolicy(req,res){
  var output = "";
  var output_displaytext = "";
  var output = "Here is the document for the company's Leave Policy.";
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
  msgBdyJson["text"] = "Here is the document for the company's Leave Policy.";
  msgBdyJson["attachments"] = [];
  var attachmentsJson = {};
  var textJson = {};
  textJson["type"] = "text";
  textJson["title"] = ""; 
  textJson["titleLink"] = "";
  textJson["subTitle"] = "";
  textJson["subTitleType"] = "";
  textJson["text"] = "";
  //var query = "select * from payslips";

 
  var dataJson ={};
  textJson["data"] = [];

  dataJson = {};
  dataJson["label"] = "";
  dataJson["value"] = "Leave Policy Document.";
  dataJson["short"] = "false";
  dataJson["type"] = "pdf";
  dataJson["link"] = "http://preview-templates.biztreeapps.com/thumbnails_size/460px/26276.png";
  textJson["data"].push(dataJson);
  textJson["postText"] = "";
      //console.log("these are the rows",JSON.stringify(rows[i]["month"]));
      
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
  dataJson["text"] = "Holiday List";
  dataJson["value"] = "";
  dataJson["type"] = "regular";
  dataJson["successMessage"] = "";
  dataJson["callBackFn"] = "Show holiday list";
  
  buttonJson["data"].push(dataJson);

  var dataJson = {};
  dataJson["name"] = "";
  dataJson["text"] = "Apply Leaves";
  dataJson["value"] = "";
  dataJson["type"] = "regular";
  dataJson["successMessage"] = "";
  dataJson["callBackFn"] = "I want to apply for leaves";
 
  buttonJson["data"].push(dataJson);
 
  
  msgBdyJson["attachments"].push(buttonJson);
  responseJson["msgBdy"] = msgBdyJson;
  output_displaytext = responseJson;    
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));
    
}


function searchProfileBySpecialisation(req,res){
  imagelinkarray = [];
  imagelinkarray.push("zero");
  if(req.body.result.parameters['specialisation']){
  var query = "select * from employeetable where specialisation like '%"+req.body.result.parameters['specialisation']+"%'";

  index.connection.query(query, function(err,rows,fields){
          if(rows.length == 0){
          output = "I am sorry. I could not find anyone working on "+ req.body.result.parameters['specialisation'] +".";
             
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
        if(rows.length == 1){var output = "Here are some details about "+ rows[0].employee_name;}
        else{var output = "Here are some profiles that I found ";}
        
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

        if(rows.length == 1){msgBdyJson["text"] = "Here are some details about our "+req.body.result.parameters['specialisation'];}
        else{msgBdyJson["text"] = "Here are some people who specialise as "+req.body.result.parameters['specialisation'];}
       
        msgBdyJson["attachments"] = [];
        var attachmentsJson = {};
        var cardJson = {};
        cardJson["type"] = "profile";
        var dataJson ={};
        cardJson["data"] = [];
        //var contactSplit = [];

        var rowlen = 4;
        if (rowlen > rows.length) {rowlen = rows.length};
        var i = 0;
        var k = 0;
        
        for(i = 0; i < rowlen; ++i){
          dataJson = {};
          var contactSplit = rows[i].contact_details.split("|");
          console.log(contactSplit[0],"jeez... this is cntct split"); 
          dataJson["image"] = rows[i].image_link;
          dataJson["title"] = rows[i].employee_name;
          dataJson["subtitle"] = "";
          dataJson["description"] = rows[i].contact_details;
          dataJson["description1"] = contactSplit[0];
          dataJson["description2"] = contactSplit[1];
          console.log("This is the datajason description::",dataJson["description1"]);
          console.log("This is the datajason description::",dataJson["description2"]);
          console.log("This is the datajason description::",dataJson["description"]);
          dataJson["postText"] = "Get more details.";
          k = i + 1;
          dataJson["callBackFn"] = "Give me more detaiils about match "+ k;
          cardJson["data"].push(dataJson);
          imagelinkarray.push(rows[i].image_link);
         }
      
        console.log("This is the card jason ",cardJson);

        msgBdyJson["attachments"].push(cardJson);
        responseJson["msgBdy"] = msgBdyJson;
        output_displaytext = responseJson;
          }

        
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));
  });
  }
  else{
    output = "We do not have any associate with such a profile.";
    
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

    msgBdyJson["text"] = "We do not have any associate with such a profile.";
    
   
    msgBdyJson["attachments"] = [];
    responseJson["msgBdy"] = msgBdyJson;
    output_displaytext = responseJson;
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));
  }
  
}

function applyLeaves(req,res){
  var output = "";
  var output_displaytext = "";
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
  msgBdyJson["text"] = "Sure, Please fill in the details below.";
  msgBdyJson["attachments"] = [];
  var attachmentsJson = {};
  

  var itemListJson = {};
  itemListJson["type"] = "form";
  itemListJson["title"] = "";
  itemListJson["data"] = [];
  var itemJson = {};
  itemJson["item"] = "Profile Details";
  itemJson["details"] = [];
  
  itemListJson["data"].push(itemJson);
  msgBdyJson["attachments"].push(itemListJson);

  

  responseJson["msgBdy"] = msgBdyJson;
  output_displaytext = responseJson;    


  res.setHeader('Content-Type', 'application/json');
  res.send({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext)});
}
    


function profileDetails(req,res){
  var query = "select * from employeetable where image_link='"+imagelinkarray[req.body.result.parameters['matchnumber']] + "'";
  var output = "";
  var output_displaytext = "";
  index.connection.query(query, function(err,rows,fields){
   
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
    msgBdyJson["text"] = "Here are the contact details for "+rows[0].employee_name;
    msgBdyJson["attachments"] = [];
    var attachmentsJson = {};
    
    var contactSplit = []
    contactSplit = rows[0].contact_details.split("|");

    var itemListJson = {};
    itemListJson["type"] = "itemList";
    itemListJson["title"] = "";
    itemListJson["data"] = [];
    var itemJson = {};
    itemJson["item"] = "Contact Details";
    itemJson["details"] = [];
    console.log(rows,"This is the rows.... can you believe it...");
    
    var detailsJson = {};
    detailsJson["label"] = "Office Location";
    detailsJson["value"] = contactSplit[1];
    itemJson["details"].push(detailsJson);
    var detailsJson = {};
    detailsJson["label"] = "Mobile no.";
    detailsJson["value"] = rows[0].mobile;
    itemJson["details"].push(detailsJson);
    var detailsJson = {};
    detailsJson["label"] = "Office no.";
    detailsJson["value"] = rows[0].officeno;
    itemJson["details"].push(detailsJson);
    var detailsJson = {};
    detailsJson["label"] = "Email Id.";
    detailsJson["value"] = rows[0].email;
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
    dataJson["text"] = "Call now";
    dataJson["value"] = "";
    dataJson["type"] = "regular";
    dataJson["successMessage"] = "";
    dataJson["callBackFn"] = "Call now";
   
    buttonJson["data"].push(dataJson);
  
    msgBdyJson["attachments"].push(buttonJson);


    responseJson["msgBdy"] = msgBdyJson;
    output_displaytext = responseJson;    
  
  
  res.setHeader('Content-Type', 'application/json');
  res.send({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext)});
  });
}

function searchProfile(req,res){

  console.log("Here me out. here is the type of variable");
  imagelinkarray = [];
  imagelinkarray.push("zero");
  var query = "select * from employeetable where employee_name like '%"+req.body.result.parameters['name']+"%'";
 

  index.connection.query(query, function(err,rows,fields){
          if(rows.length == 0){
          output = "I am sorry. I could not find anyone by the name of "+ req.body.result.parameters['name'] +".";
             
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
        if(rows.length == 1){var output = "Here are some details about "+req.body.result.parameters['name'];}
        else{var output = "Here are some profiles that I found ";}
        
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

        if(rows.length == 1){msgBdyJson["text"] = "Here are some details about "+req.body.result.parameters['name'];}
        else{msgBdyJson["text"] = "Here are some profiles that I found ";}
       
        msgBdyJson["attachments"] = [];
        var attachmentsJson = {};
        var cardJson = {};
        cardJson["type"] = "profile";
        var dataJson ={};
        cardJson["data"] = [];
        //var contactSplit = [];

        var rowlen = 4;
        if (rowlen > rows.length) {rowlen = rows.length};
        var i = 0;
        var k = 0;
        
        for(i = 0; i < rowlen; ++i){
          dataJson = {};
          var contactSplit = rows[i].contact_details.split("|");
          console.log(contactSplit[0],"jeez... this is cntct split"); 
          dataJson["image"] = rows[i].image_link;
          dataJson["title"] = rows[i].employee_name;
          dataJson["subtitle"] = "";
          dataJson["description"] = rows[i].contact_details;
          dataJson["description1"] = contactSplit[0];
          dataJson["description2"] = contactSplit[1];
          console.log("This is the datajason description::",dataJson["description1"]);
          console.log("This is the datajason description::",dataJson["description2"]);
          console.log("This is the datajason description::",dataJson["description"]);
          dataJson["postText"] = "Get more details.";
          k = i + 1;
          dataJson["callBackFn"] = "Give me more detaiils about match "+ k;
          cardJson["data"].push(dataJson);
          imagelinkarray.push(rows[i].image_link);
         }
      
        console.log("This is the card jason ",cardJson);

        msgBdyJson["attachments"].push(cardJson);
        responseJson["msgBdy"] = msgBdyJson;
        output_displaytext = responseJson;
          }
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));
  });



}

function showSHP(req,res){
  var output = "";
  var output_displaytext = "";
  var output = "Here is the document for the company's Prevention of Sexual harassment policy. You can also get in touch with our helpline or raise a violation right away.";
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
  msgBdyJson["text"] = "Here is the document for the company's Prevention of Sexual harassment policy. You can also get in touch with our helpline or raise a violation right away.";
  msgBdyJson["attachments"] = [];
  var attachmentsJson = {};
  var textJson = {};
  textJson["type"] = "text";
  textJson["title"] = ""; 
  textJson["titleLink"] = "";
  textJson["subTitle"] = "";
  textJson["subTitleType"] = "";
  textJson["text"] = "";
  //var query = "select * from payslips";

 
  var dataJson ={};
  textJson["data"] = [];

  dataJson = {};
  dataJson["label"] = "";
  dataJson["value"] = "Prevention of Sexual Harassment Policy.";
  dataJson["short"] = "false";
  dataJson["type"] = "pdf";
  dataJson["link"] = "https://storage.googleapis.com/databasesearch/abc/Prevention_of_sexual_harassment_policy.pdf";
  textJson["data"].push(dataJson);
  textJson["postText"] = "";
      //console.log("these are the rows",JSON.stringify(rows[i]["month"]));
      
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
  dataJson["text"] = "Call our helpline";
  dataJson["value"] = "";
  dataJson["type"] = "regular";
  dataJson["successMessage"] = "";
  dataJson["callBackFn"] = "Call our helpline";
  
  buttonJson["data"].push(dataJson);

  var dataJson = {};
  dataJson["name"] = "";
  dataJson["text"] = "Report a Violation";
  dataJson["value"] = "";
  dataJson["type"] = "regular";
  dataJson["successMessage"] = "";
  dataJson["callBackFn"] = "Report a violation";
 
  buttonJson["data"].push(dataJson);
 
  
  msgBdyJson["attachments"].push(buttonJson);
  responseJson["msgBdy"] = msgBdyJson;
  output_displaytext = responseJson;    
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));
    

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
  msgBdyJson["text"] = "Here you go. This PDF below contains your Salary Structure document.";
  msgBdyJson["attachments"] = [];
  var attachmentsJson = {};
  var textJson = {};
  textJson["type"] = "text";

  textJson["title"] = "";

  
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
              msgBdyJson["text"] = "Here you go. This PDF below contains the form 16 document.";
              msgBdyJson["attachments"] = [];
              var attachmentsJson = {};
              var textJson = {};
              textJson["type"] = "text";

              textJson["title"] = "";
            
              
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
var sampletext = "";
var dummyrows = [];

function showpayslips(req,res){
              
              if((!req.body.result.parameters['date-period'])&&(!req.body.result.parameters['timespan'])){
                query = "select * from payslips";
                for_loop_parameter = 1;
                sampletext = "Showing payslip for the last month. The password to view your payslips is your employee ID. \n\n ";
              }
              else if(req.body.result.parameters['date-period']){
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
                    for_loop_parameter = 99;
                    sampletext = "Showing payslips for " + arr[0] + ". The password to view your payslips is your employee ID. \n\n ";
                  }

                  else if(arr1[1] !== arr2[1]){ //if different month
                    month_number = parseInt(arr1[1],10);
                    end_month = parseInt(arr2[1],10);
                    end_month = end_month + 1;
                    console.log("This is the month_number when arr1[1] !== arr2[0] ", month_number);
                    console.log("This is the end_month when arr1[0] == arr2[0] ", end_month);
                    query = "select * from payslips where month_date >= " + arr[0] + " and month_number <= " + arr[1];
                    for_loop_parameter = 99;
                    sampletext = "Showing payslips from " + arr[0] + " to "+ arr[1] + ". The password to view your payslips is your employee ID. \n\n ";
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
                  sampletext = "Showing payslips from " + arr[0] + " to "+ arr[1] +". The password to view your payslips is your employee ID. \n\n ";
                }

              }
              else if(req.body.result.parameters['timespan']){
                
                timespan = req.body.result.parameters['timespan'];
                console.log("This is the timespan frmo inside timepsan block", timespan);
                query = "select * from payslips";
                for_loop_parameter = timespan;
                sampletext = "Showing payslips for the last " + timespan + " months. The password to view your payslips is your employee ID. \n\n ";
              }
              index.connection.query(query, function(error,rows,fields){
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
                
                if(timespan == 1){
                  msgBdyJson["text"] = "Showing payslips for the last month. The password to view your payslips is your employee ID. \n\n ";
                }
                else{
                  msgBdyJson["text"] = sampletext;
                }

                msgBdyJson["attachments"] = [];
                var attachmentsJson = {};
                var textJson = {};
                textJson["type"] = "text";
                textJson["title"] = "";
                textJson["titleLink"] = "";
                textJson["subTitle"] = "";
                textJson["subTitleType"] = "";
                textJson["text"] = "";
                //var query = "select * from payslips";
                var dataJson ={};
                textJson["data"] = [];
                var i = 0;
                //console.log("these are the rows",JSON.stringify(rows[1]));
                //console.log("these are the rows",rows[1]['month']);
                //console.log("these are the rows",JSON.stringify(rows[1],month));
                console.log("THis is the for loop parameter", for_loop_parameter);
                if(for_loop_parameter == 99){
                  for_loop_parameter = rows.length;
                  console.log("This is the modified for loop parameter", for_loop_parameter);
                  for(i=0;i<for_loop_parameter;i++){
                    console.log(arr[0]);
                    console.log(arr[1]);
                    console.log(rows[i]["month_date"]);
                    console.log(i);
                    if((rows[i]["month_date"]>=arr[0])&&(rows[i]["month_date"]<=arr[1])){
                    console.log("I went inside the if statement here")
                    dataJson = {};
                    dataJson["label"] = "";
                    dataJson["value"] = rows[i]["month"] +" Payslip";
                    dataJson["short"] = "false";
                    dataJson["type"] = "pdf";
                    dataJson["link"] = rows[i]["link"];
                    textJson["data"].push(dataJson);
                    textJson["postText"] = "";
                      //console.log("these are the rows",JSON.stringify(rows[i]["month"]));
                    dummyrows.push(rows[i]);
                    console.log(JSON.stringify(dataJson),"This is the stringified JSON for i = ",i);
                    }
                  }
                }

                else {
                  for(i=0;i<for_loop_parameter;i++){
                 
                  dataJson = {};
                  dataJson["label"] = "";
                  dataJson["value"] = rows[i]["month"] +" Payslip";
                  dataJson["short"] = "false";
                  dataJson["type"] = "pdf";
                  dataJson["link"] = rows[i]["link"];
                  textJson["data"].push(dataJson);
                  textJson["postText"] = "";
                  //console.log("these are the rows",JSON.stringify(rows[i]["month"]));
                  dummyrows.push(rows[i]);
                  console.log(JSON.stringify(dataJson),"This is the stringified JSON for i = ",i);
                  }
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
              dataJson["callBackFn"] = "Email it to me.";
              
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

    var senderEmail = "sarveshvaidya92@gmail.com";
    var receiverEmail = req.body.result.parameters['email'];

    //req.body.result.parameters['emailid'];
    var mailSubject = " Salary slips details.";
    var mailbody = "";//rows[0].overview + "          " + " Product Brochure : " + rows[0].pdf_link + "             " + " Product Video Link "+ rows[0].video_link;
    var htmlbody = '<p>Dear Employee,</p><br><p>Sharing some details about your Salary slips.</p><br><p>'+ dummyrows[0] +'</p><br><p>We would be happy to assist you for any more information or if you require help purchasing this insurance plan.</p><br><p>Reach out to us at <a href="http://125.22.109.58:8090/chatbot">Morph Virtual Assistant</a></p><br><p>Warm Regards,</p><br><p>Morph Admin Team</p>';
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
    
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));
   
}