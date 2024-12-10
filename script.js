document.addEventListener("DOMContentLoaded", function () {
  let selectedItem = null;

  // Open "Add Subject" modal
  document
    .getElementById("open-modal-btn")
    .addEventListener("click", function () {
      document.getElementById("modal").style.display = "flex"; // Show modal
    });

  // Close the "Add Subject" modal when clicking outside
  document.getElementById("modal").addEventListener("click", function (event) {
    if (event.target === this) {
      document.getElementById("modal").style.display = "none"; // Close modal
    }
  });

  // Add click event to each subject div for opening the edit modal
  document.querySelectorAll(".item-div").forEach((item) => {
    item.addEventListener("click", function () {
      console.log(item.id);
      selectedItem = item; // Set the selected item to the clicked div

      // Pre-fill the modal fields with the selected subject's data
      const subjectName = item.querySelector(".subject-name").textContent;
      const subjectSalle = item.querySelector(".subject-salle").textContent;

      // Fill the modal inputs
      // document.getElementById("subject").value = subjectName;
      // document.getElementById("salle").value = subjectSalle;

      // Display the "Edit Modal"
      document.getElementById("modaledit").style.display = "flex";
    });
  });

  // Close "Edit Modal" when clicking outside
  document
    .getElementById("modaledit")
    .addEventListener("click", function (event) {
      if (event.target === this) {
        document.getElementById("modaledit").style.display = "none"; // Close modal
      }
    });

  // Handle Edit Button click to update the selected item
  document.getElementById("edit-button").addEventListener("click", function () {
    if (!selectedItem) return; // No item selected

    const newSubject = document.getElementById("subject").value;
    const newSalle = document.getElementById("salle").value;

    // Update the subject name and salle in the selected item
    selectedItem.querySelector(".subject-name").textContent = newSubject;
    selectedItem.querySelector(".subject-salle").textContent = newSalle;

    // Close the edit modal
    document.getElementById("modaledit").style.display = "none";
  });

  // Handle Delete Button click to remove the selected item
  document
    .getElementById("delete-button")
    .addEventListener("click", function () {
      if (!selectedItem) return; // No item selected

      // Remove the selected item from the timetable
      selectedItem.remove();

      // Close the edit modal
      document.getElementById("modaledit").style.display = "none";
    });

  // Define the options for each dropdown
  const subjects = ["French", "English", "German", "Italian", "Spanish"];
  const instructors = ["MHB", "AN", "HM"];
  const salles = ["Salle 1", "Salle 2", "Salle 3", "Salle 4", "Salle 5"];

  // Get the select elements by their IDs
  const subjectSelect = document.getElementById("subject");
  const instructorSelect = document.getElementById("instructor");
  const salleSelect = document.getElementById("salle");
  const editsalleSelect = document.getElementById("edit-salle");

  // Function to populate a select element with options
  function populateSelect(selectElement, options) {
    selectElement.innerHTML = ""; // Clear any existing options
    options.forEach(function (option) {
      const optionElement = document.createElement("option");
      optionElement.value = option;
      optionElement.textContent = option;
      selectElement.appendChild(optionElement);
    });
  }

  // Populate the select elements with their respective options
  populateSelect(subjectSelect, subjects);
  populateSelect(instructorSelect, instructors);
  populateSelect(salleSelect, salles);
  populateSelect(editsalleSelect, salles);
});

// Store already assigned gradient classes
const usedGradients = new Set();

// Store already existing subjects with time and salle
const existingSubjects = [];

// Print Button Functionality
document.getElementById("print-button").addEventListener("click", function () {
  const printWindow = window.open("", "", "width=800,height=600");
  const timetableContent = document.querySelector("#timetable").outerHTML;

  printWindow.document.write(`
          <html>
            <head>
             <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap"
      rel="stylesheet"
    />
   
         
               <style>
               .case-time {
  color: #546e7a;
  background-color: #eceff1;
  padding :10;
}
.timetable {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.timetable th {
  padding: 12px;
  text-align: center;
  border: 1px solid #ddd;
}

.timetable td {

  text-align: center;
  border: 1px solid #ddd;
}

.timetable th {
  background-color: #ffffff;
  color: #546e7a;
  font-weight: 500;
}


.container {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  width: 100%;
  height: fit-content;
}
 .item-div {
  color: black;
  border: 1px solid black;
   padding: 5px 10px;
}
  /* Reset all default margins, paddings, and set box-sizing */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Body Styling */
body {
  font-family: "Poppins", sans-serif; /* Set Poppins as default font */
  background-color: #eceff1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

}</style>
            </head>
            <body>
         
              ${timetableContent}
            </body>
          </html>
        `);

  printWindow.document.close();
  printWindow.print();
});

// Listen for the change event on the filter dropdowns
document.getElementById("filter-day").addEventListener("change", applyFilters);
document.getElementById("filter-time").addEventListener("change", applyFilters);
document
  .getElementById("filter-class")
  .addEventListener("change", applyFilters);
document
  .getElementById("filter-instructor")
  .addEventListener("change", applyFilters);

function applyFilters() {
  const filterDay = document.getElementById("filter-day").value;
  const filterTime = document.getElementById("filter-time").value;
  const filterClass = document.getElementById("filter-class").value;
  const filterInstructor = document.getElementById("filter-instructor").value;

  const headerCells = document.querySelectorAll("#timetable thead th");

  // Loop through each header cell to show/hide based on the selected day filter
  headerCells.forEach((headerCell) => {
    const day = headerCell.getAttribute("data-day");

    if (day) {
      if (filterDay === "all" || filterDay === day) {
        headerCell.style.display = ""; // Show the header for this day
      } else {
        headerCell.style.display = "none"; // Hide the header for this day
      }
    }
  });

  // Now apply the row filters as well (based on the selected day, time, class, or instructor)
  const timetableRows = document.querySelectorAll("#timetable tbody tr");

  timetableRows.forEach((row) => {
    const timeCell = row.cells[0].textContent; // Time column
    const classCells = Array.from(row.cells).slice(1); // All day columns
    let showRow = true;

    // Apply the filter by time
    if (filterTime !== "all" && !timeCell.includes(filterTime)) {
      showRow = false; // Hide row if time doesn't match
    }

    // Apply the filter by instructor (new filter added here)
    const subjectCells = Array.from(classCells); // All cells excluding time
    subjectCells.forEach((cell) => {
      const subjectDivs = cell.querySelectorAll(".item-div"); // All subject divs in the cell
      let anySubjectVisible = false; // Flag to check if at least one subject is visible

      // Loop through all subjects in the cell and only show the matching subject
      subjectDivs.forEach((subjectDiv) => {
        const subjectInstructor = subjectDiv.querySelector(
          ".subject-instructor"
        ); // Find the instructor for this item
        const instructorText = subjectInstructor
          ? subjectInstructor.textContent
          : "";

        if (
          (filterInstructor === "all" ||
            instructorText.includes(filterInstructor)) &&
          (filterClass === "all" ||
            subjectDiv.textContent.includes(filterClass))
        ) {
          subjectDiv.style.display = ""; // Show this subject if it matches instructor and class
          anySubjectVisible = true; // Mark that we have at least one matching subject
        } else {
          subjectDiv.style.display = "none"; // Hide this subject if it doesn't match
        }
      });

      // If no subject is displayed in the cell, hide the cell
      if (!anySubjectVisible) {
        cell.style.display = "none"; // Hide the entire cell if no subject is displayed
      } else {
        cell.style.display = ""; // Show the cell if at least one subject is displayed
      }
    });

    // Apply the filter by day (already implemented correctly)
    classCells.forEach((cell, index) => {
      const dayName = headerCells[index + 1].getAttribute("data-day"); // Get the day name from the header
      if (filterDay !== "all" && dayName !== filterDay) {
        cell.style.display = "none"; // Hide the cell if it's not the selected day
      } else {
        cell.style.display = ""; // Show the cell if it matches the selected day
      }
    });

    // If all day cells for the selected day are empty, hide the row
    showRow =
      showRow &&
      classCells.some(
        (cell) =>
          cell.style.display !== "none" && cell.textContent.trim() !== ""
      );

    row.style.display = showRow ? "table-row" : "none";
  });
}

document
  .getElementById("timetable-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const startTime = document.getElementById("start-time").value;
    const endTime = document.getElementById("end-time").value;
    // Get the selected values from the dropdowns
    const subject = document.getElementById("subject").value;
    const instructor = document.getElementById("instructor").value;
    const salle = document.getElementById("salle").value;
    const selectedDays = getSelectedDays();

    // Check if the start time is later than the end time
    if (startTime >= endTime) {
      alert("Start time cannot be later than or equal to the end time.");
      return; // Stop form submission
    }
    console.log(selectedDays, " salle : ", salle, " date ", startTime, endTime);
    // Check if the subject already exists for the same time and salle
    if (isSubjectExisting(startTime, endTime, salle, selectedDays)) {
      alert("This subject is already scheduled at the same time and salle.");
      return; // Stop form submission
    }

    if (
      subject &&
      instructor &&
      salle &&
      startTime &&
      endTime &&
      selectedDays.length > 0
    ) {
      addTimetableEntry(
        subject,
        instructor,
        salle,
        startTime,
        endTime,
        selectedDays
      );
    } else {
      alert("Please fill in all the fields.");
    }

    document.getElementById("modal").style.display = "none"; // Close modal after submission
  });

function getSelectedDays() {
  const days = document.querySelectorAll(
    '#days input[type="checkbox"]:checked'
  );
  return Array.from(days).map((day) => day.value);
}
function getSelectededitDays() {
  const days = document.querySelectorAll(
    '#edit-days input[type="checkbox"]:checked'
  );
  return Array.from(days).map((day) => day.value);
}

function isSubjectExisting(startTime, endTime, salle, selectedDays) {
  // Ensure existingSubjects is an array
  if (!Array.isArray(existingSubjects)) {
    console.error("existingSubjects is not an array");
    return false; // Return false to avoid errors
  }

  // Check if there is already a subject scheduled for the same time, salle, and days
  return existingSubjects.some((entry) => {
    // Ensure entry.selectedDays is an array
    if (!Array.isArray(entry.selectedDays) || entry.selectedDays.length === 0) {
      console.error(
        "entry.selectedDays is not a valid array:",
        entry.selectedDays
      );
      return false; // Skip this entry if it's invalid
    }

    // Check for overlap in the selected days
    const daysOverlap = entry.selectedDays.some((day) =>
      selectedDays.includes(day)
    );
    return (
      entry.startTime === startTime &&
      entry.endTime === endTime &&
      entry.salle === salle &&
      daysOverlap // Check if there's any overlap in the selected days
    );
  });
}

function addTimetableEntry(
  subject,
  instructor,
  salle,
  startTime,
  endTime,
  selectedDays
) {
  const timetableBody = document.querySelector("#timetable tbody");
  let rowExists = false;
  let targetRow;

  // Generate a unique identifier for each combination of subject, instructor, and salle
  const uniqueGroup = `${subject}-${instructor}-${salle}`;
  const groupBackgroundColor = getUniqueGradientColor(); // Get a unique gradient color for the group

  Array.from(timetableBody.rows).forEach((row) => {
    const rowTime = row.cells[0].textContent;
    if (rowTime === `${startTime} - ${endTime}`) {
      rowExists = true;
      targetRow = row;
    }
  });

  if (rowExists) {
    selectedDays.forEach((day) => {
      const dayIndex = getDayIndex(day);
      const cellContent = targetRow.cells[dayIndex].innerHTML;

      if (!cellContent.includes(salle)) {
        // Avoid inserting duplicates
        const uniqueID = `item-${subject}-${salle}-${startTime}-${endTime}-${day}-${Date.now()}`;
        targetRow.cells[
          dayIndex
        ].innerHTML += `<div id="${uniqueID}" class="item-div ${groupBackgroundColor}">
            <div class="name"><label class="subject-name">${subject}</label><label class="subject-instructor">(${instructor})</label></div>
            <label class="subject-salle">${salle}</label></div>`;
      }
    });
    addclassToFilter(subject);
    addinstructorToFilter(instructor);
    // Attach click event listener for opening edit modal
    // Reattach event listeners after adding or editing subjects
    attachEditModalListeners();
  } else {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `<td class="case-time">${startTime} - ${endTime}</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>`;

    selectedDays.forEach((day) => {
      const dayIndex = getDayIndex(day);
      const uniqueID = `item-${subject}-${salle}-${startTime}-${endTime}-${day}-${Date.now()}`;
      newRow.cells[
        dayIndex
      ].innerHTML = `<div id="${uniqueID}" class="item-div ${groupBackgroundColor}"><div class="name" ><label class="subject-name">${subject}</label><label class="subject-instructor">(${instructor})</label></div> <label class="subject-salle">${salle}</label></div>`;
    });

    insertSortedRow(newRow, startTime, timetableBody);
    addclassToFilter(subject);
    addinstructorToFilter(instructor);

    // Attach click event listener for opening edit modal
    // Reattach event listeners after adding or editing subjects
    attachEditModalListeners();
  }

  function attachEditModalListeners() {
    // Add the time to the filter if not already present
    addTimeToFilter(startTime, endTime);
    // Add the time to the filter if not already present

    // Store the subject entry in existingSubjects
    existingSubjects.push({ startTime, endTime, salle });
  }

  document.querySelectorAll(".item-div").forEach((item) => {
    item.addEventListener("click", function () {
      console.log(item.id);
      selectedItem = item; // Set the selected item to the clicked div
      const subjectName = item.querySelector(".subject-name").textContent;
      const subjectSalle = item.querySelector(".subject-salle").textContent;

      // Fill the modal inputs
      document.getElementById("subject").value = subjectName;
      document.getElementById("salle").value = subjectSalle;

      // Display the "Edit Modal"
      document.getElementById("modaledit").style.display = "flex";
    });
  });

  // Handle Delete Button click to remove the selected item
  document
    .getElementById("delete-button")
    .addEventListener("click", function () {
      if (!selectedItem) return; // No item selected

      // Remove the selected item from the timetable
      selectedItem.remove();

      // Close the edit modal
      document.getElementById("modaledit").style.display = "none";
    });

  // Handle Edit Button click to update the selected item
  document.getElementById("edit-button").addEventListener("click", function () {
    if (!selectedItem) return; // No item selected

    // Populate the edit modal fields
    document.getElementById("edit-start-time").value = ""; // Set this to current start time
    document.getElementById("edit-end-time").value = ""; // Set this to current end time
    // Reset checkboxes
    document
      .querySelectorAll("#edit-days input[type='checkbox']")
      .forEach((checkbox) => {
        checkbox.checked = false; // Reset all checkboxes
      });
    const subjectName = selectedItem.querySelector(".subject-name").textContent;
    const subjectSalle =
      selectedItem.querySelector(".subject-salle").textContent;
    const subjectinstructor = selectedItem.querySelector(
      ".subject-instructor"
    ).textContent;
    document.getElementById("subjet-edit-name").textContent = subjectName;
    document.getElementById("subjet-edit-salle").textContent = subjectSalle;
    // Close the edit modal
    document.getElementById("modaledit").style.display = "none";
    document.getElementById("modaleditsubject").style.display = "grid";
  });

  // Cancel button functionality
  document
    .getElementById("cancel-edit-button")
    .addEventListener("click", function () {
      document.getElementById("modaleditsubject").style.display = "none"; // Close edit modal without saving
    });
  document
    .getElementById("save-edit-button")
    .addEventListener("click", function () {
      if (!selectedItem) return; // No item selected

      // Get the new values from the edit modal
      const subjectNameedit = document.getElementById("subject").value;
      const subjectSalleedit = document.getElementById("edit-salle").value;
      const startTimeedit = document.getElementById("edit-start-time").value;
      const endTimeedit = document.getElementById("edit-end-time").value;
      const selectedDaysedit = getSelectededitDays();

      // Ensure the subject is valid before proceeding
      if (
        subjectNameedit &&
        subjectSalleedit &&
        startTimeedit &&
        endTimeedit &&
        selectedDaysedit.length > 0
      ) {
        // Check if the start time is later than the end time
        if (startTimeedit >= endTimeedit) {
          alert("Start time cannot be later than or equal to the end time.");
          return; // Stop form submission
        }
        // Check if the subject already exists for the same time and salle
        if (
          isSubjectExisting(
            startTimeedit,
            endTimeedit,
            subjectSalleedit,
            selectedDaysedit
          )
        ) {
          alert(
            "This subject is already scheduled at the same time and salle."
          );
          return; // Stop form submission
        }

        // Remove the old subject (selected item)
        selectedItem.remove();

        // Add the new subject with the updated time and days
        addTimetableEntry(
          subjectNameedit,
          document.getElementById("instructor").value, // Assuming instructor is also updated
          subjectSalleedit,
          startTimeedit,
          endTimeedit,
          selectedDaysedit
        );

        // Close the edit modal after saving
        document.getElementById("modaleditsubject").style.display = "none";
      } else {
        alert("Please fill in all the fields.");
      }
    });
}

function addTimeToFilter(startTime, endTime) {
  const filterTime = document.getElementById("filter-time");

  // Create a new time option
  const timeOption = `${startTime} - ${endTime}`;

  // Check if the option already exists
  let optionExists = false;
  Array.from(filterTime.options).forEach((option) => {
    if (option.value === timeOption) {
      optionExists = true;
    }
  });

  // If the time doesn't exist, add it as a new option
  if (!optionExists) {
    const newOption = document.createElement("option");
    newOption.value = timeOption;
    newOption.textContent = timeOption;
    filterTime.appendChild(newOption);
  }
}

function addclassToFilter(subject) {
  const filterclass = document.getElementById("filter-class");

  // Create a new time option
  const subjectOption = `${subject}`;

  // Check if the option already exists
  let optionExists = false;
  Array.from(filterclass.options).forEach((option) => {
    if (option.value === subjectOption) {
      optionExists = true;
    }
  });

  // If the time doesn't exist, add it as a new option
  if (!optionExists) {
    const newOption = document.createElement("option");
    newOption.value = subjectOption;
    newOption.textContent = subjectOption;
    filterclass.appendChild(newOption);
  }
}
function addinstructorToFilter(instructor) {
  const filterinstructor = document.getElementById("filter-instructor");

  // Create a new time option
  const instructorOption = `${instructor}`;

  // Check if the option already exists
  let optionExists = false;
  Array.from(filterinstructor.options).forEach((option) => {
    if (option.value === instructorOption) {
      optionExists = true;
    }
  });

  // If the time doesn't exist, add it as a new option
  if (!optionExists) {
    const newOption = document.createElement("option");
    newOption.value = instructorOption;
    newOption.textContent = instructorOption;
    filterinstructor.appendChild(newOption);
  }
}

function getUniqueGradientColor() {
  // List of available gradient class names
  const gradientClasses = [
    "accent-pink-gradient",
    "accent-blue-gradient",
    "accent-orange-gradient",
    "accent-green-gradient",
    "accent-cyan-gradient",

    "accent-purple-gradient",
  ];

  // Find the first available gradient that hasn't been used
  for (let gradient of gradientClasses) {
    if (!usedGradients.has(gradient)) {
      usedGradients.add(gradient); // Mark this gradient as used
      return gradient;
    }
  }

  // If all gradients are used, reset and reuse the gradients from the beginning
  usedGradients.clear(); // Clear the set to allow all gradients to be used again
  usedGradients.add(gradientClasses[0]); // Mark the first one as used
  return gradientClasses[0]; // Return the first gradient
}

function insertSortedRow(newRow, startTime, timetableBody) {
  const existingRows = Array.from(timetableBody.rows);

  if (existingRows.length === 0) {
    timetableBody.appendChild(newRow);
  } else {
    let inserted = false;
    for (let i = 0; i < existingRows.length; i++) {
      const rowTime = existingRows[i].cells[0].textContent.split(" - ")[0];
      if (compareTimes(startTime, rowTime)) {
        timetableBody.insertBefore(newRow, existingRows[i]);
        inserted = true;
        break;
      }
    }

    if (!inserted) {
      timetableBody.appendChild(newRow);
    }
  }
}

function compareTimes(time1, time2) {
  return time1 < time2;
}

function getDayIndex(day) {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return days.indexOf(day) + 1;
}
