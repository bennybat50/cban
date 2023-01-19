const axios = require('axios');
const {Host,apiHost,setUser, admin,member}=require('../config/configuration');

module.exports={
    getReferrals:async (req,res,next)=>{
        if(req.session.admin){
        req.app.locals.layout='main';
        res.render('referrals',{pagetitle:"All Referrals", username:"Admin", })
    }else{
        res.redirect(`/login`);
      }
    },

    getMemReferrals:async (req,res,next)=>{
        req.app.locals.layout='member';
        res.render('member/referrals_mem',{pagetitle:"Referrals",  username:"User", })
    },

    getMemPendingReferrals:async (req,res,next)=>{
        req.app.locals.layout='member'; 

        if(!req.session.member) return res.redirect("/login")
        let member_id = req.session?.member?.member_id;  
        let status = "pending"
        referrers = await axios.get(`${apiHost}/members/${member_id}/referrers?status=${status}`);
        referrers = referrers.data.reverse();
        //referrers=[{"name":"Mike", "email":"till@gmail.com", "member_id":"skfjdsjkh23h4kj23h",status:"pending" }]
        progress = await axios.get(`${apiHost}/members/${req.session.member.user_id}/reg-progress`);
        progress=progress.data
        showDashboard=false;
        if(progress.registration && progress.profile_update && progress.first_donation>0 && progress.support_a_project && progress.verify_account){
            showDashboard=true;
        }
        res.render('member/referrals_mem',{pagetitle:"Pending Referrals", status:"pending",username:"User", referrers:referrers,"showDashboard":showDashboard })
    },
    verifyMember:async (req,res,next)=>{
        verify=false;
        if(req.query.active=="yes"){
            verify=true;
        }
        let user_id = setUser(req,res); 
        let verifyData= {
            "user_id":req.query.member_id,
            "guarantor_id":user_id,
            "accepted":verify
        }
        let response = await axios.post(`${apiHost}/members/verify/guarantor`, verifyData);
        console.log(response.data)
        res.redirect(`/member/pending-referrals?success="yes"`);
    }
}