import React, { useState, useEffect } from 'react';
import { nanoid } from "nanoid";
import Todo from "./components/Todo";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import axios from 'axios';



function App() {
  const [filter, setFilter] = useState("All");
  const [tasks, setTasks] = useState([]);

  const FILTER_MAP = {
    All: () => true,
    Active: (task) => !task.completed,
    Completed: (task) => task.completed,
  };
  

  const FILTER_NAMES = Object.keys(FILTER_MAP);


  useEffect(() => {
    axios
      .get('http://localhost:5001/todos')
      .then((response) => setTasks(response.data))
      .catch((error) => console.error(error));
  }, [tasks]);
  
  
  function addTask(name) {
    console.log(name);
    axios
      .post('http://localhost:5001/todos', { name })
      .then((response) => setTasks([...tasks, response.data]))
      .catch((error) => console.error(error));
  }
  
  function toggleTaskCompleted(id) {
    const task = tasks.find((task) => task._id === id);
    axios
      .patch(`http://localhost:5001/todos/${id}`, { completed: !task.completed })
      .then((response) => {
        const updatedTasks = tasks.map((task) =>
          task._id === id ? { ...task, completed: response.data.completed } : task
        );
        setTasks(updatedTasks);
      })
      .catch((error) => console.error(error));
  }
  
  function deleteTask(id) {
    axios
      .delete(`http://localhost:5001/todos/${id}`)
      .then(() => setTasks(tasks.filter((task) => task._id !== id)))
      .catch((error) => console.error(error));
  }
  
  function editTask(id, newName) {
    axios 
      .patch(`http://localhost:5001/todos/${id}`, { name: newName })
      .then((response) => {
        const updatedTask = response.data;
        const editedTaskList = tasks.map((task) => 
          task._id === id ? updatedTask : task
        );
        setTasks(editedTaskList);
      })
      .catch((error) => console.error(error));
  }
  
  const taskList = tasks
  .filter(FILTER_MAP[filter])
  .map((task) => (
    <Todo
      id={task._id}
      name={task.name}
      completed={task.completed}
      key={task.id}
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask}
      editTask={editTask}
    />
  ));


  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));
  
  

  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  
  
  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic - MERNified</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">
      {filterList}
      </div>
      <h2 id="list-heading">{headingText}</h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
        {taskList}
      </ul>
    </div>
  );
}

export default App;