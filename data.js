// Saves and loads everything from localStorage

// ---------- users ----------
function getUsers() {
  var users = localStorage.getItem("users");
  if (users == null) {
    // first time: make a default admin account
    users = [{ username: "admin", email: "admin@campusfit.com", password: "admin123" }];
    localStorage.setItem("users", JSON.stringify(users));
    return users;
  }
  return JSON.parse(users);
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// ---------- gym data ----------
function getData() {
  var data = localStorage.getItem("gymData");
  if (data == null) {
    data = {
      capacity: 30,
      nextId: 6,
      members: [
        { id: 1, name: "Thabo Mokoena", email: "thabo@student.ac.za", plan: "Monthly", expires: "2026-12-01" },
        { id: 2, name: "Lerato Dlamini", email: "lerato@student.ac.za", plan: "Semester", expires: "2027-02-15" },
        { id: 3, name: "Sipho Nkosi", email: "sipho@student.ac.za", plan: "Monthly", expires: "2026-10-01" },
        { id: 4, name: "Naledi Khumalo", email: "naledi@student.ac.za", plan: "Annual", expires: "2027-06-30" },
        { id: 5, name: "Kagiso Molefe", email: "kagiso@student.ac.za", plan: "Day pass", expires: "2026-10-28" }
      ],
      checkins: [],
      sessions: [
        { id: 1, name: "Morning conditioning", coach: "Coach Hayes", date: "2026-10-28", time: "06:00", booked: 12, max: 30 },
        { id: 2, name: "Lunch HIIT", coach: "Naledi K.", date: "2026-10-28", time: "12:30", booked: 17, max: 20 }
      ],
      tickets: [
        { id: 1, equipment: "Treadmill 14", problem: "Belt slipping", status: "Open" }
      ]
    };
    localStorage.setItem("gymData", JSON.stringify(data));
    return data;
  }
  return JSON.parse(data);
}

function saveData(data) {
  localStorage.setItem("gymData", JSON.stringify(data));
}

// ---------- login check ----------
function getLoggedInUser() {
  return localStorage.getItem("loggedIn");
}
