const express = require('express');
const dotEnv = require('dotenv');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const dbConnection = require('./database/connection');

const FCM = require('fcm-push');
const fcm = new FCM('AAAAv8LsIRY:APA91bFIgpGxY3_gfi-tvx28C68IAYWiOdaKVaLsXjdSUuwqcoOY0VQaoh-0tct91u8NB6Zg5fXsj3VIjjgv5GKJZPj7vKukCih0xd3C2b3k0EXYwK_-YQcGDpHpaLSN9VpfY_DDxCkx');


dotEnv.config();

const app = express();

// db connectivity
dbConnection();

// cors
app.use(cors());

// request payload middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/product', require('./routes/productRoutes'));
app.use('/api/v1/user', require('./routes/userRoutes'));

// API Documentation
if (process.env.NODE_ENV != 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

var message = {
  to:'e8_K7yo0T9eFbUOZnRW3gT:APA91bEZSMhbXKix68xfg15EHhZoOGcNSfkPLl5kK3zshIBvgJC6YYfDA-isyjsVJd7QNRdnfECEFVPA9jrsEdGQHzBVRNkUQPesF0TpUQVA5yAPYZCF2GUA51ttcicYvSTob1KbtlfZ',
   collapse_key:'type_a',

   notification: {
     title:'hello',
     body:'helooooooooooooooo'
   }
}
app.get('/', async(req, res, next) => {

 await fcm.send(message,(err,response)=>{
    if(!err){
      res.send('Hello from Node API Server'+response);
    }else{
      res.send('failed'+err);
    }
  }).catch(err=>{
    res.send('failed'+err);
  });
 
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// error handler middleware
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send({
    status: 500,
    message: err.message,
    body: {}
  });
})