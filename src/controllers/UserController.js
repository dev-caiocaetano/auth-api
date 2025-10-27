import { validationResult } from "express-validator";
import * as userService from "../services/userService.js";

export async function createUser(req, res, next) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    };

    const registerResult = await userService.registerUser(req.body);
    return res.status(201).json(registerResult);
  } catch (error) {
    next(error);
  };
};

export async function verifyEmail(req, res, next) {
  try {
    const { token } = req.query;

    const verifyResult = await userService.verifyUserEmail(token);

    if (verifyResult.status === 'already_verified') {
      return res.redirect('/');
    } else {
      return res.redirect('/');
    }
  } catch (error) {
    next(error);
  };
};

export async function userLogin(req, res, next) {
  try {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    };

    const loginResult = await userService.loginUser(req.body);
    return res.status(201).json(loginResult);
  } catch (error) {
    next(error);
  }
};
