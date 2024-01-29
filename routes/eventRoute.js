/*
get event list
get single event 
post regester event genreate qr and save in eventschema and userevent schema 
*/
import  express  from "express";
import { getEventById, getEventList, getEventsByIds, registerEvent, unregisterEvent } from "../controllers/eventController.js";

const router =express.Router();

router.get('/event-list',getEventList);
router.get('/:eventId',getEventById);
router.put('/:eventId',registerEvent);
 router.delete("/:eventId",unregisterEvent);
router.post("/registerd/events",getEventsByIds)


export default router;
