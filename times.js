let user1Times = [];
let user2Times = [];

function addUser1Availability() {
  const date = document.querySelector('.user1-date').value;
  const start = document.querySelector('.user1-start').value;
  const end = document.querySelector('.user1-end').value;

  if (date && start && end) {
    user1Times.push({ date, start, end });
    displayUser1Slots();
    clearUser1Inputs();
  } else {
    alert('Please fill in all fields before adding another slot.');
  }
}

function addUser2Availability() {
  const date = document.querySelector('.user2-date').value;
  const start = document.querySelector('.user2-start').value;
  const end = document.querySelector('.user2-end').value;

  if (date && start && end) {
    user2Times.push({ date, start, end });
    displayUser2Slots();
    clearUser2Inputs();
  } else {
    alert('Please fill in all fields before adding another slot.');
  }
}

function clearUser1Inputs() {
  document.querySelector('.user1-date').value = '';
  document.querySelector('.user1-start').value = '';
  document.querySelector('.user1-end').value = '';
}

function clearUser2Inputs() {
  document.querySelector('.user2-date').value = '';
  document.querySelector('.user2-start').value = '';
  document.querySelector('.user2-end').value = '';
}

function displayUser1Slots() {
  const slotList = document.getElementById('user1-slot-list');
  slotList.innerHTML = ''; // Clear current list

  user1Times.forEach((slot, index) => {
    const li = document.createElement('li');
    li.textContent = `${slot.date}: ${slot.start} - ${slot.end}`;
    slotList.appendChild(li);
  });
}

function displayUser2Slots() {
  const slotList = document.getElementById('user2-slot-list');
  slotList.innerHTML = ''; // Clear current list

  user2Times.forEach((slot, index) => {
    const li = document.createElement('li');
    li.textContent = `${slot.date}: ${slot.start} - ${slot.end}`;
    slotList.appendChild(li);
  });
}

function findMeetingTime() {
  if (user1Times.length === 0 || user2Times.length === 0) {
    alert('Both users must add at least one availability slot.');
    return;
  }

  const overlaps = [];

  // Loop through both users' times and check for overlaps
  user1Times.forEach(u1 => {
    user2Times.forEach(u2 => {
      if (u1.date === u2.date) {
        // Check if the times overlap on the same date
        const u1StartTime = convertToMinutes(u1.start);
        const u1EndTime = convertToMinutes(u1.end);
        const u2StartTime = convertToMinutes(u2.start);
        const u2EndTime = convertToMinutes(u2.end);

        const overlapStart = Math.max(u1StartTime, u2StartTime);
        const overlapEnd = Math.min(u1EndTime, u2EndTime);

        if (overlapStart < overlapEnd) {
          overlaps.push({
            date: u1.date,
            start: convertToTimeFormat(overlapStart),
            end: convertToTimeFormat(overlapEnd)
          });
        }
      }
    });
  });

  displayResults(overlaps);
}

function displayResults(overlaps) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = ''; // Clear previous result

  if (overlaps.length === 0) {
    resultDiv.textContent = 'No suitable meeting time found.';
  } else {
    let resultText = 'Suitable meeting times:\n';
    overlaps.forEach(overlap => {
      resultText += `On ${overlap.date} from ${overlap.start} to ${overlap.end}\n`;
    });
    resultDiv.textContent = resultText;
  }
}

// Helper function to convert time (HH:MM) to minutes
function convertToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Helper function to convert minutes back to HH:MM format
function convertToTimeFormat(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}