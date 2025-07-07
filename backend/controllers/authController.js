const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username,email,password} = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ username,email,password: hashed });
    res.status(201).json({ msg: 'User created', user: user.username });
  } catch (err) {
    res.status(400).json({ error: 'User exists' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Wrong password' });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
  res.json({ token });
};
