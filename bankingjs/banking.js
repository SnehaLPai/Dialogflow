// banking.js
// ========
var index = require('./index');
var accountBalance;
var userIdParam;
var bankingProducts = require('./banking_products');
var bankingProcess = require('./banking_process');

var request = require('request');

module.exports = {
  bankingBot: function (req,res) {
    console.log("Before::We hit the banking bot");
    if(req.body.result.metadata['intentName'] == "account.balance.check" || req.body.result.metadata['intentName'] == "account.balance.check - context: account"){
        getAccountBalance(req,res);
    }
    
    else if (req.body.result.metadata['intentName'] == "account.balance.check - context: showTransactions"){
        getTransactions(req,res);
    }
    
    else if(req.body.result.metadata['intentName'] == "account.product.information"){
        bankingProducts.getAccountTypes(req,res);
    }

    else if(req.body.result.metadata['intentName'] == "account.product.details"){
        bankingProducts.getAccountDetails(req,res);
    }
    
    else if (req.body.result.metadata['intentName'] == "account.process.description"){
        bankingProcess.getProcess(req,res);
    }
    else if (req.body.result.metadata['intentName'] == "account.process.description.email"){
        bankingProcess.sendProcessEmail(req,res);
    }
    else if (req.body.result.metadata['intentName'] == "account.homeloan.calculator"){
        bankingProcess.getLoan(req,res);
    }
    else if (req.body.result.metadata['intentName'] == "account.search.atm.takelocation"){
        bankingProcess.searchPlace(req,res);
    }
    else if (req.body.result.metadata['intentName'] == "account.search.atm"){
        bankingProcess.sendLocation(req,res);
    }
    else if (req.body.result.metadata['intentName'] == "account.login"){
        checkLogin(req,res);
    }
    else if (req.body.result.metadata['intentName'] == "transfer.money"){
        bankingProducts.transferMoney(req,res);
    }
    else if (req.body.result.metadata['intentName'] == "transfer.money.transactiontype"){
        bankingProducts.transferMoneyWithTransactionType(req,res);
    }
    else if (req.body.result.metadata['intentName'] == "transfer.money.accountfrom"){
        bankingProducts.transferMoneyWithAccountFrom(req,res);
    }
    else if (req.body.result.metadata['intentName'] == "transfer.money.accountto"){
        bankingProducts.transferMoneyWithAccountTo(req,res);
    }
    else if (req.body.result.metadata['intentName'] == "transfer.money.amount"){
        bankingProducts.transferMoneyWithAmount(req,res);
    }
    else if (req.body.result.metadata['intentName'] == "transfer.money.remarks"){
        bankingProducts.transferMoneyWithRemarks(req,res);
    }

  }
}

/* Login function */
function checkLogin(req,res){
    
    /** Verify User Credentials **/

    var output="";
    var output_displaytext="";
    var eventName = "";
    var query = "select password from banking_customer where userId = '"+req.body.result.parameters['userId']+"'";
    index.connection.query(query,function(err,rows,fields){
        if(rows.length==0){

            output = "Invalid username!";
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
        else if(rows[0].password == req.body.result.parameters['password']){
            
            var str = req.body.result.parameters['callbackIntent']
            var arr = str.split(".");
            eventName = arr[0];
            for(var i =1;i<arr.length;i++){
               eventName = eventName + "_" + arr[i];
            }

            /** Make note of session token **/
            query = "update banking_customer set sessionToken = '"+req.body.sessionId+"' where userId = '"+req.body.result.parameters['userId']+"'";
            index.connection.query(query,function(err,rows,fields){
                if(err){
                    output = "Sorry, an error as ocurred.";
                    output_displaytext = output;
                    //res.setHeader('Content-Type', 'application/json');
                    //res.send({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext)});
                   
                }
                console.log("Hi from checkLogin");
                console.log(eventName);

                var followUpEvent = {};
                followUpEvent.name = eventName;
                
                if(eventName  == "account_balance_check"){
                    var contexts = req.body.result.contexts;
                    var parameter;
                    console.log(req.body);
                    for (i=0; i< contexts.length;i++){
                        console.log("Context name" + i + "::" + contexts[i].name);
                        if(contexts[i].name == "balance"){

                            if(contexts[i].parameters.account.length != 0){
                                parameter = contexts[i].parameters.account;
                                console.log(parameter);
                                
                            }
                            else {
                                parameter = [];
                                console.log(parameter);
                            }
                            followUpEvent.data = {};
                            followUpEvent.data.account1 = parameter;
                            followUpEvent.data.userId = req.body.result.parameters['userId'];
                        }
                    }
                }else if(eventName  == "transfer_money"){
                    var contexts = req.body.result.contexts;
                    var parameter;
                    console.log(req.body);
                    for (i=0; i< contexts.length;i++){
                        console.log("Context name" + i + "::" + contexts[i].name);
                        if(contexts[i].name == "transfer_money_parameters"){                   
                            followUpEvent.data = {};
                            followUpEvent.data.userId = req.body.result.parameters['userId'];
                            break;
                        }
                    }
                    console.log("login back to transfer money followupEvent:",followUpEvent.data);
                }            
                res.setHeader('Content-Type', 'application/json');
                res.send({ 'followupEvent': followUpEvent}); 
               
            });        
            /** check intent **/
        }
        else{
            //if password is wrong
            output = "Invalid password! ";
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
            console.log("invalid username password");
        }
        console.log("Hi from checkLogin");
        console.log(eventName);
       
    });
  }


/* get account transaction */
function getTransactions(req,res){
    console.log("Transactions");
    var responseJson = {};
    var msgHdrJson = {};
    var msgBdyJson = {};
    var output = "";
    var output_displaytext = "";
    var attachments = [];
    msgBdyJson["attachments"] = [];
  
    msgHdrJson["success"] = "true";      
    msgHdrJson["error"] = "";
    msgHdrJson["cd"] = "200";
    msgHdrJson["rsn"] = "";
    responseJson["msgHdr"] = msgHdrJson;
    
    msgBdyJson["userId"] = "Sarvesh";
    msgBdyJson["userImage"] = "https://scontent-amt2-1.cdninstagram.com/t51.2885-19/s150x150/14262769_342114716128056_857373176_a.jpg";
  //  msgBdyJson["text"] = output;
   // msgBdyJson["attachments"] = attachments;
    responseJson["msgBdy"] = msgBdyJson;
    output_displaytext = responseJson; 
    res.setHeader('Content-Type', 'application/json');
    console.log("JSON STRING:" , JSON.stringify(output_displaytext));
  
    var acctDetails = req.body.result.parameters['account1'];
  
    if(acctDetails == ""){
        acctDetails = req.body.result.parameters['account'];
    }
   
    
    var query = "select * from banking_transactions where customerId = 1 and accountNumber in (select accountNumber from banking_account where customerId = 1 and accountType = '" + acctDetails + "')";
  
    if(req.body.result.parameters['transactions'] == 'noTransactions'){
        output = "Let me know if I can help you with anything else";
        console.log(output);
        msgBdyJson["text"] = output;
        msgBdyJson["attachments"] = [];
        res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) })); 
    }
    else{
      index.connection.query(query, function(error,rows,fields){
          if(error){
              output = "Sorry, we were unable to fetch the transactions for your account";
              msgBdyJson["text"] = output;
              msgBdyJson["attachments"] = [];
              res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) })); 
              
          }
          else if(rows.length == '0'){
              output = "Looks like there are no transactions on this account";
              console.log(output);
              msgBdyJson["text"] = output;
              msgBdyJson["attachments"] = [];
              res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));   
            
          }
          else{
              console.log("I AM HETE");
              output = "Showing your last 10 transactions";
              
              var quoteJson = {};
              
              quoteJson["type"] = "doubleColumnText";              
              quoteJson["leftTitle"] = req.body.result.parameters['account'] + " Account";
              quoteJson["rightTitle"] = "&#8377";
              
              
  
              quoteJson["leftTitleLink"] = "";
              quoteJson["lefTitleType"] = "text";
              quoteJson["leftSubTitle"] = "";
              quoteJson["leftSubTitleCallbackFn"] = "";
              quoteJson["leftData"] = [];
              quoteJson["rightTitleLink"] = "";
              quoteJson["rightTitleType"] = "text";
              quoteJson["rightSubTitle"] = "";
              quoteJson["rightSubTitleCallbackFn"] = "";
              quoteJson["rightData"] = [];
            
            
            
              attachments.push(quoteJson);
            
              console.log("QUOTE JSON" + quoteJson);

              var itemListJson = {};
              itemListJson["type"] = "itemList";
              itemListJson["title"] = "Transaction History";
              itemListJson["data"] = [];
 
              for (i=0; i< rows.length; i++){ 
                
                  var itemJson = {};
                  itemJson["item"] = "";
                  itemJson["details"] = [];
    
                  var detailsJson = {};
                  detailsJson["label"] = "Date:";
                  var dateString = new Date(rows[i].transactionDate);
                  var dateStr = dateString.getDate() + '-' + (dateString.getMonth()+1) + '-' + dateString.getFullYear();
                  detailsJson["value"] = dateStr;
                  itemJson["details"].push(detailsJson);
                  
                  var detailsJson = {};
                  detailsJson["label"] = "Amount:";
                  detailsJson["value"] = "&#8377 " + rows[i].transactionAmt;
                  itemJson["details"].push(detailsJson);
                  
                  var detailsJson = {};
                  detailsJson["label"] = "Merchant";
                  detailsJson["value"] = rows[i].merchant;
                  itemJson["details"].push(detailsJson);
                  
                  itemListJson["data"].push(itemJson);
              }
              attachments.push(itemListJson);
              
              console.log("Attacjements::" , attachments);
              msgBdyJson["text"] = output;
              msgBdyJson["attachments"] = attachments;
              res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));   
            
            }
        })
    }
   
}

/* Get account balance */
function getAccountBalance(req,res){
    
    var output = "";
    var query;
    var responseJson = {};
    var msgHdrJson = {};
    var msgBdyJson = {};
    msgBdyJson["attachments"] = [];
  
    /** 1. Check if the user is logged in or not **/ 
    var query = "select * from banking_customer where sessionToken = '"+ req.body.sessionId + "'";
    
    index.connection.query(query,function(err,rows,fields){
        if(err){
            var output = "Sorry, an error as ocurred.";
            var output_displaytext = output;
            res.setHeader('Content-Type', 'application/json');
            res.send({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext)});
            console.log("1: DB ERROR");
            return;
        }
        if(rows.length == 0){
            var followUpEvent = {};
            
             followUpEvent.name = "login_event";
             followUpEvent.data = {};
             followUpEvent.data.callbackIntent = req.body.result.metadata.intentName;
             

             res.setHeader('Content-Type', 'application/json');
             res.send({ 'followupEvent': followUpEvent}); 
             console.log("2: Fired Login event"); 
             return;
        }
        else{
            if(req.body.result.parameters['userId']){
                userIdParam = req.body.result.parameters['userId'];
            }
            else{
                query = "select userId from banking_customer where sessionToken = '"+ req.body.sessionId + "'"
                console.log(query);
                index.connection.query(query,function(err,rows,fields){
                    if(err){console.log("error in fetching customerId from userId")}
                    else{
                    userIdParam = rows[0].userId;
                    console.log(userIdParam);
                    console.log("This is the userIdParam");
                }
            });
            console.log(userIdParam);
            console.log(" user id param should be been above me");
            }
            
            // In this case I need to get account balance for all accounts
            if((req.body.result.parameters.account.length == 0)&&(req.body.result.parameters.account1.length == 0)){
                query = "select accountNumber, accountType , availableBalance , availableCredit from banking_account where customerId = (select customerId from banking_customer where userId = '"+ userIdParam + "')";
                console.log(query);
                console.log("query when account type not provided");
            }
            else{

                var account;
                if(req.body.result.parameters.account.length != 0){
                    account = req.body.result.parameters.account;
                }
                else{
                    account = req.body.result.parameters.account1;
                }
  
                // In this case I need to get account balance for only one kind of account
                if (account.length == 1){
                    query = "select accountNumber, accountType , availableBalance , availableCredit from banking_account where customerId = (select customerId from banking_customer where userId = '"+ userIdParam + "') and accountType = '" + account[0] + "'";
                }
            
                // In this case I need to get account balance for all kinds of account the user has specfied
                else { 
                    query = "select accountNumber, accountType , availableBalance , availableCredit from banking_account where customerId = (select customerId from banking_customer where userId = '"+ userIdParam + "') and accountType in (";

                    for(i=0;i<req.body.result.parameters.account.length;i++){
                         if(i != 0){
                            query = query + ",";
                        }
                        query = query + "'" + account[i] + "'";
                    }
                    query = query + ")";
                }
            }
                index.connection.query(query, function(error,rows,fields){
                    if(error){
                        output = "Sorry, we were unable to get your account information";
                        msgBdyJson["attachments"] = [];
            
                    }
                    else if(rows.length == '0'){
                        output = "Sorry, we did not find any account linked to your customer id";
                        console.log(output);
                        msgBdyJson["attachments"] = [];
                    }
                    else if(rows.length == '1'){
                        output = "You have <b>&#8377 " + rows[0].availableBalance + "</b> in your " + req.body.result.contexts[0].parameters['account.original'] + ". Would you like me to show you your last 10 transactions";
                        msgBdyJson["attachments"] = [];
                        for(i=0; i<rows.length; i++){
                            var quoteJson = {};
                            quoteJson["type"] = "doubleColumnText";
       
                            quoteJson["leftTitle"] = rows[0].accountType + " ACCOUNT";
                            quoteJson["leftTitleLink"] = "";
                            quoteJson["leftTitleType"] = "text";
                            quoteJson["leftSubTitle"] = "XXXXXX" + rows[0].accountNumber;
                            quoteJson["leftSubTitleCallbackFn"] = "";
                            quoteJson["leftData"] = [];
                
                            quoteJson["rightTitleLink"] = "";
                            quoteJson["rightTitleType"] = "price";
                            quoteJson["rightSubTitleCallbackFn"] = "Show last 10 transactions for " + rows[0].accountType + " account";
                            quoteJson["rightData"] = [];
                        
                            
                            quoteJson["rightTitle"] = "&#8377"+ " " + rows[0].availableBalance + "/-";
                            quoteJson["rightSubTitle"] = "Current Balance";
                            
                            msgBdyJson["attachments"].push(quoteJson);
                        }
                        msgHdrJson["success"] = "true";
                        msgHdrJson["error"] = "";
                        msgHdrJson["cd"] = "200";
                        msgHdrJson["rsn"] = "";
                        responseJson["msgHdr"] = msgHdrJson;
                          
                        msgBdyJson["userId"] = "Sarvesh";
                        msgBdyJson["userImage"] = "https://scontent-amt2-1.cdninstagram.com/t51.2885-19/s150x150/14262769_342114716128056_857373176_a.jpg";
                        msgBdyJson["text"] = output;
                         
                      
                        responseJson["msgBdy"] = msgBdyJson;
                        output_displaytext = responseJson; 
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));

                    }
                    else {
                        output = "Here are your account details. ";
                        for(i=0; i<rows.length; i++){
                            var quoteJson = {};
                            output=output+rows[i].accountType ;
                            

                            quoteJson["type"] = "doubleColumnText";
                            quoteJson["leftTitle"] = rows[i].accountType + " ACCOUNT";
                            quoteJson["leftTitleLink"] = "";
                            quoteJson["leftTitleType"] = "text";
                            quoteJson["leftSubTitle"] = "XXXXXX" + rows[i].accountNumber;
                            quoteJson["leftSubTitleCallbackFn"] = "";
                            quoteJson["leftData"] = [];
                
                            quoteJson["rightTitleLink"] = "";
                            quoteJson["rightTitleType"] = "price";
                            quoteJson["rightSubTitleCallbackFn"] = "Show last 10 transactions for " + rows[i].accountType + " account";
                            quoteJson["rightData"] = [];
                        
                            if(rows[i].accountType == "CREDIT CARD"){
                                quoteJson["rightTitle"] = "&#8377"+ " " + rows[i].availableCredit + "/-";
                                quoteJson["rightSubTitle"] = "Available Credit";
                                output=output + " ACCOUNT has credit of rupees  " + rows[i].availableCredit + ","; 
                            }
                            else{
                                quoteJson["rightTitle"] = "&#8377"+ " " + rows[i].availableBalance + "/-";
                                quoteJson["rightSubTitle"] = "Current Balance";
                                output=output + " ACCOUNT has balance of rupees  " + rows[i].availableBalance + ","; 
                            }
                            msgBdyJson["attachments"].push(quoteJson);
                        }
                        msgHdrJson["success"] = "true";
                        msgHdrJson["error"] = "";
                        msgHdrJson["cd"] = "200";
                        msgHdrJson["rsn"] = "";
                        responseJson["msgHdr"] = msgHdrJson;
                          
                        msgBdyJson["userId"] = "Sarvesh";
                        msgBdyJson["userImage"] = "https://scontent-amt2-1.cdninstagram.com/t51.2885-19/s150x150/14262769_342114716128056_857373176_a.jpg";
                        msgBdyJson["text"] = "Here are your account details:";
                         
                      
                        responseJson["msgBdy"] = msgBdyJson;
                        output_displaytext = responseJson; 
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));    
                    }
                })
            
        }
    })
    
}
   
  
    //User is not logged in
    // Fire login event
  
    //Send post request through node
//  var path = "https://api.dialogflow.com/v1/query?v=20150910&e=login_event&timezone=Europe/Paris&lang=en&sessionId="+req.body.sessionId;
//  
//  request({
//        headers: {
//          'Authorization': 'bearer 69b965b353f24a1ea522bc52c506b548'
//          
//        },
//        url: path,
//        method: 'GET'
//      }, function (error, response, body) {
//        if (!error && response.statusCode == 200) {
//            console.log("Success" + body);
//            res.setHeader('Content-Type', 'application/json');
//            res.send(JSON.stringify(body));    
//        }
//        else{
//            console.log("Error" + error);
//        }
//      });
  
  
        
  
//If User is not loggged in, fire login event
         
 

//    // In this case I need to get account balance for all accounts
//    if(req.body.result.parameters.account.length == 0){
//        query = "select accountNumber, accountType , availableBalance , availableCredit from banking_account where customerId = 1";
//    }
//  
//    // In this case I need to get account balance for only one kind of account
//    else if (req.body.result.parameters.account.length == 1){
//        query = "select accountNumber, accountType , availableBalance , availableCredit from banking_account where customerId = 1 and accountType = '" + req.body.result.parameters.account[0] + "'";
//      
//    }
//  
//    // In this case I need to get account balance for all kinds of account the user has specfied
//    else if (req.body.result.parameters.account.length > 1){
//        query = "select accountNumber, accountType , availableBalance , availableCredit from banking_account where customerId = 1 and accountType in (";
//        
//        for(i=0;i<req.body.result.parameters.account.length;i++){
//            if(i != 0){
//                query = query + ",";
//            }
//            query = query + "'" + req.body.result.parameters.account[i] + "'";
//        }
//        query = query + ")";
//    }
//  
//   
//    console.log("We hit the banking bot:" + query);
//    
//  
//    index.connection.query(query, function(error,rows,fields){
//      if(error){
//          output = "Sorry, we were unable to get your account information";
//          msgBdyJson["attachments"] = [];
//            
//      }
//      else if(rows.length == '0'){
//            output = "Sorry, we did not find any account linked to your customer id";
//            console.log(output);
//            msgBdyJson["attachments"] = [];
//      }
//      else if(rows.length == '1'){
//            output = "You have <b>&#8377 " + rows[0].availableBalance + "</b> in your " + req.body.result.contexts[0].parameters['account.original'] + ". Would you like me to show you your last 10 transactions";
//            msgBdyJson["attachments"] = [];
//      }
//      else {
//          output = "Here are your account details"
//             
//          for(i=0; i<rows.length; i++){
//              var quoteJson = {};
//              quoteJson["type"] = "doubleColumnText";
//       
//              quoteJson["leftTitle"] = rows[i].accountType + " ACCOUNT";
//              quoteJson["leftTitleLink"] = "";
//              quoteJson["leftTitleType"] = "text";
//              quoteJson["leftSubTitle"] = "XXXXXX" + rows[i].accountNumber;
//              quoteJson["leftSubTitleCallbackFn"] = "";
//              quoteJson["leftData"] = [];
//  
//              quoteJson["rightTitleLink"] = "";
//              quoteJson["rightTitleType"] = "price";
//              quoteJson["rightSubTitleCallbackFn"] = "Show last 10 transactions for " + rows[i].accountType + " account";
//              quoteJson["rightData"] = [];
//        
//              if(rows[i].accountType == "CREDIT CARD"){
//                  quoteJson["rightTitle"] = "&#8377"+ " " + rows[i].availableCredit + "/-";
//                  quoteJson["rightSubTitle"] = "Available Credit";
//              }
//              else{
//                  quoteJson["rightTitle"] = "&#8377"+ " " + rows[i].availableBalance + "/-";
//                  quoteJson["rightSubTitle"] = "Current Balance";
//              }
//              msgBdyJson["attachments"].push(quoteJson);
//          }
//      }
//   
//      msgHdrJson["success"] = "true";
//      msgHdrJson["error"] = "";
//      msgHdrJson["cd"] = "200";
//      msgHdrJson["rsn"] = "";
//      responseJson["msgHdr"] = msgHdrJson;
//      
//      msgBdyJson["userId"] = "Sarvesh";
//      msgBdyJson["userImage"] = "https://scontent-amt2-1.cdninstagram.com/t51.2885-19/s150x150/14262769_342114716128056_857373176_a.jpg";
//      msgBdyJson["text"] = output;
//     
//  
//      responseJson["msgBdy"] = msgBdyJson;
//      output_displaytext = responseJson; 
//      res.setHeader('Content-Type', 'application/json');
//      res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));    
//    })

