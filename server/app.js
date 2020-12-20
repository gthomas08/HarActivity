const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const signupRouter = require('./controllers/signup');
const loginRouter = require('./controllers/login');
const updateUsernameRouter = require('./controllers/user/updateUsername');
const updatePasswordRouter = require('./controllers/user/updatePassword');
const uploadRouter = require('./controllers/user/upload');
const userStatsRouter = require('./controllers/user/userStats');
const heatmapRouter = require('./controllers/user/heatmap');

const numberOfUsersRouter = require('./controllers/admin/generalInfo/numberOfUsers');
const numberOfMethodsRouter = require('./controllers/admin/generalInfo/numberOfMethods');
const numberOfStatusRouter = require('./controllers/admin/generalInfo/numberOfStatus');
const numberOfDomainsRouter = require('./controllers/admin/generalInfo/numberOfDomains');
const numberOfISPsRouter = require('./controllers/admin/generalInfo/numberOfISPs');

const logger = require('./utils/logger');
const config = require('./utils/config');
const middleware = require('./utils/middleware');

const app = express();

app.enable('trust proxy');

// Connect to database
mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message);
  });

// Remove deprecation warning
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

app.use(cors()); // Handle requests from different ports
app.use(express.static('build')); // Handle static file (react build)
app.use(bodyParser.json({ limit: '50mb' })); // Handle request body
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Handle requests to different routes
app.use('/signup', signupRouter);
app.use('/login', loginRouter);

// Handle requests from user
app.use('/update/username', updateUsernameRouter);
app.use('/update/password', updatePasswordRouter);
app.use('/upload', uploadRouter);
app.use('/userstats', userStatsRouter);
app.use('/heatmap', heatmapRouter);

// Handle requests from admin
app.use('/admin/generalinfo/numberofusers', numberOfUsersRouter);
app.use('/admin/generalinfo/numberofmethods', numberOfMethodsRouter);
app.use('/admin/generalinfo/numberofstatus', numberOfStatusRouter);
app.use('/admin/generalinfo/numberofdomains', numberOfDomainsRouter);
app.use('/admin/generalinfo/numberofisps', numberOfISPsRouter);

// Handle errors
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
