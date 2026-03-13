import { mockUsers } from "../utils/mockData";

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export const getScholars = async () => {
  await delay();
  return mockUsers.filter((u) => u.role === "scholar");
};

export const getStaff = async () => {
  await delay();
  return mockUsers.filter((u) => u.role === "staff");
};

export const getApplicants = async () => {
  await delay();
  return mockUsers.filter((u) => u.role === "applicant");
};

export const getUserById = async (id) => {
  await delay();
  const user = mockUsers.find((u) => u.id === Number(id));
  if (!user) throw new Error("User not found.");
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const addScholar = async (data) => {
  await delay();
  const exists = mockUsers.find((u) => u.email === data.email);
  if (exists) throw new Error("A user with this email already exists.");
  const newUser = {
    id: Math.max(...mockUsers.map((u) => u.id)) + 1,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password || "Default123",
    role: "scholar",
    scholarshipType: data.scholarshipType,
    status: data.status || "active",
    applicationStatus: "approved",
    createdAt: new Date().toISOString(),
  };
  mockUsers.push(newUser);
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const addStaff = async (data) => {
  await delay();
  const exists = mockUsers.find((u) => u.email === data.email);
  if (exists) throw new Error("A user with this email already exists.");
  const newUser = {
    id: Math.max(...mockUsers.map((u) => u.id)) + 1,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password || "Default123",
    role: "staff",
    scholarshipType: null,
    status: data.status || "active",
    applicationStatus: null,
    createdAt: new Date().toISOString(),
  };
  mockUsers.push(newUser);
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const updateUser = async (id, data) => {
  await delay();
  const index = mockUsers.findIndex((u) => u.id === Number(id));
  if (index === -1) throw new Error("User not found.");
  mockUsers[index] = {
    ...mockUsers[index],
    firstName: data.firstName ?? mockUsers[index].firstName,
    lastName: data.lastName ?? mockUsers[index].lastName,
    scholarshipType: data.scholarshipType ?? mockUsers[index].scholarshipType,
    status: data.status ?? mockUsers[index].status,
  };
  const { password: _, ...userWithoutPassword } = mockUsers[index];
  return userWithoutPassword;
};

export const toggleStatus = async (id) => {
  await delay();
  const index = mockUsers.findIndex((u) => u.id === Number(id));
  if (index === -1) throw new Error("User not found.");
  mockUsers[index].status =
    mockUsers[index].status === "active" ? "inactive" : "active";
  const { password: _, ...userWithoutPassword } = mockUsers[index];
  return userWithoutPassword;
};

export const deleteUser = async (id) => {
  await delay();
  const index = mockUsers.findIndex((u) => u.id === Number(id));
  if (index === -1) throw new Error("User not found.");
  mockUsers.splice(index, 1);
  return { message: "User deleted successfully." };
};
