const axios = require('axios');
var multer  = require('multer')();
const FormData = require('form-data');
const fs = require('fs');
const {apiHost,setUser,admin,member}=require('../config/configuration');

const upload = multer.single('resource');

module.exports={
    getDonations:async (req,res,next)=>{
      if(req.session.admin){
        req.app.locals.layout='main';
        causes = await axios.get(`${apiHost}/causes`);
        causes = causes.data.reverse();
        causes.forEach((data) => {
        var date = new Date(data.date_created);
        var months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        data.created_date = `${date.getDate()}-${
          months[date.getMonth()]
        }-${date.getFullYear()}`;
      
    });
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
        res.render('causes',{pagetitle:"All Causes", username:"Admin", causes:causes, error:errorResponse, admin:admin, member:member,
        success:successResponse})
     } else{
          res.redirect(`/login`);
        }
    },
    getMemDonations:async (req,res,next)=>{
      req.app.locals.layout='member';
       donations = await axios.get(`${apiHost}/causes`);
      donations = donations.data.reverse();
       donations.forEach((data) => {
      var date = new Date(data.date_created);
      var months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      data.created_date = `${date.getDate()}-${
        months[date.getMonth()]
      }-${date.getFullYear()}`;
    
  });

  progress = await axios.get(`${apiHost}/members/${req.session.member.user_id}/reg-progress`);
        progress=progress.data
        showDashboard=false;
        if(progress.registration && progress.profile_update && progress.first_donation>0 && progress.support_a_project && progress.verify_account){
            showDashboard=true;
        }
 
      res.render('member/donation_mem',{pagetitle:"My Donations", username:"User","showDashboard":showDashboard})
  },

    deleteDonations:async (req,res,next)=>{
      console.log(req.params.id)
      await axios.delete(`${apiHost}/causes/${req.params.id}`);
      res.redirect(`/causes?delete="1"`); 
    },

    createDonations:async (req,res,next)=>{
      upload(req, res,async (err)  => {
        let form = new FormData();
        let user_id = setUser(req,res); 
      if (err) {
        console.log(err);
      } else {
        req.body.user_id=user_id
        if(req.file){
            req.body.resource='/'+req.file.path;
            const fileRecievedFromClient = req.file;
            form.append('resource', fileRecievedFromClient.buffer, fileRecievedFromClient.originalname);
        }else{
            req.body.resource='Empty';
        }

        //Update Data
        let sentData
        req.body.completion_date = new Date(req.body.completion_date).getTime();
        if(req.body.id){
            sentData = await axios.put(`${apiHost}/causes/${req.body.id}`, req.body);
            sentData.data.id=req.body.id
        }else{
            sentData = await axios.post(`${apiHost}/causes`, req.body);
        }
         sentData=sentData.data;

         if(sentData.id && req.body.resource!="Empty"){
            await axios.put(`${apiHost}/causes/${sentData.id}/resources`, form, {headers: {
                'Content-Type': `multipart/form-data; boundary=${form._boundary}`
            }}).then((responseFromServer2) => {
                console.log(responseFromServer2.data)
            }).catch((err) => {
                console.log(err)
            });
         }
    }
    res.redirect(`/causes?success="yes"`);
      })
    }

}