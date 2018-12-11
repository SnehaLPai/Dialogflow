// banking.js
// ========
var index = require('./index');
var transactionType="";
var accountFrom="";
var accountTo="";
var amount="";
var remarks="Monthly rent";

module.exports = {

  getAccountTypes: function (req,res) {
    console.log("We hit the bankingProducts: getAccountTypes fn");
    var output = "";
    var output_displaytext="";
    var query;
    // In this case I need to get all account types balance for all accounts
    if(req.body.result.parameters.account.length == 0){
        query = "select ACCOUNT_NAME , ACCOUNT_DESC, ACCOUNT_DETAILS_INTENT, ACCOUNT_IMAGE,ACCOUNT_TYPE from BANKING_ACCOUNT_TYPE where ACCOUNT_TYPE=''";
    }
  
    // In this case I need to get account balance for only one kind of account
    else if (req.body.result.parameters.account.length == 1){
        query = "select ACCOUNT_NAME , ACCOUNT_DESC, ACCOUNT_DETAILS_INTENT, ACCOUNT_IMAGE,ACCOUNT_TYPE from BANKING_ACCOUNT_TYPE where ACCOUNT_TYPE = '" + req.body.result.parameters.account[0] + "'";      
    }
  
    // In case I need to get account balance for all kinds of account
    else if (req.body.result.parameters.account.length > 1){
        query = "select ACCOUNT_NAME , ACCOUNT_DESC, ACCOUNT_DETAILS_INTENT, ACCOUNT_IMAGE,ACCOUNT_TYPE from BANKING_ACCOUNT_TYPE where ACCOUNT_TYPE in (";
        
        for(i=0;i<req.body.result.parameters.account.length;i++){
            if(i != 0){
                query = query + ",";
            }
            query = query + "'" + req.body.result.parameters.account[i] + "'";
        }
        query = query + ")";
    }
  
   
    console.log("We hit the banking bot:" + query);
    
  
    index.connection.query(query, function(error,rows,fields){
      if(error){
          output = "Sorry, we were unable to get products information";            
      }
      else if(rows.length == '0'){
            output = "Sorry, we did not find any products";
            console.log(output);
      }
      else{
            if(!req.body.result.parameters.account[0]){
                req.body.result.parameters.account[0]="";
            }
            output="Here are the different products I have found";
            for(var i=0;i<rows.length;i++){
              output= output + "." + rows[i].ACCOUNT_NAME;
            }
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
      msgBdyJson["text"] = "Our Bank offers following products";
      msgBdyJson["attachments"] = [];  
      
      var titles=[];
      var desc=[];
      var images=[];
      var callbackfn=[];
      for(var i = 0; i < rows.length; i++){
        titles[i]=rows[i].ACCOUNT_NAME;
        desc[i]=rows[i].ACCOUNT_DESC;
        images[i]=rows[i].ACCOUNT_IMAGE;
        if(!rows[i].ACCOUNT_TYPE){
          callbackfn[i]="Show me more " + rows[i].ACCOUNT_NAME + " products";
        }else{
          callbackfn[i]="Tell me more about " + rows[i].ACCOUNT_NAME;
        }
        console.log("accname: "+rows[i].ACCOUNT_NAME + "acc type: "+rows[i].ACCOUNT_TYPE);
        console.log("callbackfn:"+callbackfn[i]);
      }
      var cardJsonArray={};
      cardJsonArray=getCardsAttachment(titles,desc,images,callbackfn);
      msgBdyJson["attachments"].push(cardJsonArray);
      responseJson["msgBdy"] = msgBdyJson;
    
      output_displaytext = responseJson; 
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));    
    })
  },
  
  getAccountDetails: function (req,res) {

    console.log("We hit the bankingProducts: getAccountDetails fn");
    var output = "";
    var output_displaytext="";
    var query;

    if (req.body.result.parameters.account){
        //query = "select ACCOUNT_NAME, ACCOUNT_FEATURES, ELIGIBILITY_CRITERIA, RATES from BANKING_ACCOUNT_TYPE_DETAILS where ACCOUNT_NAME= '" + req.body.result.parameters.account + "'";      
        query = "select ACCOUNT_NAME, ACCOUNT_FEATURES from BANKING_ACCOUNT_TYPE_DETAILS where ACCOUNT_NAME= '" + req.body.result.parameters.account + "'";      
    }
  
    console.log("We hit the banking bot:" + query);
    
    index.connection.query(query, function(error,rows,fields){
      if(error){
          output = "Sorry, we were unable to get products information";            
      }
      else if(rows.length == '0'){
            output = "Sorry, we did not find any details";
            console.log(output);
      }
      else{
            output="Sure, Let me get some details for you.";
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
      
      var textJson = getTextWithStarsAttachment(rows[0].ACCOUNT_NAME,rows[0].ACCOUNT_FEATURES,"Eligibility Criteria","Rates & Fees");
      msgBdyJson["attachments"].push(textJson);

      var buttonNames=[2];
      buttonNames[0]="Get a Call back";
      buttonNames[1]="Apply Online";
      var callbackfn=[2];
      callbackfn[0]="";
      callbackfn[1]="";
      var buttonJson=getButtonJson(buttonNames,callbackfn);
      msgBdyJson["attachments"].push(buttonJson);

      responseJson["msgBdy"] = msgBdyJson;

      output_displaytext = responseJson; 
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));    
    })
  },

  //postlogin only-global method to receive and check if all inputs are received or not
  transferMoney: function (req,res) {

    console.log("We hit the bankingProducts: transferMoney fn");
    var output = "";
    var output_displaytext="";
    var query;
    var userIdParam;

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
        }else{
          query = "select userId from banking_customer where sessionToken = '"+ req.body.sessionId + "'";
          console.log(query);
          index.connection.query(query,function(err,rows,fields){
            if(err){
              console.log("error in fetching customerId from userId");
            }
            else{
              if(!userIdParam){
                userIdParam = rows[0].userId;
                console.log("userIdParam:",userIdParam);
              }
            }
            console.log("user id received for transferMoney:",userIdParam);
            console.log("query generated:",query);
            console.log('parameters received for transferMoney:',req.body.result.parameters); 
              
            if(req.body.result.parameters['transaction-type']  ||
              req.body.result.parameters['account-from'] || 
              req.body.result.parameters['account-to'] || 
              req.body.result.parameters['amount'] || 
              req.body.result.parameters['remarks'] ){

                if(transactionType==""){
                  transactionType=req.body.result.parameters['transaction-type'];
                }

                if(accountFrom==""){
                  accountFrom=req.body.result.parameters['account-from'];
                }

                if(accountTo==""){
                  accountTo=req.body.result.parameters['account-to'];
                }

                if(amount==""){
                  amount=req.body.result.parameters['amount'];
                }  
              }else{
                transactionType="";
                amount="";
                accountFrom="";
                accountTo="";
                remarks="";
              } 

            if(!req.body.result.parameters['transaction-type'] && transactionType==""){

               var followUpEvent = {};
              
               followUpEvent.name = "transfer_money_transactiontype";
               followUpEvent.data = {};
               followUpEvent.data.userId = req.body.result.parameters['userId'];
               followUpEvent.data.callbackIntent = req.body.result.metadata.intentName;                 

               res.setHeader('Content-Type', 'application/json');
               res.send({ 'followupEvent': followUpEvent}); 
               console.log("2: "+ followUpEvent.name + " event"); 
               return;
            }else if(!req.body.result.parameters['account-from'] && accountFrom==""){
              var followUpEvent = {};
              
               followUpEvent.name = "transfer_money_accountfrom";
               followUpEvent.data = {};
               followUpEvent.data.userId = req.body.result.parameters['userId'];
               followUpEvent.data.callbackIntent = req.body.result.metadata.intentName;                 

               res.setHeader('Content-Type', 'application/json');
               res.send({ 'followupEvent': followUpEvent}); 
               console.log("2: "+ followUpEvent.name + " event"); 
               return;
            }else if(!req.body.result.parameters['account-to'] && accountTo==""){
              var followUpEvent = {};
              
               followUpEvent.name = "transfer_money_accountto";
               followUpEvent.data = {};
               followUpEvent.data.userId = req.body.result.parameters['userId'];
               followUpEvent.data.transactionType = transactionType;                 
               followUpEvent.data.callbackIntent = req.body.result.metadata.intentName;                 

               res.setHeader('Content-Type', 'application/json');
               res.send({ 'followupEvent': followUpEvent}); 
               console.log("2: "+ followUpEvent.name + " event"); 
               return;
            }else if(!req.body.result.parameters['amount'] && amount==""){
              var followUpEvent = {};
              
               followUpEvent.name = "transfer_money_amount";
               followUpEvent.data = {};
               followUpEvent.data.userId = req.body.result.parameters['userId'];
               followUpEvent.data.callbackIntent = req.body.result.metadata.intentName;                 

               res.setHeader('Content-Type', 'application/json');
               res.send({ 'followupEvent': followUpEvent}); 
               console.log("2: "+ followUpEvent.name + " event"); 
               return;
            }else if(!req.body.result.parameters['remarks']){
              var followUpEvent = {};
              
               followUpEvent.name = "transfer_money_remarks";
               followUpEvent.data = {};
               followUpEvent.data.userId = req.body.result.parameters['userId'];
               followUpEvent.data.callbackIntent = req.body.result.metadata.intentName;                 

               res.setHeader('Content-Type', 'application/json');
               res.send({ 'followupEvent': followUpEvent}); 
               console.log("2: "+ followUpEvent.name + " event"); 
               return;
            }else{
              //initiate fund transfer
              console.log("all parameters received: ",req.body.result.parameters); 
              var output="";

              //subtract money from fromAccount
              var query="update banking_account set availableBalance=availableBalance-" + amount + " where accountType='" + accountFrom + "' and customerId=(select customerId from banking_customer where userId='" + userIdParam + "')";
              console.log(query);
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
              msgBdyJson["attachments"] = [];

              index.connection.query(query, function(error,rows,fields){
                if(error){
                    output = "Sorry, something went wrong";
                }else{
                    if(transactionType=="imps")
                      output="An " + transactionType + " transaction of rupees " + amount + " has been initiated from " + accountFrom + " account to " + accountTo  + "'s account"  ;
                    else if(transactionType=="neft")
                      output="A " + transactionType + " transaction of rupees " + amount + " has been initiated from " + accountFrom + " account to " + accountTo  + "'s account"  ;
                    else
                      output="Transaction of rupees " + amount + " has been initiated from " + accountFrom + " account to " + accountTo + "'s account within bank" ;
                    
                    console.log("output1:",output);
                    query="select availableBalance from banking_account where accountType='" + accountFrom + "' and customerId=(select customerId from banking_customer where userId='" + userIdParam + "')";
                    index.connection.query(query, function(error,rows,fields){
                      if(error){
                          output = "Sorry, something went wrong";
                      }else{
                          output=output+". Remaining balance in your account is " + rows[0].availableBalance + " Rupees";
                          msgBdyJson["text"] = output;
                          responseJson["msgBdy"] = msgBdyJson;
                          output_displaytext = responseJson; 
                          console.log("output:",output);
                          res.setHeader('Content-Type', 'application/json');
                          res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));    
                          transactionType="";
                          amount="";
                          accountFrom="";
                          accountTo="";
                          remarks=""; 
                      }
                    });
                }
              });               
            }
          });               
        }
      });  
  },

  transferMoneyWithTransactionType: function (req,res) {
    console.log("We hit the bankingProducts: transferMoneyWithTransactionType fn");
    var output = "";
    var output_displaytext="";

    var output="";
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

    var buttonNames=[3];
    buttonNames[0]="Within Bank";
    buttonNames[1]="Other Bank using NEFT";
    buttonNames[2]="Other Bank using IMPS";
    var callbackfn=[3];
    callbackfn[0]="transfer money within bank";
    callbackfn[1]="transfer money using neft";
    callbackfn[2]="transfer money using imps";
    var title="How would you like to send the money";

    var btnJsonData = getButtonJsonVertical(title,buttonNames,callbackfn);
      
    msgBdyJson["attachments"].push(btnJsonData);

    responseJson["msgBdy"] = msgBdyJson;

    output_displaytext = responseJson; 

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) })); 
    console.log("The state of global variables after transaction type ::", transactionType,amount,accountFrom,accountTo,remarks);
            
  },

  transferMoneyWithAccountFrom: function (req,res) {
    console.log("We hit the bankingProducts: transferMoneyWithAccountfrom fn");
    var buttonNames=[];
    var callbackfn=[];

    var output = "";
    var output_displaytext="";
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

    var userIdParam;
    var query = "select userId from banking_customer where sessionToken = '"+req.body.sessionId+"'";
    index.connection.query(query, function(error,rows,fields){
      if(error){
          output = "Sorry, Your session expired! Please login again";
          responseJson["msgBdy"] = msgBdyJson;
          output_displaytext = responseJson;
          //console.log("error: session expired");
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));    
      }else{
        userIdParam=rows[0].userId;
        query = "select accountType from banking_account where customerId = (select customerId from banking_customer where userId = '"+ userIdParam + "')";
        index.connection.query(query, function(error,rows,fields){
          if(error){
              output = "Sorry, we were unable to get your account information";
              //console.log("error: unable to get your account info");
              responseJson["msgBdy"] = msgBdyJson;
              output_displaytext = responseJson;
              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));    
          }else{
            buttonNames=[rows.length];
            callbackfn=[rows.length];
            for(var i=0;i<rows.length;i++){
              buttonNames[i]=rows[i].accountType;
              console.log("account types ", buttonNames[i]);
              callbackfn[i]="transfer funds from " + buttonNames[i];
            }
            var title="Please select the account from which you want to transfer funds";
            var btnJsonData = getButtonJsonVertical(title,buttonNames,callbackfn);          
            msgBdyJson["attachments"].push(btnJsonData);    
            output=title; 

            responseJson["msgBdy"] = msgBdyJson;
            output_displaytext = responseJson;
            console.log("output_displaytext:",output_displaytext);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));
            console.log("The state of global variables after account from ::", transactionType,amount,accountFrom,accountTo,remarks);
            
          }          
        });  
      }
    });    
  },

  transferMoneyWithAccountTo: function (req,res) {
    console.log("We hit the bankingProducts: transferMoneyWithAccountto fn");

    var buttonNames=[];
    var callbackfn=[];

    var output = "";
    var output_displaytext="";
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

    var userIdParam;
    var query = "select userId from banking_customer where sessionToken = '"+req.body.sessionId+"'";
    index.connection.query(query, function(error,rows,fields){
      if(error){
          output = "Sorry, Your session expired! Please login again";
          responseJson["msgBdy"] = msgBdyJson;
          output_displaytext = responseJson;
          //console.log("error: session expired");
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));    
      }else{
        userIdParam=rows[0].userId;
        var beneficiaryType;
        //console.log("transactionType in transferMoneyWithAccountTo fn:",req.body.result.parameters['transaction-type']);
        if(req.body.result.parameters['transaction-type']=='within bank'){
          query = "select beneficiary from banking_customer where customerName='" + userIdParam + "'";
          beneficiaryType="within bank";
        }
        else{
          query = "select beneficiary_outside from banking_customer where customerName='" + userIdParam + "'";
          beneficiaryType="other bank";
        }
       
       //console.log("query:",query);
        index.connection.query(query, function(error,rows,fields){
          //console.log("executing query");
          if(error){
              output = "Sorry, we were unable to get your account information";
              //console.log("error: unable to get your account info");
              responseJson["msgBdy"] = msgBdyJson;
              output_displaytext = responseJson;
              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));    
          }else{
            //console.log("rows:",rows[0].beneficiary);
            var beneficiaryList=rows[0].beneficiary;
            if(beneficiaryType=="within bank")
              buttonNames=rows[0].beneficiary.split(',');
            else
              buttonNames=rows[0].beneficiary_outside.split(',');            
            callbackfn=[buttonNames.length];
            for(var i=0;i<buttonNames.length;i++){
              callbackfn[i]="transfer funds to " + buttonNames[i];
            }
            var title="Please select the beneficiary to which you want to transfer funds";
            var btnJsonData = getButtonJsonVertical(title,buttonNames,callbackfn);          
            msgBdyJson["attachments"].push(btnJsonData);    
            output=title; 

            responseJson["msgBdy"] = msgBdyJson;
            output_displaytext = responseJson;
            //console.log("output_displaytext:",output_displaytext);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) })); 
            console.log("The state of global variables after account to ::", transactionType,amount,accountFrom,accountTo,remarks);
            
          }          
        });  
      }
    }); /*










    var output = "";
    var output_displaytext="";
    var output="";
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

    var buttonNames=[3];
    buttonNames[0]="Neha";
    buttonNames[1]="Sarvesh";
    buttonNames[2]="Kriti";
    var callbackfn=[3];
    callbackfn[0]="transfer funds to Neha";
    callbackfn[1]="transfer funds to Sarvesh";
    callbackfn[2]="transfer funds to Kriti";
    var title="Please select the beneficiary to which you want to transfer funds";

    var btnJsonData = getButtonJsonVertical(title,buttonNames,callbackfn);
      
    msgBdyJson["attachments"].push(btnJsonData);

    responseJson["msgBdy"] = msgBdyJson;

    output_displaytext = responseJson; 

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ 'speech': JSON.stringify(output), 'displayText': JSON.stringify(output_displaytext) }));    */
  },

  transferMoneyWithAmount: function (req,res) {
    console.log("We hit the bankingProducts: transferMoneyWithAmount fn");
    var output = "";
    var output_displaytext="";
    var output="How much amount would you like to transfer?";
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
    console.log("The state of global variables after amount ::", transactionType,amount,accountFrom,accountTo,remarks);
    
  },

  transferMoneyWithRemarks: function (req,res) {
    console.log("We hit the bankingProducts: transferMoneyWithRemarks fn");
    var output = "";
    var output_displaytext="";
    var output="Please enter remarks";
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
    console.log("The state of global variables after remarks ::", transactionType,amount,accountFrom,accountTo,remarks);
    
  }  
}

/*function to get responseJson in given type format*/
function getCardsAttachment(titles,desc,images,callbackfn){                     
      /*if user asks accounts types or account subtypes available
      create attachment json for scrolling cards*/
      var cardJsonArray = {};
      cardJsonArray["type"] = "cards";
      var dataJson ={};
      cardJsonArray["data"] = []; 

      for(var i= 0; i < titles.length; i++){
          dataJson = {};

          dataJson["image"] = images[i];
          dataJson["title"] = titles[i];
          dataJson["subtitle"] = "";
          dataJson["description"] = desc[i];
          dataJson["postText"] = "Get more details.";
          dataJson["callBackFn"] = callbackfn[i];
                
          cardJsonArray["data"].push(dataJson);
      }    
      return cardJsonArray;
}

/*show a single card with stars-type-text*/
function getTextWithStarsAttachment(title,features,actionLabel1,actionLabel2){

    var textJson = {};
    textJson["type"] = "text";
    textJson["title"] = title;
    textJson["titleLink"] = "";
    textJson["subTitle"] = "";
    textJson["subTitleType"] = "";
    textJson["text"] = "";

    var dataJson ={};
    textJson["data"] = [];
    var featuresArray = features.split(",");
    for(var i = 0; i < featuresArray.length;i++){
      dataJson = {};
      dataJson["label"] = "";
      dataJson["value"] = featuresArray[i];
      dataJson["short"] = "false";
      dataJson["type"] = "text";
      dataJson["link"] = "";
      textJson["data"].push(dataJson);
    }

    dataJson = {};
    dataJson["label"] = "";
    dataJson["value"] = actionLabel1;
    dataJson["short"] = "true";
    dataJson["type"] = "video";
    dataJson["link"] = "";
    textJson["data"].push(dataJson);

    dataJson = {};
    dataJson["label"] = "";
    dataJson["value"] = actionLabel2;
    dataJson["short"] = "true";
    dataJson["type"] = "pdf";
    dataJson["link"] = "";
    textJson["data"].push(dataJson);
    textJson["postText"] = "";

    return textJson;
}

//show btns horizontally side by side
function getButtonJson(buttonNames,callbackfn){
    var buttonJson = {};
    buttonJson["type"] = "buttons";
    buttonJson["title"] = "";
    buttonJson["titleLink"] = "";
    buttonJson["text"] = "";
    buttonJson["buttonType"] = "button";
    buttonJson["callBackFn"] = "";
    buttonJson["postText"] = "";
    buttonJson["data"] = [];
  
    for(var i=0;i<buttonNames.length;i++){
      var dataJson = {};
      dataJson["name"] = "";
      dataJson["text"] = buttonNames[i];
      dataJson["value"] = "";
      dataJson["type"] = "regular";
      dataJson["successMessage"] = "";
      dataJson["callBackFn"] = callbackfn[i];      
      buttonJson["data"].push(dataJson);
    }

    return buttonJson;
}

//show btns vertically-one below other
function getButtonJsonVertical(title,buttonNames,callbackfn){
    var btnJsonData={
                            'openingText' : title,
                            'type':"buttons_vertical",
                            'buttonNames' : buttonNames,
                            'callBackFn' :  callbackfn 
                    };
                    return btnJsonData;
}
