import express from "express";
import {
  createRoom,
  deleteRoom,
  getAllRoom,
  getRoom,
  removeRoomAvailability,
  updateRoom,
  updateRoomAvailability,
} from "../controllers/room.js";
import { verifyAdmin } from "../Utils/verifytoken.js";

const router = express.Router();

//create
// router.post("/:hotelId", verifyAdmin, createRoom);
router.post("/:hotelId", createRoom);
//update
// router.put("/:id", verifyAdmin, updateRoom);
router.put("/:id", updateRoom);
//check for availability
router.put("/availability/:id", updateRoomAvailability);
router.put("/unavailability/:id", removeRoomAvailability);
//deleted
// router.delete("/:id", verifyAdmin, deleteRoom);
router.delete("/:id", deleteRoom);
//Get
router.get("/:id", getRoom);
//Get All
router.get("/", getAllRoom);

export default router;
