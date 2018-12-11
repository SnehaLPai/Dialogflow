app.controller('bankingCtrl', ['$scope', '$compile','chatService','$sce','$http','$timeout', 
	                               function($scope,$compile,chatService,$sce,$http,$timeout) {
			
		
		var input;
		sessionid = Date.now();
		
		
	      var banking = this;
	      banking.conversationHistory = [];
	  
	      banking.me = {avatar: "https://randomuser.me/api/portraits/med/men/83.jpg"};

	      banking.you = {avatar: "https://avatars.slack-edge.com/2017-10-26/262107400931_186974c9c8dbba10863a_48.jpg"};
	       
	      //
	      banking.buttonCallBackFunction = function(e){
	    	  var buttonValue = e.target.getAttribute('value');
	            console.log("Button was clicked");
	            var history = {};
	            history.user = 'Sheldon Fernandes';
	            history.image = banking.me.avatar;
	            history.userType = "me";
	            control = buttonValue;
	            history.text =  $sce.trustAsHtml(control);
	            history.ts = banking.formatAMPM(new Date());
	            banking.conversationHistory.push(history);
	            banking.execute(control);
	            
	      	  
	      }
	      
	      //Function to format date displayed on screen
	      banking.formatAMPM = function(date) {
	            var hours = date.getHours();
	            var minutes = date.getMinutes();
	            var ampm = hours >= 12 ? 'PM' : 'AM';
	            hours = hours % 12;
	            hours = hours ? hours : 12; // the hour '0' should be '12'
	            minutes = minutes < 10 ? '0' + minutes : minutes;
	            var strTime = hours + ':' + minutes + ' ' + ampm;
	            return strTime;
	      }   
	      
	      
	      //Function to display user query on screen{
	      banking.insertChat = function(){
	          //User Interaction
	    	  var history = {};
	            history.user = 'Sheldon Fernandes';
	            history.image = banking.me.avatar;
	            history.userType = "me";
	            control = banking.userText;
	            history.text =  $sce.trustAsHtml(control);
	            history.ts = banking.formatAMPM(new Date());
	            banking.conversationHistory.push(history);
	        
	            $timeout(function() {
	              var scroller = document.getElementById("boxBody");
	              scroller.scrollTop = scroller.scrollHeight;
	            }, 0, false);
	        
	      }
	      
	      
	      //User query to be displayed on chat screen
	      banking.sendUserQuery = function(){
	          var text = banking.userText;
	          if (text !== "") {
	              banking.insertChat("me", text);
	              history.userType = "me";
	              banking.userText = "";
	              input = text;
				  banking.execute(text);
	          }            
	      };
	      
	      
	      banking.setIsGraph = function(graphFlag,index){
	          graphFlag = !graphFlag;
	          banking.conversationHistory[index].showGraph = graphFlag;
	      }
	      
	      
	      function IsJsonString(str) {
	  		try {
	  			sessionid
	  			JSON.parse(str);
	  		} catch (e) {
	  			return false;
	  		}
	  		return true;
	  	}

		
		banking.execute= function(text)
		{
			   	  
	    	//hit api.ai on the user input
	  		var accessToken = "4fdb9c28ee9a48ed9e4b1bcf18d16512";
	  		var baseUrl = "https://api.api.ai/v1/";
	  		$http({

	  			method: 'POST',
	  			url: baseUrl + "query/",
	  			headers: {
	  				"Authorization": "Bearer " + accessToken},
	  			"Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
	  			data: JSON.stringify({
	  				query: text,
	  				lang: "en",
	  				sessionId: sessionid
	  			}),
	  		}).
	  		success(function(data, status) {
	  			var obj = JSON.parse(JSON.stringify(data));	  		
	  			
	  			
	  			
	  		//done specifies whether the api does not require any further information from the user and can hit the data base to get the required data to showcase to the user
	  			if (obj.result.speech == "Done!"){

					$http({
						method: "POST",
						url: "http://40.71.38.237:8080/NewIntents/apiai/data",
						data: JSON.stringify(obj),
						header:{},
						"Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
						
						
					}).
					success(function(input, status){
						if(!(JSON.stringify(input.data)=="{}"||JSON.stringify(input)=="{}")){
							var obj1 = JSON.parse(JSON.stringify(input));
							var cars = new Array()
							
							var formattedData="";
							for (var k in input)
								if (k != "data" && input[k] != "all")
									formattedData = formattedData + "<br/>" + k + " " + input[k];

							formattedData = formattedData + "\n"
									

							if ((data.result.metadata.intentName == "performance_statistics") ||
									(data.result.metadata.intentName == "performance_statistics_input")||
									(data.result.metadata.intentName == "monthly_trend_input")||
									(data.result.metadata.intentName == "monthly_trend")){		
								
							var chartData = [];
							var chartHeaders = [];
							var tempArray = [];
							var tempArray1 = [];
							var tempArray2 = [];
							var strhead = [];
							var xLabelHead = "";
							var yLabelHead = "";
							var strnum = [];
							var xLabels = [];


							chartData = JSON.stringify(input.data.data);
							chartHeaders = JSON.stringify(input.data.header);

							chartData = chartData.replace(/\"/g, "");
							chartData = chartData.substring(1, chartData.length - 1);

							chartHeaders = chartHeaders.replace(/\"/g, "");
							chartHeaders = chartHeaders.substring(1, chartHeaders.length - 1);


							tempArray = chartData.split(":");
							tempArray1 = tempArray.join();
							tempArray2 = tempArray1.split(",");

							strhead = chartHeaders.split(":");
							xLabelHead = strhead[0];
							yLabelHead = strhead[1];

							var m = 0,
							n = 0,
							p = 0;

							for (m in tempArray2) {
								if (m % 2 == 0) {
									xLabels[n] = tempArray2[m];
									n++;
									m++;
								} else {
									strnum[p] = tempArray2[m];
									p++;
									m++;
								}

							}
							var i=0;
							var chartValues = [];
							chartValues[i]={"value":strhead[1],"label":strhead[0]};
							i++;
							for (j in strnum)
							{
								chartValues[i]={ "value" : strnum[j] , "label" : xLabels[j] };
								i++;
							}
	        
							//For graph and table
				            var history = {};
				            history.image = banking.you.avatar;
				            history.userType = "bot";
				            history.user = 'Rosey@Banking';
				            //history.text = $sce.trustAsHtml(control);
				            history.ts = banking.formatAMPM(new Date());
				            history.graph = true;
				            history.showGraph = false;
				        
				            
				             var jsonData = {
				                'displayString' : 'Displaying data for',
				                'formattedData':formattedData,   
				                'data': {
				                    'graphData' : chartValues
				                    }
				              }

				              var fnData = {
				                    'callBackFn' : 'banking.setIsGraph'     
				              }

				              var btnData = {
	                                'openingText' : '',
	                                'buttonNames' : ['Print','Email','Save as JPEG','Save as PNG'],
	                                'callBackFn' : 'banking.buttonCallBackFunction' 
	                            }
				             
				             banking.chartIndex=banking.chartIndex+1;
				              banking.containerId='chart-container-' + banking.chartIndex;
				              banking.chartId='revenue-chart-' + banking.chartIndex;  

								control=chatService.getHtmlForScrollButtons(btnData);
				            /* Html for Graph*/ control=control+chatService.getHtmlForGraph2(jsonData.displayString,jsonData.formattedData,jsonData.data.graphData,banking.containerId,banking.chartId,'history.showGraph');    
				            /* Html for Graph*/ control=control+chatService.getHtmlForTable2(jsonData.displayString,jsonData.data.graphData,jsonData.containerId,jsonData.chartId,'history.showGraph');
				                  
				              /*html for toggle button */
				              control=control+'<div class="row"><span type="submit" ng-click="' + fnData.callBackFn + '(' + 'history.showGraph,$index' + ')"' + ' class="toggle-btn">  Toggle </span></div>';
				        	  
				              history.text = $sce.trustAsHtml(control);
				              //banking.conversationHistory.push(history);			
				              if ($scope.$$phase) { // most of the time it is "$digest"
						            applyFn(history);
						      } else {
						            $scope.$apply(applyFn(history));
						      }
							  $timeout(function() {
						          var scroller = document.getElementById("boxBody");
						          scroller.scrollTop = scroller.scrollHeight;
						      }, 0, false);
							
						}
							else if(data.result.metadata.intentName == "comparison")
							{
								var percentageIncLastMonth = "";
								var percentageIncLastYear = "";
								var percentageIncFinancialYear = "";
								var percentageIncLastMonthFlag = "";
								var percentageIncLastYearFlag = "";
								var percentageIncFinancialYearFlag = "";
								var current_revenue_financialYear="";
								var present_revenue_month = "";
								var MonthAsked = "";
								var YearAsked = "";
								var Product = "";
								var comaprison = "";
								
								percentageIncLastMonth = JSON.stringify(input.data.percentageIncLastMonth);
								percentageIncLastMonthFlag = JSON.stringify(input.data.percentageIncLastMonthFlag);
								if(percentageIncLastMonthFlag!=null)
								percentageIncLastMonthFlag = percentageIncLastMonthFlag.replace(/\"/g, "");
								
								percentageIncLastYear = JSON.stringify(input.data.percentageIncLastYear);
								percentageIncLastYearFlag = JSON.stringify(input.data.percentageIncLastYearFlag);
								if(percentageIncLastYearFlag!=null)
								percentageIncLastYearFlag = percentageIncLastYearFlag.replace(/\"/g, "");
								
								percentageIncFinancialYear = JSON.stringify(input.data.percentageIncFinancialYear);
								percentageIncFinancialYearFlag = JSON.stringify(input.data.percentageIncFinancialYearFlag);
								if(percentageIncFinancialYearFlag!=null)
								percentageIncFinancialYearFlag = percentageIncFinancialYearFlag.replace(/\"/g, "");
								
								current_revenue_financialYear = JSON.stringify(input.data.current_sum);
								if(current_revenue_financialYear!=null)
									current_revenue_financialYear = current_revenue_financialYear.replace(/\"/g,"");
								present_revenue_month = JSON.stringify(input.data.present_revenue);
								if(present_revenue_month!=null)
									present_revenue_month = present_revenue_month.replace(/\"/g,"");
								
								
								MonthAsked = JSON.stringify(input.data.MonthAsked);
								if(MonthAsked!=null)
									MonthAsked = MonthAsked.replace(/\"/g,"");
								YearAsked = JSON.stringify(input.data.YearAsked);
								if(YearAsked!=null)
									YearAsked = YearAsked.replace(/\"/g,"");
								Product = JSON.stringify(input.data.Product);
								if(Product!=null)
									Product = Product.replace(/\"/g,"");
								
								comparison = JSON.stringify(input.data.comparison);
								if(comaprison!=null)
									comparison = comparison.replace(/\"/g,"");
								
								
								var chartData = [];
								var chartHeaders = [];
								var tempArray = [];
								var tempArray1 = [];
								var tempArray2 = [];
								var strhead = [];
								var xLabelHead = "";
								var yLabelHead = "";
								var strnum = [];
								var xLabels = [];
								

								chartData = JSON.stringify(input.data.data);
								chartHeaders = JSON.stringify(input.data.header);

								chartData = chartData.replace(/\"/g, "");
								chartData = chartData.substring(1, chartData.length - 1);

								chartHeaders = chartHeaders.replace(/\"/g, "");
								chartHeaders = chartHeaders.substring(1, chartHeaders.length - 1);


								tempArray = chartData.split(":");
								tempArray1 = tempArray.join();
								tempArray2 = tempArray1.split(",");

								strhead = chartHeaders.split(":");
								xLabelHead = strhead[0];
								yLabelHead = strhead[1];

								var m = 0,
								n = 0,
								p = 0;

								for (m in tempArray2) {
									if (m % 2 == 0) {
										xLabels[n] = tempArray2[m];
										n++;
										m++;
									} else {
										strnum[p] = tempArray2[m];
										p++;
										m++;
									}

								}

								var i=0;
								var chartValues = [];
								chartValues[i]={"value":strhead[1],"label":strhead[0]};
								i++;
								for (j in strnum)
								{
									chartValues[i]={ "value" : strnum[j] , "label" : xLabels[j] };
									i++;
								}
								
								
								
								
								if(comparison=="last year")
								{
									if(current_revenue_financialYear!=null)
									{
										if(percentageIncFinancialYear!=null)
										{
											if(percentageIncFinancialYearFlag=="Increase")
											{
												var history = {};
									            history.image = banking.you.avatar;
									            history.userType = "bot";
									            history.user = 'Rosey@Banking';
									            //history.text = $sce.trustAsHtml(control);
									            history.ts = banking.formatAMPM(new Date());
									            history.graph = true;
									            history.showGraph = true;
									        
									            
									             var jsonData = {
									                'displayString' : 'Displaying data for',
									                'formattedData':"Revenue percentage increase from last year is "+percentageIncFinancialYear+"%",   
									                'data': {
									                    'graphData' : chartValues
									                    }
									              }

									              var fnData = {
									                    'callBackFn' : 'banking.setIsGraph'     
									              }

									              var btnData = {
						                                'openingText' : '',
						                                'buttonNames' : ['Print','Email','Save as JPEG','Save as PNG'],
						                                'callBackFn' : 'banking.buttonCallBackFunction' 
						                            }
									             
									             banking.chartIndex=banking.chartIndex+1;
									              banking.containerId='chart-container-' + banking.chartIndex;
									              banking.chartId='revenue-chart-' + banking.chartIndex;  

													control=chatService.getHtmlForScrollButtons(btnData);
									            /* Html for Graph*/ control=control+chatService.getHtmlForGraph2(jsonData.displayString,jsonData.formattedData,jsonData.data.graphData,banking.containerId,banking.chartId,'history.showGraph');    
									            /* Html for Graph*/ control=control+chatService.getHtmlForTable2(jsonData.displayString,jsonData.data.graphData,jsonData.containerId,jsonData.chartId,'history.showGraph');
									                  
									              /*html for toggle button */
									              control=control+'<div class="row"><span type="submit" ng-click="' + fnData.callBackFn + '(' + 'history.showGraph,$index' + ')"' + ' class="toggle-btn">  Toggle </span></div>';
									        	  
									              history.text = $sce.trustAsHtml(control);
									              //banking.conversationHistory.push(history);			
									              if ($scope.$$phase) { // most of the time it is "$digest"
											            applyFn(history);
											      } else {
											            $scope.$apply(applyFn(history));
											      }
												  $timeout(function() {
											          var scroller = document.getElementById("boxBody");
											          scroller.scrollTop = scroller.scrollHeight;
											      }, 0, false);
													
											}
											else if(percentageIncFinancialYearFlag=="Decrease")
											{
												
												var history = {};
									            history.image = banking.you.avatar;
									            history.userType = "bot";
									            history.user = 'Rosey@Banking';
									            //history.text = $sce.trustAsHtml(control);
									            history.ts = banking.formatAMPM(new Date());
									            history.graph = true;
									            history.showGraph = true;
									        
									            
									             var jsonData = {
									                'displayString' : 'Displaying data for',
									                'formattedData':"Revenue percentage decrease from last year is "+percentageIncFinancialYear+"%",   
									                'data': {
									                    'graphData' : chartValues
									                    }
									              }

									              var fnData = {
									                    'callBackFn' : 'banking.setIsGraph'     
									              }

									              var btnData = {
						                                'openingText' : '',
						                                'buttonNames' : ['Print','Email','Save as JPEG','Save as PNG'],
						                                'callBackFn' : 'banking.buttonCallBackFunction' 
						                            }
									             
									             banking.chartIndex=banking.chartIndex+1;
									              banking.containerId='chart-container-' + banking.chartIndex;
									              banking.chartId='revenue-chart-' + banking.chartIndex;  

													control=chatService.getHtmlForScrollButtons(btnData);
									            /* Html for Graph*/ control=control+chatService.getHtmlForGraph2(jsonData.displayString,jsonData.formattedData,jsonData.data.graphData,banking.containerId,banking.chartId,'history.showGraph');    
									            /* Html for Graph*/ control=control+chatService.getHtmlForTable2(jsonData.displayString,jsonData.data.graphData,jsonData.containerId,jsonData.chartId,'history.showGraph');
									                  
									              /*html for toggle button */
									              control=control+'<div class="row"><span type="submit" ng-click="' + fnData.callBackFn + '(' + 'history.showGraph,$index' + ')"' + ' class="toggle-btn">  Toggle </span></div>';
									        	  
									              history.text = $sce.trustAsHtml(control);
									              //banking.conversationHistory.push(history);			
									              if ($scope.$$phase) { // most of the time it is "$digest"
											            applyFn(history);
											      } else {
											            $scope.$apply(applyFn(history));
											      }
												  $timeout(function() {
											          var scroller = document.getElementById("boxBody");
											          scroller.scrollTop = scroller.scrollHeight;
											      }, 0, false);

												
											}
										}
										else
										{
											var history = {};
									        history.image = banking.you.avatar;
									        history.userType = "bot";
									        history.text = Product+" revenue for the financial year of "+YearAsked+" is ₹"+current_revenue_financialYear;
									        history.user = 'Rosey@Banking';
									        history.ts =  banking.formatAMPM(new Date());
									     // banking.conversationHistory.push(history);
										
										}
										
									}
									else if(present_revenue_month!=null)
									{
										if(percentageIncLastYear!=null)
										{
											if(percentageIncLastYearFlag=="Increase")
											{
												
												var history = {};
									            history.image = banking.you.avatar;
									            history.userType = "bot";
									            history.user = 'Rosey@Banking';
									            //history.text = $sce.trustAsHtml(control);
									            history.ts = banking.formatAMPM(new Date());
									            history.graph = true;
									            history.showGraph = true;
									        
									            
									             var jsonData = {
									                'displayString' : 'Displaying data for',
									                'formattedData':"Revenue percentage increase from last year same month is "+percentageIncLastYear+"%",   
									                'data': {
									                    'graphData' : chartValues
									                    }
									              }

									              var fnData = {
									                    'callBackFn' : 'banking.setIsGraph'     
									              }

									              var btnData = {
						                                'openingText' : '',
						                                'buttonNames' : ['Print','Email','Save as JPEG','Save as PNG'],
						                                'callBackFn' : 'banking.buttonCallBackFunction' 
						                            }
									             
									             banking.chartIndex=banking.chartIndex+1;
									              banking.containerId='chart-container-' + banking.chartIndex;
									              banking.chartId='revenue-chart-' + banking.chartIndex;  

													control=chatService.getHtmlForScrollButtons(btnData);
									            /* Html for Graph*/ control=control+chatService.getHtmlForGraph2(jsonData.displayString,jsonData.formattedData,jsonData.data.graphData,banking.containerId,banking.chartId,'history.showGraph');    
									            /* Html for Graph*/ control=control+chatService.getHtmlForTable2(jsonData.displayString,jsonData.data.graphData,jsonData.containerId,jsonData.chartId,'history.showGraph');
									                  
									              /*html for toggle button */
									              control=control+'<div class="row"><span type="submit" ng-click="' + fnData.callBackFn + '(' + 'history.showGraph,$index' + ')"' + ' class="toggle-btn">  Toggle </span></div>';
									        	  
									              history.text = $sce.trustAsHtml(control);
									              //banking.conversationHistory.push(history);			
									              if ($scope.$$phase) { // most of the time it is "$digest"
											            applyFn(history);
											      } else {
											            $scope.$apply(applyFn(history));
											      }
												  $timeout(function() {
											          var scroller = document.getElementById("boxBody");
											          scroller.scrollTop = scroller.scrollHeight;
											      }, 0, false);

												
											}
											else if(percentageIncLastYearFlag=="Decrease")
											{
												var history = {};
									            history.image = banking.you.avatar;
									            history.userType = "bot";
									            history.user = 'Rosey@Banking';
									            //history.text = $sce.trustAsHtml(control);
									            history.ts = banking.formatAMPM(new Date());
									            history.graph = true;
									            history.showGraph = true;
									        
									            
									             var jsonData = {
									                'displayString' : 'Displaying data for',
									                'formattedData':"Revenue percentage decrease from last year same month is "+percentageIncLastYear+"%",   
									                'data': {
									                    'graphData' : chartValues
									                    }
									              }

									              var fnData = {
									                    'callBackFn' : 'banking.setIsGraph'     
									              }

									              var btnData = {
						                                'openingText' : '',
						                                'buttonNames' : ['Print','Email','Save as JPEG','Save as PNG'],
						                                'callBackFn' : 'banking.buttonCallBackFunction' 
						                            }
									             
									             banking.chartIndex=banking.chartIndex+1;
									              banking.containerId='chart-container-' + banking.chartIndex;
									              banking.chartId='revenue-chart-' + banking.chartIndex;  

													control=chatService.getHtmlForScrollButtons(btnData);
									            /* Html for Graph*/ control=control+chatService.getHtmlForGraph2(jsonData.displayString,jsonData.formattedData,jsonData.data.graphData,banking.containerId,banking.chartId,'history.showGraph');    
									            /* Html for Graph*/ control=control+chatService.getHtmlForTable2(jsonData.displayString,jsonData.data.graphData,jsonData.containerId,jsonData.chartId,'history.showGraph');
									                  
									              /*html for toggle button */
									              control=control+'<div class="row"><span type="submit" ng-click="' + fnData.callBackFn + '(' + 'history.showGraph,$index' + ')"' + ' class="toggle-btn">  Toggle </span></div>';
									        	  
									              history.text = $sce.trustAsHtml(control);
									              //banking.conversationHistory.push(history);			
									              if ($scope.$$phase) { // most of the time it is "$digest"
											            applyFn(history);
											      } else {
											            $scope.$apply(applyFn(history));
											      }
												  $timeout(function() {
											          var scroller = document.getElementById("boxBody");
											          scroller.scrollTop = scroller.scrollHeight;
											      }, 0, false);

												
											}
										}
										else
										{
											
											var history = {};
									        history.image = banking.you.avatar;
									        history.userType = "bot";
									        history.text = Product+" revenue for the month of "+MonthAsked+" is ₹"+present_revenue_month+"\n"+
											"Data is not present for last year same month";
									        history.user = 'Rosey@Banking';
									        history.ts =  banking.formatAMPM(new Date());
									     // banking.conversationHistory.push(history);
										
												
										}
										
									}
								}	
								else if(comparison=="last month")
								{
									if(current_revenue_financialYear!=null)
									{
										if(percentageIncFinancialYear!=null)
										{
											if(percentageIncFinancialYearFlag=="Increase")
											{
												var history = {};
										        history.image = banking.you.avatar;
										        history.userType = "bot";
										        history.text = "You can't ask for last month comparison for a financial year";
										        history.user = 'Rosey@Banking';
										        history.ts =  banking.formatAMPM(new Date());
										     // banking.conversationHistory.push(history);
											
											}
											else if(percentageIncFinancialYearFlag=="Decrease")
											{
												var history = {};
										        history.image = banking.you.avatar;
										        history.userType = "bot";
										        history.text = "You can't ask for last month comparison for a financial year";
										        history.user = 'Rosey@Banking';
										        history.ts =  banking.formatAMPM(new Date());
										     // banking.conversationHistory.push(history);
											
											}
										}
										else
										{
											
											var history = {};
									        history.image = banking.you.avatar;
									        history.userType = "bot";
									        history.text = "You can't ask for last month comparison for a financial year";
									        history.user = 'Rosey@Banking';
									        history.ts =  banking.formatAMPM(new Date());
									     // banking.conversationHistory.push(history);
										
										}
										
									}
									else if(present_revenue_month!=null)
									{
										if(percentageIncLastMonth!=null)
										{
											if(percentageIncLastMonthFlag=="Increase")
											{
												var history = {};
									            history.image = banking.you.avatar;
									            history.userType = "bot";
									            history.user = 'Rosey@Banking';
									            //history.text = $sce.trustAsHtml(control);
									            history.ts = banking.formatAMPM(new Date());
									            history.graph = true;
									            history.showGraph = true;
									        
									            
									             var jsonData = {
									                'displayString' : 'Displaying data for',
									                'formattedData':"Revenue percentage increase from previous month is "+percentageIncLastMonth+"%",   
									                'data': {
									                    'graphData' : chartValues
									                    }
									              }

									              var fnData = {
									                    'callBackFn' : 'banking.setIsGraph'     
									              }

									              var btnData = {
						                                'openingText' : '',
						                                'buttonNames' : ['Print','Email','Save as JPEG','Save as PNG'],
						                                'callBackFn' : 'banking.buttonCallBackFunction' 
						                            }
									             
									             banking.chartIndex=banking.chartIndex+1;
									              banking.containerId='chart-container-' + banking.chartIndex;
									              banking.chartId='revenue-chart-' + banking.chartIndex;  

													control=chatService.getHtmlForScrollButtons(btnData);
									            /* Html for Graph*/ control=control+chatService.getHtmlForGraph2(jsonData.displayString,jsonData.formattedData,jsonData.data.graphData,banking.containerId,banking.chartId,'history.showGraph');    
									            /* Html for Graph*/ control=control+chatService.getHtmlForTable2(jsonData.displayString,jsonData.data.graphData,jsonData.containerId,jsonData.chartId,'history.showGraph');
									                  
									              /*html for toggle button */
									              control=control+'<div class="row"><span type="submit" ng-click="' + fnData.callBackFn + '(' + 'history.showGraph,$index' + ')"' + ' class="toggle-btn">  Toggle </span></div>';
									        	  
									              history.text = $sce.trustAsHtml(control);
									              //banking.conversationHistory.push(history);			
									              if ($scope.$$phase) { // most of the time it is "$digest"
											            applyFn(history);
											      } else {
											            $scope.$apply(applyFn(history));
											      }
												  $timeout(function() {
											          var scroller = document.getElementById("boxBody");
											          scroller.scrollTop = scroller.scrollHeight;
											      }, 0, false);

												
											}
											else if(percentageIncLastMonthFlag=="Decrease")
											{
												
												var history = {};
									            history.image = banking.you.avatar;
									            history.userType = "bot";
									            history.user = 'Rosey@Banking';
									            //history.text = $sce.trustAsHtml(control);
									            history.ts = banking.formatAMPM(new Date());
									            history.graph = true;
									            history.showGraph = true;
									        
									            
									             var jsonData = {
									                'displayString' : 'Displaying data for',
									                'formattedData':"Revenue percentage decrease from previous month is "+percentageIncLastMonth+"%",   
									                'data': {
									                    'graphData' : chartValues
									                    }
									              }

									              var fnData = {
									                    'callBackFn' : 'banking.setIsGraph'     
									              }

									              var btnData = {
						                                'openingText' : '',
						                                'buttonNames' : ['Print','Email','Save as JPEG','Save as PNG'],
						                                'callBackFn' : 'banking.buttonCallBackFunction' 
						                            }
									             
									             banking.chartIndex=banking.chartIndex+1;
									              banking.containerId='chart-container-' + banking.chartIndex;
									              banking.chartId='revenue-chart-' + banking.chartIndex;  

													control=chatService.getHtmlForScrollButtons(btnData);
									            /* Html for Graph*/ control=control+chatService.getHtmlForGraph2(jsonData.displayString,jsonData.formattedData,jsonData.data.graphData,banking.containerId,banking.chartId,'history.showGraph');    
									            /* Html for Graph*/ control=control+chatService.getHtmlForTable2(jsonData.displayString,jsonData.data.graphData,jsonData.containerId,jsonData.chartId,'history.showGraph');
									                  
									              /*html for toggle button */
									              control=control+'<div class="row"><span type="submit" ng-click="' + fnData.callBackFn + '(' + 'history.showGraph,$index' + ')"' + ' class="toggle-btn">  Toggle </span></div>';
									        	  
									              history.text = $sce.trustAsHtml(control);
									              //banking.conversationHistory.push(history);			
									              if ($scope.$$phase) { // most of the time it is "$digest"
											            applyFn(history);
											      } else {
											            $scope.$apply(applyFn(history));
											      }
												  $timeout(function() {
											          var scroller = document.getElementById("boxBody");
											          scroller.scrollTop = scroller.scrollHeight;
											      }, 0, false);


											}
										}
										else
										{
											var history = {};
									        history.image = banking.you.avatar;
									        history.userType = "bot";
									        history.text = Product+" revenue for the month of "+MonthAsked+" is ₹"+present_revenue_month+"\n"+
											"Data is not present for last month ";
									        history.user = 'Rosey@Banking';
									        history.ts =  banking.formatAMPM(new Date());
									     // banking.conversationHistory.push(history);
										
												
										}
									}
								}
								
								
								
								
							}
							else if((data.result.metadata.intentName == "casa_revenue")||(data.result.metadata.intentName == "casa_revenue_input"))
							{
								
								var current_revenue_financialYear="";
								var present_revenue_month = "";
								var MonthAsked = "";
								var YearAsked = "";
								var Product = "";
								
								
								current_revenue_financialYear = JSON.stringify(input.data.current_sum);
								if(current_revenue_financialYear!=null)
									current_revenue_financialYear = current_revenue_financialYear.replace(/\"/g,"");
								present_revenue_month = JSON.stringify(input.data.present_revenue);
								if(present_revenue_month!=null)
									present_revenue_month = present_revenue_month.replace(/\"/g,"");
								
								
								MonthAsked = JSON.stringify(input.data.MonthAsked);
								if(MonthAsked!=null)
									MonthAsked = MonthAsked.replace(/\"/g,"");
								YearAsked = JSON.stringify(input.data.YearAsked);
								if(YearAsked!=null)
									YearAsked = YearAsked.replace(/\"/g,"");
								Product = JSON.stringify(input.data.Product);
								if(Product!=null)
									Product = Product.replace(/\"/g,"");
								
								
								
								if(current_revenue_financialYear!=null)
								{
									var history = {};
							        history.image = banking.you.avatar;
							        history.userType = "bot";
							        history.text = Product+" revenue for the financial year of "+YearAsked+" is ₹"+current_revenue_financialYear;
							        history.user = 'Rosey@Banking';
							        history.ts =  banking.formatAMPM(new Date());
							     // banking.conversationHistory.push(history);			
								}
							 
								
								if(present_revenue_month!=null)
								{
									var history = {};
							        history.image = banking.you.avatar;
							        history.userType = "bot";
							        history.text = Product+" revenue for the month of "+MonthAsked+" is ₹"+present_revenue_month;
							        history.user = 'Rosey@Banking';
							        history.ts =  banking.formatAMPM(new Date());
							     // banking.conversationHistory.push(history);
								
								}	
							}
						}
						else{
						
						  var history = {};
				          history.image = banking.you.avatar;
				          history.userType = "bot";
				          history.text =  "Sorry, data is not present for the given combination!";
				          history.user = 'Rosey@Banking';
				          history.ts =  banking.formatAMPM(new Date());
				         // banking.conversationHistory.push(history);
				      	
						}
					}).
					error(function(data, status) {});
	  			}
	 	  		//if the output from api.ai is not done then display the output to the user to get required output
				else {
					
					test="";
					
					function nth_occur(string, char, nth) {
						var firstIndex = string.indexOf(char);
						var length_firstIndex = firstIndex + 1;

						if (nth == 1) {
							return firstIndex;
						} else {
							var string_after = string.slice(length_firstIndex);
							var next_occur = nth_occur(string_after, char, nth - 1);

							if (next_occur === -1) {
								return -1;
							} else {
								return length_firstIndex + next_occur;
							}
						}
					}

					function nth_occur_fordot(string, char, nth) {
						var firstIndex = string.indexOf(char) + 1;
						var length_firstIndex = firstIndex + 1;

						if (nth == 1) {
							return firstIndex;
						} else {
							var string_after = string.slice(length_firstIndex);
							var next_occur = nth_occur_fordot(string_after, char, nth - 1);

							if (next_occur === -1) {
								return -1;
							} else {
								return length_firstIndex + next_occur;
							}
						}
					}		
				
					if ((data.result.metadata.intentName == "performance_statistics") ||
							(data.result.metadata.intentName == "performance_statistics_input")||
							(data.result.metadata.intentName == "monthly_trend_input")||
							(data.result.metadata.intentName == "monthly_trend")||
					    		(data.result.metadata.intentName == "casa_revenue")) {
						var initspeech = JSON.stringify(data.result.speech);
						var startspeech = initspeech;
						startspeech = startspeech.substring(1, startspeech.indexOf("<"));

						var str007 = [];

						var i = 0,
						j = 0,
						z = 1;
						for (i in initspeech) {
							var startsym = nth_occur_fordot(initspeech, ".", z);
							var endsym = nth_occur(initspeech, "<br />", z);
							if (endsym == -1)
								break;
							else {
								str007[j] = initspeech.substring(startsym, endsym);
								j++;
								z++;

							}
						}
						
						//For buttons
						var callBackFn=[];
						for(var i=0;i<str007.length;i++){
							callBackFn[i]='banking.buttonCallBackFunction';
						}
			            var history = {};
			            var jsonData = {
			                'openingText' : startspeech,
			                'buttonNames' : str007,
			                'callBackFn' : callBackFn 
			            }
			            var control = chatService.getHtmlForButtons(jsonData); 
			            history.image = banking.you.avatar;
			            history.userType = "bot";
			            history.user = 'Rosey@Banking';
			            history.text = $sce.trustAsHtml(control);
			            history.ts = banking.formatAMPM(new Date());
			           // banking.conversationHistory.push(history);
			        	
						
					}else {
						test = data.result.speech;
						var history = {};
				          history.image = banking.you.avatar;
				          history.userType = "bot";
				          history.text =  test;
				          history.user = 'Rosey@Banking';
				          history.ts =  banking.formatAMPM(new Date());
				         // banking.conversationHistory.push(history);
						
					}				
				}

				if ($scope.$$phase) { // most of the time it is "$digest"
		            applyFn(history);
		        } else {
		            $scope.$apply(applyFn(history));
		        }
				$timeout(function() {
		          var scroller = document.getElementById("boxBody");
		          scroller.scrollTop = scroller.scrollHeight;
		        }, 0, false);
			}).
			error(function(data, status) {});			
		}

		var applyFn = function (history) {
	        banking.conversationHistory.push(history);
	    };
	  
	  
      banking.init = function(){
    	  
    	  banking.isMobile=chatService.getIsMobile();
          console.log('isMobile detected',banking.isMobile);

          banking.typing="...";

    	  var control;
          banking.chartIndex=0;
        
          var history = {};
          history.image = banking.you.avatar;
          history.userType = "bot";
          history.text =  'Hi! I am Mike. I can help you with anything related to Banking ';
          history.user = 'Rosey@Banking';
          history.ts =  banking.formatAMPM(new Date());
          banking.conversationHistory.push(history);
      
          
        
              //Scroll to the bottom of the screen
              $timeout(function() {
                  var scroller = document.getElementById("boxBody");
                  scroller.scrollTop = scroller.scrollHeight;
              }, 0, false);
      }
	      banking.init();
	}]);
