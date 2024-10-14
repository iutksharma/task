import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import database from './src/common/config/db.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.json' assert { type: 'json' };
import config from './src/common/config/envConfig.js';
import userRoute from './src/api/user/index.js'

const app = express();
app.use(cors());
app.use(bodyParser.json());

// file upload on local
app.use('/assets/profile', express.static('assets/profile'));

// swagger for API documentation
app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.get('/', (req, res) => {
    res.json({message: "Hello from the server"});
})

// routes
app.use('/users', userRoute)

// database connectivity
database;

// server
app.listen(config.PORT, config.HOST, () =>{
    console.log(`Server is running on http://${config.HOST}:${config.PORT}`);
})