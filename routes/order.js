const router = require("express").Router();
const Order = require("../models/Order");
const { verifytokenandaid } = require("./verifytoken");


//CREATE
router.post('/create', verifytokenandaid, async (req, res) => {
    const newOrder = new Order(req.body)
    try {
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (e) {
        res.status(500).json(e);
    }
});

//UPDATE
router.put('/:id', verifytokenandaid, async (req, res) => {
    const Order = await Order.find(req.params.id);

    //Verifier le Status== "Processing"(c.	Users can update the description, price, or title during this status)
    if (Order.status === "Processing" && req.body.status === "Shipped") {
        try {
            const upadteOrder = await Order.findByIdAndUpdate(
                req.params.id, {
                //Il peut chagner tous le champs nrmlmnt!
                $set: req.body
            }, {
                new: true
            }
            );

            if (!updateOrder) {
                return res.status(404).json({ error: 'order non trouvée.' });
            }
            res.status(200).json(upadteOrder);
        }
        catch (e) {
            res.status(500).json(e);
        }
    } else {
        //Verifier si les status sont justes(•	The order can only move forward in the workflow (e.g., "Pending" to "Processing") and cannot revert to a previous status.)
        if (
            Order.status === "Pending" && req.body.status === "Processing" ||
            //Il peut annuler que dans le status "Pending"
            Order.status === "Pending" && req.body.status === "Cancelled" ||
            Order.status === "Shipped" && req.body.status === "Delivered"
        ) {
            try {
                const upadteOrder = await Order.findByIdAndUpdate(
                    req.params.id, {
                    //Updating que le status 
                    $set: { status: "Processing", ...req.body }
                }, {
                    new: true
                }
                );

                if (!updateOrder) {
                    return res.status(404).json({ error: 'order non trouve.' });
                }
                res.status(200).json(upadteOrder);
            }
            catch (e) {
                res.status(500).json(e);
            }

        } else
            res.status(403).json("non autorise");

    }

});

//DELETE
router.delete('/:id', verifytokenandaid, async (req, res) => {
    try {
        const Order = await Order.findByIdAndDelete(req.params.id);
        if (!Order) {
            return res.status(404).json({ error: 'order non trouvée.' });
        }
        res.status(200).json("ordre suprime!");
    } catch (e) {
        res.status(500).json(e);
    }
});


//GET
router.get('/:id', verifytokenandaid, async (req, res) => {
    try {
        const Order = await Order.find(req.params.id);
        if (!Order) {
            return res.status(404).json({ error: 'order non trouve.' });
        }
        res.status(200).json(Orders);
    } catch (e) {
        res.status(500).json(e);
    }
});

//SEARCH by Title
router.get('/search/:title', verifytokenandaid, async (req, res) => {
    try {
        //On utilise une Expression Reguliere pour une recherche partielle
        const titleRegex = new RegExp(req.params.title);
        const Orders = await Order.find({ title: titleRegex });
        res.status(200).json(Orders);
    } catch (e) {
        res.status(500).json(e);
    }
});


//GET ALL
router.get('/', verifytokenandaid, async (req, res) => {
    //Specifier une query qui a un param "pag"
    const query = req.query.pag;
    try {
        //Utiliser la pagination si il existe le param "pag"
        const Orders = query ? await Order.find().limit(10) : await Order.find();
        // const Orders = await Order.find().limit(5);

        res.status(200).json(Orders);
    } catch (e) {
        res.status(500).json(e);
    }
});


module.exports = router
