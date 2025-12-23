const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodPartner.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  const { username, email, password } = req.body;

  const isUserAlreadyRegistered = await userModel.findOne({ email: email });

  if (isUserAlreadyRegistered) {
    return res.status(400).json({ message: "User already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.cookie("token", token);

  return res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      name: user.username,
      email: user.email,
    },
  });
}

async function loginUser(req,res){
    const {email,password} = req.body;
    const user = await userModel.findOne({email:email});
    if(!user){
        return res.status(400).json({message:"Invalid emai or password"});
    }
    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(400).json({message:"Invalid email or password"});
    }
    const token = jwt.sign({
        userId:user._id
    },process.env.JWT_SECRET,{expiresIn:'1h'});


    res.cookie("token",token);
    return res.status(200).json({
        message:"Login successful",
        user:{
            id:user._id,
            name:user.username,
            email:user.email
        }
    })
}

async function logoutUser(req,res){
  res.clearCookie("token");
  return res.status(200).json({message:"Logout successful"});
}

async function registerFoodPartner(req,res){
   const {username,email,password} = req.body;

   const isFoodPartnerRegistered = await foodPartnerModel.findOne({email:email});

   if(isFoodPartnerRegistered){
    return res.status(400).json({message:"Food partner already registered"});
   }

   const hashedPassword = await bcrypt.hash(password,10);

   const foodPartner = await foodPartnerModel.create({
    username,
    email,
    password:hashedPassword
   });
   const token = jwt.sign({
        userId:foodPartner._id
    },process.env.JWT_SECRET,{expiresIn:'1h'});


    res.cookie("token",token);
   res.status(201).json({
    message:"Food partner registered successfully",
    foodPartner:{
      id:foodPartner._id,
      name:foodPartner.username,
      email:foodPartner.email
    }
   });
}
async function loginFoodPartner(req,res){
  const {email,password} = req.body;
    const user = await foodPartnerModel.findOne({email:email});
    if(!user){
        return res.status(400).json({message:"Invalid emai or password"});
    }
    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(400).json({message:"Invalid email or password"});
    }
    const token = jwt.sign({
        userId:user._id
    },process.env.JWT_SECRET,{expiresIn:'1h'});


    res.cookie("token",token);
    return res.status(200).json({
        message:"Login successful",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })

}
async function logoutFoodPartner(req,res){
  res.clearCookie("token");
  return res.status(200).json({message:"Logout successful"});
}
module.exports = { 
    registerUser, 
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
};
