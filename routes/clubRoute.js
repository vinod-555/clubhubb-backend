/*
get club list
get signle club
*/

import  express from "express";
import { getClubList, getSingleClub } from "../controllers/clubController.js";

const router=express.Router();


router.get("/club-list",getClubList);

router.get("/:clubId",getSingleClub);

export default router;