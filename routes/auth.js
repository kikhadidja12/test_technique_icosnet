const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require('crypto-js');
const jwt = require("jsonwebtoken");

//Register
router.post("/register", async (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        //Utiliser le module CryptoJS pour chiffrer le mot de passe
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SEC).toString(),
    })
    try {
        //Enregistrer le user
        await user.save();
        res.status(201).json(user)
    }
    catch (e) {
        res.status(500).json(e)
        console.log("nooo");
    }
});
//Login
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        console.log(user);
        //Si le user n'existe pas afficher l'erreur 401
        !user && res.status(401).json("Erreur des informations!");

        //dechiffrer le pssword
        const haspassword = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SEC);

        const pass = haspassword.toString(CryptoJS.enc.Utf8);

        //Verifier le password du Modele avec le password saisie
        pass !== req.body.password && res.status(401).json("Erreur des informations (Mot de passe)!");



        //Utilisation du JWT
        const token = jwt.sign({
            id: user._id,
        },//Utiliser la cle sucrete
            process.env.JWT_SEC,
            { expiresIn: "1d" });

        //Ne pas afficher le passzord 
        res.status(200).json({ user, token });

    }
    catch (e) {
        res.status(500).json(e)
        console.log("nooo");
    }
});


module.exports = router