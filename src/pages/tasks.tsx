/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";

const TaskManager: React.FC = () => {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Pending",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const response = await fetch("http://127.0.0.1:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create task.");
      }

      const result = await response.json();
      console.log(result);
      setSuccess("Task created successfully!");
      setTaskData({
        title: "",
        description: "",
        priority: "Medium",
        status: "Pending",
      });
    } catch (error: any) {
      setError(error.message || "An error occurred while creating the task.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-md">
      <h1 className="text-3xl font-bold text-center text-blue-600">Task Manager</h1>

      {error && (
        <div className="flex items-center p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636L5.636 18.364M18.364 18.364L5.636 5.636"></path>
          </svg>
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={taskData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={taskData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          ></textarea>
        </div>
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={taskData.priority}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={taskData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          >
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded shadow-md hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          Create Task
        </button>
        <button
          type="button"
          onClick={() => setTaskData({ title: "", description: "", priority: "Medium", status: "Pending" })}
          className="w-full px-4 py-2 mt-2 text-blue-500 border border-blue-500 rounded hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Reset Form
        </button>
      </form>
    </div>
  );
};

export default TaskManager;
