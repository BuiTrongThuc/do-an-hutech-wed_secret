// backend/index.js
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();
const port = 3000;

// Middleware
app.use(cors());            // cho phép frontend gọi API khác port
app.use(express.json());    // để đọc JSON từ body

// Route kiểm tra server
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// ========== API PRODUCTS ==========

// 1. Lấy danh sách sản phẩm
app.get('/products', (req, res) => {
  const sql = 'SELECT * FROM products ORDER BY created_at DESC';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Lỗi truy vấn:', err);
      return res.status(500).json({ message: 'Lỗi server' });
    }
    res.json(results);
  });
});

// 2. Thêm sản phẩm
app.post('/products', (req, res) => {
  const { name, price, description } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: 'Thiếu name hoặc price' });
  }

  const sql = 'INSERT INTO products (name, price, description) VALUES (?, ?, ?)';
  db.query(sql, [name, price, description || ''], (err, result) => {
    if (err) {
      console.error('Lỗi truy vấn:', err);
      return res.status(500).json({ message: 'Lỗi server' });
    }

    res.json({
      message: 'Thêm sản phẩm thành công',
      productId: result.insertId,
    });
  });
});

// 3. Cập nhật sản phẩm
app.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body;

  const sql = 'UPDATE products SET name = ?, price = ?, description = ? WHERE id = ?';
  db.query(sql, [name, price, description || '', id], (err, result) => {
    if (err) {
      console.error('Lỗi truy vấn:', err);
      return res.status(500).json({ message: 'Lỗi server' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    res.json({ message: 'Cập nhật sản phẩm thành công' });
  });
});

// 4. Xóa sản phẩm
app.delete('/products/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM products WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Lỗi truy vấn:', err);
      return res.status(500).json({ message: 'Lỗi server' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    res.json({ message: 'Xóa sản phẩm thành công' });
  });
});

// ==================================

app.listen(port, () => {
  console.log(`Server backend chạy tại http://localhost:${port}`);
});