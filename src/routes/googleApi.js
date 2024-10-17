const express=require("express");
const router=express.Router();
require('dotenv').config();

router.get('/api/maps', async (req, res) => {
    try {
        const url = (`https://maps.googleapis.com/maps/api/js?key=${process.env.API}&libraries=places`);
        res.redirect(url)
    } catch (error) {
       res.send(error)
    }
});
module.exports = router;