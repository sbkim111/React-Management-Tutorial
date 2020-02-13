//const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OBJECT;

const dbConfig = require('./database.js');

oracledb.getConnection(
    {  
    user            : dbConfig.user, 
    password        : dbConfig.password,     
    connectString   : dbConfig.connectString 
    },     
    function(err, connection) { 
        if (err) {           
           console.error(err.message);     
           return;     
        } 

        var query =    
            'SELECT * FROM CUSTOMER'; 
    
        connection.execute(query, [], function (err, result) { 
           if (err) { 
              console.error(err.message); 

              doRelease(connection); 
              return; 
           } 
    
           console.log(result.rows);   
           
           doRelease(connection, result.rows);
        }); 
        
    }
);     
    
function doRelease(connection, userlist) {
    connection.close(function(err){
        if(err) {
            console.error(err.message);
        }

        //console.log('list size: ' + userlist.length);

        //for(var i=0; i<userlist.length; i++) {
            //console.log('name: ' + userlist[i][2]);
            
        //}
        //console.log(userlist);
        //response.send(userlist);

        app.get('/api/customers', (req, res) => {

            console.log(userlist);
            res.send(userlist);
    
        });        
        
    })
}



app.listen(port, () => console.log(`Listening on port ${port}`));