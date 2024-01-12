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
    CREATE TABLE IF NOT EXISTS entries (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      title VARCHAR(255),
      content TEXT NOT NULL,
      timestamp timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Ошибка при создании таблицы entries:", err);
      return;
    }
    console.log("Таблица entries успешно создана");
  });
});

class Entry {
  constructor() {}

  static create(data) {
    const sql =
      "INSERT INTO entries (username, title, content) VALUES (?, ?, ?)";
    db.query(sql, [data.username, data.title, data.content], (err, result) => {
      if (err) {
        console.error("Ошибка при добавлении записи:", err);
        return;
      }
      console.log("Запись успешно добавлена");
    });
  }

  static selectAll(cb) {
    db.query("SELECT * FROM entries", cb);
  }

  static getEntryById(entryId, cb) {
    const sql = "SELECT * FROM entries WHERE id = ?";
    db.query(sql, entryId, (err, rows) => {
      if (err) {
        console.error("Error getting entry by ID:", err);
        return cb(err, null);
      }

      if (rows.length === 0) {
        console.log("Entry not found");
        return cb(new Error("Entry not found"), null);
      }

      const entry = {
        id: rows[0].id,
        username: rows[0].username,
        title: rows[0].title,
        content: rows[0].content,
      };

      cb(null, entry);
    });
  }

  static delete(entryId, cb) {
    const sql = "DELETE FROM entries WHERE id = ?";
    db.query(sql, entryId, function (err, result) {
      if (err) {
        return cb(err);
      }
      cb(null, result);
    });
  }

  static update(entryId, newData, cb) {
    const updateSql = "UPDATE entries SET title = ?, content = ? WHERE id = ?";
    db.query(
      updateSql,
      [newData.title, newData.content, entryId],
      (err, result) => {
        if (err) {
          console.error("Error updating entry:", err);
          return cb(err);
        }

        console.log("запись обновлена успешно");
        cb(null);
      }
    );
  }
}

module.exports = Entry;
