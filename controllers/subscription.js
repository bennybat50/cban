const axios = require('axios');
const {Host,apiHost, admin,member}=require('../config/configuration');

module.exports={
    getsubscriptions:async (req,res,next)=>{
        req.app.locals.layout='main';

        let subscriptions =  await axios.get(`${apiHost}/subscriptions`);
        subscriptions=subscriptions.data;

        let errorResponse,successResponse

        if(req.query.delete){
            successResponse=" Subscription deleted "
          }
    if(req.query.success){
      successResponse=" Subscription created successfully"
    }
    if(req.query.update){
        successResponse=" Subscription updated successfully"
    }


    if(req.query.error){
      errorResponse=" Somthing went wrong while sending data, Please try again! "
    }
        res.render('subscription',{pagetitle:"All Subscriptions", username:"Admin",subscriptions:subscriptions, error:errorResponse, success:successResponse, })
    },
    viewSubscriptions:async (req,res,next)=>{
        req.app.locals.layout='main';
       
        res.render('view-subscriptions',{pagetitle:"All Members Subscriptions", username:"Admin", })
    },

    getMemSubscriptions:async (req,res,next)=>{
        req.app.locals.layout='member';
        let subscriptions =  await axios.get(`${apiHost}/subscriptions`);
        subscriptions=subscriptions.data;
        res.render('member/subscription_mem',{pagetitle:"Subscriptions", username:"User",subscriptions:subscriptions })
    },

    createUpdateSubscriptions:async (req,res,next)=>{
        if(req.body.id){
            let subscription= await axios.put(`${apiHost}/subscriptions/${req.body.id}`, req.body)
            subscription=subscription.data;
            res.redirect(`/subscriptions?update="yes"`); 
        }else{
            req.body.starts_at=245453453454
            let subscription= await axios.post(`${apiHost}/subscriptions`, req.body)
            subscription=subscription.data;
            
            res.redirect(`/subscriptions?success="yes"`); 
        }       
    },

    deleteSubscription:async (req,res,next)=>{
       await axios.delete(`${apiHost}/subscriptions/${req.params.id}`)
        res.redirect(`/subscriptions?delete="yes"`); 
    },

}