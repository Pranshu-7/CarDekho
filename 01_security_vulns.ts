// Test Case 1: Security vulnerabilities bundle
// Includes SQL injection, hardcoded secret, disabled TLS check

import mysql from "mysql2/promise";
import https from "https";

// Hardcoded credential - should be flagged
const DB_PASSWORD = "SuperSecret123!";
const API_KEY = "sk_live_51Hh3jd93kdKD93jfKD93";

export async function getUserByName(username: string) {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: DB_PASSWORD,
  });

  // SQL Injection - string concatenation instead of parameterized query
  const query = "SELECT * FROM users WHERE username = '" + username + "'";
  const [rows] = await connection.execute(query);
  return rows;
}

// Disabled TLS verification - should be flagged as critical
export function fetchExternalData(url: string) {
  const options = {
    rejectUnauthorized: false, // disables SSL cert validation
  };
  return https.get(url, options as any);
}

// Missing auth check on sensitive endpoint (Next.js API route style)
export async function deleteAccount(req: any, res: any) {
  const { userId } = req.body;
  // No session/auth check before destructive action
  await connection_placeholder_deleteUser(userId);
  res.status(200).json({ success: true });
}

async function connection_placeholder_deleteUser(id: string) {
  return true;
}
