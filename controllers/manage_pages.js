const axios = require('axios');
const {apiHost}=require('../config/configuration');
var multer  = require('multer')();
const FormData = require("form-data");
const upload=multer.fields([{name:'img1',maxCount:1},{name:'img2',maxCount:1}, {name:'img3',maxCount:1}, {name:'resource_img1',maxCount:1}, {name:'resource_img2',maxCount:1}, {name:'resource_img3',maxCount:1}]);


module.exports={
    getHome:async (req,res,next)=>{
        // if(req.session.admin){
         let homeData= await axios.get(`${apiHost}/pages/index`);
           homeData=homeData.data
            req.app.locals.layout='main';
            res.render('pages/manage_home',{pagetitle:"Manage Home", username:"Admin", homeData:homeData,  })
          // }else{
          //   res.redirect(`/login`);
          // }
    },
    postHome:async (req,res,next)=>{
      upload(req, res, async (err) => {
        let form = new FormData();
        if (err) {
          console.log(err);
        } else {

          let textData={
            "sliders":[
               {"caption":req.body.caption1, "text":req.body.text1, "route":"/donate"}, 
               {"caption":req.body.caption2, "text":req.body.text2, "route":"/donate"},
                {"caption":req.body.caption3, "text":req.body.text3,"route":"/donate"},
            ],
            "resources":[
              {"caption":req.body.resource_caption1,"text":req.body.resource_text1, "icon":"https://catholicbankers.com/images/basketball.png",},
            {"caption":req.body.resource_caption2,"text":req.body.resource_text2,"icon":"https://catholicbankers.com/images/coin.png",},
            {"caption":req.body.resource_caption3,"text":req.body.resource_text3,  "icon":"https://catholicbankers.com/images/globe.png",},
           ],

            "causes":req.body.causes,
            "gallery":{
                "caption":req.body.gallery_title,
                "descp":req.body.gallery_descp,
            }
            
        }

        await axios.put(`${apiHost}/pages/index`,textData)

          if(req.files.img1!=null){
            const img1RecievedFromClient = req.files.img1[0];
            form.append(
              "slider_1",
              img1RecievedFromClient.buffer,
              img1RecievedFromClient.originalname
            );
          }

          if(req.files.img2!=null){
            const img2RecievedFromClient = req.files.img2[0];
            form.append(
              "slider_2",
              img2RecievedFromClient.buffer,
              img2RecievedFromClient.originalname
            );
          }

          if(req.files.img3!=null){
            const img3RecievedFromClient = req.files.img3[0];
            form.append(
              "slider_3",
              img3RecievedFromClient.buffer,
              img3RecievedFromClient.originalname
            );
          }

          if(req.files.resource_img1!=null){
            const resource_img1RecievedFromClient = req.files.resource_img1[0];
            form.append(
              "resource_1",
              resource_img1RecievedFromClient.buffer,
              resource_img1RecievedFromClient.originalname
            );
          }

          if(req.files.resource_img2!=null){
            const resource_img2RecievedFromClient = req.files.resource_img2[0];
            form.append(
              "resource_2",
              resource_img2RecievedFromClient.buffer,
              resource_img2RecievedFromClient.originalname
            );
          }

          if(req.files.resource_img3!=null){
            const resource_img3RecievedFromClient = req.files.resource_img3[0];
            form.append(
              "resource_3",
              resource_img3RecievedFromClient.buffer,
              resource_img3RecievedFromClient.originalname
            );
          }

          await axios.put(`${apiHost}/pages/index/resources`, form, { headers: {"Content-Type": `multipart/form-data; boundary=${form._boundary}`,},})
          .then((responseFromServer2) => {console.log(responseFromServer2.data);})
          .catch((err) => { console.log(err);});
            
          res.redirect(`/manage-home`);

        }
        
      })
    },
    getAbout:async (req,res,next)=>{
      // if(req.session.admin){
          req.app.locals.layout='main';
          res.render('pages/manage_about',{pagetitle:"Manage About",  username:"Admin", })
        // }else{
        //   res.redirect(`/login`);
        // }
  },getContact:async (req,res,next)=>{
    // if(req.session.admin){
        req.app.locals.layout='main';
        res.render('pages/manage_contact',{pagetitle:"Manage Contact", username:"Admin", })
      // }else{
      //   res.redirect(`/login`);
      // }
},
}