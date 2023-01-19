const axios = require('axios');
var multer = require('multer')();
const FormData = require('form-data');
const fs = require('fs');
const { Host, apiHost, setUser, admin, member } = require('../config/configuration');

const upload = multer.single('resource');

module.exports = {
  getProjects: async (req, res, next) => {
    if (req.session.admin) {
      req.app.locals.layout = 'main';
      projects = await axios.get(`${apiHost}/projects`);
      projects = projects.data.reverse();
      projects.forEach((data) => {
        var date = new Date(data.completion_date);
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
        data.date_completed = `${date.getDate()}-${months[date.getMonth()]
          }-${date.getFullYear()}`;
        data.date_completed_value = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`

      });
      let errorResponse, successResponse
      if (req.query.success) {
        successResponse = " Project created successfully"
      }
      if (req.query.delete) {
        successResponse = " Project deleted "
      }

      if (req.query.error) {
        errorResponse = " Somthing went wrong while sending data, Please try again! "
      }
      res.render('projects', { pagetitle: "All Projects", username: "Admin", projects: projects, error: errorResponse, success: successResponse, })
    } else {
      res.redirect(`/login`);
    }
  },


  getMemProjects: async (req, res, next) => {
    req.app.locals.layout = 'member';
    projects = await axios.get(`${apiHost}/projects`);
    projects = projects.data.reverse();
    projects.forEach((data) => {
      var date = new Date(data.completion_date);
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
      data.date_completed = `${date.getDate()}-${months[date.getMonth()]
        }-${date.getFullYear()}`;
      data.date_completed_value = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`

    });
    progress = await axios.get(`${apiHost}/members/${req.session.member.user_id}/reg-progress`);
    progress = progress.data
    showDashboard = false;
    if (progress.registration && progress.profile_update && progress.first_donation > 0 && progress.support_a_project && progress.verify_account) {
      showDashboard = true;
    }
    res.render('member/projects_mem', { pagetitle: "Projects", username: "User", projects: projects, "showDashboard": showDashboard })
  },
  getAMemProjects: async (req, res, next) => {
    req.app.locals.layout = 'member';
    let user_id = setUser(req, res);
    projects = await axios.get(`${apiHost}/members/${user_id}/projects`);
    projects = projects.data.reverse();
    projects.forEach((data) => {
      var date = new Date(data.completion_date);
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
      data.date_completed = `${date.getDate()}-${months[date.getMonth()]
        }-${date.getFullYear()}`;
      data.date_completed_value = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`

    });

    progress = await axios.get(`${apiHost}/members/${req.session.member.user_id}/reg-progress`);
    progress = progress.data
    showDashboard = false;
    if (progress.registration && progress.profile_update && progress.first_donation > 0 && progress.support_a_project && progress.verify_account) {
      showDashboard = true;
    }
    res.render('member/active-projects_mem', { pagetitle: "Projects Involved", username: "User", projects: projects, "showDashboard": showDashboard })
  },

  deleteProject: async (req, res, next) => {
    console.log(req.params.id)
    await axios.delete(`${apiHost}/projects/${req.params.id}`);
    res.redirect(`/projects?delete="yes"`);
  },
  createProject: async (req, res, next) => {
    upload(req, res, async (err) => {
      let form = new FormData();
      if (err) {
        console.log(err);
      } else {
        let user_id = setUser(req, res);
        req.body.user_id = user_id
        if (req.file) {
          req.body.resource = '/' + req.file.path;
          const fileRecievedFromClient = req.file;
          form.append('resource', fileRecievedFromClient.buffer, fileRecievedFromClient.originalname);
        } else {
          req.body.resource = 'Empty';
        }

        //Update Data
        let sentData
        req.body.completion_date = new Date(req.body.completion_date).getTime();
        if (req.body.id) {
          sentData = await axios.put(`${apiHost}/projects/${req.body.id}`, req.body);
          sentData.data.id = req.body.id
        } else {
          sentData = await axios.post(`${apiHost}/projects`, req.body);
        }
        sentData = sentData.data;

        if (sentData.id && req.body.resource != "Empty") {
          await axios.put(`${apiHost}/projects/${sentData.id}/resources`, form, {
            headers: {
              'Content-Type': `multipart/form-data; boundary=${form._boundary}`
            }
          }).then((responseFromServer2) => {
            console.log(responseFromServer2.data)
          }).catch((err) => {
            console.log(err)
          });
        }
      }
      res.redirect(`/projects?success="yes"`);
    })
  }

}