
const session = require("express-session");
const collection = require("../../collection/config");
const crypto = require('crypto');
require('dotenv').config();
const algorithm = 'aes-256-cbc'; // AES-256 mit CBC Mode
const key = Buffer.from(process.env.CRYPTO_KEY, 'hex');  // 32 Bytes für AES-256
const iv = Buffer.from(process.env.CRYPTO_IV, 'hex');;  // Initialisierungsvektor (16 Byte für AES)

//encrypt den user name
function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}
function decrypt(encryptedText) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else if(req.cookies.login != null) {
         
        const usercrypt = decrypt(req.cookies.login);
        const user =  collection.findOne({name: usercrypt})
        if(!user){
            return  res.redirect("/login");
        }
        req.session.user = usercrypt;
        
        return next();
    }else{
        res.redirect('/login');
    }
  }
  
  function loadAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else if(req.cookies.login != null) {
         
        const usercrypt = decrypt(req.cookies.login);
        const user =  collection.findOne({name: usercrypt})
        if(!user){
           return next();
        }
        req.session.user = usercrypt;
        
        return next();
  }
  return next();
}

  async function   isAdmin(req,res,next){
    const user = await collection.find({name: req.session.user});
    if(user.admin){
        return next();
    }
    res.redirect("/")
  };
  module.exports = {isAuthenticated, loadAuthenticated, isAdmin,encrypt}