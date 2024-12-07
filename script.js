document
  .getElementById("open-modal-btn")
  .addEventListener("click", function () {
    document.getElementById("modal").style.display = "flex"; // Show modal
  });

document.getElementById("modal").addEventListener("click", function (event) {
  // Close modal when clicking outside of the form (i.e., on the background)
  if (event.target === this) {
    document.getElementById("modal").style.display = "none";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Define the options for each dropdown
  const subjects = ["French", "English", "German", "Italian", "Spanish"];
  const instructors = ["MHB", "AN", "HM"];
  const salles = ["Salle 1", "Salle 2", "Salle 3", "Salle 4", "Salle 5"];

  // Get the select elements by their IDs
  const subjectSelect = document.getElementById("subject");
  const instructorSelect = document.getElementById("instructor");
  const salleSelect = document.getElementById("salle");

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
});

// Store already assigned gradient classes
const usedGradients = new Set();

// Store already existing subjects with time and salle
const existingSubjects = [];

// Listen for the change event on the filter dropdowns
document.getElementById("filter-day").addEventListener("change", applyFilters);
document.getElementById("filter-time").addEventListener("change", applyFilters);
document
  .getElementById("filter-class")
  .addEventListener("change", applyFilters);

function applyFilters() {
  const filterDay = document.getElementById("filter-day").value;
  const filterTime = document.getElementById("filter-time").value;
  const filterClass = document.getElementById("filter-class").value;

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

  // Now apply the row filters as well (based on the selected day, time, or class)
  const timetableRows = document.querySelectorAll("#timetable tbody tr");

  timetableRows.forEach((row) => {
    const timeCell = row.cells[0].textContent; // Time column
    const classCells = Array.from(row.cells).slice(1); // All day columns
    let showRow = true;

    // Apply the filter by time
    if (filterTime !== "all" && !timeCell.includes(filterTime)) {
      showRow = false; // Hide row if time doesn't match
    }

    // Apply the filter by class
    const subject = row.cells[1].querySelector(".item-div");
    if (
      filterClass !== "all" &&
      subject &&
      !subject.textContent.includes(filterClass)
    ) {
      showRow = false; // Hide row if subject doesn't match
    }

    // Loop through each day cell in the row and check if it contains content for the selected day
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
        (cell) => cell.style.display === "" && cell.textContent.trim() !== ""
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

    // Check if the subject already exists for the same time and salle
    if (isSubjectExisting(startTime, endTime, salle)) {
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

function isSubjectExisting(startTime, endTime, salle) {
  // Check if there is already a subject scheduled for the same time and salle
  return existingSubjects.some(
    (entry) =>
      entry.startTime === startTime &&
      entry.endTime === endTime &&
      entry.salle === salle
  );
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

  // Add the subject entry to the timetable if not already present
  if (rowExists) {
    selectedDays.forEach((day) => {
      const dayIndex = getDayIndex(day);
      const cellContent = targetRow.cells[dayIndex].innerHTML;
      if (cellContent) {
        targetRow.cells[
          dayIndex
        ].innerHTML += `<br><div class="item-div ${groupBackgroundColor}">${subject} ${salle} (${instructor})</div>`;
      } else {
        targetRow.cells[
          dayIndex
        ].innerHTML = `<div class="item-div ${groupBackgroundColor}">${subject} ${salle} (${instructor})</div>`;
      }
    });
  } else {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `<td class="case-time">${startTime} - ${endTime}</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>`;

    selectedDays.forEach((day) => {
      const dayIndex = getDayIndex(day);
      newRow.cells[
        dayIndex
      ].innerHTML = `<div class="item-div ${groupBackgroundColor}">${subject} ${salle} (${instructor})</div>`;
    });

    insertSortedRow(newRow, startTime, timetableBody);
  }

  // Add the time to the filter if not already present
  addTimeToFilter(startTime, endTime);
  // Add the time to the filter if not already present
  addclassToFilter(subject);

  // Store the subject entry in existingSubjects
  existingSubjects.push({ startTime, endTime, salle });
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

function getUniqueGradientColor() {
  // List of available gradient class names
  const gradientClasses = [
    "accent-pink-gradient",
    "accent-orange-gradient",
    "accent-green-gradient",
    "accent-cyan-gradient",
    "accent-blue-gradient",
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
