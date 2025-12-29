/****************************
 * DROPDOWN DATA
 ****************************/
const customers = ["Abacus Pvt Ltd - aakash.dubey@interconnecta.com", "Interconnecta", "Zoho Corp", "Demo Customer"];
const contacts = ["Aakash Dubey", "Rahul Sharma", "Chris John", "Support Team"];
const locations = ["Abacus HQ"];
const paymentTerms = ["Due on Receipt", "Net 7", "Net 15", "Net 30"];
const deliveryMethods = ["Courier", "Pickup", "Transport", "Self Delivery"];

/****************************
 * INITIAL LOAD
 ****************************/
document.addEventListener("DOMContentLoaded", () => {
  populateSelect(".row select", {
    "Customer Name": customers,
    "Contact Person": contacts,
    "Location": locations,
    "Payment Terms": paymentTerms,
    "Delivery Method": deliveryMethods,
    "Warehouse Location": locations
  });

  initLineItems();
  initTotals();
  calculateTotals(); // initial calc
});

/****************************
 * POPULATE DROPDOWNS
 ****************************/
function populateSelect(selector, dataMap) {
  document.querySelectorAll(selector).forEach(select => {
    const label = select.closest(".row")?.querySelector("label")?.innerText || "";

    Object.keys(dataMap).forEach(key => {
      if (label.includes(key)) {
        select.innerHTML = `<option value="">Select</option>`;
        dataMap[key].forEach(v => {
          const opt = document.createElement("option");
          opt.value = v;
          opt.textContent = v;
          select.appendChild(opt);
        });
      }
    });
  });
}

/****************************
 * AMOUNT SANITIZER
 ****************************/
function sanitizeAmount(input) {
  input.value = input.value
    .replace(/[^0-9.-]/g, "")   // allow digits, dot, minus
    .replace(/(?!^)-/g, "")     // minus only at start
    .replace(/(\..*)\./g, "$1"); // single decimal
}

/****************************
 * LINE ITEMS
 ****************************/
function initLineItems() {
  document.querySelector(".item-actions button")
    ?.addEventListener("click", addRow);

  document.querySelector(".items tbody")
    .addEventListener("input", e => {
      if (e.target.tagName === "INPUT") {
        sanitizeAmount(e.target);
        calculateRow(e.target.closest("tr"));
        calculateTotals();
      }
    });

  document.querySelector(".items tbody")
    .addEventListener("click", e => {
      if (e.target.classList.contains("delete")) {
        e.target.closest("tr").remove();
        calculateTotals();
      }
    });
}

function addRow() {
  const tbody = document.querySelector(".items tbody");
  const row = document.createElement("tr");

  row.innerHTML = `
    <td class="item-cell">
      <input class="item-name" placeholder="Type or click to select an item">
      <textarea class="item-desc" placeholder="Description"></textarea>
    </td>
    <td><input class="amount-input" value="1"></td>
    <td><input class="amount-input" value="0"></td>
    <td><input class="amount-input" value="0"></td>
    <td class="amount">0.00</td>
    <td class="delete">✕</td>
  `;

  tbody.appendChild(row);
}

/****************************
 * CALCULATIONS
 ****************************/
function calculateRow(row) {
  const qty  = parseFloat(row.children[1].querySelector("input").value) || 0;
  const rate = parseFloat(row.children[2].querySelector("input").value) || 0;
  const disc = parseFloat(row.children[3].querySelector("input").value) || 0;

  let amount = qty * rate;
  amount -= (amount * disc) / 100;

  row.querySelector(".amount").textContent = amount.toFixed(2);
}

function calculateTotals() {
  let subtotal = 0;

  document.querySelectorAll(".amount").forEach(a => {
    subtotal += parseFloat(a.textContent) || 0;
  });

  // Sub Total
  document.getElementById("subTotal").textContent = subtotal.toFixed(2);

  // Shipping & Adjustment (PURE AMOUNT)
  const shipping   = parseFloat(document.getElementById("shipping").value) || 0;
  const adjustment = parseFloat(document.getElementById("adjustment").value) || 0;

  // Grand Total (Adjustment INCLUDED)
  const total = subtotal + shipping - adjustment;
  document.getElementById("grandTotal").textContent = total.toFixed(2);
}

/****************************
 * TOTAL INPUT LISTENERS
 ****************************/
function initTotals() {
  ["shipping", "adjustment"].forEach(id => {
    const el = document.getElementById(id);
    el?.addEventListener("input", () => {
      sanitizeAmount(el);
      calculateTotals();
    });
  });
}