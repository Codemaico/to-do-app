import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import React, { useState, useEffect } from "react";

function App() {
  return (
    <div className="container mt-5"
    style={{ maxWidth: '600px', margin: '0 auto' }} >
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
  const [todos, setTodos] = useState<Todo[]>([]);

  const fetchTodos = async () => {
    const response = await fetch("http://localhost:8081/todos");
    const data = await response.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const Items = todos.map(todo => <Item todo={todo} key={todo._id}/>);

  return (
    <div>{Items}</div>
  );
};

const Item: React.FC<{ todo: Todo }> = (props) => {
  const {desc, completed} = props.todo;
  return (
    <div>
      {desc} - {completed ? "Completed" : "Pending"}
    </div>
  );
};

export default App;
