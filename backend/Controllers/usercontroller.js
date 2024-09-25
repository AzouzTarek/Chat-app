const userModel = require("../Models/usermodels");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
    const jwtkey = "your_secret_key_here"; // Remplacez "your_secret_key_here" par votre clé secrète
    return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let user = await userModel.findOne({ email });

        if (user) 
            return res.status(400).json("User with the given email already exists...");
        if (!name || !email || !password) 
            return res.status(400).json("All fields are required...");
        // if (!validator.isEmail(email))
        //     return res.status(400).json("Email not valid");
        if (!validator.isStrongPassword(password))
            return res.status(400).json("Password not valid");

        user = new userModel({ name, email, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        const token = createToken(user._id);
        res.status(200).json({ _id: user._id, name, email, token });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

const LoginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log("Email:", email, "Password:", password); // Log des informations d'entrée

        let user = await userModel.findOne({ email });
        if (!user) {
            console.log("User not found");
            return res.status(400).json("Invalid email or password...");
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            console.log("Password invalid");
            return res.status(400).json("Invalid email or password...");
        }

        const token = createToken(user._id);
        console.log("Login successful, token generated");

        res.status(200).json({ _id: user._id, name: user.name, email, token });
    } catch (error) {
        console.log("Error in login:", error); // Log de l'erreur
        res.status(500).json("Internal server error");
    }
};

const findUser = async (req, res) => {
    const userId = req.params.id; // Assurez-vous que cela est bien une chaîne valide
    console.log(userId); // Vérifiez la valeur ici

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.send(user);
    } catch (error) {
        res.status(400).send(error.message);
    }
}


const getUsers = async (req, res) => {
    
    try {
        const users = await userModel.find(); // Utilisez findById ici
        if (!users) {
            return res.status(404).json("User not found");
        }
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json("Internal server error");
    }
};

module.exports = { registerUser, LoginUser, findUser,getUsers };
