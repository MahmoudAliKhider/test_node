const db = require('../config/database'); 

exports.up = function(next) {
  const createFoodTableQuery = `
    CREATE TABLE IF NOT EXISTS food (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price INT,
      quantity INT
    );
  `;

  const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS user (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL
    );
  `;

  db.query(createFoodTableQuery, err => {
    if (err) throw err;
    db.query(createUserTableQuery, err => {
      if (err) throw err;
      next();
    });
  });
};

exports.down = function(next) {
  const dropFoodTableQuery = `DROP TABLE IF EXISTS food;`;
  const dropUserTableQuery = `DROP TABLE IF EXISTS user;`;

  db.query(dropFoodTableQuery, err => {
    if (err) throw err;
    db.query(dropUserTableQuery, err => {
      if (err) throw err;
      next();
    });
  });
};
