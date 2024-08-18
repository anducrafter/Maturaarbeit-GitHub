
const session = require("express-session");

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else if(req.cookies.login != null) {
         
        req.session.user = JSON.parse(req.cookies.login)
        console.log(req.session.user)
        return next();
    }else{
        res.redirect('/login');
    }
  }
  
  function loadAuthenticated(req, res, next) {
    if (req.session.user) {
       
    } else if(req.cookies.login != null) {
         
        req.session.user = JSON.parse(req.cookies.login)
        console.log(req.session.user)
        
    }
    return next();
  }

  module.exports = {isAuthenticated, loadAuthenticated}