import axios from "axios";

export const loginUser = async (email: string, password: string) => {
  console.log("Login payload:", { email, password });
  const response = await axios.post("http://127.0.0.1:5000/api/auth/login", { email, password });
  console.log("Login response:", response.data);
  return response.data;
};

export const registerUser = async (name: string, email: string, password: string) => {
  console.log("Register payload:", { name, email, password });
  const response = await axios.post("http://127.0.0.1:5000/api/auth/register", { name, email, password });
  console.log("Register response:", response.data);
  return response.data;
};
