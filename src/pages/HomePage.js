import React, { useMemo, useState } from "react";
import CameraCard from "../components/camera/CameraCard";
import PlatesTable from "../components/table/PlatesTable";
import { useHomePageData } from "../hooks/usePlates";
import { videoApi } from "../services/api";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("activity");
  const [simulatePlate, setSimulatePlate] = useState("");
  const [historyPlate, setHistoryPlate] = useState("");

  // Sử dụng custom hooks để quản lý data
  const { latestPlates, platesHistory, plateSimulation, cameraStatus } =
    useHomePageData();
  console.log("platesHistory ~", platesHistory);
  // Màu badge theo trạng thái
  const getStatusColor = (status) =>
    status === "vào"
      ? "text-green-600 bg-green-100"
      : "text-red-600 bg-red-100";

  // Activity sorted newest first (theo rawTime nếu có)
  const activityLog = useMemo(() => {
    return [...latestPlates.plates].sort((a, b) => {
      const timeA = new Date(a.rawTime || a.time);
      const timeB = new Date(b.rawTime || b.time);
      return timeB - timeA; // Mới nhất lên đầu
    });
  }, [latestPlates.plates]);

  // Handle simulate submit
  const handleSimulateSubmit = async (e) => {
    e.preventDefault();
    if (!simulatePlate.trim()) return;
    
    const success = await plateSimulation.simulatePlate(simulatePlate);
    if (success) {
      setSimulatePlate("");
    }
  };

  // Handle history submit
  const handleHistorySubmit = async (e) => {
    e.preventDefault();
    if (!historyPlate.trim()) return;
    await platesHistory.fetchHistory(historyPlate);
  };


  return (
    <div className="p-6 space-y-6">
      {/* === HEADER === */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Hệ thống nhận diện biển số xe
          </h1>
          <p className="text-gray-600 mt-1">
            Giám sát thời gian thực và quản lý phương tiện
          </p>
        </div>
      </div>

      {/* === CAMERA === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CameraCard
          title="Camera cổng vào"
          color="green"
          connected={cameraStatus.cameraStatus.entrance.connected}
          recording={cameraStatus.cameraStatus.entrance.recording}
          description="Luồng video trực tiếp - Cổng vào"
          streamUrl={videoApi.getVideoStreamUrl()}
        />
        <CameraCard
          title="Camera cổng ra"
          color="red"
          connected={cameraStatus.cameraStatus.exit.connected}
          recording={cameraStatus.cameraStatus.exit.recording}
          description="Luồng video trực tiếp - Cổng ra"
          streamUrl={videoApi.getVideoStreamUrl()}
        />
      </div>

      {/* === TOOLS: Giả lập & Lịch sử === */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Giả lập dữ liệu */}
          <form className="flex items-end space-x-3" onSubmit={handleSimulateSubmit}>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giả lập plate
              </label>
              <input
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="VD: 59A1 12345"
                value={simulatePlate}
                onChange={(e) => setSimulatePlate(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={plateSimulation.loading}
              className="h-10 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {plateSimulation.loading ? "Đang gửi..." : "Gửi"}
            </button>
          </form>

          {/* Tra cứu lịch sử */}
          <form className="flex items-end space-x-3" onSubmit={handleHistorySubmit}>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tra cứu lịch sử theo biển số
              </label>
              <input
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="VD: 59A1 12345"
                value={historyPlate}
                onChange={(e) => setHistoryPlate(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={platesHistory.loading}
              className="h-10 px-4 rounded-lg bg-gray-700 text-white hover:bg-gray-800 disabled:opacity-50 transition"
            >
              {platesHistory.loading ? "Đang tải..." : "Tải lịch sử"}
            </button>
          </form>
        </div>

        {/* Error messages */}
        {plateSimulation.error && (
          <div className="p-3 rounded bg-red-50 text-red-600 text-sm">
            ❌ {plateSimulation.error}
          </div>
        )}
        {platesHistory.error && (
          <div className="p-3 rounded bg-red-50 text-red-600 text-sm">
            ❌ {platesHistory.error}
          </div>
        )}
        {platesHistory.loading && (
          <div className="p-3 rounded bg-blue-50 text-blue-600 text-sm">
            ⏳ Đang tải lịch sử...
          </div>
        )}

        {/* History results */}
        {platesHistory.history.length > 0 && (
          <div className="mt-4">
            <PlatesTable
              currentPlates={platesHistory.history}
              getStatusColor={() => "text-gray-700 bg-gray-100"}
              title={`Lịch sử: ${historyPlate} (${platesHistory.history.length} bản ghi)`}
            />
          </div>
        )}
      </div>

      {/* === TABS === */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="flex border-b border-gray-200">
          {[
            { id: "activity", label: "Nhật ký hoạt động", count: activityLog.length },
            { 
              id: "in", 
              label: "Danh sách xe vào",
              count: latestPlates.plates.filter(p => p.status === "vào").length
            },
            { 
              id: "out", 
              label: "Danh sách xe ra",
              count: latestPlates.plates.filter(p => p.status === "ra").length
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

        {/* === NỘI DUNG TAB === */}
        <div className="p-6">
          {latestPlates.loading && activityLog.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              Đang tải dữ liệu...
            </div>
          ) : (
            <>
              {activeTab === "activity" && (
                <PlatesTable
                  currentPlates={activityLog}
                  getStatusColor={getStatusColor}
                  title="Nhật ký hoạt động"
                />
              )}
              {activeTab === "in" && (
                <PlatesTable
                  currentPlates={latestPlates.plates.filter(
                    (p) => p.status === "vào"
                  )}
                  getStatusColor={getStatusColor}
                  title="Danh sách xe vào"
                />
              )}
              {activeTab === "out" && (
                <PlatesTable
                  currentPlates={latestPlates.plates.filter(
                    (p) => p.status === "ra"
                  )}
                  getStatusColor={getStatusColor}
                  title="Danh sách xe ra"
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;