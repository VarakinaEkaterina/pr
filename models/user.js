const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "00000000",
  database: "base",
});

db.connect((err) => {
  if (err) {
    console.error("Ошибка подключения к базе данных MySQL:", err);
    return;
  }
  console.log("Подключение к базе данных MySQL установлено");

  const sql = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        age INT NOT NULL,
        role VARCHAR(50) DEFAULT 'user'
      )
    `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Ошибка при создании таблицы users:", err);
      return;
    }
    console.log("Таблица users успешно создана");
  });
});

class User {
  constructor() {}
  static async create(dataForm, cb) {
    try {
      let role = "user";

      db.query("SELECT COUNT(*) AS count FROM users", async (err, rows) => {
        if (err) return cb(err);

        const usersCount = rows[0].count;

        if (usersCount === 0) {
          role = "admin";
        }

        const sql =
          "INSERT INTO users (name, email, password, age, role) VALUES (?, ?, ?, ?, ?)";
        db.query(
          sql,
          [
            dataForm.name,
            dataForm.email,
            dataForm.password,
            dataForm.age,
            role,
          ],
          (err, result) => {
            if (err) return cb(err);
            cb(null, result);
          }
        );
      });
    } catch (error) {
      cb(error);
    }
  }

  static findByEmail(email, cb) {
    db.query("SELECT * FROM users WHERE email = ?", email, (err, rows) => {
      if (err) return cb(err);
      cb(null, rows[0]);
    });
  }

  static authenticate(dataForm, cb) {
    User.findByEmail(dataForm.email, (error, user) => {
      if (error) return cb(error);
      if (!user) return cb();

      if (dataForm.password === user.password) {
        return cb(null, user);
      } else {
        return cb();
      }
    });
  }
}

module.exports = User;
