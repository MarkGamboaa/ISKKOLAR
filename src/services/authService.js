import { mockUsers } from "../utils/mockData";

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export const login = async (email, password) => {
  await delay();
  const user = mockUsers.find(
    (u) => u.email === email && u.password === password
  );
  if (!user) {
    throw new Error("Invalid credentials. Please check your email and password.");
  }
  if (user.status === "inactive") {
    throw new Error("Your account has been deactivated. Please contact the administrator.");
  }
  const { password: _, ...userWithoutPassword } = user;
  return {
    token: "mock-jwt-token-" + user.id,
    user: userWithoutPassword,
  };
};

export const register = async (userData) => {
  await delay();
  const exists = mockUsers.find((u) => u.email === userData.email);
  if (exists) {
    throw new Error("An account with this email already exists.");
  }
  const newUser = {
    id: mockUsers.length + 1,
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    password: userData.password,
    role: userData.userType || "applicant",
    scholarshipType: userData.scholarshipType || null,
    status: "active",
    applicationStatus: "pending",
    createdAt: new Date().toISOString(),
  };
  mockUsers.push(newUser);
  return { message: "Account created successfully! You can now log in." };
};

export const forgotPassword = async (email) => {
  await delay();
  const user = mockUsers.find((u) => u.email === email);
  if (!user) {
    throw new Error("No account found with this email address.");
  }
  return { message: "A password reset link has been sent to your email." };
};
