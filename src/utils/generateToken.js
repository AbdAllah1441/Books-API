import jwt from "jsonwebtoken";

const generateToken = (user, res) => {
  const payload = {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role ?? "USER",
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export default generateToken;
