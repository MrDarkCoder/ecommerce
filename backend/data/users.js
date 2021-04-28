import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: "Dope User",
    email: "dope@example.com",
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: "Mode User",
    email: "mode@example.com",
    password: bcrypt.hashSync('123456', 10),
  },
];

export default users;