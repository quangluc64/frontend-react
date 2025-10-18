import { useState, useEffect, useCallback, useRef } from "react";
import { platesApi, mapPlateData } from "../services/api";

// Hook để quản lý danh sách biển số mới nhất
export const useLatestPlates = (pollInterval = 2000) => {
  const [plates, setPlates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Ref để tránh race condition
  const isMountedRef = useRef(true);
  const fetchCountRef = useRef(0);

  const fetchLatestPlates = useCallback(async (showLoading = true) => {
    const currentFetch = ++fetchCountRef.current;
    try {
      if (showLoading) setLoading(true);
      setError("");
      const data = await platesApi.getLatestPlates();
      // Chỉ update nếu component vẫn mounted và là fetch mới nhất
      if (isMountedRef.current && currentFetch === fetchCountRef.current) {
        const mappedData = mapPlateData(data);
        setPlates(mappedData);
      }
    } catch (err) {
      if (isMountedRef.current && currentFetch === fetchCountRef.current) {
        console.error("Error fetching plates:", err);
        setError(err.message || "Lỗi tải dữ liệu");
      }
    } finally {
      if (isMountedRef.current && currentFetch === fetchCountRef.current) {
        setLoading(false);
      }
    }
  }, []);

  // Force reload - Gọi sau khi update MongoDB
  const forceReload = useCallback(async () => {
    try {
      await platesApi.reloadCache();
      await fetchLatestPlates(true);
    } catch (err) {
      console.error("Error force reloading:", err);
    }
  }, [fetchLatestPlates]);

  useEffect(() => {
    isMountedRef.current = true;
    let intervalId;
    // Fetch ngay lập tức
    fetchLatestPlates(true);
    // Thiết lập polling (không show loading cho background updates)
    if (pollInterval > 0) {
      intervalId = setInterval(() => {
        fetchLatestPlates(false);
      }, pollInterval);
    }
    return () => {
      isMountedRef.current = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [fetchLatestPlates, pollInterval]);

  return {
    plates,
    loading,
    error,
    refetch: fetchLatestPlates,
    forceReload,
  };
};

// Hook để quản lý lịch sử biển số
export const usePlatesHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isMountedRef = useRef(true);

  const fetchHistory = useCallback(async (plateNumber) => {
    if (!plateNumber?.trim()) {
      setHistory([]);
      return;
    }
    try {
      setLoading(true);
      setError("");
      const data = await platesApi.getPlatesHistory(plateNumber.trim());
      if (isMountedRef.current) {
        const mappedData = mapPlateData(data);
        setHistory(mappedData);
      }
    } catch (err) {
      if (isMountedRef.current) {
        console.error("Error fetching history:", err);
        setError(err.message || "Lỗi tải lịch sử");
        setHistory([]);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setError("");
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    history,
    loading,
    error,
    fetchHistory,
    clearHistory,
  };
};

// Hook để quản lý việc giả lập biển số
export const usePlateSimulation = (onSuccess) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isMountedRef = useRef(true);

  const simulatePlate = useCallback(
    async (plateNumber) => {
      if (!plateNumber?.trim()) {
        setError("Vui lòng nhập biển số");
        return false;
      }

      try {
        setLoading(true);
        setError("");

        await platesApi.updatePlate(plateNumber.trim());

        if (isMountedRef.current) {
          // Callback để parent component reload data
          if (onSuccess) {
            setTimeout(() => onSuccess(), 500); // Delay nhỏ để MongoDB kịp lưu
          }
          return true;
        }
      } catch (err) {
        if (isMountedRef.current) {
          console.error("Error simulating plate:", err);
          setError(err.message || "Lỗi giả lập biển số");
          return false;
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
      return false;
    },
    [onSuccess]
  );

  const clearError = useCallback(() => {
    setError("");
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    loading,
    error,
    simulatePlate,
    clearError,
  };
};

// Hook để quản lý trạng thái camera
export const useCameraStatus = () => {
  const [cameraStatus, setCameraStatus] = useState({
    entrance: { connected: true, recording: true },
    exit: { connected: true, recording: true },
  });

  const checkCameraStatus = useCallback(async () => {
    // TODO: Implement camera status check API nếu cần
    // const status = await cameraApi.getStatus();
    // setCameraStatus(status);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(checkCameraStatus, 30000);
    return () => clearInterval(intervalId);
  }, [checkCameraStatus]);

  return {
    cameraStatus,
    checkCameraStatus,
  };
};

// Hook để quản lý dữ liệu theo ngày
export const usePlatesByDate = () => {
  const [plates, setPlates] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isMountedRef = useRef(true);

  const fetchPlatesByDate = useCallback(async (date) => {
    if (!date) {
      setPlates([]);
      setStats({});
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [platesData, statsData] = await Promise.all([
        platesApi.getPlatesByDate(date),
        platesApi.getDailyStats(date),
      ]);

      if (isMountedRef.current) {
        const mappedPlates = mapPlateData(platesData);
        setPlates(mappedPlates);
        setStats(statsData);
      }
    } catch (err) {
      if (isMountedRef.current) {
        console.error("Error fetching plates by date:", err);
        setError(err.message || "Lỗi tải dữ liệu theo ngày");
        setPlates([]);
        setStats({});
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const clearData = useCallback(() => {
    setPlates([]);
    setStats({});
    setError("");
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    plates,
    stats,
    loading,
    error,
    fetchPlatesByDate,
    clearData,
  };
};

// Hook để quản lý dữ liệu theo tháng
export const usePlatesByMonth = () => {
  const [plates, setPlates] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isMountedRef = useRef(true);

  const fetchPlatesByMonth = useCallback(async (year, month) => {
    if (!year || !month) {
      setPlates([]);
      setStats({});
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [platesData, statsData] = await Promise.all([
        platesApi.getPlatesByMonth(year, month),
        platesApi.getMonthlyStats(year, month),
      ]);

      if (isMountedRef.current) {
        const mappedPlates = mapPlateData(platesData);
        setPlates(mappedPlates);
        setStats(statsData);
      }
    } catch (err) {
      if (isMountedRef.current) {
        console.error("Error fetching plates by month:", err);
        setError(err.message || "Lỗi tải dữ liệu theo tháng");
        setPlates([]);
        setStats({});
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const clearData = useCallback(() => {
    setPlates([]);
    setStats({});
    setError("");
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    plates,
    stats,
    loading,
    error,
    fetchPlatesByMonth,
    clearData,
  };
};

// Hook tổng hợp để quản lý toàn bộ trang chủ
export const useHomePageData = () => {
  const latestPlates = useLatestPlates(20000);
  const platesHistory = usePlatesHistory();
  const cameraStatus = useCameraStatus();

  // Tạo callback để reload sau khi simulate
  const plateSimulation = usePlateSimulation(() => {
    // Force reload ngay sau khi simulate thành công
    latestPlates.forceReload();
  });

  return {
    latestPlates,
    platesHistory,
    plateSimulation,
    cameraStatus,
  };
};
