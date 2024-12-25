/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";

interface Task {
  id: number;
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

      const url = isEditing
        ? `http://127.0.0.1:5000/api/tasks/${editingTask.id}`
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

      // Update tasks list
      if (isEditing) {
        setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? result : t)));
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

      setTasks((prev) => prev.filter((task) => task.id !== taskId));
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
    <div className="p-6 space-y-4 bg-gray-100">
      <h1 className="text-2xl font-bold">Task Manager</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <input
          type="text"
          name="title"
          value={taskData.title}
          onChange={handleInputChange}
          placeholder="Task Title"
          className="w-full px-4 py-2 border rounded"
          required
        />

        <textarea
          name="description"
          value={taskData.description}
          onChange={handleInputChange}
          placeholder="Task Description"
          className="w-full px-4 py-2 border rounded"
          required
        />

        <select
          name="priority"
          value={taskData.priority}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          name="status"
          value={taskData.status}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
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
            className="w-full px-4 py-2 mt-2 text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white"
          >
            Cancel Edit
          </button>
        )}
      </form>

      <div className="space-y-4">
        {currentTasks.length > 0 ? (
          currentTasks.map((task) => (
            <div key={task.id} className="p-4 border rounded space-y-2">
              <h3 className="text-lg font-bold">{task.title}</h3>
              <p>{task.description}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(task)}
                  className="px-4 py-2 text-blue-500 border border-blue-500 rounded hover:bg-blue-500 hover:text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="px-4 py-2 text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No tasks available. Add a task to get started!</p>
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
