import express from 'express'
import helmet from 'helmet'
import session from 'express-session';
import uniqid from 'uniqid'
import {User} from './models';

const app = express();
const PORT = process.env.PORT || 3000;


// Session middleware
app.use(session({
  name: 'sid',
  resave: false,
  saveUninitialized: false,
  secret: "shhh don't say it!!",
  cookie: {
    maxAge: 1000 * 60 * 60 * 2,
    secure: false
  }
}));

// Accept JSON and url encoding as params
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Some protection
app.use(helmet());

app.post('/signup', checkUserParams, (req, res) => {
  const {username, password} = req.body;
  User.create({username, password}, (err, doc)=> {
    if(err){
      return res.status(500).send("error ocurred while saving your credentials");
    }
    res.json(doc);
  });
})

app.post('/login', checkUserParams, (req, res) => {
  const {username, password} = req.body;
  User.findOne({username}, (err, user) => {
    if(err) return res.status(500).send("Encountered a db error");
    
    if(user){
      user.comparePassword(password, (error, isMatch) => {
        if(error) return res.status(500).send("Encountered a db error");
        if(isMatch){
          const hostID = uniqid();
          req.session.userId = hostID;
          res.json({userId: hostID});
        }else {
          res.status(404).json({"msg": "not authorized"});
        }
      })
    } else {
      res.status(404).send('Account not found');
    }
    
  });

})

app.post('/logout', (req, res) => {
  const {hostId} = req.body;
  req.session.destroy();
  res.json({message: "success"});
})


app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
})


// ============================
// CUSTOM MIDDLEWARE FUNCTIONS
// ============================

/**
 * Middleware function for checking if user gave an username and password
 * @param {*} req the request object
 * @param {*} res the response object
 * @param {*} next the callback to execute if the test is passed
 */
function checkUserParams(req, res, next){
  if(typeof req.body.password === 'undefined' || typeof req.body.username === 'undefined'){
    res.status(400).send('Need username and password');
  }else {
    next();
  }
}