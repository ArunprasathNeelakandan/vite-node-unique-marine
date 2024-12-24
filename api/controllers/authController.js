const  db  = require("../db"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password)
  try {
    const connection = await db.getConnection();
    if (!connection) {
      return res.status(500).json({ message: "Database connection failed" });
    }

    const get_user = "SELECT * FROM admin WHERE username = ?";
    const [rows] = await connection.execute(get_user, [username]);

    const user = rows[0]; 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({ message: "Password is incorrect" });
    }

    const payLoad = { username: username };
    const jwtToken = jwt.sign(payLoad, "arun", { expiresIn: '1h' });

    res.json({ jwtToken });

    connection.release();

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Error during login" });
  }
};


module.exports = { login };


