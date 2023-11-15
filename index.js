const express = require("express")
const cors = require('cors')
const dotenv = require('dotenv')
const userroute = require('./routes/user')
const authroute = require('./routes/auth')
const orderroute = require('./routes/order')
const app = express();
const mongoose = require('mongoose')


//Config
dotenv.config();
//Connexion BD
mongoose.connect(process.env.MONGO_URL,)
    .then(() => console.log('Connexion etablie'))
    .catch((e) => {
        console.log(e);
    });
//
app.use(cors());
app.use(express.json());

//Nos Routes
app.use("/orderes", orderroute);
app.use("/auth", authroute);
app.use("/user", userroute);

app.listen(process.env.PORT || 5000, () => {
    console.log('hey');
});