import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import React, { useState, useEffect } from "react";

function App() {
  return (
    <div style={{ maxWidth: "75%", minHeight: "500px", margin: "0 auto", overflowY: "auto" }}>
      <List />
    </div>
  );
}

type Todo = {
  _id: string;
  desc: string;
  completed: boolean;
  priority: number;
};

const List = () => {
  // State for the list of todos
  const [todos, setTodos] = useState<Todo[]>([]);
  // State for the new task input value
  const [newTask, setNewTask] = useState("");

  // Fetch todos from backend on mount
  const fetchTodos = async () => {
    const response = await fetch("http://localhost:8081/todos");
    const data = await response.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Handler to toggle completed state and update backend
  const handleToggle = async (id: string, completed: boolean ) => {
    // Update in frontend state for instant feedback
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo._id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
    // Send PATCH request to backend to update DB
    await fetch(`http://localhost:8081/todos/${id}` , {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });
    // Optionally, you can call fetchTodos() here to refresh from backend
  };

  // Handler for input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask(e.target.value);
  };

  // Handler for adding a new task
  const handleAddTask = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    // Only send desc, completed, and priority. MongoDB will generate _id.
    const response = await fetch("http://localhost:8081/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        desc: newTask,
        completed: false,
        priority: 1,
      }),
    });

    if (response.ok) {
      // Fetch the updated list from backend so you get the MongoDB _id
      fetchTodos();
    }

    setNewTask("");
  };

  const items = todos.map((todo) => (
    <Item todo={todo} key={todo._id} onToggle={() => handleToggle(todo._id, todo.completed)} />
  ));

  return (
    <div className="ui form" style={{margin: "40px", padding: "20px", 
    border: "1px solid #eee", borderRadius: "5px", backgroundColor: "#f9f9f9"}}>
      <div className="field" style={{marginBottom: "20px"}}>
        <label><h2>TO-DO List</h2></label>
        {/* Controlled input for new task */}
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={handleInputChange}
        />
      </div>
      {/* Button to add a new task */}
      <button className="positive ui button " onClick={handleAddTask}>
        <i className="plus icon"></i>
        Add Task
      </button>
      <div className="ui relaxed divided list" style={{ marginBottom: "20px" }}>
        <h1>Tasks</h1>
        {items}
      </div>
    </div>
  );
};

interface ItemProps {
  todo: Todo;
  onToggle: () => void;
}

const Item: React.FC<ItemProps> = (props) => {
  const { desc, completed } = props.todo;
  return (
    <div className="item" style={{ display: "flex", alignItems: "center"}}>
      <div className="content" style={{ flexGrow: 1, margin: "10px 0" }}>
        <div className="header"><h3>{desc}</h3></div>
        <div style={{ margin: "8px 0" }}> <p>{completed ? "Completed" : "Pending"}</p> </div>
      </div>
      <div
        className={`ui checkbox ${completed ? "checked" : "unchecked"}`}
        style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}
      >
        <input
          type="checkbox"
          checked={completed}
          onChange={props.onToggle}
        />
        <label><small>Tick box when done</small></label>
      </div>
    </div>
  );
};



export default App;
