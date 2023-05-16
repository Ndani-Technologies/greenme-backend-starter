/* eslint-disable import/extensions */
import logger from "../middleware/logger.js";
import User from "../models/users.js";
import asyncHandler from "../middleware/async.js";
import ErrorResponse from "../utils/error-response.js";
import redis from "../configs/redis.js";

const getUsers = asyncHandler(async (req, res) => {
  const usersCache = await redis.get("users");
  if (usersCache) {
    return res
      .status(200)
      .json({ success: true, data: JSON.parse(usersCache) });
  }

  const users = await User.find();
  await redis.set("users", JSON.stringify(users), "EX", 60);
  res.status(200).json({ success: true, data: users });
});

const createUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  await redis.del("users");
  res.status(201).json({ success: true, data: user });
  logger.info(`User created with id ${user.id}`);
});

const getUser = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.params;

  const userCache = await redis.get(`user:${userId}`);
  if (userCache) {
    return res.status(200).json({ success: true, data: JSON.parse(userCache) });
  }

  const user = await User.findOne({ _id: userId });
  if (!user) {
    return next(new ErrorResponse(`No user with id ${userId}`, 404));
  }

  await redis.set(`user:${userId}`, JSON.stringify(user), "EX", 60);
  res.status(200).json({ success: true, data: user });
});

const updateUser = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json({ success: true, message: `Update user with id ${req.params.id}` });
});

const deleteUser = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json({ success: true, message: `Delete user with id ${req.params.id}` });
});

export { getUsers, createUser, getUser, updateUser, deleteUser };
