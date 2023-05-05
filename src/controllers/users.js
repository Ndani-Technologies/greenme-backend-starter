const getUsers = (req, res) => {
  res.status(200).json({ success: true, message: "Show all users" });
};

const createUser = (req, res) => {
  res.status(201).json({ success: true, message: "Create new user" });
};

const getUser = (req, res) => {
  res
    .status(200)
    .json({ success: true, message: `Show user with id ${req.params.id}` });
};

const updateUser = (req, res) => {
  res
    .status(200)
    .json({ success: true, message: `Update user with id ${req.params.id}` });
};

const deleteUser = (req, res) => {
  res
    .status(200)
    .json({ success: true, message: `Delete user with id ${req.params.id}` });
};

export { getUsers, createUser, getUser, updateUser, deleteUser };
