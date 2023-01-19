const axios = require('axios');
const { setUser,apiHost,member}=require('../config/configuration');

module.exports={
    getCauses:async (req,res,next)=>{
      if(req.session.admin){
        req.app.locals.layout='main';
        res.render('causes',{pagetitle:"All Causes", username:"Admin", })
      }else{
        res.redirect(`/login`);
      }

       
    },
    getAMemCauses:async (req,res,next)=>{
      if(req.session.user){
        let user_id = setUser(req,res); 
        req.app.locals.layout='member';
        causes = await axios.get(`${apiHost}/members/${user_id}/causes`);
        causes = causes.data.reverse();
        progress = await axios.get(`${apiHost}/members/${req.session.member.user_id}/reg-progress`);
        progress=progress.data
        showDashboard=false;
        if(progress.registration && progress.profile_update && progress.first_donation>0 && progress.support_a_project && progress.verify_account){
            showDashboard=true;
        }
        res.render('member/active-causes_mem',{pagetitle:"Causes Involved", username:"User", causes:causes,"showDashboard":showDashboard })
      }else{
        res.redirect(`/login`);
      }
        
    },

    getMemCauses:async (req,res,next)=>{
        req.app.locals.layout='member';
        causes = await axios.get(`${apiHost}/causes`);
        causes = causes.data.reverse();
    //     causes.forEach((data) => {
    //     var date = new Date(data.date_created);
    //     var months = [
    //       "Jan",
    //       "Feb",
    //       "Mar",
    //       "Apr",
    //       "May",
    //       "Jun",
    //       "Jul",
    //       "Aug",
    //       "Sep",
    //       "Oct",
    //       "Nov",
    //       "Dec",
    //     ];
    //     data.created_date = `${date.getDate()}-${
    //       months[date.getMonth()]
    //     }-${date.getFullYear()}`;
      
    // });
    let errorResponse,successResponse
    if(req.query.success){
        successResponse=" Cause created successfully"
      }

      if(req.query.delete){
        successResponse=" Cause deleted successfully"
      }
  
      if(req.query.error){
        errorResponse="Somthing went wrong while sending data, Please try again! "
      }

      progress = await axios.get(`${apiHost}/members/${req.session.member.user_id}/reg-progress`);
        progress=progress.data
        showDashboard=false;
        if(progress.registration && progress.profile_update && progress.first_donation>0 && progress.support_a_project && progress.verify_account){
            showDashboard=true;
        }
        res.render('member/causes_mem',{pagetitle:"Causes", username:"User", causes:causes,"showDashboard":showDashboard})
    },

}