const axios = require("axios");
var multer = require("multer")();
const FormData = require("form-data");
const fs = require("fs");
const { Host, apiHost, setUser,admin,member } = require("../config/configuration");

const upload = multer.single("resource");

module.exports = {
  getNews: async (req, res, next) => {
    if(req.session.admin){
    req.app.locals.layout='main';
    newsData = await axios.get(`${apiHost}/blog`);
    newsData = newsData.data.reverse();
    newsData.forEach((data) => {
      if (data.event_date != -1) {
        var date = new Date(data.event_date);
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
        data.date = `${date.getFullYear()}-${
          months[date.getMonth()]
        }-${date.getDate()}`;
      }
    });
    let errorResponse,successResponse

    if(req.query.success){
      successResponse=" New / Event created successfully"
    }
    if(req.query.delete){
      successResponse=" New / Event deleted"
    }

    if(req.query.error){
      errorResponse=" Somthing went wrong while sending data, Please try again! "
    }

    
    res.render("news", {
      pagetitle: "Manage News and Events",
      news: newsData,
      username: "Admin",
      error:errorResponse,
      success:successResponse,
      admin:admin, member:member
    });
  }else{
    res.redirect(`/login`);
  }
  },

  getMemNews: async (req, res, next) => {
    req.app.locals.layout='member';
    newsData = await axios.get(`${apiHost}/blog`);
    newsData = newsData.data.reverse();
    newsData.forEach((data) => {
      if (data.event_date != -1) {
        var date = new Date(data.event_date);
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
        data.date = `${date.getFullYear()}-${
          months[date.getMonth()]
        }-${date.getDate()}`;
      }
    });
    progress = await axios.get(`${apiHost}/members/${req.session.member.user_id}/reg-progress`);
        progress=progress.data
        showDashboard=false;
        if(progress.registration && progress.profile_update && progress.first_donation>0 && progress.support_a_project && progress.verify_account){
            showDashboard=true;
        }
    
    res.render("member/news_mem", {
      pagetitle: "All News and Events",
      news: newsData,
      username: "User","showDashboard":showDashboard
    });
  },

  createNew: async (req, res) => {
    upload(req, res, async (err) => {
      let form = new FormData();
      if (err) {
        console.log(err);
      } else {
        let user_id = setUser(req,res); 
        req.body.user_id = user_id;
        if (req.file) {
          console.log(req.file);
          req.body.resource = "/" + req.file.path;
          const fileRecievedFromClient = req.file;
          form.append(
            "resource",
            fileRecievedFromClient.buffer,
            fileRecievedFromClient.originalname
          );
        } else {
          req.body.resource = "Empty";
        }

        if (req.body.category == "event") {
          req.body.event_date = new Date(req.body.event_date).getTime();
        }

        //Update Data
        let sentData;
        if (req.body.id) {
          sentData = await axios.put(
            `${apiHost}/blog/${req.body.id}`,
            req.body
          );
          sentData.data.id = req.body.id;
        } else {
          sentData = await axios.post(`${apiHost}/blog`, req.body);
        }

        sentData = sentData.data;
        console.log(sentData);

        if (sentData.id && req.body.resource != "Empty") {
          await axios
            .put(`${apiHost}/blog/${sentData.id}/resources`, form, {
              headers: {
                "Content-Type": `multipart/form-data; boundary=${form._boundary}`,
              },
            })
            .then((responseFromServer2) => {
              console.log(responseFromServer2.data);
            })
            .catch((err) => {
              console.log(err);
            });
        }
        res.redirect(`/news?success="yes"`);
      }
    });
  },
  delete: async (req, res) => {
    dat = await axios.delete(`${apiHost}/blog/${req.params.id}`);
    res.redirect(`/news?delete="yes"`);
  },

  viewNews: async (req, res, next) => {
    let aNewsData;
    newsData = await axios.get(`${apiHost}/blog`);
    newsData = newsData.data.reverse();
    newsData.forEach((data) => {
      var date = new Date(data.event_date);
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
      data.event_start_date = `${date.getDate()}-${
        months[date.getMonth()]
      }-${date.getFullYear()}`;

      if (req.params.id == data.id) {
        aNewsData = data;
        console.log(aNewsData)
      }
    });
    res.render("view-blog", {
      pagetitle: aNewsData.caption,
      username: "User",
      aNewsData: aNewsData,
    });
  },
};
