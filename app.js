const express = require('express'); //importing express package to build routes easily
const app = express();  //execute the package

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config'); // to use variables from .env
//npm start - to run the app
//sudo systemctl start mongod - to start db
app.use(bodyParser.json());
//routes

//import routes
const postsRoute = require('./routes/posts');

app.use('/posts', postsRoute); //use postRoute when we hit posts

// //middlewares - function that executes whenever user hit the route
// app.use('/posts', () => {
//     console.log('middleware running');
// }); - can be used to check if user authorized


//first parameter - route at which we accept request
//second - function with request and response parameters
app.get('/', (req, res) => {
    res.send('Home page');
});

//app.post() - to send something (eg submit a form)
//app.delete(), app.patch()

//connect do db
mongoose.connect(process.env.DB_CONNECTION, () => {
    console.log('Connected to db');
});
app.listen(3000); // port that the server will listen to
