import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

const register = async (req, res) => {
  const { email, password, username, name } = req.body;
  // check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  // create new user with hashed password
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: { username, email, password: hashedPassword, name },
    select: { id: true, username: true, email: true, name: true},
  });
  generateToken(newUser, res);
  res.status(201).json({
    message: "User registered successfully",
    user: newUser,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  // check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      role: true,
      password: true,
    },
  });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  generateToken(user, res);
  res.json({
    message: "Login successful",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
    },
  });
};

const logout = (req, res) => {
  res.clearCookie("token","", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logout successful" });
}

export { register, login, logout };
