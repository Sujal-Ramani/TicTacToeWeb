const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Register a new user
// Expects: { username, password } in request body
exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validate input: username >=3 chars, password >=4 chars
    if (!username || !password || username.length < 3 || password.length < 4) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Check if username already exists
    if (await User.findOne({ username })) {
      return res.status(409).json({ message: "Username already taken" });
    }

    // Create new user instance
    const user = new User({ username });

    // Hash and set password
    await user.setPassword(password);

    // Save user to database
    await user.save();

    // Return newly created user (without password)
    res.status(201).json({ id: user.id, username: user.username });
  } catch (err) {
    next(err); // pass error to global error handler
  }
};

// Login an existing user
// Expects: { username, password } in request body
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password)
      return res.status(400).json({ message: "Username and password required" });

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // Verify password
    const ok = await user.verifyPassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || "secret_dev",
      { expiresIn: "12h" }
    );

    // Return token to client
    res.json({ token });
  } catch (err) {
    next(err);
  }
};
