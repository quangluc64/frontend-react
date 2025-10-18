import axios from "axios";
import { API_CONFIG, buildApiUrl } from "../config/api";

// Tạo axios instance với cấu hình mặc định
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để xử lý response
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error);
    const errorMessage = error.response?.data?.error || error.message;
    return Promise.reject(new Error(errorMessage));
  }
);

// ** API Services ** //
export const platesApi = {
  // Lấy danh sách biển số mới nhất (từ MongoDB qua cache)
  getLatestPlates: async () => {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.LATEST_PLATES);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error("Error fetching latest plates:", error);
      throw new Error(`Lỗi tải danh sách biển số: ${error.message}`);
    }
  },

  // Lấy lịch sử biển số theo xe
  getPlatesHistory: async (plateNumber) => {
    try {
      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.PLATES_HISTORY}?xe=${encodeURIComponent(
          plateNumber
        )}`
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      throw new Error(`Lỗi tải lịch sử biển số: ${error.message}`);
    }
  },

  // Cập nhật biển số (giả lập hoặc từ model)
  updatePlate: async (plateNumber) => {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.UPDATE_PLATE, {
        plate: plateNumber,
      });
      return response;
    } catch (error) {
      throw new Error(`Lỗi cập nhật biển số: ${error.message}`);
    }
  },

  // Force reload cache - gọi sau khi update MongoDB trực tiếp
  reloadCache: async () => {
    try {
      const response = await apiClient.post("/reload_cache");
      return response;
    } catch (error) {
      console.error("Error reloading cache:", error);
      throw new Error(`Lỗi reload cache: ${error.message}`);
    }
  },

  // Lấy danh sách biển số theo ngày
  getPlatesByDate: async (date) => {
    try {
      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.PLATES_BY_DATE}?date=${encodeURIComponent(
          date
        )}`
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      throw new Error(`Lỗi tải dữ liệu theo ngày: ${error.message}`);
    }
  },

  // Lấy thống kê theo ngày
  getDailyStats: async (date) => {
    try {
      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.DAILY_STATS}?date=${encodeURIComponent(date)}`
      );
      return response;
    } catch (error) {
      throw new Error(`Lỗi tải thống kê ngày: ${error.message}`);
    }
  },
};

export const employeeApi = {
  // Tìm kiếm nhân viên
  searchEmployee: async (searchData) => {
    try {
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.SEARCH_EMPLOYEE,
        searchData
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      throw new Error(`Lỗi tìm kiếm nhân viên: ${error.message}`);
    }
  },

  // Thêm nhân viên mới
  addEmployee: async (employeeData) => {
    try {
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.ADD_EMPLOYEE,
        employeeData
      );
      return response;
    } catch (error) {
      throw new Error(`Lỗi thêm nhân viên: ${error.message}`);
    }
  },
};

export const videoApi = {
  // Lấy URL stream video
  getVideoStreamUrl: () => {
    return buildApiUrl(API_CONFIG.ENDPOINTS.VIDEO_STREAM);
  },
};

// Utility functions
export const formatDateTime = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch (error) {
    console.error("Date formatting error:", error);
    return String(dateString).replace("T", " ");
  }
};

// Map dữ liệu từ backend sang frontend format
export const mapPlateData = (plateData) => {
  if (!Array.isArray(plateData)) return [];

  return plateData.map((item, index) => ({
    id: item.id || item._id || `temp-${index}`,
    plate: item.plate || "",
    time: formatDateTime(item.time || item.time_added || item.timestamp),
    rawTime: item.time || item.time_added || item.timestamp, // Giữ raw time để sort
    status: item.status || "vào",
    camera: item.camera || "Nhân viên",
    name: item.name || "",
    position: item.position || "",
  }));
};

export default apiClient;
