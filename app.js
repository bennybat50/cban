const express = require('express');
const cors = require('cors');
const app =express();
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser');
const fileUpload  = require('express-fileupload');
const path=require('path');
let session = require('express-session');
const routes=require('./routes/main_rts');
const memberRoute=require('./routes/member_rts');
var {Host,Port }=require('./config/configuration');


app.use(fileUpload({
    createParentPath: true
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

app.use(session({
    secret:'any-secret',
    saveUninitialized:false,
    resave:true,
    cookie:{
        path:'/',
        //expires:90000000000000,
    }
}));
//Set viewengine
app.engine('hbs', exphbs({ layoutsDirectory:path.join(__dirname,'views/layouts'),
defaultLayout: 'main', extname: '.hbs' }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//routes
app.use('/',routes);
app.use('/member',memberRoute);

app.listen(process.env.port || Port, ()=>{
    console.log(Host);
}); 