const express=require('express');
const router=express.Router();
const homeController=require('../controllers/home');
const loginController=require('../controllers/login');
const registerController=require('../controllers/register');
const newsController=require('../controllers/news');
const profileController=require('../controllers/profile');
const projectsController=require('../controllers/projects');
const aProjectController=require('../controllers/view_project');
const passwordController=require('../controllers/password');
const membersController=require('../controllers/members');
const donationController=require('../controllers/donation');
const subscriptionController=require('../controllers/subscription');
const givingController=require('../controllers/giving');
const causeController=require('../controllers/causes');
const managePagesController=require('../controllers/manage_pages');

router.get('/', homeController.getHome);
router.get('/login', loginController.getLogin);

router.post('/login', loginController.postLogin);
router.get('/logout', loginController.logoutUser);
router.post('/login', loginController.postLogin);
router.get('/register', registerController.getRegister);
router.post('/register', registerController.postRegister); 
router.get('/reset-code', registerController.getVerifyPasswd);
router.get('/forgot-passwd', registerController.getforgetPasswd);
router.post('/forgot-passwd', registerController.postForgetPasswd);
router.get('/approval', registerController.getRegisterApproval);
router.get('/register-complete', registerController.getRegister_complete);
router.post('/register-complete', registerController.postRegister_complete);
router.get('/payment-check', registerController.getPaymentCheck);
router.get('/news', newsController.getNews);
router.post('/news', newsController.createNew);
router.get('/view-news/:id', newsController.viewNews);
router.get('/delete/event/:id', newsController.delete);
router.get('/profile', profileController.getProfile);
router.get('/password', passwordController.getPassword);
router.post('/password', passwordController.sendNewPassword);
router.get('/projects', projectsController.getProjects);
router.post('/projects', projectsController.createProject);
router.get('/delete/project/:id', projectsController.deleteProject);
router.get('/view-project/:id', aProjectController.getAProject);
router.get('/members', membersController.getAllMemebers); 
router.get('/unverified', membersController.getUnverified); 
router.get('/verify-memeber', membersController.verifyMemeber); 
router.get('/causes', donationController.getDonations); 
router.post('/causes', donationController.createDonations);
router.get('/delete/cause/:id', donationController.deleteDonations);
router.get('/subscriptions', subscriptionController.getsubscriptions); 
router.post('/subscriptions', subscriptionController.createUpdateSubscriptions); 
router.get('/view-subscriptions', subscriptionController.viewSubscriptions);
router.get('/delete/subscriptions/:id', subscriptionController.deleteSubscription); 
router.get('/givings', givingController.getGiving); 
router.get('/manage-home', managePagesController.getHome); 
router.post('/manage-home', managePagesController.postHome); 
router.get('/manage-about', managePagesController.getAbout); 
router.get('/manage-contact', managePagesController.getContact); 
module.exports=router;