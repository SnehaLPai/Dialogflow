// banking.js
// ========
var index = require('./index');
var accountBalance;
var request = require('request');
var nodemailer = require('nodemailer');

module.exports = {
    getProcess: function (req,res) {  
        
    var output = "";
    var query = "select * from banking_process where process = '"+req.body.result.parameters['process']+"'";
    
  
   
    console.log("We hit the banking bot:" + query);
    
    index.connection.query(query, function(error,rows,fields){
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
      textJson["title"] = "<b><u>"+req.body.result.parameters['process']+" Process details.</u></b>";
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
        dataJson["value"] = i+1+") "+arr[i];
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
      dataJson["text"] = "Raise SR";
      dataJson["value"] = "";
      dataJson["type"] = "regular";
      dataJson["successMessage"] = "";
      dataJson["callBackFn"] = "No";
     
      buttonJson["data"].push(dataJson);

      msgBdyJson["attachments"].push(buttonJson);

      responseJson["msgBdy"] = msgBdyJson;
      output_displaytext = responseJson; 
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));    
    })
    
  },

  getLoan: function (req,res){
    var path = "https://api.ocbc.com:8243/Home_Loan/1.0?currentAge1="+req.body.result.parameters['currentAge1']+"&totalMonthlyIncome1="+req.body.result.parameters['totalMonthlyIncome1']+"&totalMonthlyDebt1="+req.body.result.parameters['totalMonthlyDebt1']+"&outstandingLoans1"+req.body.result.parameters['outstandingLoans1']+"&repaymentPeriod="+req.body.result.parameters['repaymentPeriod'];
    
    console.log(path," This is the path parameter for getloan request");
    request({
        headers: {
          'Authorization': 'Bearer 6943a31e80ee476a0bf644fd39e2e128',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        url: path,
        method: 'GET'
      }, function (error, response, body) {
        var output = "";
        output = response.body;
        var output_displaytext = "";
        output_displaytext = output;
        res.setHeader('Content-Type', 'application/json');
        res.send({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext)});
      });

  },

  sendProcessEmail: function (req,res){
    query = "select * from banking_process where process like '%"+req.body.result.parameters['process']+"%'";
    index.connection.query(query, function(err,rows,fields){
      
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
            var mailSubject = req.body.result.parameters['process']+" Process details.";
            var mailbody = "Hello!";
            var arr = premium * 19;
            var htmlbody = '<p>Dear Customer,</p><br><p>Sharing some details about '+req.body.result.parameters['process']+' process. </p><br><p>'+arr[0]+' </p>';
            for(var i=1;i<arr.length;i++){
                htmlbody = htmlbody + '<br><p>'+i+') '+arr[i]+'</p>';
            }
            htmlbody = htmlbody + '<p>We would be happy to assist you for any more information or if you require help purchasing this insurance plan.</p><br><p>Reach out to us at <a href="http://125.22.109.58:8090/chatbot">XYZ Insurance Assistant</a></p><br><p>Warm Regards,</p><br><p>XYZ Insurance Team</p>';
            
      
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
    },
    sendLocation: function(req,res){
      var output = "send me your location";
      var output_displaytext = output;
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));
    },
    searchPlace: function (req,res){
      if(req.body.result.parameters['atm'] == 'atm'){searchAtm(req,res);}
      if(req.body.result.parameters['atm'] == 'branch'){searchBranch(req,res);}
    }
}
   function searchBranch(req,res){
      query = "select * from branch_nepal";
      index.connection.query(query, function(err,rows,fields){
      output = "I found some of our offices nearby. ";
      
      for (var i = 0; i < rows.length; i++) {
        if (i == 0)
        output = output + rows[i].branchName;
        else if (i != rows.length - 1)
        output = output + ", " + rows[i].branchName;
        else 
        output = output + " and " + rows[i].branchName;
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

    function searchAtm(req,res){
      var path="";
      path = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + req.body.result.parameters['lat'] + "," + req.body.result.parameters['long'] + "&rankby=distance&types=" + "atm" + "&key=AIzaSyBYCwlMeu0bsC6oApIS3-T7ilX9wtaZoVE";
      
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
        var output = "Here are some ATMs I found near you. ";
        var output_displaytext = "";
      
        for (var i = 0; i < 3; i++) {
          if (i == 0)
          output = output + parsedOutput.results[i]['name'];
          else if (i != parsedOutput.results.length - 1)
          output = output + ", " + parsedOutput.results[i]['name'];
          else 
          output = output + " and " + parsedOutput.results[i]['name'];
        }
        console.log(parsedOutput.results[0]['name'],"here is the atm name");
        console.log(parsedOutput.results[1]['name'],"here is the atm name");
        console.log(parsedOutput.results[2]['name'],"here is the atm name");

  
  
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
        mapJson["title"] = "ATM";
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


