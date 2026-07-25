import { createUser } from "../services/userService.js";

export const register = async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json({ message: "User created", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving user", error: error.message });
  }
};
