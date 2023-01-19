const axios = require('axios');
const { Host, setUser, apiHost } = require('../config/configuration');
var multer = require('multer')();
const FormData = require("form-data");
const upload = multer.fields([{ name: 'avatar', maxCount: 1 }, { name: 'bank_identification', maxCount: 1 }, { name: 'nin_identification', maxCount: 1 }]);


module.exports = {
  getProfile: async (req, res, next) => {
    req.app.locals.layout = 'main';
    res.render('profile', { pagetitle: "Account Profile", username: "Admin" })
  },
  getMemProfile: async (req, res, next) => {
  
    if (req.session.member) {
      req.app.locals.layout = 'member';
      let user_id = setUser(req, res);
      let member = await axios.get(`${apiHost}/members/${user_id}`)

      member = member.data;
      let date = new Date(member.date_of_birth);
      let month, day;

      if (date.getMonth() < 10) {
        let mt = date.getMonth() + 1
        month = "0" + mt
      } else {
        month = date.getMonth()
      }

      if (date.getDate() < 10) {
        day = "0" + date.getMonth()
      } else {
        day = date.getDate()
      }

      member.date_of_birth2 = `${date.getFullYear()}-${month}-${day}`;

      progress = await axios.get(`${apiHost}/members/${req.session.member.user_id}/reg-progress`);
      progress = progress.data
      showDashboard = false;
      if (progress.registration && progress.profile_update && progress.first_donation > 0 && progress.support_a_project && progress.verify_account) {
        showDashboard = true;
      }

      res.render('member/profile_mem', { pagetitle: "Account Profile", username: "User", member: member, "showDashboard": showDashboard })

    } else {
      res.redirect(`/login`);
    }
  },

  postProfileUpdate: async (req, res, next) => {

    upload(req, res, async (err) => {
      let form = new FormData();
      if (err) {
        console.log(err);
      } else {
        let user_id = setUser(req, res);
        req.body.user_id = user_id;

        if (req.files.avatar != null) {
          const avatarRecievedFromClient = req.files.avatar[0];
          form.append(
            "avatar",
            avatarRecievedFromClient.buffer,
            avatarRecievedFromClient.originalname
          );
        }

        if (req.files.bank_identification != null) {
          const bankRecievedFromClient = req.files.bank_identification[0];
          form.append(
            "bank_identification",
            bankRecievedFromClient.buffer,
            bankRecievedFromClient.originalname
          );
        }

        if (req.files.nin_identification != null) {
          const ninRecievedFromClient = req.files.nin_identification[0];
          form.append(
            "nin_identification",
            ninRecievedFromClient.buffer,
            ninRecievedFromClient.originalname
          );
        }

        //Send Data
        req.body.date_of_birth = new Date(req.body.date_of_birth).getTime()
        console.log(req.body.date_of_birth);
        await axios.put(`${apiHost}/members/${user_id}`, req.body).then(async (sentData) => {
          sentData = sentData.data;
          //Upload resources
          await axios.put(`${apiHost}/members/${user_id}/resources`, form, { headers: { "Content-Type": `multipart/form-data; boundary=${form._boundary}`, }, })
            .then((responseFromServer2) => { console.log(responseFromServer2.data); })
            .catch((err) => { console.log(err); });
          res.redirect(`/member/profile`);
        })
          .catch((err) => {
            req.app.locals.layout = "auth";
            console.log(err);
            res.render('member/profile_mem', { pagetitle: "Account Profile", username: "User", error: "Error updating profile" })
          });
      }
    });
  },
}