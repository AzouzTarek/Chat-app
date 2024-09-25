const express =require("express");
const{registerUser , LoginUser, findUser,getUsers }= require("../Controllers/usercontroller")

const router =express.Router();

router.post("/register" , registerUser) ; 
router.post("/login" , LoginUser) ;
router.get("/find/:id" , findUser) ; 
router.get("/" , getUsers) ;











module.exports=router;