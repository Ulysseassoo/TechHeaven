import express from "express";

const router = express.Router();
// -------------------------------------------------------------------------- ROUTES -------------------------------------------------------------

router.get("/users", async (req, res) => {
    return res.status(200).json({hi: "hi"})
})
export default router;