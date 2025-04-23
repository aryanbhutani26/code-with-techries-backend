import bcrypt from "bcrypt";
import User from "../schema/user.js";

const registerManual = async (req, res) => {
  const { email, password, displayName, role } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashed,
      displayName,
      role,
    });
    res.status(201).json({ msg: "Registered successfully", user });
  } catch (err) {
    res.status(500).json({ msg: "Registration failed", error: err.message });
  }
};

const loginManual = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.password)
      return res.status(400).json({ msg: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ msg: "Incorrect password" });

    req.login(user, (err) => {
      if (err) return res.status(500).json({ msg: "Login failed" });
      res.status(200).json({ msg: "Logged in", user });
    });
  } catch (err) {
    res.status(500).json({ msg: "Error during login", error: err.message });
  }
};


export { registerManual, loginManual };