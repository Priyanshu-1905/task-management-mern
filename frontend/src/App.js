import { useState , useEffect } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const [tasks, setTasks] = useState([]);

  const role = localStorage.getItem("role");

  useEffect(() => {
  if (role === "admin") {
    fetchEmployees();
  }
}, [role]);

  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/auth/employees", {
      headers: {
        Authorization: token
      }
    });

    const data = await res.json();
    setEmployees(data);

  } catch (error) {
    console.log(error);
  }
}; 
  // 🔐 LOGIN
  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      alert("Login successful");
      window.location.reload();

    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  // 🚀 CREATE TASK (ADMIN)
  const handleCreateTask = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/tasks/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify({
          title,
          description,
          assignedTo
        })
      });
       

      const data = await res.json();
      alert(data);

      // ✅ CLEAR INPUTS
    setTitle("");
    setDescription("");
    setAssignedTo("");;

    } catch (error) {
      console.log(error);
      alert("Error creating task");
    }
  };

  // 📥 FETCH TASKS (EMPLOYEE)
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/tasks/my", {
        headers: {
          Authorization: token
        }
      }
    );
    
      const data = await res.json();
      setTasks(data);

    } catch (error) {
      console.log(error);
    }
  };
  const fetchAllTasks = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/tasks/all", {
      headers: {
        Authorization: token
      }
    });

    const data = await res.json();
    setTasks(data);

  } catch (error) {
    console.log(error);
  }
};

  // 🔄 UPDATE TASK
  const updateTask = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`http://localhost:5000/api/tasks/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify({ status: "completed" })
      });

      alert("Task updated");
      fetchTasks();

    } catch (error) {
      console.log(error);
    }
  };

  // 🔓 LOGOUT
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
  <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f5f5f5"
  }}>
    <div style={{
      background: "white",
      padding: "30px",
      borderRadius: "10px",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      width: "350px"
    }}>

      {!role ? (
        <>
          <h2 style={{ textAlign: "center" }}>Login</h2>

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />

          <button
            onClick={handleLogin}
            style={{
              width: "100%",
              padding: "10px",
              background: "#007bff",
              color: "white",
              border: "none",
              cursor: "pointer"
            }}
          >
            Login
          </button>
        </>
      ) : role === "admin" ? (
        <>
          <h2 style={{ textAlign: "center" }}>Admin Dashboard</h2>
          <button
            onClick={fetchAllTasks}
            
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px"
            }}
          >
            View All Tasks
          </button>
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />

          <select
  value={assignedTo}
  onChange={(e) => setAssignedTo(e.target.value)}
  style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
>
  <option value="">Select Employee</option>

  {employees.map((emp) => (
    <option key={emp._id} value={emp._id}>
      {emp.name} ({emp.email})
    </option>
  ))}
</select>

          <button
            onClick={handleCreateTask}
            style={{
              width: "100%",
              padding: "10px",
              background: "green",
              color: "white",
              border: "none",
              marginBottom: "10px"
            }}
          >
            Create Task
          </button>
          {tasks.map((task) => (
          <div key={task._id} style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px"
          }}>
            <h4>{task.title}</h4>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <p>
              Assigned To: {task.assignedTo?.name} ({task.assignedTo?.email})
            </p>
          </div>
        ))}
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "10px",
              background: "red",
              color: "white",
              border: "none"
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <h2 style={{ textAlign: "center" }}>Employee Dashboard</h2>

          <button
            onClick={fetchTasks}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px"
            }}
          >
            Load Tasks
          </button>

          {tasks.map((task) => (
            <div key={task._id} style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px"
            }}>
              <h4>{task.title}</h4>
              <p>{task.description}</p>
              <p>Status: {task.status}</p>

              {task.status !== "completed" && (
                <button
                  onClick={() => updateTask(task._id)}
                  style={{
                    padding: "5px",
                    background: "blue",
                    color: "white",
                    border: "none"
                  }}
                >
                  Mark Completed
                </button>
              )}
            </div>
          ))}

          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "10px",
              background: "red",
              color: "white",
              border: "none"
            }}
          >
            Logout
          </button>
        </>
      )}
    </div>
  </div>
);
}

export default App;