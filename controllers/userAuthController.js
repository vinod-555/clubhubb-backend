// authController.js
import User from '../models/userModel.js';
import { hashPassword, comparePasswords, generateToken } from '../helpers/userAuthHelper.js';


export const signup = async (req, res) => {
  try {
    const { email, password, name, username, phoneNumber, collegeName } = req.body;

    // Check if the required fields are present
    if (!email || !name || !username || !password || !phoneNumber || !collegeName ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already exists' });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      username,
      phoneNumber,
      collegeName,
      eventsRegisterd:[]
    });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const signin = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
     
    // Check if the email or username exists
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the password is valid
    const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate a token for the authenticated user
    const token = generateToken(user._id);

    // Send the token and user ID in the response
    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
