const axios = require("axios");
const { Host, apiHost } = require("../config/configuration");
var multer = require("multer")();
const FormData = require("form-data");
const fs = require('fs')
const diocese = (fs.readFileSync("./diocese.csv") + "").split("\n");
const commercial_1 = (fs.readFileSync("./1-commercial-1.csv") + "").split("\n");
const commercial_2 = (fs.readFileSync("./2-commercial-2.csv") + "").split("\n");
const commercial_3 = (fs.readFileSync("./3-commercial-3.csv") + "").split("\n");
const non_interest_1 = (fs.readFileSync("./4-non-interest-1.csv") + "").split("\n");
const non_interest_2 = (fs.readFileSync("./5-non-interest-2.csv") + "").split("\n");
const merchant = (fs.readFileSync("./6-merchant.csv") + "").split("\n");
const mortgage = (fs.readFileSync("./7-mortgage.csv") + "").split("\n");
const mfb = (fs.readFileSync("./8-mfb.csv") + "").split("\n");

const banks = [
  {
    name: "Commercial With Internation Authorization".toUpperCase(),
    values: capitalize(commercial_1)
  },
  {
    name: "Commercial With National Authorization".toUpperCase(),
    values: capitalize(commercial_2)
  },
  {
    name: "Commercial With Regional Authorization".toUpperCase(),
    values: capitalize(commercial_3)
  },
  {
    name: "Non-Interest With National Authorization".toUpperCase(),
    values: capitalize(non_interest_1)
  },
  {
    name: "Non-Interest With Regional Authorization".toUpperCase(),
    values: capitalize(non_interest_2)
  },
  {
    name: "Merchant With National Authorization".toUpperCase(),
    values: capitalize(merchant)
  },
  {
    name: "Primary Mortgage Insitutions".toUpperCase(),
    values: capitalize(mortgage)
  },
  {
    name: "Micro Finance Bank".toUpperCase(),
    values: capitalize(mfb)
  }
]

const upload = multer.fields([
  { name: "avatar", maxCount: 1 },
  { name: "bank_identification", maxCount: 1 },
  { name: "nin_identification", maxCount: 1 },
]);

function capitalize(n) {
  let arr = []
  for (let i = 0; i < n.length; i++) {
    let value = n[i][0].toUpperCase() + n[i].substr(1).toLowerCase()
    arr.push(value)
  }
  return arr
}

module.exports = {

  getforgetPasswd: async (req, res, next) => {
    req.app.locals.layout = "auth";
    res.render("forget", {
      pagetitle: "Forget Password",
      username: "User",
      error: "",
    });
  },
  getVerifyPasswd: async (req, res, next) => {
    if (!req.session.forgot_email) return res.redirect("/forgot-passwd")
    req.app.locals.layout = "auth";
    res.render("verify", {
      pagetitle: "Verify",
      username: "User",
      "route": apiHost,
      email: req.session.forgot_email,
      error: "",
    });
  },
  postVerifyPasswd: async (req, res, next) => {
    let acct = (await axios.post(`${apiHost}/accounts/forget-passwd`, req.body)).data;

    res.render("forget", {
      pagetitle: "Forget Password",
      error: `${acct.msg}`,
    });
  },
  getRegister: async (req, res, next) => {
    req.app.locals.layout = "auth";
    res.render("register", {
      pagetitle: "Create CBAN Account",
      username: "User",
      diocese,
      banks,
      error: "",
    });
  },
  getRegisterApproval: async (req, res, next) => {

    if (req.session.member) {
      let member = await axios.get(
        `${apiHost}/members/${req.session.member.user_id}`
      );
      member = member.data;
      if (member.completed_first_time_subscription == false) {
        req.app.locals.layout = "auth";
        res.render("approval", {
          pagetitle: "Create CBAN Account",
          username: "User",
          member: member,
          error: "",
          diocese,
          banks,
        });
      } else {
        res.redirect(`/member`);
      }


    } else {
      res.redirect(`/login`);
    }
  },
  getRegister_complete: async (req, res, next) => {

    if (req.session.member) {
      let member = await axios.get(
        `${apiHost}/members/${req.session.member.user_id}`
      );
      member = member.data;
      let date = new Date(member.date_of_birth);
      let month, day;

      if (date.getMonth() < 10) {
        let mt = date.getMonth() + 1;
        month = "0" + mt;
      } else {
        month = date.getMonth();
      }

      if (date.getDate() < 10) {
        day = "0" + date.getMonth();
      } else {
        day = date.getDate();
      }

      member.date_of_birth2 = `${date.getFullYear()}-${month}-${day}`;
      // console.log(member.date_of_birth2);

      req.app.locals.layout = "auth";
      res.render("register-complete", {
        pagetitle: "Create CBAN Account",
        username: "User",
        member,
        diocese,
        banks,
        error: "",
      });
    } else {
      res.redirect(`/login`);
    }
  },
  postForgetPasswd: async (req, res) => {
    req.session.forgot_email = req.body.email;
    let acct = (await axios.post(`${apiHost}/accounts/forget-passwd`, req.body)).data;

    // res.render("forget", {
    //   pagetitle: "Forget Password",
    //   error: `${acct.msg}`,
    // });
    res.redirect("/reset-code")
    // res.render("verify", {
    //   pagetitle: "Forget Password",
    //   error: ``,
    // });

  },
  postRegister: async (req, res, next) => {
    let member = (await axios.post(`${apiHost}/members/register`, req.body)).data;
    if (member.type == "EXISTS") {
      req.app.locals.layout = "auth";
      res.render("register", {
        pagetitle: "Create CBAN Account",
        username: "User",
        diocese,
        banks,
        error: `${member.msg}, please register with another email address or login to your account`,
      });
    } 
    else if(member.type == "INVALID_ID"){
      res.render("register", {
        pagetitle: "Create CBAN Account",
        username: "User",
        diocese,
        banks,
        error: `${member.msg}, please use a valid gaurantor id`,
      });
    }
    else {

      member.data.user_id = member.data.id;
      member.data.email = req.body.email;
      member.data.full_name = req.body.full_name;

      req.session.member = member.data;
      res.redirect(`/member`);
    }
  },
  postRegister_complete: async (req, res, next) => {
    // console.log(req.files)
    if (req.session.member) {
      req.app.locals.layout = "auth";
      // req.body.date_of_birth = new Date(req.body.date_of_birth).getTime();

      let user_id = req.session.member.user_id
      let member = { ...req.body };
      let month, day;
      let has_resource = false;
      let date = new Date(member.date_of_birth);
      let form = new FormData();

      if(req.files){
        has_resource = true;

          if (req.files.avatar != null) {
            
            const avatarRecievedFromClient = req.files.avatar;
            form.append(
              "avatar",
              avatarRecievedFromClient.data,
              avatarRecievedFromClient.name
            );
          }

          if (req.files.bank_identification != null) {
         
            const bankRecievedFromClient = req.files.bank_identification;
            form.append(
              "bank_identification",
              bankRecievedFromClient.data,
              bankRecievedFromClient.name
            );
          }

          if (req.files.nin_identification != null) {
           
            const ninRecievedFromClient = req.files.nin_identification;
            form.append(
              "nin_identification",
              ninRecievedFromClient.data,
              ninRecievedFromClient.name
            );
          }

      }

      if (date.getMonth() < 10) {
        let mt = date.getMonth() + 1;
        month = "0" + mt;
      } else {
        month = date.getMonth();
      }
      
      if (date.getDate() < 10) {
        day = "0" + date.getMonth();
      } else {
        day = date.getDate();
      }

      member.date_of_birth2 = `${date.getFullYear()}-${month}-${day}`;
   
      await axios
      .put(`${apiHost}/members/${user_id}`, req.body)
      .then(async (sentData) => {
        sentData = sentData.data;

        if (sentData.code == 404) {
          //not found
          member.guarantor_id = "";
          res.render("register-complete", {
            pagetitle: "Create CBAN Account",
            username: "User",
            diocese,
            banks,
            member,
            error: sentData.msg,
          });

        } else {

          if (has_resource) {

            await axios
              .put(`${apiHost}/members/${user_id}/resources`, form, {
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

          let member = (await axios.get(`${apiHost}/members/${user_id}`)).data;
          if (member.is_reg_completed === false) {
            return res.redirect(`/member`);
          } else {
            return res.redirect(`/approval`);
          }
        }
        //Upload resources
      });

    } else {
      res.redirect("/login")
    }


  },
  getPaymentCheck: async (req, res, next) => {
    if (req.session.member) {
      req.app.locals.layout = "auth";
      res.render("payment-check", {
        pagetitle: "Membership Payment",
        username: "User",
        error: "",
      });
    } else {
      res.redirect(`/login`);
    }
  }
};
