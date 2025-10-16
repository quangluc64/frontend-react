import { useState, useCallback } from "react";
import { employeeApi } from "../services/api";

// Hook để quản lý tìm kiếm nhân viên
export const useEmployeeSearch = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchEmployees = useCallback(async (searchData) => {
    try {
      setLoading(true);
      setError("");
      const data = await employeeApi.searchEmployee(searchData);
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Lỗi tìm kiếm nhân viên");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setEmployees([]);
    setError("");
  }, []);

  return {
    employees,
    loading,
    error,
    searchEmployees,
    clearSearch,
  };
};

// Hook để quản lý thêm nhân viên
export const useAddEmployee = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const addEmployee = useCallback(async (employeeData) => {
    try {
      setLoading(true);
      setError("");
      setSuccess(false);

      const result = await employeeApi.addEmployee(employeeData);
      setSuccess(true);
      return result;
    } catch (err) {
      setError(err.message || "Lỗi thêm nhân viên");
      setSuccess(false);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setError("");
    setSuccess(false);
  }, []);

  return {
    loading,
    error,
    success,
    addEmployee,
    clearMessages,
  };
};

// Hook để quản lý form thêm nhân viên
export const useEmployeeForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    xe: "",
  });
  const [errors, setErrors] = useState({});

  const updateField = useCallback(
    (field, value) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear error khi user nhập
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }
    },
    [errors]
  );

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên nhân viên không được để trống";
    }

    if (!formData.position.trim()) {
      newErrors.position = "Chức vụ không được để trống";
    }

    if (!formData.xe.trim()) {
      newErrors.xe = "Biển số xe không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      position: "",
      xe: "",
    });
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    updateField,
    validateForm,
    resetForm,
  };
};
