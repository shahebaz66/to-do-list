//jshint esversion:6
const data=require(__dirname+"/data.js");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _=require("lodash");

const app = express();
const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://admin-shahebaz:admin123@shahebaz-r8yb8.mongodb.net/blogdb?retryWrites=true&w=majority",{useNewUrlParser:true, useUnifiedTopology: true},function () {
  console.log("success fully connected");
});


const dataSchema=new mongoose.Schema({
  title:String,
  content:String

});

const Data=mongoose.model("Data",dataSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const newEntry=new Data({
  title:"Welcome",
  content:"This is my first entry in this blog"
});



app.get("/",function (req,res) {
  Data.find({},function (err,final) {
    if(final.length===0){
      newEntry.save(function () {
        res.redirect("/");
      });
    }else{

    res.render("home.ejs",{data:data.homeStartingContent,final:final});
  }
  });

});

app.get('/about',function (req,res) {
    res.render("about.ejs",{data:data.aboutContent});
  });
app.get('/contact',function (req,res) {
  res.render("contact.ejs",{data:data.contactContent});
});
app.get('/compose',function (req,res) {
    res.render("compose.ejs");
});




app.post("/",function (req,res) {
  const value=_.capitalize(req.body.data);
  const text=req.body.text;
  const newEntry=new Data({
    title:value,
    content:text
  });
  newEntry.save(function () {
      res.redirect("/");
  });

});

app.post("/delete",function (req,res) {
  const title=_.capitalize(req.body.delete);
  console.log(title);
  Data.deleteOne({title:title},function () {
    res.redirect("/");
  })

})
app.get("/posts/:para", function(req, res){
  const requestedTitle = _.capitalize(req.params.para);
  console.log(requestedTitle);
  Data.findOne({title:requestedTitle},function (err,post) {
    res.render("final.ejs", {
      title: post.title,
      content: post.content
    });
  });
});



let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port,function () {
  console.log("server running succesfully....");
});
