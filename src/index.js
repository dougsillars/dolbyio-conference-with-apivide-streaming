require('dotenv').config();
const express = require('express');
const app = express();
bodyParser = require('body-parser');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine','pug');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var request = require("request");


const dolbykey=process.env.dolbykey;
const dolbysecret = process.env.dolbysecret;



app.get('/123', (req, res) => {
    //authenticate with Dolby
    //first we must authenticate
	var authOptions = {
		method: 'POST',
		url: 'https://session.voxeet.com/v1/oauth2/token',
		headers: {
			'Authorization': "Basic " + btoa(encodeURI(dolbykey) + ":" + encodeURI(dolbysecret))
			
		},
        data: {
          grant_type: 'client_credentials'
        }
	}
    //console.log(authOptions);
	request(authOptions, function (error, response, body) {
		if (error) throw new Error(error);
		//this will give me the api key
       
		console.log("body", body);
        bodyJson = JSON.parse(body);
        var authToken = bodyJson.access_token;
		console.log("token ",authToken);
        res.redirect("/index.html?token="+authToken);
      //  res.sendFile(path.join(__dirname, '../public', 'index.html'));  
    });
});

app.post('/startrtmp', (req, res) => {
    console.log("body", req.body);
  //  bodyJson = JSON.parse(req.body);

    var rtmpstreamURL = req.body.uri;
    var apiUrl = req.body.apiUrl;
    var rtmpOptions = {
		method: 'POST',
		url: apiUrl,
		headers: {
            'Content-Type': 'application/json',
			'Authorization': "Basic " + btoa(encodeURI(dolbykey) + ":" + encodeURI(dolbysecret))	
		},
        body: JSON.stringify({"uri": rtmpstreamURL})
	} 
    console.log("rtmpstart options:", rtmpOptions);
    request(rtmpOptions, function (error, response, rtmpbody) {
		if (error) throw new Error(error);
		console.log("body", rtmpbody);
        bodyJson = JSON.parse(rtmpbody);
        res.sendStatus(200);
        
    });   

});

app.post('/stoprtmp', (req, res) => {
    console.log("body", req.body);
  //  bodyJson = JSON.parse(req.body);

    var rtmpstreamURL = req.body.uri;
    var apiUrl = req.body.apiUrl;
    var rtmpOptions = {
		method: 'POST',
		url: apiUrl,
		headers: {
            'Content-Type': 'application/json',
			'Authorization': "Basic " + btoa(encodeURI(dolbykey) + ":" + encodeURI(dolbysecret))	
		},
	} 
    console.log("rtmpstart options:", rtmpOptions);
    request(rtmpOptions, function (error, response, rtmpbody) {
		if (error) throw new Error(error);
		console.log("body", rtmpbody);
        bodyJson = JSON.parse(rtmpbody);
        res.sendStatus(200);
        
    });   

});

//testing on 3027
app.listen(3027, () =>
  console.log('Example app listening on port 3027!'),
);