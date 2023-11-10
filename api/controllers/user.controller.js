import bcryptjs from 'bcryptjs';

import User from '../models/user.model.js';

export const test = (req, res) => {
  res.json({
    message: 'Api route is working!',
  })
}

export const updateUser = async (req, res, next) => {
  const { username, email, password, avatar } = req.body;

  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can only update your own account!'));
  }

  try {
    if (password) {
      password = bcryptjs.hashSync(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { username, email, password, avatar } },
      { new: true }
    );

    const { password: pass, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
}