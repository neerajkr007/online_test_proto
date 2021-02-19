const express = require('express');
const app = express();
var http = require('http')
const serv = require('http').createServer(app);
 










app.get('/', (req, res) =>
{
    res.sendFile(__dirname + '/index.html');
});

app.get('/index.html', (req, res) =>
{
    res.sendFile(__dirname + '/index.html');
}); 

app.get('/admin.html', (req, res) =>
{
    res.sendFile(__dirname + '/admin.html');
    
}); 

app.get('/signup.html', (req, res) =>
{
    res.sendFile(__dirname + '/signup.html');
    
}); 


app.use(express.static(__dirname + '/public'));

serv.listen(process.env.PORT || 3000); 
 



