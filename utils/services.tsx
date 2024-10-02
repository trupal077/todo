import { config } from "@/config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const clientService = {
  get: async (endPoint: string) => {
    const token = await AsyncStorage.getItem("token");
    const headers = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      return await axios.get(config.apiUrl + endPoint, headers);
    } catch (e) {
      return null;
    }
  },

  post: async (endPoint: string, data: any) => {
    const token = await AsyncStorage.getItem("token");
    const headers = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const res = await axios.post(config.apiUrl + endPoint, data, headers);
      return {
        status: true,
        data: res.data,
      };
    } catch (e: any) {
      console.error("Error in clientService.post:", e?.response);
      return {
        status: false,
        data: e?.response?.data?.message || "Something went wrong",
        error: e?.response,
      };
    }
  },

  put: async (endPoint: string, data: any) => {
    const token = await AsyncStorage.getItem("token");
    const headers = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await axios.put(config.apiUrl + endPoint, data, headers);
      return {
        status: true,
        data: res.data,
      };
    } catch (e: any) {
      return {
        status: false,
        data: e?.response?.data?.errors,
      };
    }
  },

  // Image Upload using FormData
  uploadImage: async (
    endPoint: string,
    image: any,
    otherData: Record<string, any> = {}
  ) => {
    const token = await AsyncStorage.getItem("token");
    const headers = {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const formData: any = new FormData();
    formData.append("image", {
      uri: image.uri, // URI of the image file
      name: image.fileName, // Image file name
      type: image.type || "image/jpeg", // Image file type
    });

    // Add any other form data if necessary
    Object.keys(otherData).forEach((key) => {
      formData.append(key, otherData[key]);
    });

    try {
      const res = await axios.post(config.apiUrl + endPoint, formData, headers);
      return {
        status: true,
        data: res.data,
      };
    } catch (e: any) {
      return {
        status: false,
        data: e?.response?.data?.message,
      };
    }
  },

  // Delete method to handle image deletion
  delete: async (endPoint: string) => {
    const token = await AsyncStorage.getItem("token");
    const headers = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await axios.delete(config.apiUrl + endPoint, headers);
      return {
        status: true,
        data: res.data,
      };
    } catch (e: any) {
      return {
        status: false,
        data: e?.response?.data?.message,
      };
    }
  },
};
