// testDatabase.js
const db = require("./config/db");

async function testConnection() {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    console.log("Connection successful:", rows[0].result); // Should print '2' if successful
  } catch (err) {
    console.error("Database connection failed:", err);
  }
}

testConnection();
