 //console.log("This is custom target");
   var getPayload = context.getVariable("request.content");
 print("This is custom request - 1 :: "+getPayload);
 var serverURLs= context.getVariable("targetEP");
 print("This is custom target - 1 :: "+serverURLs);

 try {
   
	//var serverURLs = targetEP;
	var serverURLsArray = serverURLs.replace(/ /g, '').split(',');
    //var headers = {'Content-Type': 'application/json','vf-trace-transaction-id': context.getVariable('vf.trace.transaction.id')};
	serverURLsArray.forEach(serverURL => {
	print("serverURL ::",serverURL);
	//var calloutResponse = httpClient.get(serverURL); 
	var headers = {
      'Content-Type' : 'application/json'
    };
	var myRequest = new Request(serverURL, "POST", headers, getPayload);
   httpClient.send(myRequest);
//	httpClient.PostAsync(serverURL, getPayload);
	 print("This is custom target - 1");
//   fetch(serverURL)
//   .then(response => response.json())
//   .then(data => print(data));
	});
	context.setVariable('message.header.Content-Type', "application/json");
context.setVariable('message.content',"");
} catch (err) {
    throw err;
}