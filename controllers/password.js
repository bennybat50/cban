const axios = require('axios');
const {Host, apiHost, setUser,admin,member}=require('../config/configuration');

module.exports={
    getPassword:async (req,res,next)=>{
        req.app.locals.layout='main';
        res.render('password',{pagetitle:"Change Password ",  username:"Admin", error:""})
    }, 

    getMemPassword:async (req,res,next)=>{
        req.app.locals.layout='member';
        progress = await axios.get(`${apiHost}/members/${req.session.member.user_id}/reg-progress`);
        progress=progress.data
        showDashboard=false;
        if(progress.registration && progress.profile_update && progress.first_donation>0 && progress.support_a_project && progress.verify_account){
            showDashboard=true;
        }
        res.render('member/password_mem',{pagetitle:"Change Password ",  username:"User", error:"","showDashboard":showDashboard})
    }, 

    sendNewPassword:async (req,res,next)=>{
        req.app.locals.layout='main';
        let user_id = setUser(req,res); 
        req.body.user_id=user_id
        let changed=await axios.post(`${apiHost}/settings/change-passwd`,req.body)
        changed=changed.data
        if(changed.type=="SUCCESS"){
            res.render('password',{pagetitle:"Change Password ",  username:"Admin", success:"Password updates successfully"})
        }else{
            res.render('password',{pagetitle:"Change Password ",  username:"Admin", error:changed.msg})
        }
        
    },
    sendMemNewPassword:async (req,res,next)=>{
        req.app.locals.layout='member';
        let user_id = setUser(req,res); 
        req.body.user_id=user_id
        let changed=await axios.post(`${apiHost}/settings/change-passwd`,req.body)
        changed=changed.data
        if(changed.type=="SUCCESS"){
            res.render('member/password_mem',{pagetitle:"Change Password ",  username:"User", success:"Password updates successfully",})
        }else{
            res.render('member/password_mem',{pagetitle:"Change Password ",  username:"User", error:changed.msg,})
        }
        
    },
}