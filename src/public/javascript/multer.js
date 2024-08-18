//Bild hochladen
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');

function generateUUID() { 
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

if (!fs.existsSync(uploadDir)) {
  
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null, uploadDir);
    },
    filename: (req,file,cb) =>{
       
        cb(null, file.fieldname + '-' + generateUUID() + path.extname(file.originalname) );
    }
})
const upload = multer({
     storage: storage 

    }).array("image",20); //Möglicherweise kurzfristig noch mehr bilder hinzufügen

module.exports = { upload};