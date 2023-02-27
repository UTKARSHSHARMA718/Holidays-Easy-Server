import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../Utils/error.js";
import jwt from "jsonwebtoken";
import Cookies from 'universal-cookie';

export const register = async (req, res, next) => {

  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt); // hashing the password
    console.log("req body");
    console.log(req);
    const newUser = new User({
      ...req.body, // for taking all the properties of the user
      password: hash,
    });

    await newUser.save();
    res.status(200).send("User is created");
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found"));

    // console.log("user info :"+user);
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect)
      return next(createError(400, "password or username is incorrect"));

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );
    //---------------------------------//
    const cookies = new Cookies();
    cookies.set('access_token',token,{ path: 'http://localhost:3000' });
    console.log(cookies.get('access_token'));
    //---------------------------------//
    const { password, isAdmin, ...otherDetails } = user._doc;
    console.log("token is here:- "+token)
    res.cookie("access_token", token, {
      httpOnly: true,
    });

    res.status(200).json({ details: { ...otherDetails }, isAdmin });
  } catch (err) {
    next(err);
  }
};
