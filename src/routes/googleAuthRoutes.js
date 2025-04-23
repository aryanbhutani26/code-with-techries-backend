import express from "express";
import passport from "passport";
import { registerManual, loginManual } from "../controller/authController.js";

const router = express.Router();

// Manual auth
router.post("/register", registerManual);
router.post("/login", loginManual);

// Google callback
router.get("/google/callback", passport.authenticate("google", {
    successRedirect: "/profile",
    failureRedirect: "/auth/login-failed"
}));

// Google login - set role
router.get("/google/:role", (req, res, next) => {
    const role = req.params.role.toLowerCase();
    console.log("Received role:", req.params.role);

    const validRoles = ["student", "recruiter", "developer"];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ msg: "Invalid role type" });
    }
    req.session.tempRole = role;
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});




// Logout
router.get("/logout", (req, res) => {
    req.logout(() => {
        res.redirect("/");
    });
});

export default router;
