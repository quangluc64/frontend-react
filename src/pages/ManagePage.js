import React, { useState, useEffect, useMemo } from "react";
import PlatesTable from "../components/table/PlatesTable";
import ExcelExport from "../components/export/ExcelExport";
import { usePlatesByDate } from "../hooks/usePlates";

const ManagePage = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { plates, stats, loading, error, fetchPlatesByDate, clearData } =
    usePlatesByDate();

  // Thiết lập ngày mặc định là hôm nay
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
    fetchPlatesByDate(today);
  }, [fetchPlatesByDate]);

  // Xử lý thay đổi ngày
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    if (newDate) {
      fetchPlatesByDate(newDate);
    } else {
      clearData();
    }
  };

  // Lọc dữ liệu theo tab
  const filteredPlates = useMemo(() => {
    if (!plates || plates.length === 0) return [];

    switch (activeTab) {
      case "in":
        return plates.filter((p) => p.status === "vào");
      case "out":
        return plates.filter((p) => p.status === "ra");
      case "staff":
        return plates.filter((p) => p.name && p.name !== "");
      case "visitor":
        return plates.filter((p) => !p.name || p.name === "");
      default:
        return plates;
    }
  }, [plates, activeTab]);

  // Màu badge theo trạng thái
  const getStatusColor = (status) => {
    switch (status) {
      case "vào":
        return "text-green-600 bg-green-100";
      case "ra":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // Format ngày để hiển thị
  const formatDisplayDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý biển số xe
          </h1>
          <p className="text-gray-600 mt-1">
            Xem và quản lý danh sách biển số theo ngày
          </p>
        </div>
      </div>

      {/* Export Section */}
      <ExcelExport />

      {/* Date Filter */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn ngày
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-sm text-gray-500 mt-6">
            {selectedDate && formatDisplayDate(selectedDate)}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 rounded bg-red-50 text-red-600 text-sm">
            ❌ {error}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      {stats && Object.keys(stats).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng lượt</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Xe vào</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.in || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Xe ra</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.out || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Nhân viên</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.staff || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="flex border-b border-gray-200">
          {[
            { id: "all", label: "Tất cả", count: plates?.length || 0 },
            {
              id: "in",
              label: "Xe vào",
              count: plates?.filter((p) => p.status === "vào").length || 0,
            },
            {
              id: "out",
              label: "Xe ra",
              count: plates?.filter((p) => p.status === "ra").length || 0,
            },
            {
              id: "staff",
              label: "Nhân viên",
              count: plates?.filter((p) => p.name && p.name !== "").length || 0,
            },
            {
              id: "visitor",
              label: "Khách",
              count:
                plates?.filter((p) => !p.name || p.name === "").length || 0,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab.label}
              <span className="ml-2 px-2 py-0.5 bg-gray-200 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              Đang tải dữ liệu...
            </div>
          ) : (
            <PlatesTable
              currentPlates={filteredPlates}
              getStatusColor={getStatusColor}
              title={`Danh sách biển số - ${formatDisplayDate(selectedDate)}`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagePage;
