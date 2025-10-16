import React from "react";

const PlatesTable = ({ currentPlates, getStatusColor, title }) => {
  if (!currentPlates || currentPlates.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="text-center py-8 text-gray-500">
          <svg
            className="w-16 h-16 mx-auto mb-2 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p>Không có dữ liệu</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {title}
        <span className="ml-2 text-sm font-normal text-gray-500">
          ({currentPlates.length} bản ghi)
        </span>
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Biển số
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Thông tin
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Thời gian
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {currentPlates.map((p, index) => (
              <tr key={p.id || index} className="hover:bg-gray-50 transition">
                {/* Biển số */}
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-xs">
                          {p.plate ? p.plate.substring(0, 2) : "??"}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {p.plate || "N/A"}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Thông tin nhân viên */}
                <td className="px-6 py-4">
                  {p.name ? (
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {p.name}
                      </div>
                      <div className="text-sm text-gray-500">{p.position}</div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400 italic">Người lạ</div>
                  )}
                </td>

                {/* Thời gian */}
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{p.time || "N/A"}</div>
                </td>

                {/* Trạng thái */}
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-6 py-2 rounded-lg text-base font-semibold ${
                      getStatusColor
                        ? getStatusColor(p.status)
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {p.status === "vào"
                      ? "Vào"
                      : p.status === "ra"
                      ? "Ra"
                      : p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlatesTable;
