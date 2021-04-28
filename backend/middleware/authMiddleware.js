import jwt from "jsonwebtoken";

import expressAsyncHandler from "express-async-handler";

import User from "../modals/userModal.js";
import { request } from "express";

const protect = expressAsyncHandler(async (request, response, next) => {
  let token;
  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = request.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, `${process.env.JWT_SECRECT}`);

      request.user = await User.findById(decoded.id).select(
        "-password"
      );

      next();
    } catch (error) {
      response.status(401);
      throw new Error("NOT AUTHORIZED, token failed");
    }
  }
  if (!token) {
    response.status(401);
    throw new Error("Not authorized, No Token");
  }
});

const admin = (request, response, next) => {
  if( request.user && request.user.isAdmin ){
    next()
  }else {
    response.status(401)
    throw new Error("Not Authorized as an admin")
  }
}

export { protect, admin };
