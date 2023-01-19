const axios = require('axios');
const {Host, apiHost,}=require('../config/configuration');


module.exports={
    getLogin:async (req,res,next)=>{
        req.app.locals.layout='auth';
        res.render('login',{pagetitle:"Login to CBAN", username:"User", error:""});
    },
    postLogin:async (req,res,next)=>{
        req.app.locals.layout='auth';
        
        if(req.body.username=="admin@cban.com"){
            req.session.admin={"role":"admin"};
            res.redirect('/');
        }else{
            let loginRes=(await axios.post(`${apiHost}/auth/login`,req.body)).data;
       
            if(loginRes.error){
                res.render('login',{pagetitle:"Login to CBAN", username:"User",error:loginRes.msg});
            }else{
                loginRes = loginRes.data;

                if(loginRes.role == "admin"){
                    req.session.admin={"role":"admin"};
                    res.redirect('/');
                }else{	
            	
                    req.session.member=loginRes;                    
                    res.redirect('/member');

            	}
            }
        }
    },

    logoutUser:async (req,res,next)=>{
        req.session.destroy();
        res.redirect('/login');
    }
}