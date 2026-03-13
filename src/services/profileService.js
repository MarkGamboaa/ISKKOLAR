import { mockUsers } from "../utils/mockData";

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export const getProfile = async () => {
  await delay();
  const storedUser = localStorage.getItem("user");
  if (!storedUser) throw new Error("Not authenticated.");
  const user = JSON.parse(storedUser);
  const fullUser = mockUsers.find((u) => u.id === user.id);
  if (!fullUser) throw new Error("User not found.");
  const { password: _, ...userWithoutPassword } = fullUser;
  return userWithoutPassword;
};

export const updateProfile = async (data) => {
  await delay();
  const storedUser = localStorage.getItem("user");
  if (!storedUser) throw new Error("Not authenticated.");
  const user = JSON.parse(storedUser);
  const index = mockUsers.findIndex((u) => u.id === user.id);
  if (index === -1) throw new Error("User not found.");

  mockUsers[index].firstName = data.firstName ?? mockUsers[index].firstName;
  mockUsers[index].lastName = data.lastName ?? mockUsers[index].lastName;

  const { password: _, ...userWithoutPassword } = mockUsers[index];

  // Update localStorage
  localStorage.setItem("user", JSON.stringify(userWithoutPassword));

  return userWithoutPassword;
};

export const changePassword = async (currentPassword, newPassword) => {
  await delay();
  const storedUser = localStorage.getItem("user");
  if (!storedUser) throw new Error("Not authenticated.");
  const user = JSON.parse(storedUser);
  const index = mockUsers.findIndex((u) => u.id === user.id);
  if (index === -1) throw new Error("User not found.");

  if (mockUsers[index].password !== currentPassword) {
    throw new Error("Current password is incorrect.");
  }

  mockUsers[index].password = newPassword;
  return { message: "Password updated successfully." };
};
