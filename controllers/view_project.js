const axios = require("axios");
const { Host, apiHost, user_id,admin,member } = require("../config/configuration");

module.exports = {
  getAProject: async (req, res, next) => {
    let aProjectData;
    projects = await axios.get(`${apiHost}/projects`);
    projects = projects.data.reverse();
    projects.forEach((data) => {
      var date = new Date(data.completion_date);
      var months = [
        "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",
      ];
      data.date_completed = `${date.getDate()}-${
        months[date.getMonth()]
      }-${date.getFullYear()}`;

      if (req.params.id == data.id) {
        aProjectData = data;
      }
    });
    res.render("view-project", {
      pagetitle: "A Projects",
      username: "User",
      aProjectData: aProjectData,
      admin:admin, member:member
    });
  },
};
