/****************************
 * INIT
 ****************************/
document.addEventListener("DOMContentLoaded", () => {
  bindAssociateButton();
});

/****************************
 * POPULATE CONTACT DROPDOWN
 ****************************/
function populateContactsFromAPI(contactPersons) {
  const select = document.getElementById("contactSelect");
  if (!select || !Array.isArray(contactPersons)) return;

  select.innerHTML = `<option value="">Select Contact</option>`;

  contactPersons.forEach(cp => {
    // OPTIONAL: show only portal-enabled users
    // if (!cp.is_added_in_portal) return;

    const firstName = cp.first_name || "";
    const lastName  = cp.last_name || "";
    const email     = cp.email || "";

    let label = `${firstName} ${lastName}`.trim();
    if (email) label += ` - ${email}`;

    // Skip empty rows
    if (!label) return;

    const option = document.createElement("option");
    option.value = cp.contact_person_id; // IMPORTANT
    option.textContent = label;

    // Auto-select primary contact
    if (cp.is_primary_contact === true) {
      option.selected = true;
    }

    select.appendChild(option);
  });
}

/****************************
 * ASSOCIATE BUTTON
 ****************************/
function bindAssociateButton() {
  const btn = document.querySelector(".primary");
  const select = document.getElementById("contactSelect");

  if (!btn || !select) return;

  btn.addEventListener("click", () => {
    const selectedContactId = select.value;

    if (!selectedContactId) {
      alert("Please select a contact person");
      return;
    }

    const selectedLabel =
      select.options[select.selectedIndex].text;

    console.log("Selected Contact Person ID:", selectedContactId);
    console.log("Selected Contact Label:", selectedLabel);

    // 👉 NEXT STEP:
    // Call Zoho Inventory API to associate contact person
    // Example:
    // associateContactToTransaction(selectedContactId);
  });
}