import React, { useState } from "react";
import * as XLSX from "xlsx";
import { platesApi } from "../../services/api";

const ExcelExport = ({ onExportComplete }) => {
  const [exportType, setExportType] = useState("daily"); // daily hoặc monthly
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Thiết lập ngày mặc định là hôm nay
  React.useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);

  const handleExport = async () => {
    try {
      setLoading(true);
      setError("");

      let platesData = [];
      let statsData = {};
      let fileName = "";

      if (exportType === "daily") {
        if (!selectedDate) {
          setError("Vui lòng chọn ngày");
          return;
        }

        [platesData, statsData] = await Promise.all([
          platesApi.getPlatesByDate(selectedDate),
          platesApi.getDailyStats(selectedDate),
        ]);

        const date = new Date(selectedDate);
        fileName = `danh_sach_bien_so_${date
          .toLocaleDateString("vi-VN")
          .replace(/\//g, "-")}.xlsx`;
      } else {
        if (!selectedYear || !selectedMonth) {
          setError("Vui lòng chọn năm và tháng");
          return;
        }

        [platesData, statsData] = await Promise.all([
          platesApi.getPlatesByMonth(selectedYear, selectedMonth),
          platesApi.getMonthlyStats(selectedYear, selectedMonth),
        ]);

        const monthNames = [
          "Thang_1",
          "Thang_2",
          "Thang_3",
          "Thang_4",
          "Thang_5",
          "Thang_6",
          "Thang_7",
          "Thang_8",
          "Thang_9",
          "Thang_10",
          "Thang_11",
          "Thang_12",
        ];
        fileName = `danh_sach_bien_so_${
          monthNames[selectedMonth - 1]
        }_${selectedYear}.xlsx`;
      }

      // Tạo workbook và worksheet
      const workbook = XLSX.utils.book_new();

      // Chuẩn bị dữ liệu cho Excel
      const excelData = platesData.map((plate, index) => ({
        STT: index + 1,
        "Biển số": plate.plate || "",
        "Thời gian": plate.time || "",
        "Trạng thái": plate.status || "",
        Loại: plate.camera || "",
        Tên: plate.name || "",
        "Chức vụ": plate.position || "",
      }));

      // Tạo worksheet cho dữ liệu
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Đặt độ rộng cột
      const columnWidths = [
        { wch: 5 }, // STT
        { wch: 15 }, // Biển số
        { wch: 20 }, // Thời gian
        { wch: 10 }, // Trạng thái
        { wch: 12 }, // Loại
        { wch: 25 }, // Tên
        { wch: 20 }, // Chức vụ
      ];
      worksheet["!cols"] = columnWidths;

      // Thêm worksheet vào workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách biển số");

      // Tạo worksheet cho thống kê
      const statsDataArray = [
        ["THỐNG KÊ"],
        ["Tổng lượt", statsData.total || 0],
        ["Xe vào", statsData.in || 0],
        ["Xe ra", statsData.out || 0],
        ["Nhân viên", statsData.staff || 0],
        ["Khách", statsData.visitor || 0],
      ];

      const statsWorksheet = XLSX.utils.aoa_to_sheet(statsDataArray);
      statsWorksheet["!cols"] = [{ wch: 15 }, { wch: 10 }];
      XLSX.utils.book_append_sheet(workbook, statsWorksheet, "Thống kê");

      // Xuất file
      XLSX.writeFile(workbook, fileName);

      if (onExportComplete) {
        onExportComplete();
      }
    } catch (err) {
      console.error("Export error:", err);
      setError(err.message || "Lỗi xuất file Excel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Xuất file Excel
      </h3>

      {/* Chọn loại xuất */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chọn loại xuất
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="daily"
              checked={exportType === "daily"}
              onChange={(e) => setExportType(e.target.value)}
              className="mr-2"
            />
            Theo ngày
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="monthly"
              checked={exportType === "monthly"}
              onChange={(e) => setExportType(e.target.value)}
              className="mr-2"
            />
            Theo tháng
          </label>
        </div>
      </div>

      {/* Chọn ngày */}
      {exportType === "daily" && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn ngày
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Chọn tháng */}
      {exportType === "monthly" && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Năm
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tháng
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Tháng {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-600 text-sm">
          ❌ {error}
        </div>
      )}

      {/* Nút xuất */}
      <button
        onClick={handleExport}
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? (
          <>
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
            Đang xuất file...
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Xuất file Excel
          </>
        )}
      </button>
    </div>
  );
};

export default ExcelExport;
