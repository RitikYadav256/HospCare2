document.getElementById("currentDate").textContent = new Date().toLocaleDateString();

// Medicine Search Functionality
document.getElementById("medicineSearch").addEventListener("input", function () {
  const searchQuery = this.value.toLowerCase();
  const rows = document.querySelectorAll("#medicineTable tr");

  rows.forEach(row => {
    const medicineName = row.cells[0].textContent.toLowerCase();
    row.style.display = medicineName.includes(searchQuery) ? "" : "none";
  });
});

const addButtons = document.querySelectorAll(".add-btn");
const patientTable = document.getElementById("patientTable");
const totalCostElement = document.getElementById("totalCost");
const payButton = document.getElementById("payButton");

function isMedicineAdded(medicineName) {
  const rows = patientTable.getElementsByTagName("tr");
  for (let row of rows) {
    if (row.cells.length > 0 && row.cells[0].innerText === medicineName) {
      return row;
    }
  }
  return null;
}
function updateTotalCost() {
  let total = -2004;
  const rows = patientTable.querySelectorAll("tbody tr");

  rows.forEach(row => {
    const priceCell = row.cells[2];
    if (priceCell && !isNaN(parseFloat(priceCell.innerText))) {
      total += parseFloat(priceCell.innerText);
    }
  });

  totalCostElement.innerText = total.toFixed(2);
  payButton.classList.toggle("d-none", total <= 0);
}

addButtons.forEach(button => {
  button.addEventListener("click", function () {
    const row = this.parentElement.parentElement;
    const medicineName = row.cells[0].innerText;
    const quantityInput = row.cells[1].querySelector("input");
    const costPerUnit = parseFloat(row.cells[2].innerText);

    let quantity = parseInt(quantityInput.value);
    if (isNaN(quantity) || quantity < 1) {
      alert("Please enter a valid quantity.");
      return;
    }

    let existingRow = isMedicineAdded(medicineName);
    if (existingRow) {
      let existingQuantity = parseInt(existingRow.cells[1].innerText);
      let newQuantity = existingQuantity + quantity;
      existingRow.cells[1].innerText = newQuantity;
      existingRow.cells[2].innerText = (newQuantity * costPerUnit).toFixed(2);
    } else {
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
            <td>${medicineName}</td>
            <td>${quantity}</td>
            <td>${(quantity * costPerUnit).toFixed(2)}</td>
            <td><button class="btn btn-danger btn-sm remove-btn">Remove</button></td>
          `;
      patientTable.querySelector("tbody").appendChild(newRow);
      newRow.querySelector(".remove-btn").addEventListener("click", function () {
        newRow.remove();
        updateTotalCost();
      });
    }

    quantityInput.value = "";
    updateTotalCost();
  });
});

payButton.addEventListener("click", function () {
  alert("Payment successful! Total: ₹" + totalCostElement.innerText);
});