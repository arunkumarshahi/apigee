# apigee

### Usecase : create an adapter at apigee, which will receive the event from external source, send the immediate notification to caller and keep proceesing request asynchronously in background. Added shared flow for basic authentication and quota managment like 1 request per minute.

###### policies - define the policy which can be plugged as steps in flow . It is associated with jsvascript resource for custom code execution.
###### proxy endpoint(intiate the flow and specifiy diffrent flow logic to execute to process request and reponse before sending to client )
###### KVM - key value map like environment variables for each environment. This needs to be plugged before intiating preflow and post flow.
###### Target endppoint - http or nodejs endpoint invoked from proxy endpoint . like calling a microservice after processing requet from gateway.
###### Resources - javascript code for custom logic execution.

our flow look like 

KVM (to read endpoint url ) --> preflow --> postflow --> flow --> step -->plicy --> jsc --> target ep

it reads endppont url from kvm and which can be accessed using - 
######  var serverURLs= context.getVariable("targetEP");

This target url is set in kvm policy as 
```
 <KeyValueMapOperations async="false" continueOnError="false" enabled="true" name="Key-Value-Map-Operations-1" mapIdentifier="KVM_Hello_plane_node">
    <DisplayName>Key Value Map Operations-1</DisplayName>
    <Properties/>
   <Get assignTo="targetEP" index="1">
        <Key>
            <Parameter>hello-external-url</Parameter>
        </Key>
   </Get>
    <Scope>environment</Scope>
 </KeyValueMapOperations>
```

###### invoke external endpoint asychronously an return notification to caller.
```
 <RouteRule name="GoNowhere">
        <Condition>request.header.routeTo = "xxx"</Condition>
    </RouteRule>
```    
    Async invocation which is added as a step will call flollowing js -
```
 var getPayload = context.getVariable("request.content");
 print("This is custom request - 1 :: "+getPayload);
 var serverURLs= context.getVariable("targetEP");
 print("This is custom target - 1 :: "+serverURLs);
 try {
 var headers = {
      'Content-Type' : 'application/json'
    };
   var myRequest = new Request(serverURL, "POST", headers, getPayload);
   httpClient.send(myRequest);
	 print("This is custom target - 1");
	});
	context.setVariable('message.header.Content-Type', "application/json");
    context.setVariable('message.content',"");
} catch (err) {
    throw err;
}
```

##### Added shared flow
 Basic authntication and quota managment  defined as shared flow 
 Added inot the main flow as flow callout 
 
 ```
 curl -X POST  -H "routeTo:xxx"  -d @data.json  -i "https://arunkumarshahi-eval-test.apigee.net/hello-plane-node?username=arun&password=kumar"
 
 ```
 note - data.json is any json file 
