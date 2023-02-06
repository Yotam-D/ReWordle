const express = require('express')
const dotenv = require('dotenv')
const knex = require('knex')
const cors = require('cors')
const login = require('./db.js')
const bodyParser = require('body-parser')
const app = express()
dotenv.config()
let userInfo = {};

app.set('view engine', 'ejs')
app.use(cors())
app.use('/',express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

    app.listen (process.env.PORT, ()=>{
        console.log(`listening on port ${process.env.PORT}`);
    })

function setUserInfo(Info) {
    userInfo = Info;
    }

const db = knex({
    client:'pg',
    connection: {
      host : process.env.DB_HOST,     
      port: process.env.DB_PORT,              
      user : process.env.DB_USER,       
      password : process.env.DB_PASSWORD,          
      database : process.env.DB_DATABASE,
      ssl: { rejectUnauthorized: false }
        }
    })
        
// send the client side answer wether 'valid user' or 'invalid user' after comparing request username and password with the DB data
app.post('/login',(req,res) =>{
    login.validate(req.body.username,req.body.password,db)
    .then(validateRes => {
        if(validateRes){
                // get user Data from server according to username pass validation
                login.getUserInfo(req.body.username,req.body.password,db)
                    // setting the user data in local varible "userInfo"
                    .then(info => setUserInfo(info))
                    .catch(err => console.log("unable to get info :", err))
                res.send({status: 'valid user'})
            }
            else{res.send({status: 'invalid user'})}
        })
    })

// renders game page after login completed
app.get('/play', (req,res) =>{
        res.render('playClassic')
    })

    //send new word and new wrod ID to client
app.get('/getWord', (req,res) =>{
    console.log('user_info:', userInfo);
    res.send({
        userWord:userInfo.word_text,
        wordId:userInfo.word_id
    })
    })

app.get('/updateuser', (req,res)=>{
    login.updateUser(userInfo,db)
    .then(login.getUserInfo(userInfo.username,userInfo.password,db)
    .then(info => setUserInfo(info)))
    // setting the user data in local varible "userInfo"
    .catch(err => console.log("unable to get info :", err))
    console.log('user updated');
})
