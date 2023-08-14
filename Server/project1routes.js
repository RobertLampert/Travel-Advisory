const setupRtns = require("./setupalerts");
const express = require('express');
const router = express.Router();

router.get('/setupalerts', async (req, res) => {
    try{
        let result = await setupRtns.run();
        res.status(200).send(result);
    }catch(err){
        console.log(err.stack);
        res.status(500).send("get all countries failed - internal server error")
    }
});

module.exports = router;