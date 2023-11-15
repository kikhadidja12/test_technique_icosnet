const jwt = require("jsonwebtoken");

//Verification du Token dns l'entete en utilisant JWT
const verifytoken = (req, res, next) => {
    const header = req.headers.token
    if (header) {
        //Verify :fct du JWT
        jwt.verify(header, process.env.JWT_SEC, (err, user) => {
            if (err) res.status(403).json("Faux Token");
            else {
                req.user = user;
                //Appeler la fct passe dans les args! (continuer)
                next();
            }
        });

    } else {
        res.status(401).json("non identifie!");

    }
}

//Verification l'ID de User plus le Token dans l'entete en utilisant JWT (Users should only be able to update and delete their own orders.)
const verifytokenandaid = (req, res, next) => {
    verifytoken(req, res, () => {
        if (req.user.id === req.params.id) {
            //Appeler la fct passe dans les args! (continuer)
            next();
        } else {
            res.status(403).json("non autorise");
        }
    });
}


//Exporter pour les utiliser par la suite
module.exports = { verifytoken, verifytokenandaid };