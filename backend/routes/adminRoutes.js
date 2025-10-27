    const express = require("express");
    const router = express.Router();
    const {getAllUsers,updateUserStatus}=  require("../controllers/authController");
    const verifyAdminToken =  require("../middleware/verifyAdminToken");
    const verifyToken = require("../middleware/verifyToken");
    

    // Create GET route
    router.get("/customers",verifyToken, verifyAdminToken, getAllUsers);
    router.put("/customers/:id/status",verifyToken, verifyAdminToken, updateUserStatus);



    module.exports = router;
