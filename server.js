const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.json());
app.use(express.static('public'));

const CACHE_FILE = path.join(__dirname, 'portfolio-cache.json');

function loadCache() {
    try {
        if (fs.existsSync(CACHE_FILE)) {
            return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
        }
    } catch (e) {
        console.error('Failed to load cache:', e.message);
    }
    return [];
}

function saveCache() {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(portfolio, null, 2));
}

let portfolio = loadCache();

// Add stock
app.post('/add', (req, res) => {
    const { name, price, quantity } = req.body;

    let existing = portfolio.find(s => s.name === name);

    if (existing) {
        existing.price = price;        // update price
        existing.quantity += quantity; // increase qty
        saveCache();
        return res.json({ message: "Stock updated" });
    }

    portfolio.push({ name, price, quantity });
    saveCache();
    res.json({ message: "Stock added" });
});

// Buy stock
app.post('/buy', (req, res) => {
    const { name, quantity } = req.body;
    let stock = portfolio.find(s => s.name === name);

    if (stock) {
        stock.quantity += quantity;
        saveCache();
        res.json({ message: "Stock bought" });
    } else {
        res.json({ message: "Stock not found" });
    }
});

// Sell stock
app.post('/sell', (req, res) => {
    const { name, quantity } = req.body;
    let stock = portfolio.find(s => s.name === name);

    if (stock && stock.quantity >= quantity) {
        stock.quantity -= quantity;
        saveCache();
        res.json({ message: "Stock sold" });
    } else {
        res.json({ message: "Not enough stock" });
    }
});

// Get portfolio
app.get('/portfolio', (req, res) => {
    res.json(portfolio);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));