Test the chat API
To test the WebSocket API, you can use wscat, an open-source, command line tool.

1) Install NPM.
2) Install wscat:

$ npm install -g wscat

3) On the console, connect to your published API endpoint by executing the following command:

$ wscat -c wss://{YOUR-API-ID}.execute-api.{YOUR-REGION}.amazonaws.com/{STAGE}
To test the sendMessage function, send a JSON message like the following example. The Lambda function sends it back using the callback URL:
$ wscat -c wss://{YOUR-API-ID}.execute-api.{YOUR-REGION}.amazonaws.com/dev
connected (press CTRL+C to quit)
> {"action":"sendmessage", "data":"hello world"}
< hello world

If you run wscat in multiple consoles, each will receive the “hello world”.


