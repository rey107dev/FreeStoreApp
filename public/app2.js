document.addEventListener("DOMContentLoaded", async () => {
  const itemList = document.getElementById("itemList");
  const totalPointsElement = document.getElementById("totalPoints");

  // Fetch items from the server
  async function fetchItems() {
    try {
      const response = await fetch("http://localhost:3000/items");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const items = await response.json();
      const sortedItems = items.sort((a, b) => a.name.localeCompare(b.name));
      const groupedItems = groupItemsByFirstLetter(sortedItems);

      displayItems(groupedItems);
    } catch (error) {
      console.error("Failed to fetch items:", error);
    }
  }

  function groupItemsByFirstLetter(items) {
    return items.reduce((groups, item) => {
      const firstLetter = item.name[0].toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(item);
      return groups;
    }, {});
  }

  function displayItems(groupedItems) {
    const itemList = document.getElementById("itemList");
    itemList.innerHTML = ""; // Clear the current items

    Object.keys(groupedItems).forEach((letter) => {
      // Create a header for each letter group
      const letterHeader = document.createElement("h2");
      letterHeader.textContent = letter;
      itemList.appendChild(letterHeader);

      groupedItems[letter].forEach((item) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("item");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = item.id;
        checkbox.value = item.price;
        checkbox.addEventListener("change", updateTotalPoints);

        const itemName = document.createElement("label");
        itemName.htmlFor = item.id;
        itemName.textContent = `${item.name} - ${item.price} points`;

        const quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.value = 1;
        quantityInput.min = 1;
        quantityInput.addEventListener("input", updateTotalPoints);

        itemDiv.appendChild(checkbox);
        itemDiv.appendChild(itemName);
        itemDiv.appendChild(quantityInput);
        itemList.appendChild(itemDiv);
      });
    });
  }

  function updateTotalPoints() {
    let totalPoints = 0;

    // Iterate over each item to calculate the total points
    document.querySelectorAll(".item").forEach((itemDiv) => {
      const checkbox = itemDiv.querySelector('input[type="checkbox"]');
      const quantityInput = itemDiv.querySelector('input[type="number"]');

      if (checkbox.checked) {
        const quantity = parseInt(quantityInput.value, 10);
        const price = Number(checkbox.value);

        totalPoints += quantity * price;
      }
    });

    totalPointsElement.textContent = totalPoints;
  }

  function disableUncheckedItems() {
    const checkboxes = document.querySelectorAll(
      "#itemList input[type='checkbox']"
    );
    checkboxes.forEach((checkbox) => {
      if (!checkbox.checked) {
        checkbox.disabled = true;
      }
    });
  }

  function enableUncheckedItems() {
    const checkboxes = document.querySelectorAll(
      "#itemList input[type='checkbox']"
    );
    checkboxes.forEach((checkbox) => {
      checkbox.disabled = false;
    });
  }

  // Fetch and render the items
  fetchItems();
});
