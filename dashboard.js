// Dashboard page

// if nobody is logged in, go back to the login page
var user = getLoggedInUser();
if (user == null) {
  window.location.href = "index.html";
}

var data = getData();
document.getElementById("user-name").innerText = "Logged in: " + user;

// ---------- helpers ----------
function today() {
  return new Date().toISOString().slice(0, 10);
}

function timeNow() {
  var d = new Date();
  return d.getHours() + ":" + String(d.getMinutes()).padStart(2, "0");
}

function getMemberName(id) {
  for (var i = 0; i < data.members.length; i++) {
    if (data.members[i].id == id) {
      return data.members[i].name;
    }
  }
  return "Deleted member";
}

function isExpired(member) {
  return member.expires < today();
}

function save() {
  saveData(data);
}

// ---------- navigation ----------
function showPage(name) {
  var pages = ["home", "members", "attendance", "schedule", "equipment", "settings"];
  for (var i = 0; i < pages.length; i++) {
    document.getElementById("page-" + pages[i]).style.display = "none";
    document.getElementById("nav-" + pages[i]).className = "";
  }
  document.getElementById("page-" + name).style.display = "block";
  document.getElementById("nav-" + name).className = "active";

  if (name == "home") showHome();
  if (name == "members") showMembers();
  if (name == "attendance") showAttendance();
  if (name == "schedule") showSchedule();
  if (name == "equipment") showEquipment();
  if (name == "settings") document.getElementById("set-capacity").value = data.capacity;
}

function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "index.html";
}

// ---------- dashboard ----------
function showHome() {
  var inside = 0;
  var todayCount = 0;
  var rows = "";

  for (var i = 0; i < data.checkins.length; i++) {
    var c = data.checkins[i];
    if (c.date == today()) todayCount++;
    if (c.out == "") {
      inside++;
      rows += "<tr><td>" + getMemberName(c.memberId) + "</td><td>" + c.in + "</td></tr>";
    }
  }
  if (rows == "") rows = "<tr><td colspan='2'>Nobody is inside right now</td></tr>";

  var activeMembers = 0;
  for (var j = 0; j < data.members.length; j++) {
    if (!isExpired(data.members[j])) activeMembers++;
  }

  var openTickets = 0;
  for (var k = 0; k < data.tickets.length; k++) {
    if (data.tickets[k].status != "Fixed") openTickets++;
  }

  var percent = Math.min(100, Math.round(inside / data.capacity * 100));
  document.getElementById("stat-inside").innerText = inside;
  document.getElementById("stat-capacity").innerText = "of " + data.capacity + " (" + percent + "% full)";
  document.getElementById("stat-bar").style.width = percent + "%";
  document.getElementById("stat-today").innerText = todayCount;
  document.getElementById("stat-members").innerText = activeMembers;
  document.getElementById("stat-tickets").innerText = openTickets;
  document.getElementById("home-inside").innerHTML = rows;
}

// ---------- members ----------
function showMembers() {
  var search = document.getElementById("m-search").value.toLowerCase();
  var rows = "";

  for (var i = 0; i < data.members.length; i++) {
    var m = data.members[i];
    if (m.name.toLowerCase().indexOf(search) == -1) continue;

    var status = "<span class='ok'>Active</span>";
    if (isExpired(m)) status = "<span class='expired'>Expired</span>";

    rows += "<tr>" +
      "<td>" + m.id + "</td>" +
      "<td>" + m.name + "<br><small>" + m.email + "</small></td>" +
      "<td>" + m.plan + "</td>" +
      "<td>" + m.expires + "</td>" +
      "<td>" + status + "</td>" +
      "<td><button onclick='renewMember(" + m.id + ")'>Renew</button>" +
      "<button class='red' onclick='deleteMember(" + m.id + ")'>Delete</button></td>" +
      "</tr>";
  }
  if (rows == "") rows = "<tr><td colspan='6'>No members found</td></tr>";
  document.getElementById("members-table").innerHTML = rows;
}

function daysForPlan(plan) {
  if (plan == "Day pass") return 1;
  if (plan == "Monthly") return 30;
  if (plan == "Semester") return 120;
  return 365;
}

function addDays(dateString, days) {
  var d = new Date(dateString);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function addMember() {
  var name = document.getElementById("m-name").value.trim();
  var email = document.getElementById("m-email").value.trim();
  var plan = document.getElementById("m-plan").value;

  if (name == "" || email == "") {
    alert("Please enter a name and email");
    return;
  }

  data.members.push({
    id: data.nextId,
    name: name,
    email: email,
    plan: plan,
    expires: addDays(today(), daysForPlan(plan))
  });
  data.nextId++;
  save();

  document.getElementById("m-name").value = "";
  document.getElementById("m-email").value = "";
  showMembers();
}

function renewMember(id) {
  for (var i = 0; i < data.members.length; i++) {
    var m = data.members[i];
    if (m.id == id) {
      // if still active, add to the current expiry date. otherwise start from today
      var start = m.expires > today() ? m.expires : today();
      m.expires = addDays(start, daysForPlan(m.plan));
    }
  }
  save();
  showMembers();
}

function deleteMember(id) {
  if (!confirm("Delete this member?")) return;
  var newList = [];
  for (var i = 0; i < data.members.length; i++) {
    if (data.members[i].id != id) newList.push(data.members[i]);
  }
  data.members = newList;
  save();
  showMembers();
}

// ---------- attendance ----------
function showAttendance() {
  // fill the dropdown
  var options = "";
  for (var i = 0; i < data.members.length; i++) {
    options += "<option value='" + data.members[i].id + "'>" + data.members[i].name + "</option>";
  }
  document.getElementById("a-member").innerHTML = options;

  // table, newest first
  var rows = "";
  for (var j = data.checkins.length - 1; j >= 0; j--) {
    var c = data.checkins[j];
    var out = c.out;
    var button = "";
    if (out == "") {
      out = "Still inside";
      button = "<button onclick='checkOut(" + j + ")'>Check out</button>";
    }
    rows += "<tr><td>" + getMemberName(c.memberId) + "</td><td>" + c.date + " " + c.in + "</td><td>" + out + "</td><td>" + button + "</td></tr>";
  }
  if (rows == "") rows = "<tr><td colspan='4'>No check-ins yet</td></tr>";
  document.getElementById("attendance-table").innerHTML = rows;
}

function checkIn() {
  var id = document.getElementById("a-member").value;
  if (id == "") {
    alert("Add a member first");
    return;
  }

  var member = null;
  for (var i = 0; i < data.members.length; i++) {
    if (data.members[i].id == id) member = data.members[i];
  }

  if (isExpired(member)) {
    alert(member.name + "'s membership has expired. Renew it first.");
    return;
  }

  // already inside?
  for (var j = 0; j < data.checkins.length; j++) {
    if (data.checkins[j].memberId == id && data.checkins[j].out == "") {
      alert(member.name + " is already inside");
      return;
    }
  }

  data.checkins.push({ memberId: member.id, date: today(), in: timeNow(), out: "" });
  save();
  showAttendance();
}

function checkOut(index) {
  data.checkins[index].out = timeNow();
  save();
  showAttendance();
}

// ---------- schedule ----------
function showSchedule() {
  var rows = "";
  for (var i = 0; i < data.sessions.length; i++) {
    var s = data.sessions[i];
    rows += "<tr>" +
      "<td>" + s.name + "</td>" +
      "<td>" + s.coach + "</td>" +
      "<td>" + s.date + "</td>" +
      "<td>" + s.time + "</td>" +
      "<td>" + s.booked + " / " + s.max + "</td>" +
      "<td><button onclick='bookSession(" + s.id + ")'>+1</button>" +
      "<button class='red' onclick='deleteSession(" + s.id + ")'>Delete</button></td>" +
      "</tr>";
  }
  if (rows == "") rows = "<tr><td colspan='6'>No sessions yet</td></tr>";
  document.getElementById("schedule-table").innerHTML = rows;
}

function addSession() {
  var name = document.getElementById("s-name").value.trim();
  var coach = document.getElementById("s-coach").value.trim();
  var date = document.getElementById("s-date").value;
  var time = document.getElementById("s-time").value;
  var max = parseInt(document.getElementById("s-max").value);

  if (name == "" || coach == "" || date == "" || time == "") {
    alert("Please fill in all the session details");
    return;
  }
  if (isNaN(max) || max < 1) {
    alert("Max people must be at least 1");
    return;
  }

  data.sessions.push({ id: Date.now(), name: name, coach: coach, date: date, time: time, booked: 0, max: max });
  save();
  document.getElementById("s-name").value = "";
  document.getElementById("s-coach").value = "";
  showSchedule();
}

function bookSession(id) {
  for (var i = 0; i < data.sessions.length; i++) {
    var s = data.sessions[i];
    if (s.id == id) {
      if (s.booked >= s.max) {
        alert("This session is full");
      } else {
        s.booked++;
      }
    }
  }
  save();
  showSchedule();
}

function deleteSession(id) {
  if (!confirm("Delete this session?")) return;
  var newList = [];
  for (var i = 0; i < data.sessions.length; i++) {
    if (data.sessions[i].id != id) newList.push(data.sessions[i]);
  }
  data.sessions = newList;
  save();
  showSchedule();
}

// ---------- equipment ----------
function showEquipment() {
  var rows = "";
  for (var i = 0; i < data.tickets.length; i++) {
    var t = data.tickets[i];
    var nextButton = "";
    if (t.status == "Open") nextButton = "<button onclick='changeStatus(" + t.id + ", \"In progress\")'>Start work</button>";
    if (t.status == "In progress") nextButton = "<button onclick='changeStatus(" + t.id + ", \"Fixed\")'>Mark fixed</button>";

    rows += "<tr>" +
      "<td>" + t.equipment + "</td>" +
      "<td>" + t.problem + "</td>" +
      "<td>" + t.status + "</td>" +
      "<td>" + nextButton + "<button class='red' onclick='deleteTicket(" + t.id + ")'>Delete</button></td>" +
      "</tr>";
  }
  if (rows == "") rows = "<tr><td colspan='4'>No faults logged</td></tr>";
  document.getElementById("equipment-table").innerHTML = rows;
}

function addTicket() {
  var name = document.getElementById("e-name").value.trim();
  var problem = document.getElementById("e-problem").value.trim();
  if (name == "" || problem == "") {
    alert("Please fill in both fields");
    return;
  }
  data.tickets.push({ id: Date.now(), equipment: name, problem: problem, status: "Open" });
  save();
  document.getElementById("e-name").value = "";
  document.getElementById("e-problem").value = "";
  showEquipment();
}

function changeStatus(id, newStatus) {
  for (var i = 0; i < data.tickets.length; i++) {
    if (data.tickets[i].id == id) data.tickets[i].status = newStatus;
  }
  save();
  showEquipment();
}

function deleteTicket(id) {
  var newList = [];
  for (var i = 0; i < data.tickets.length; i++) {
    if (data.tickets[i].id != id) newList.push(data.tickets[i]);
  }
  data.tickets = newList;
  save();
  showEquipment();
}

// ---------- settings ----------
function saveCapacity() {
  var cap = parseInt(document.getElementById("set-capacity").value);
  if (isNaN(cap) || cap < 1) {
    alert("Enter a number bigger than 0");
    return;
  }
  data.capacity = cap;
  save();
  alert("Saved");
}

function resetData() {
  if (!confirm("This puts all gym data back to the starting data. Continue?")) return;
  localStorage.removeItem("gymData");
  data = getData();
  showPage("home");
}

// start on the dashboard
showPage("home");
