const express = require('express');
const cors = require('cors');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_gh5Js0zcdRue@ep-sparkling-river-ao84a99d-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  ssl: {
    rejectUnauthorized: false 
  }
});

const app = express();

app.use(cors()); 
app.use(express.json()); 


// Create Barang Baru
app.post('/api/items', async (req, res) => {
    try {
        const { nama_barang, kategori, jumlah, deskripsi, image_url } = req.body;
        const newItem = await pool.query(
            "INSERT INTO items (nama_barang, kategori, jumlah, deskripsi, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [nama_barang, kategori, jumlah, deskripsi, image_url]
        );
        res.json(newItem.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Read Semua Data Barang
app.get('/api/items', async (req, res) => {
    try {
        // Mengambil semua data dan diurutkan dari yang terbaru dimasukkan
        const allItems = await pool.query("SELECT * FROM items ORDER BY id DESC");
        res.json(allItems.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Delete Barang Berdasarkan ID
app.delete('/api/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteItem = await pool.query("DELETE FROM items WHERE id = $1", [id]);
        res.json("Barang berhasil dihapus!");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(5000, () => {
    console.log("Server berjalan di http://localhost:5000");
  });
}

module.exports = app;