const express = require('express');
const app = express();
const config = require('./config/dbconfig');
const userroutes = require('./routes/userRoutes');
const reporoutes = require('./routes/reporoutes');
const versionroutes = require('./routes/versionroutes');
const grouproutes = require('./routes/grouproutes');
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use('/api/users',userroutes);
app.use('/api/repositories',reporoutes);
app.use('/api/versions',versionroutes);
app.use('/api/groups',grouproutes);
app.listen(5001,()=>{
    console.log('app is listening at port 5001');
});