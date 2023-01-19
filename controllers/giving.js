const axios = require('axios');
const {Host,apiHost, admin,member}=require('../config/configuration');

module.exports={
    getGiving:async (req,res,next)=>{
        req.app.locals.layout='main';
        // givings = await axios.get(`${apiHost}/givings`);
        // givings=givings.data
       // console.log(givings)
        res.render('givings',{pagetitle:"All Givings", username:"Admin", })
    },

    getMemGiving:async (req,res,next)=>{
        req.app.locals.layout='member';
        res.render('member/giving_mem',{pagetitle:"Giving", username:"User", })
    },

}