import express from "express";
import { register } from "../controllers/userController.js";
import { validateRegistration } from "../middlewares/authMiddleware.js";

const router = express.Router();

// The route is clean: Path -> Guard -> Boss
router.post("/register", validateRegistration, register);

export default router;
