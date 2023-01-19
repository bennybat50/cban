var port=3004;
let MODE = "PRODUCTION"
let HOST = MODE == "PRODUCTION" ? "https://catholicbankers.com/api" : "http://127.0.0.1:3003/api"
//d083ffb9a6f146a9aa84f120610fee79
function setUser(req,res){
    let user_id = req.session?.member?.user_id; 
    // if(!user_id) return res.redirect("/login");
    return user_id;
}

module.exports={
    Port:port,
    user_id:"30cdfb5d68df4a528b596cbf176415c1" ,
    admin_id:"0de64f3ad5334a46865a57792c786534",
    apiHost:HOST,
    admin:true,
    setUser,
    member:false,
    Host:'http://localhost:'+port
}