import { hash, compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";

const hashPassword = async (password) => {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
};

const verifyPassword = async (password, hashedPassword) => {
  const isValid = await compare(password, hashedPassword);
  return isValid;
};

const generateAccessToken = (data) => {
  const token = sign({ ...data }, process.env.AccessTokenSecretKey, {
    expiresIn: "15m",
  });

  return token;
};

const verifyAccessToken = (token) => {
  try {
    const tokenPayload = verify(token, process.env.AccessTokenSecretKey);

    return tokenPayload;
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      console.log("Token has expired");
      return null;
    }

    console.log("Verify AccessToken Error =>", err.message);

    return false;
  }
};

const generateRefreshToken = (data) => {
  const token = sign({ ...data }, process.env.RefreshTokenSecretKey, {
    expiresIn: "15d",
  });

  return token;
};
const verifyRefreshToken = (token) => {
  try {
    const tokenPayload = verify(token, process.env.RefreshTokenSecretKey);

    return tokenPayload;
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      console.log("Refresh token has expired");
      return null;
    }

    console.log("Verify Refresh Token Error =>", err.message);

    return false;
  }
};

const validateEmail = (email) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
};

const validatePhone = (phone) => {
  const pattern = /^[+]?[0-9]{10,15}$/;
  return pattern.test(phone);
};

const valiadtePassword = (password) => {
  const pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$/;

  return pattern.test(password);
};

export {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateRefreshToken,
  validateEmail,
  validatePhone,
  valiadtePassword,
};
