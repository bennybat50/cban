const axios = require('axios');
const {apiHost, admin,member}=require('../config/configuration');

module.exports={
    getHome:async (req,res,next)=>{
        if(req.session.admin){
        req.app.locals.layout='main';
        res.render('index',{pagetitle:"Home Page", username:"Admin", })
    }else{
        res.redirect(`/login`);
      }
    },

    getMemHome:async (req,res,next)=>{
        if(req.session.member){
        req.app.locals.layout='member';
         
      
        progress = await axios.get(`${apiHost}/members/${req.session.member.user_id}/reg-progress`);
        progress=progress.data
        showDashboard=false;
        if(progress.registration && progress.profile_update && progress.first_donation>0 && progress.support_a_project && progress.verify_account){
            showDashboard=true;
        }
        

        res.render('member/index_mem',{pagetitle:"Member Page", username:"User", "progress":progress,"showDashboard":showDashboard })
        }else{
            res.redirect(`/login`);
        }
    },

}