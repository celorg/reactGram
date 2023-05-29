const User = require("../models/User");
const bcrypt = require("bcryptjs");


const jwt = require("jsonwebtoken");
const Photo = require("../models/Photo");

const jwtSecret = process.env.JWT_SECRET;

// Gerando user Token
const genereteToken = (id) => {
    return jwt.sign({id}, jwtSecret, {
        expiresIn: "7d",
    });
};

//Register user and sign in
const register = async(req,res) => {
    const {name,email,password} = req.body

    //check if user exists
    const user = await User.findOne({email})

    if(user){
        res.status(422).json({errors: ["Por favor, utilize outro e-mail"]})
        return
    }

    //Generate password
    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(password,salt);

    // Create user
    const newUser = await User.create({
        name,
        email,
        password: passwordHash
    });

    //If user was created sucessfully, return the token
    if(!newUser){
        res.status(422)
        .json({
            errors: ["Houve um erro, por favor tente mais tarde"]
        });
        return;
    }

    res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        token: genereteToken(newUser._id),
    })
}

const login = async(req,res) => {
    const {email,password} = req.body

    try{
        const user = await User.findOne({email})

        //Check if user exists
        if(!user){
            res.status(404).json({
                errors: ["Usuário não encontrado"]
            });
            return
        }

        //Check if password matches
        if(!(await bcrypt.compare(password, user.password))){
            res.status(422).json({errors: ["Senha inválida."]})
            return
        }

        //return user with token
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: genereteToken(user._id),
        })
    
    }catch(err){
        res.status(404).json({errors: ["Usúario não encontrado"]})
    }
    

};

//get current logged in user
const getCurrentUser = async(req,res) => {
    const user = req.user

    res.status(200).json(user)
}

const update = async (req,res) => {
   const {name, password, bio} = req.body

   let profileImage = null

   if(req.file){
    profileImage = req.file.filename
   }

   const reqUser = req.user

   const user = await User.findOne({_id: reqUser._id});


   if(name) {
    user.name = name
   }

   if(password) {
    //password hash
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    user.password = passwordHash
   }

   if(profileImage) {
    user.profileImage = profileImage
   }
   if(bio){
    user.bio = bio
   }

   await user.save().then(() => {
        res.status(200).json(user)
   
    }).catch((err) => {
        res.status(422).json({errors: ["Não foi possivel fazer o upload"]})
    })
}

//get user by id
const getUserById = async(req,res) => {
    const {id} = req.params

    try{
        const user = await User.findById(id).select("-password")
        const photos = await Photo.find({userId: id}).sort([['createdAt', -1]]).exec();

        if(!user){
            res.status(404).json({
                errors: ["Usúarios não encontrado"]
            })
            return
        }

        res.status(200).json({user,photos});
    }catch(error){
        res.status(404).json({errors: ["Usúarios não encontrado."]})
        return;
    }
    
};

const getAllUser = async(req,res) => {

    const user = await User.find({}).select("-password");

    const photos = await Photo.find({}).sort([['createdAt', -1]]).exec();

    res.status(200).json({
        user: user,
        photos: photos
    });

}

module.exports = {
    register,
    login,
    getCurrentUser,
    update,
    getUserById,
    getAllUser
}