//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//connecting to new mongoose database called 'blogDB'
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true,
       useUnifiedTopology: true
}).then(() => console.log("Connected to DB"))
.catch(console.error);


//creating a new 'postSchema' containing TITLE & CONTENT
const postSchema = {

    title: String,
    content: String
   
   };

//creating a new Mongoose Model using SCHEMA to define our 'POSTS COLLECTION" 
const Post = mongoose.model("Post", postSchema);  //red one POST is COLLECTION NAME 
   
   
// deleting the existing posts array.
//let posts = [];

app.get("/", function(req, res){

    //find all the posts in the posts collection and render that in the home.ejs file.
    Post.find({}, function(err, posts){//finding all posts inside 'Post' collection & rendering them to 'Home page'
    res.render("home", {// 'home' will take to 'home.ejs' , there exista 'startingContent' & 'posts'
    startingContent: homeStartingContent, //here homeStartingContent is const declared above
    posts: posts // here posts is a array
    });
});
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
    //creating NEW POST DOCUMENT using 'mongoose model'
    const post = new Post ({  //'Post' here is Collection Object inside Database

        title: req.body.postTitle, //postTitle is name gievn inside 'form in compose.ejs'
        content: req.body.postBody
     
      });
      //need to save the document to your database instead of pushing to the posts array.

      //Add a callback to the save method to only redirect to the home page once save is complete with no errors.
      post.save(function(err){
        if (!err){
            res.redirect("/");
        }
      });


//   posts.push(post);
//   res.redirect("/");
});

app.get("/posts/:postId", function(req, res){ //this "/posts/:postId" request made from 'HOME.ejs' page
    const requestedPostId = req.params.postId;

    //findOne() method to find the post with a matching id in the posts collection.
    //Once a matching post is found, you can render its title and content in the post.ejs page.
    Post.findOne({_id: requestedPostId}, function(err, post){ //here 'post' will store the found postID
      res.render("post", { //here it goes to 'post.ejs' page which has 'title' & 'content' values
        title: post.title,
        content: post.content
      });
    });

});

let port = process.env.PORT || 8000;
app.listen(port, function() {
  console.log("Server started on port "+port);
});
