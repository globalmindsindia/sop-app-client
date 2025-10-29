import axios from "axios";

//const BASE_URL = "https://rbacapi.globalmindsindia.in";
const BASE_URL = "http://localhost:3000";

export const leadService = {
  createLeads: async (payload: any) => {
    try {
      const response = await axios.post(`${BASE_URL}/v1/leads/`, payload);
      return response.data;
    } catch (error: any) {
      console.error("Create leads error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create leads"
      );
    }
  },
};
