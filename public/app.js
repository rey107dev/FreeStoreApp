// Fetch items from the server and display them
async function fetchItems() {
  try {
    const response = await fetch("http://localhost:3000/items");
    const items = await response.json();
    displayItems(items);
  } catch (error) {
    console.error("Error fetching items:", error);
  }
}

// Display items in the UI
function displayItems(items) {
  const itemList = document.getElementById("itemListIndex");
  itemList.innerHTML = ""; // Clear current items

  items.forEach((item) => {
    const itemDiv = createItemElement(item);
    itemList.appendChild(itemDiv);
  });
}

// Create a div element for an item
function createItemElement(item) {
  const itemDiv = document.createElement("div");
  itemDiv.classList.add("item-index");

  const itemName = document.createElement("span");
  itemName.classList.add("item-name-index");
  itemName.textContent = `${item.name} - ${item.price}`;

  const editBtn = createEditButton(item);
  const deleteBtn = createDeleteButton(item);

  itemDiv.appendChild(itemName);
  itemDiv.appendChild(editBtn);
  itemDiv.appendChild(deleteBtn);

  return itemDiv;
}

// Create an Edit button with functionality
function createEditButton(item) {
  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-btn");
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => editItem(item));
  return editBtn;
}

// Create a Delete button with functionality
function createDeleteButton(item) {
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.textContent = "x";
  deleteBtn.addEventListener("click", async () => {
    if (confirm("Are you sure you want to delete this item?")) {
      await deleteItem(item.id);
    }
  });
  return deleteBtn;
}

// Delete an item and refresh the list
async function deleteItem(itemId) {
  try {
    const response = await fetch(
      `http://localhost:3000/delete-item/${itemId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      fetchItems(); // Refresh the item list
      alert("Item deleted successfully!");
    } else {
      alert("Failed to delete item.");
    }
  } catch (error) {
    console.error("Error deleting item:", error);
  }
}

// Placeholder function for editing an item
function editItem(item) {
  // Implement the edit functionality
  console.log("Edit item:", item);
}

// Initial fetch of items
fetchItems();

// Add Item
document
  .getElementById("itemForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;

    const response = await fetch("http://localhost:3000/add-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, price }),
    });

    if (response.ok) {
      document.getElementById("itemForm").reset();
      fetchItems(); // Refresh the item list
      alert("Item added successfully!");
    } else {
      alert("Failed to add item.");
    }
  });

// Edit Item
async function editItem(item) {
  const newName = prompt("Enter new name:", item.name);
  const newPrice = prompt("Enter new price:", item.price);

  if (newName !== null && newPrice !== null) {
    const response = await fetch(`http://localhost:3000/edit-item/${item.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newName, price: newPrice }),
    });

    if (response.ok) {
      fetchItems(); // Refresh the item list
      alert("Item updated successfully!");
    } else {
      alert("Failed to update item.");
    }
  }
}

// Initial fetch to display items
fetchItems();
