import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";
import Cookies from 'universal-cookie';
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  // if(!token){
  //   const cookies = new Cookies();
  //   token = cookies.get('access_token');
  //   console.log(token);
  // }
  //NOTE not able to get the admin token
  console.log("your token is :"+token);
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    req.user = user;
    next();
  });
  next();
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};
