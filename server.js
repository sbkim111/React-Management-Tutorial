//const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OBJECT;
oracledb.autoCommit = true;

const dbConfig = require('./database.js');
const ipConfig = require('./ipConfig.js');



app.get('/api/customers', (req, res) => {
    oracledb.getConnection({  
        user          : dbConfig.user, 
        password      : dbConfig.password,     
        connectString : dbConfig.connectString 
    },     
    function(err, connection) { 
        if (err) {           
            console.error(err.message);     
            return;     
        } 

        let sql =    
            'SELECT * FROM CUSTOMER WHERE isDeleted = 0 ORDER BY ID DESC'; 
    
        connection.execute(sql, [], function (err, result) { 
        if (err) { 
            console.error(err.message); 

            doRelease(connection); 
            return; 
        } 
    
        //console.log(result.rows);   
        
        doRelease(connection, result.rows);
        }); 
        
    });     
        
    function doRelease(connection, userlist) {
        connection.close(function(err){
            if(err) {
                console.error(err.message);
            }

            //console.log(userlist);
            res.send(userlist);
        })
    }
}); 

const multer = require('multer');
//const upload = multer({dest: './upload'});

const upload = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './upload');
        },
        filename: function(req, file, cb) {
            cb(null, file.originalname);
        }
    })
})

app.use('/image', express.static('./upload'));

app.post('/api/customers', upload.single('image'), (req, res) => {
    oracledb.getConnection({
        user          : dbConfig.user, 
        password      : dbConfig.password,     
        connectString : dbConfig.connectString 
    },
    function(err, connection) {
        if(err) {
            console.error(err.message);
            return;
        }      

        //let sql = 'INSERT INTO CUSTOMER VALUES (customer_seq.nextval, ?, ?, ?, ?, ?)';
        let sql = 'INSERT INTO CUSTOMER VALUES (customer_seq.nextval, :IMAGE, :NAME, :BIRTHDAY, :GENDER, :JOB, sysdate, 0)';
        let image = ipConfig.ip + '/image/' + req.file.originalname;
        let name = req.body.name;
        let birthday = req.body.birthday;
        let gender = req.body.gender;
        let job = req.body.job;
        let params = [image, name, birthday, gender, job];

        console.log('==> userlist insert query');
        connection.execute(sql, params, function(err, result) {
            if(err) {
               
                console.error(err.message);
                
                doRelease(connection);
                return;
            }
            console.log(result);
            console.log('Rows Insert: ' + result.rowsAffected);

            doRelease(connection, result.rowsAffected);
        });
    });

    function doRelease(connection, result) {
        connection.close(function(err) {
            if(err) {
                console.error(err.message);
            }

            res.send(''+result);
        });
    };
});

app.delete('/api/customers/:id', (req, res) => {
    oracledb.getConnection({
        user          : dbConfig.user, 
        password      : dbConfig.password,     
        connectString : dbConfig.connectString 
    },
    function(err, connection) {
        if(err) {
            console.error(err.message);
            return;
        }      

        let sql = 'UPDATE CUSTOMER SET isDeleted = 1 WHERE id = :iD';
        let params = [req.params.id];
        console.log(sql);
        console.log(params);
        console.log('==> userlist delete query');
        connection.execute(sql, params, function(err, result) {
            if(err) {
               
                console.error(err.message);
                
                doRelease(connection);
                return;
            }
            //console.log(result);
            console.log('Rows Delete: ' + result.rowsAffected);

            doRelease(connection, result.rowsAffected);
        });
    });

    function doRelease(connection, result) {
        connection.close(function(err) {
            if(err) {
                console.error(err.message);
            }

            res.send(''+result);
        });
    };
});

app.listen(port, () => console.log(`Listening on port ${port}`));