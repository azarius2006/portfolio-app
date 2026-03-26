let chart;

// 🔔 Toast Notification
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 3000);
}

// ➕ Add Stock
async function addStock() {
    const name = document.getElementById('name').value.toUpperCase();
    const price = parseFloat(document.getElementById('price').value);
    const quantity = parseInt(document.getElementById('quantity').value);

    if (!name || !price || !quantity) {
        showToast("⚠️ Please fill all fields");
        return;
    }

    const res = await fetch('/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, quantity })
    });

    const data = await res.json();
    showToast(data.message);

    loadPortfolio(); // 🔄 refresh

    // ✅ Clear inputs (Fix 2)
    document.getElementById('name').value = "";
    document.getElementById('price').value = "";
    document.getElementById('quantity').value = "";
}

// 📥 Buy Stock
async function buyStock() {
    const name = document.getElementById('name').value.toUpperCase();
    const quantity = parseInt(document.getElementById('quantity').value);

    if (!name || !quantity) {
        showToast("⚠️ Enter name & quantity");
        return;
    }

    const res = await fetch('/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, quantity })
    });

    const data = await res.json();
    showToast(data.message);

    loadPortfolio();

    // ✅ Clear inputs
    document.getElementById('name').value = "";
    document.getElementById('quantity').value = "";
}

// 📤 Sell Stock
async function sellStock() {
    const name = document.getElementById('name').value.toUpperCase();
    const quantity = parseInt(document.getElementById('quantity').value);

    if (!name || !quantity) {
        showToast("⚠️ Enter name & quantity");
        return;
    }

    const res = await fetch('/sell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, quantity })
    });

    const data = await res.json();
    showToast(data.message);

    loadPortfolio();

    // ✅ Clear inputs
    document.getElementById('name').value = "";
    document.getElementById('quantity').value = "";
}

// 📊 Load Portfolio (Dashboard)
async function loadPortfolio() {
    document.getElementById("output").innerHTML = "⏳ Loading...";

    const res = await fetch('/portfolio');
    const data = await res.json();

    let total = 0;
    let labels = [];
    let values = [];

    let output = "";

    data.forEach(stock => {
        let value = stock.price * stock.quantity;
        total += value;

        labels.push(stock.name);
        values.push(value);

        // 🎯 Random profit/loss (for demo UI)
        let change = (Math.random() * 20 - 10).toFixed(2);
        let color = change >= 0 ? "lime" : "red";

        output += `
        <div class="stock-card">
            <h3>${stock.name}</h3>
            <p>Price: ₹${stock.price}</p>
            <p>Qty: ${stock.quantity}</p>
            <b>₹${value}</b>
            <p style="color:${color}">
                ${change}%
            </p>
        </div>`;
    });

    document.getElementById("output").innerHTML = output;

    // 📊 Stats
    document.getElementById("stats").innerHTML = `
        <div class="stat-card">
            <h3>Total Value</h3>
            <p>₹${total}</p>
        </div>
        <div class="stat-card">
            <h3>Assets</h3>
            <p>${data.length}</p>
        </div>
    `;

    // 📈 Chart
    if (chart) chart.destroy();

    const ctx = document.getElementById('chart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: values
            }]
        }
    });
}