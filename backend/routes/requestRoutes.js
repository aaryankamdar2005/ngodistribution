import express from 'express';
import auth from '../middlewares/auth.js';
import { applyForRequest, approveRequest, displayRequest, rejectRequest } from '../controllers/requestController.js';

const router = express.Router();

router.post("/apply/:foodId",auth,applyForRequest);
router.get("/display",auth,displayRequest);
router.post("/approve/:requestId", auth, approveRequest);
router.post("/reject/:requestId",auth, rejectRequest);

export default router;
