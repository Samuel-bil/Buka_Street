import axios from "axios";
import Cookies from "js-cookie";
import { create } from "zustand";

export const useUserStore = create((set) => ({
  details: null,
  status: "idle",
  error: null,
  updateUser: (user) => {
    set({ details: user });
  },
  validateToken: async () => {
    set({ status: "pending" });
    const userRoles = new Set(["user", "buka", "admin"]);
    let token = null;

    // Check for tokens for each role in the defined order
    for (const role of userRoles) {
      const roleToken = Cookies.get(role);
      if (roleToken) {
        token = roleToken;
        break; // Stop when the first token is found
      }
    }

    if (!token) {
      set({ status: "idle" });
      return;
    }

    try {
      const response = await axios.get(
        "https://buka-street.vercel.app/api/users/getuser",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      set({ details: data, status: "success" });
    } catch (error) {
      set({ error, status: "failed" });
    }
  },
}));
