import expressAsyncHandler from "express-async-handler";

import generateToken from "../utils/generateToken.js";

import User from "../modals/userModal.js";

// @description Auth user & get token
// @route POST /api/products
// @access Public

const authUser = expressAsyncHandler(async (request, response) => {
  const { email, password } = request.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    response.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    response.status(404);
    throw new Error("Invalid email or Password");
  }
});

// @description Get User Profile
// @route GET /api/users/profile
// @access Private

const getUserProfile = expressAsyncHandler(async (request, response) => {
  const user = await User.findById(request.user._id);

  if (user) {
    response.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    response.status(404);
    throw new Error("User Not Found");
  }
});

// @description Register New user
// @route POST /api/users
// @access Public

const registerUser = expressAsyncHandler(async (request, response) => {
  const { name, email, password } = request.body;

  const userExist = await User.findOne({ email });

  if (userExist) {
    response.status(400);
    throw new Error("User Already exist");
  }

  const user = await User.create({
    name,
    email,
    password,
  });
  if (user) {
    response.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    response.status(400);
    throw new Error("invalid user data");
  }
});

// @description PUT/UPDATE User Profile
// @route PUT /api/users/profile
// @access Private

const updateUserProfile = expressAsyncHandler(async (request, response) => {
  const user = await User.findById(request.user._id);

  if (user) {
    user.name = request.body.name || user.name;
    user.email = request.body.email || user.email;
    if (request.body.password) {
      user.password = request.body.password;
    }

    const updatedUser = await user.save();

    response.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    response.status(404);
    throw new Error("User Not Found");
  }
});

// @description Get All User
// @route GET /api/users
// @access Private/Admin

const getUsers = expressAsyncHandler(async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

// @description delete User
// @route DELETE /api/users/:id
// @access Private/Admin

const deleteUser = expressAsyncHandler(async (request, response) => {
  const user = await User.findById(request.params.id);
  if (user) {
    await user.remove();
    response.json({ message: "User Removed" });
  } else {
    response.status(404);
    throw new Error("user Not found");
  }
});

// @description Get User By Id
// @route GET /api/users/:id
// @access Private/Admin

const getUserById = expressAsyncHandler(async (request, response) => {
  const user = await User.findById(request.params.id).select("-password");
  if (user) {
    response.json(user);
  } else {
    response.status(404);
    throw new Error("user Not found");
  }
});

// @description PUT/UPDATE User
// @route PUT /api/users/:id
// @access Private/Admin

const updateUser = expressAsyncHandler(async (request, response) => {
  const user = await User.findById(request.params.id);

  if (user) {
    user.name = request.body.name || user.name;
    user.email = request.body.email || user.email;
    user.isAdmin = request.body.isAdmin;

    const updatedUser = await user.save();

    response.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    response.status(404);
    throw new Error("User Not Found");
  }
});

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
