import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = async (req, res, next) => {
  try {
    const { fullName, nationalId, password, phoneNumber, role } = req.body;

    const userExists = await User.findOne({ nationalId });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists with this National ID');
    }

    const user = await User.create({ fullName, nationalId, password, phoneNumber, role });

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { nationalId, password } = req.body;

    const user = await User.findOne({ nationalId });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid National ID or password');
    }
  } catch (error) {
    next(error);
  }
};