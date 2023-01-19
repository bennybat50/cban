const axios = require('axios');
const {Host, apiHost,setUser,admin_id,admin,member}=require('../config/configuration');

module.exports={
    getAllMemebers:async (req,res,next)=>{
      if(req.session.admin){
        req.app.locals.layout='main';
        members = await axios.get(`${apiHost}/members`);
        members = members.data.reverse();
        let errorResponse,successResponse
    if(req.query.success){
      successResponse=" Member verified successfully"
    }

    if(req.query.error){
      errorResponse=" Somthing went wrong while sending verifying member, Please try again! "
    }
        res.render('members',{pagetitle:"Verified Members",  username:"User", members:members, error:errorResponse, success:successResponse,admin:admin, member:member})
      }else{
        res.redirect(`/login`);
      }
    },
    
    getUnverified:async (req,res,next)=>{
        req.app.locals.layout='main';
        members = await axios.get(`${apiHost}/members`);
        members = members.data.reverse();
        let errorResponse,successResponse

        if(req.query.success){
          successResponse=" Member verified successfully"
        }

        if(req.query.error){
          errorResponse=" Somthing went wrong while sending verifying member, Please try again! "
        }

        res.render('unverified',{pagetitle:"Unverified Members",  username:"User", members:members, error:errorResponse, success:successResponse,admin:admin, member:member})
    },
    verifyMemeber:async (req,res,next)=>{
        data={ "user_id":req.query.user_id,"admin_id":admin_id}
        sentData = await axios.post(`${apiHost}/members/verify/admin`, data);
        res.redirect(`/unverified?success="yes"`)
    },

}