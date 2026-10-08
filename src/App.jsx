import { useState,useEffect } from "react";
import "./App.css";

const KEY = "students";
const ADMIN = { email: "admin@example.com", password: "admin123" };

const getUsers = () => JSON.parse(localStorage.getItem(KEY) || "[]");
const saveUsers = users =>
  localStorage.setItem(KEY, JSON.stringify(users));

const age = dob => {
  const d = new Date(dob), t = new Date();
  let a = t.getFullYear() - d.getFullYear();
  if (
    t.getMonth() < d.getMonth() ||
    (t.getMonth() === d.getMonth() && t.getDate() < d.getDate())
  ) a--;
  return a;
};

function App() {
  const [page, setPage] = useState("login");
  const [users, setUsers] = useState(getUsers);
  const [current, setCurrent] = useState(
    Number(localStorage.getItem("studentId"))
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const go = p => {
    setPage(p);
    setError("");
    setSuccess("");
  };

  const updateUsers = data => {
    setUsers(data);
    saveUsers(data);
  };

  /* ---------- REGISTER ---------- */

  const register = e => {
    e.preventDefault();

    const f = new FormData(e.target);
    const email = f.get("email").trim().toLowerCase();
    const users = getUsers();

    if (users.some(u => u.email === email)) {
      setError("This email is already registered.");
      return;
    }

    const file = f.get("aadhaar");

    if (!file || !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Aadhaar document must be PDF.");
      return;
    }

    const user = {
      id: Date.now(),
      name: f.get("name"),
      email,
      password: f.get("password"),
      dob: f.get("dob"),
      gender: f.get("gender"),
      qualification: f.get("qualification"),
      interests: f.getAll("interest"),
      className: f.get("className"),
      subject: f.get("subject"),
      marks: f.get("marks"),
      aadhaar: file.name
    };

    updateUsers([...users, user]);
    e.target.reset();
    setSuccess("Registration successful. Please login.");
  };

  /* ---------- LOGIN ---------- */

  const login = e => {
    e.preventDefault();

    const f = new FormData(e.target);
    const email = f.get("email").trim().toLowerCase();
    const password = f.get("password");

    if (email === ADMIN.email && password === ADMIN.password) {
      localStorage.setItem("role", "admin");
      go("admin");
      return;
    }

    const user = getUsers().find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      setError("Invalid email or password.");
      return;
    }

    localStorage.setItem("role", "student");
    localStorage.setItem("studentId", user.id);
    setCurrent(user.id);
    go("student");
  };

  /* ---------- FORGOT PASSWORD ---------- */

  const forgot = e => {
    e.preventDefault();

    const f = new FormData(e.target);
    const email = f.get("email").trim().toLowerCase();
    const password = f.get("newPassword");

    const users = getUsers();
    const index = users.findIndex(u => u.email === email);

    if (index === -1) {
      setError("No account found with this email.");
      return;
    }

    users[index].password = password;
    updateUsers(users);

    setSuccess("Password reset successful. Please login.");
    setTimeout(() => go("login"), 800);
  };

  /* ---------- LOGOUT ---------- */

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("studentId");
    setCurrent(null);
    go("login");
  };

  /* ---------- STUDENT ---------- */

  const student = users.find(u => u.id === current);

  /* ---------- LOGIN PAGE ---------- */

  if (page === "login")
    return (
      <Layout go={go} logout={logout}>
        <Card title="Account Login">
          <Message error={error} success={success} />

          <form onSubmit={login}>
            <Input name="email" type="email" label="Email Address" />
            <Input name="password" type="password" label="Password" />

            <button>Login</button>
          </form>

          <a onClick={() => go("forgot")}>Forgot Password?</a>

          <p>
            New student?{" "}
            <a onClick={() => go("signup")}>Create Account</a>
          </p>

          <small>Admin: admin@example.com / admin123</small>
        </Card>
      </Layout>
    );

  /* ---------- SIGNUP ---------- */

  if (page === "signup")
    return (
      <Layout go={go} logout={logout}>
        <Card title="Student Signup Form">
          <Message error={error} success={success} />

          <form onSubmit={register}>
            <div className="grid">
              <Input name="name" label="Name" />
              <Input name="email" type="email" label="Email" />
              <Input name="password" type="password" label="Password" />
              <Input name="dob" type="date" label="Date of Birth" />

              <div>
                <label>Gender *</label>
                <Options
                  name="gender"
                  values={["Male", "Female", "Other"]}
                />
              </div>

              <Select
                name="qualification"
                label="Qualification"
                values={[
                  "High School",
                  "Diploma",
                  "Bachelor's",
                  "Master's"
                ]}
              />

              <Input name="className" label="Class" />
              <Input name="subject" label="Subject" />
              <Input name="marks" type="number" label="Marks" />
            </div>

            <label>Interests</label>

            <Options
              name="interest"
              values={["Coding", "Design", "Gaming", "Sports"]}
              check
            />

            <Input
              name="aadhaar"
              type="file"
              label="Aadhaar Document"
              accept=".pdf"
            />

            <button>Register</button>
          </form>

          <a onClick={() => go("login")}>Back to Login</a>
        </Card>
      </Layout>
    );

  /* ---------- FORGOT PASSWORD ---------- */

  if (page === "forgot")
    return (
      <Layout go={go} logout={logout}>
        <Card title="Forgot Password">
          <Message error={error} success={success} />

          <form onSubmit={forgot}>
            <Input
              name="email"
              type="email"
              label="Registered Email"
            />

            <Input
              name="newPassword"
              type="password"
              label="New Password"
            />

            <button>Reset Password</button>
          </form>

          <a onClick={() => go("login")}>Back to Login</a>
        </Card>
      </Layout>
    );

  /* ---------- STUDENT DASHBOARD ---------- */

  if (page === "student" && student)
    return (
      <Layout go={go} logout={logout}>
        <main className="wide">
          <div className="welcome">
            Welcome, {student.name} (User ID: #{student.id})
          </div>

          <div className="box">
            <h2>Student Profile</h2>

            <p><b>Email:</b> {student.email} 🔒</p>
            <p><b>Date of Birth:</b> {student.dob}</p>
            <p><b>Gender:</b> {student.gender}</p>
            <p><b>Qualification:</b> {student.qualification}</p>
            <p>
              <b>Interests:</b>{" "}
              {student.interests.join(", ")}
            </p>
            <p><b>Class:</b> {student.className}</p>
            <p><b>Subject:</b> {student.subject}</p>
            <p><b>Marks:</b> {student.marks}%</p>

            <p>
              <b>Aadhaar:</b>{" "}
              <a href="#">{student.aadhaar}</a>
            </p>

            <button
              onClick={() => go("edit")}
            >
              Edit Profile
            </button>
          </div>
        </main>
      </Layout>
    );

  /* ---------- STUDENT EDIT ---------- */

  if (page === "edit" && student)
    return (
      <EditStudent
        student={student}
        users={users}
        update={updateUsers}
        go={go}
      />
    );

  /* ---------- ADMIN ---------- */

  if (page === "admin")
    return (
      <Admin
        users={users}
        update={updateUsers}
        go={go}
      />
    );

  return null;
}

/* ---------- ADMIN DASHBOARD ---------- */

function Admin({ users, update, go }) {
  const [name, setName] = useState("");
  const [cls, setCls] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [edit, setEdit] = useState(null);

  if (edit)
    return (
      <EditStudent
        student={edit}
        users={users}
        update={update}
        go={() => setEdit(null)}
        admin
      />
    );

  const list = users.filter(u =>
    u.name.toLowerCase().includes(name.toLowerCase()) &&
    u.className.toLowerCase().includes(cls.toLowerCase()) &&
    (!min || age(u.dob) >= +min) &&
    (!max || age(u.dob) <= +max)
  );

  const remove = id => {
    if (window.confirm("Delete student?"))
      update(users.filter(u => u.id !== id));
  };

  return (
    <Layout go={go} logout={() => {
      localStorage.clear();
      go("login");
    }}>
      <main className="wide">
        <h1>Admin Dashboard</h1>

        <div className="filters">
          <input
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <input
            placeholder="Class"
            value={cls}
            onChange={e => setCls(e.target.value)}
          />

          <input
            type="number"
            placeholder="Min Age"
            value={min}
            onChange={e => setMin(e.target.value)}
          />

          <input
            type="number"
            placeholder="Max Age"
            value={max}
            onChange={e => setMax(e.target.value)}
          />
        </div>

        <div className="table-box">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Class</th>
                <th>Marks</th>
                <th>Aadhaar</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {list.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{age(u.dob)}</td>
                  <td>{u.className}</td>
                  <td>{u.marks}%</td>
                  <td>
                    <a href="#">{u.aadhaar}</a>
                  </td>

                  <td>
                    <button
                      onClick={() => setEdit(u)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete"
                      onClick={() => remove(u.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </Layout>
  );
}

/* ---------- EDIT ---------- */

function EditStudent({
  student,
  users,
  update,
  go,
  admin
}) {
  const [form, setForm] = useState(student);

  const change = (name, value) =>
    setForm({ ...form, [name]: value });

  const submit = e => {
    e.preventDefault();

    const data = users.map(u =>
      u.id === form.id
        ? { ...u, ...form, email: student.email }
        : u
    );

    update(data);
    go(admin ? "admin" : "student");
  };

  return (
    <Layout go={go} logout={() => {
      localStorage.clear();
      go("login");
    }}>
      <main className="card">
        <h1>
          {admin ? "Edit Student" : "Edit Profile"}
        </h1>

        <form onSubmit={submit}>
          <Input
            label="Name"
            value={form.name}
            disabled={admin}
            onChange={e =>
              change("name", e.target.value)
            }
          />

          <Input
            label="Email 🔒"
            value={form.email}
            disabled
          />

          <Input
            label="Date of Birth"
            type="date"
            value={form.dob}
            onChange={e =>
              change("dob", e.target.value)
            }
          />

          <Select
            label="Qualification"
            value={form.qualification}
            values={[
              "High School",
              "Diploma",
              "Bachelor's",
              "Master's"
            ]}
            onChange={e =>
              change("qualification", e.target.value)
            }
          />

          <Input
            label="Class"
            value={form.className}
            onChange={e =>
              change("className", e.target.value)
            }
          />

          <Input
            label="Subject"
            value={form.subject}
            onChange={e =>
              change("subject", e.target.value)
            }
          />

          <Input
            label="Marks"
            type="number"
            value={form.marks}
            onChange={e =>
              change("marks", e.target.value)
            }
          />

          <button>Save Changes</button>
        </form>
      </main>
    </Layout>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function Input({
  name,
  label,
  type = "text",
  ...props
}) {
  return (
    <div>
      <label>{label} *</label>
      <input
        name={name}
        type={type}
        required
        {...props}
      />
    </div>
  );
}

function Select({
  name,
  label,
  values,
  ...props
}) {
  return (
    <div>
      <label>{label} *</label>

      <select
        name={name}
        required
        {...props}
      >
        <option value="">Select</option>

        {values.map(v => (
          <option key={v}>{v}</option>
        ))}
      </select>
    </div>
  );
}

function Options({ name, values, check }) {
  return (
    <div className="options">
      {values.map(v => (
        <label key={v}>
          <input
            type={check ? "checkbox" : "radio"}
            name={name}
            value={v}
            required={!check}
          />
          {v}
        </label>
      ))}
    </div>
  );
}

function Message({ error, success }) {
  return (
    <>
      {error && <div className="err">{error}</div>}
      {success && <div className="ok">{success}</div>}
    </>
  );
}

function Card({ title, children }) {
  return (
    <main className="card">
      <h1>{title}</h1>
      {children}
    </main>
  );
}

function Layout({ children, go, logout }) {
  return (
    <>
      <header>
        <b>Student Management</b>

        <nav>
          <button onClick={() => go("login")}>
            Login
          </button>

          <button onClick={() => go("signup")}>
            Signup
          </button>

          <button onClick={logout}>
            Logout
          </button>
        </nav>
      </header>

      {children}
    </>
  );
}

export default App;