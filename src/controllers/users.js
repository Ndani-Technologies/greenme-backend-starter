/* eslint-disable import/extensions */
import logger from "../middleware/logger.js";
import User from "../models/users.js";
import asyncHandler from "../middleware/async.js";
import ErrorResponse from "../utils/error-response.js";
import client from "../configs/redis.js";

/**
 * @desc    Get all users
 */
const getUsers = asyncHandler(async (req, res) => {
  const usersCache = await client.get("users");

  if (usersCache) {
    return res
      .status(200)
      .json({ success: true, data: JSON.parse(usersCache) });
  }

  const users = await User.find();

  await client.set("users", JSON.stringify(users), "EX", 60);

  res.status(200).json({ success: true, data: users });
});

/**
 * @desc    Create new user
 */
const createUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);

  await client.del("users");

  res.status(201).json({ success: true, data: user });

  logger.info(`User created with id ${user.id}`);
});

/**
 * @desc    Get single user
 */
const getUser = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.params;

  const userCache = await client.get(`user:${userId}`);

  if (userCache) {
    return res.status(200).json({ success: true, data: JSON.parse(userCache) });
  }

  const user = await User.findOne({ _id: userId });

  if (!user) {
    return next(new ErrorResponse(`No user with id ${userId}`, 404));
  }

  await client.set(`user:${userId}`, JSON.stringify(user), "EX", 60);

  res.status(200).json({ success: true, data: user });
});

/**
 * @desc    Update user
 */
const updateUser = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json({ success: true, message: `Update user with id ${req.params.id}` });
});

/**
 * @desc    Delete user
 */
const deleteUser = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json({ success: true, message: `Delete user with id ${req.params.id}` });
});

export { getUsers, createUser, getUser, updateUser, deleteUser };
