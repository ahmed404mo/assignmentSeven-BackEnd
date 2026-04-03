import { UserModel } from "../../DB/model/user.model.js";
import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

export const signupService = async (data) => {
  const { name, email, password, phone, age } = data;

  const isExist = await UserModel.findOne({ email });
  if (isExist) return { status: 409, message: "Email already exists." };

  const hashedPassword = bcrypt.hashSync(password, 10);
  const encryptedPhone = CryptoJS.AES.encrypt(phone, "secret_key").toString();

  const user = new UserModel({
    name,
    email,
    password: hashedPassword,
    phone: encryptedPhone,
    age,
  });

  await user.save();
  return { status: 201, message: "User added successfully." };
};

export const loginService = async (data) => {
  const { email, password } = data;

  const user = await UserModel.findOne({ email });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return { status: 400, message: "Invalid email or password" };
  }

  const token = jwt.sign({ userId: user._id }, "your_jwt_secret", {
    expiresIn: "1h",
  });

  return { status: 200, message: "Login successful", token };
};

export const updateUserService = async (userId, data) => {
  const { name, email, age } = data;

  if (email) {
    const isExist = await UserModel.findOne({ email, _id: { $ne: userId } });
    if (isExist) return { status: 409, message: "Email already exists" };
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    { name, email, age },
    { new: true, runValidators: true }
  );

  if (!updatedUser) return { status: 404, message: "User not found" };

  return { status: 200, message: "User updated", user: updatedUser };
};

export const deleteUserService = async (userId) => {
  const user = await UserModel.findByIdAndDelete(userId);
  if (!user) return { status: 404, message: "User not found" };
  return { status: 200, message: "User deleted" };
};

export const getUserDataService = async (userId) => {
  const user = await UserModel.findById(userId).select("-password");
  if (!user) return { status: 404, message: "User not found" };
  return { status: 200, user };
};