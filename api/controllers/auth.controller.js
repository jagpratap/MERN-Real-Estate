import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET);

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    next(error);
  }
}

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, 'User not found!'))
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, 'Wrong credentials!'));
    }
    const token = generateToken(validUser._id);
    const { password: hashedPassword, ...rest } = validUser._doc;
    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
}

export const google = async (req, res, next) => {
  const { name, email, photo } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = generateToken(user._id);
      const { password, ...rest } = user._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username: name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
        email,
        password: hashedPassword,
        avatar: photo
      });
      await newUser.save();

      const token = generateToken(newUser._id);
      const { password, ...rest } = newUser._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
}