/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";

interface Task {
  _id: number;
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "In Progress" | "Completed";
}

interface TaskData {
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "In Progress" | "Completed";
}

const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]); 
  const [taskData, setTaskData] = useState<TaskData>({
    title: "",
    description: "",
    priority: "Medium",
    status: "Pending",
  });
  
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  const isEditing = !!editingTask;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in again.");
  
      const response = await fetch("http://127.0.0.1:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) throw new Error("Failed to fetch tasks.");
  
      const result = await response.json();
      setTasks(result.tasks); 
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
  
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in again.");
  
      if (isEditing && (!editingTask || !editingTask._id)) {
        setError("Editing task ID is missing.");
        return;
      }
  
      const url = isEditing
        ? `http://127.0.0.1:5000/api/tasks/${editingTask?._id}`
        : "http://127.0.0.1:5000/api/tasks";
      const method = isEditing ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save task.");
      }

      const result = await response.json();
      setSuccess(isEditing ? "Task updated successfully!" : "Task created successfully!");
  
      if (isEditing) {
        setTasks((prev) => prev.map((t) => (t._id === editingTask._id ? result : t)));
      } else {
        setTasks((prev) => [...prev, result]);
      }

      setTaskData({ title: "", description: "", priority: "Medium", status: "Pending" });
      setEditingTask(null);
    } catch (error: any) {
      setError(error.message || "An error occurred while saving the task.");
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setTaskData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
    });
  };

  const handleDelete = async (taskId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in again.");

      const response = await fetch(`http://127.0.0.1:5000/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete task.");

      setTasks((prev) => prev.filter((task) => task._id !== taskId));
      setSuccess("Task deleted successfully.");
    } catch (error: any) {
      setError(error.message);
    }
  };

  const currentTasks = tasks.slice(
    (currentPage - 1) * tasksPerPage,
    currentPage * tasksPerPage
  );

  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
  <div className="container mx-auto p-4 space-y-6">
  <h1 className="text-3xl font-bold text-center text-gray-800">Task Manager</h1>

  <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow space-y-4">
    {error && <p className="text-red-500">{error}</p>}
    {success && <p className="text-green-500">{success}</p>}

    <input
      type="text"
      name="title"
      value={taskData.title}
      onChange={handleInputChange}
      placeholder="Task Title"
      className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
      required
    />

    <textarea
      name="description"
      value={taskData.description}
      onChange={handleInputChange}
      placeholder="Task Description"
      className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
      required
    />

    <div className="flex gap-4">
      <select
        name="priority"
        value={taskData.priority}
        onChange={handleInputChange}
        className="w-1/2 px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      <select
        name="status"
        value={taskData.status}
        onChange={handleInputChange}
        className="w-1/2 px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
      >
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
    </div>

    <button
      type="submit"
      className="w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition duration-200"
    >
      {isEditing ? "Update Task" : "Create Task"}
    </button>

    {isEditing && (
      <button
        type="button"
        onClick={() => {
          setEditingTask(null);
          setTaskData({ title: "", description: "", priority: "Medium", status: "Pending" });
        }}
        className="w-full py-2 mt-2 text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white transition duration-200"
      >
        Cancel Edit
      </button>
    )}
  </form>

  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {currentTasks.length > 0 ? (
      currentTasks.map((task) => (
        <div key={task._id} className="p-4 bg-white border rounded shadow space-y-2">
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <p className="text-sm text-gray-600">{task.description}</p>
          <div className="flex items-center justify-between">
            <span
              className={`px-2 py-1 text-sm rounded ${
                task.status === "Completed"
                  ? "bg-green-100 text-green-700"
                  : task.status === "In Progress"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {task.status}
            </span>
            <span
              className={`px-2 py-1 text-sm rounded ${
                task.priority === "High"
                  ? "bg-red-100 text-red-700"
                  : task.priority === "Medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {task.priority}
            </span>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => handleEdit(task)}
              className="px-4 py-2 text-blue-500 border border-blue-500 rounded hover:bg-blue-500 hover:text-white transition duration-200"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(task._id)}
              className="px-4 py-2 text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white transition duration-200"
            >
              Delete
            </button>
          </div>
        </div>
      ))
    ) : (
      <p className="text-center text-gray-500">No tasks available. Add a task to get started!</p>
    )}
  </div>

  <div className="flex justify-center space-x-2">
    {Array.from({ length: totalPages }, (_, index) => (
      <button
        key={index + 1}
        onClick={() => handlePageChange(index + 1)}
        className={`px-3 py-1 border rounded ${
          currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-white"
        }`}
      >
        {index + 1}
      </button>
    ))}
  </div>
  </div>
  );

};

export default TaskManager;
