const { errorHelper } = require("../utils/errorHelpers.js");
const { register, login } = require("../services/userService.js");
const { isAuthorized } = require("../middlewares/authMiddleware.js");
const photoService = require("../services/photoService.js");



const userController = require("express").Router();

userController.get("/register", async (req, res) => {
  try {
    res.render("register", {
      title: "Register",
    });
  } catch (err) {
    const errors = errorHelper(err)
    res.render('register',{
      title : 'Register',
      errors
    })
  }
});

userController.post("/register", async (req, res) => {
  try {
    const token = await register(req.body);
    res.cookie('auth',token,{httpOnly : true})
    res.redirect('/')
  } catch (err) {
    const errors = errorHelper(err)
    res.render('register',{
      title : 'Register',
      errors
    })
  }
});


userController.get("/login", async (req, res) => {
    try {
      res.render("login", {
        title: "Login",
      });
    } catch (err) {
      const errors = errorHelper(err)
      res.render('login',{
        title : 'Login',
        errors
      })
    }
  });
  
  userController.post("/login", async (req, res) => {
    try {
      const token = await login(req.body);
      res.cookie('auth',token,{httpOnly : true})
      res.redirect('/')
    } catch (err) {
      const errors = errorHelper(err)
      res.render('login',{
        title : 'Login',
        errors
      })
      console.log(err);
    }
  });

  userController.get("/logout",isAuthorized , async (req, res) => {
    res.clearCookie('auth')
    res.redirect('/')
  });

  
  userController.get("/:id/profile",isAuthorized, async (req, res) => {
    try{
      const posts = (await photoService.getAll()).filter(post => post.owner.email === req.user.email )
      // const email = posts[0].owner.email
      // const username = posts[0].owner.username
      const {email,username} = posts[0].owner
      const photosAmount = posts.length
  
      res.render('profile',{
        title : 'My Profile',
        posts,
        email,
        username,
        photosAmount
      })
      
    }catch(err){
      const errors = errorHelper(err)
      res.render('home',{
        title : 'Home',
        errors
      })
    }
  });
  

module.exports = userController;

