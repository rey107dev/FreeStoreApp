const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const app = express();
const PORT = 3000;

// Serve static files from the "public" directory

// Path to the JSON file
const filePath = path.join(__dirname, "data.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Utility function to read the current items
function readItems() {
  if (fs.existsSync(filePath)) {
    const rawData = fs.readFileSync(filePath);
    return JSON.parse(rawData);
  }
  return [];
}

// Utility function to write the updated items
function writeItems(items) {
  fs.writeFileSync(filePath, JSON.stringify(items, null, 2));
}

// Serve the HTML form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/free-store/items", (req, res) => {
  res.sendFile(path.join(__dirname, "public/items.html"));
});

// Serve the items (GET request)
app.get("/items", (req, res) => {
  const items = readItems();
  console.log(items);
  res.json(items);
});

// Add a new item (POST request)
app.post("/add-item", (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).send("Name and price are required.");
  }

  // Read the existing items
  const items = readItems();

  // Create a new item with a UUID
  const newItem = {
    id: uuidv4(),
    name,
    price: parseFloat(price),
  };

  // Add the new item to the list
  items.push(newItem);

  // Write the updated list back to the JSON file
  writeItems(items);

  res.status(201).send("Item added successfully.");
});

// Edit an existing item (PUT request)
app.put("/edit-item/:id", (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  // Read the existing items
  let items = readItems();

  // Find the item by ID
  const itemIndex = items.findIndex((item) => item.id === id);

  if (itemIndex === -1) {
    return res.status(404).send("Item not found.");
  }

  // Update the item's properties
  if (name) items[itemIndex].name = name;
  if (price) items[itemIndex].price = parseFloat(price);

  // Write the updated list back to the JSON file
  writeItems(items);

  res.send("Item updated successfully.");
});


// Delete an item (DELETE request)
app.delete("/delete-item/:id", (req, res) => {
  const { id } = req.params;

  // Read the existing items
  let items = readItems();

  // Filter out the item with the given ID
  const newItems = items.filter((item) => item.id !== id);

  if (items.length === newItems.length) {
    return res.status(404).send("Item not found.");
  }

  // Write the updated list back to the JSON file
  writeItems(newItems);

  res.send("Item deleted successfully.");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
