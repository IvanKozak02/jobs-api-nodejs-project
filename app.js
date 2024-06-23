require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const {router: authRouter} = require('./routes/auth')
const {router: jobsRouter} = require('./routes/jobs')
const connectDB = require("./db/connect");
const {isAuthenticated} = require('./middleware/authentication');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

//SWAGGER

const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml')


app.use(express.json());
// extra packages
app.set('trust proxy', 1);
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 100
}))
app.use(helmet());
app.use(cors());
app.use(xss());


// routes
app.get('/', (req, res)=>{
    res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>')
})

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use('/api/v1/auth/', authRouter);
app.use('/api/v1/jobs/', isAuthenticated, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log('DB connected successfully...')
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();
