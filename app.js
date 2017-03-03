var express = require ('express');
var bodyParser = require ('body-parser');
var path = require ('path');
var router = require('./routes');
var app = express();
var mongoose = require('mongoose');
var DB_URI = "mongodb://localhost:27017/portfolio";
var Schema = mongoose.Schema;


var us = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  works: String
});

var userCollection = mongoose.model('User', us);

// view engine
app.set ('view engine', 'ejs');
app.set ('views', path.join(__dirname,'views'));
// bodyParser middleware
app.use(bodyParser.json());
app.use (bodyParser.urlencoded({extended: false}));


//set static path
app.use(express.static(path.join(__dirname,'public')))

mongoose.connect(DB_URI);
app.use(router);



app.get('/',function(req,res){
  res.render ('homepage');

});



app.post('/student',function(req,res){
  res.render ('index');

});

app.post('/customer',function(req,res){
  res.render ('allportofolios');
});


app.get('/getEveryUser', function(req,res){


  userCollection.find(function(err, users) {
            if (err)
                res.send(err);

            res.json(users);
        });



});

/*app.post('/login',function(req,res){
  res.render('profile')
});*/


app.post('/login',function(req,res){
  var uname = req.body.uname;
  var pw = req.body.psw;


userCollection.find({ username: uname }, function(err, users) {
  if (err) throw err;

  if(users.length>=1 && users[0].password == pw)
  {

    res.redirect('profile/'+users[0]._id);
  }
  else{

    res.render('incorrect-password');
  }
});



});


app.post('/sign',function(req,res){
  res.render('signup')
});

app.get('/profile/:id',function(req,res){
  res.render('profile')
});


app.get('/getUser/:id',function(req,res){
  console.log('gett');
  var Id = req.params.id;
  userCollection.find({ _id : Id }, function(err, users) {
    if (err) throw err;
    user = users[0];
    res.send(user);
  });
});


app.post('/newWork/:id',function(req,res){

  var Id = req.params.id;
  work = req.body;

  userCollection.findById(Id, function(err, user) {
           if (err)
               res.send(err);
            console.log(123);
           user.works += "^"+work.work;

           user.save(function(err) {
               if (err)
                   res.send(err);

           });
       });
});

app.post ('/user/add', function (req,res){
  var username1 = req.body.email;
  var password1 = req.body.psw;
  var name1 = req.body.name;
  var x = userCollection({
  username: username1,
  password: password1,
  name: name1,
  works: ''
  });
x.save(function(err) {
      if (err) throw err;

    });
  res.render('index');
});

app.listen(3000, function (){
  console.log ('server started on port 3000...');

})
