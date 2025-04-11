import express from 'express';
import auth from '../middlewares/auth.js';

import {addFood,claimFood,getAvailableFood } from '../controllers/foodController.js'

const router = express.Router();

router.post("/add",auth,addFood);
router.get("/available",getAvailableFood);
router.post("/claim/:foodId",claimFood);
// router.delete("/delete/:foodId",auth, deleteFood);

export default router;

