import { createError } from "../Utils/error.js";
import Rooms from "../Models/Rooms.js";
import Hotels from "../Models/Hotels.js";

export const createRoom = async (req, res, next) => {
  const hotelId = req.params.hotelId;
  const newRoom = new Rooms(req.body);

  try {
    const savedroom = await newRoom.save();
    try {
      await Hotels.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedroom._id },
      });
    } catch (err) {
      next(err);
    }

    res.status(200).json(savedroom);
  } catch (err) {
    next(err);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await Rooms.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedRoom);
  } catch (err) {
    next(err);
  }
};

export const updateRoomAvailability = async (req, res, next) => {
  try {
    console.log("inside try block");
    await Rooms.updateOne(
      { "roomNumber._id": req.params.id },
      {
        $push: {
          "roomNumber.$.unavailabledates": req.body.dates
        },
      }
    );
    res.status(200).json("Room status has been updated.");
  } catch (err) {
    next(err);
  }
};
export const removeRoomAvailability = async (req, res, next) => {
  try {
    console.log("inside try block");
    await Rooms.updateOne(
      { "roomNumber._id": req.params.id },
      {
        $set: {
          "roomNumber.$.unavailabledates": []
        },
      }
    );
    res.status(200).json("Room has been removed.");
  } catch (err) {
    next(err);
  }
};
export const deleteRoom = async (req, res, next) => {
  const hotelId = req.params.hotelId;
  try {
    const deletedRoom = await Rooms.findByIdAndDelete(req.params.id);
    try {
      await Hotels.findByIdAndUpdate(hotelId, {
        $pull: { rooms: req.params.id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json("Room has been deleted");
  } catch (err) {
    next(err);
  }
};
export const getRoom = async (req, res, next) => {
  try {
    const Room = await Rooms.findById(req.params.id);
    res.status(200).json(Room);
  } catch (err) {
    next(err);
  }
};
export const getAllRoom = async (req, res, next) => {
  try {
    const allRooms = await Rooms.find(req.params.id);

    res.status(200).json(allRooms);
  } catch (err) {
    next(err);
  }
};
