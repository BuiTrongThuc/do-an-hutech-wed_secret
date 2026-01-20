// backend/config/db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',             // nếu bạn đặt mật khẩu MySQL thì sửa vào đây
  database: 'do_an_hutech', // đúng tên database bạn vừa tạo trong phpMyAdmin
});

connection.connect((err) => {
  if (err) {
    console.error('Kết nối MySQL thất bại:', err);
  } else {
    console.log('Kết nối MySQL thành công!');
  }
});

module.exports = connection;