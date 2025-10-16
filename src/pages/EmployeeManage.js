import React from "react";
import {
  useEmployeeSearch,
  useAddEmployee,
  useEmployeeForm,
} from "../hooks/useEmployee";

const EmployeeManage = () => {
  const employeeSearch = useEmployeeSearch();
  const addEmployee = useAddEmployee();
  const employeeForm = useEmployeeForm();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchData = {
      name: formData.get("name") || "",
      position: formData.get("position") || "",
      xe: formData.get("xe") || "",
    };

    // Chỉ search nếu có ít nhất một field
    if (searchData.name || searchData.position || searchData.xe) {
      await employeeSearch.searchEmployees(searchData);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (employeeForm.validateForm()) {
      const result = await addEmployee.addEmployee(employeeForm.formData);
      if (result) {
        employeeForm.resetForm();
        // Refresh search results
        await employeeSearch.searchEmployees({});
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quản lý nhân viên</h1>
        <p className="text-gray-600 mt-1">Tìm kiếm và thêm nhân viên mới</p>
      </div>

      {/* Form tìm kiếm */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Tìm kiếm nhân viên</h2>
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên nhân viên
            </label>
            <input
              type="text"
              name="name"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tên nhân viên"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chức vụ
            </label>
            <input
              type="text"
              name="position"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập chức vụ"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biển số xe
            </label>
            <input
              type="text"
              name="xe"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="VD: 59A1 12345"
            />
          </div>
          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={employeeSearch.loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {employeeSearch.loading ? "Đang tìm..." : "Tìm kiếm"}
            </button>
            <button
              type="button"
              onClick={employeeSearch.clearSearch}
              className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Xóa kết quả
            </button>
          </div>
        </form>

        {employeeSearch.error && (
          <div className="mt-4 p-3 rounded bg-red-50 text-red-600 text-sm">
            {employeeSearch.error}
          </div>
        )}
      </div>

      {/* Form thêm nhân viên */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Thêm nhân viên mới</h2>
        <form onSubmit={handleAddEmployee} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên nhân viên *
              </label>
              <input
                type="text"
                value={employeeForm.formData.name}
                onChange={(e) =>
                  employeeForm.updateField("name", e.target.value)
                }
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  employeeForm.errors.name ? "border-red-500" : ""
                }`}
                placeholder="Nhập tên nhân viên"
              />
              {employeeForm.errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {employeeForm.errors.name}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chức vụ *
              </label>
              <input
                type="text"
                value={employeeForm.formData.position}
                onChange={(e) =>
                  employeeForm.updateField("position", e.target.value)
                }
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  employeeForm.errors.position ? "border-red-500" : ""
                }`}
                placeholder="Nhập chức vụ"
              />
              {employeeForm.errors.position && (
                <p className="text-red-500 text-sm mt-1">
                  {employeeForm.errors.position}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Biển số xe *
              </label>
              <input
                type="text"
                value={employeeForm.formData.xe}
                onChange={(e) => employeeForm.updateField("xe", e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  employeeForm.errors.xe ? "border-red-500" : ""
                }`}
                placeholder="VD: 59A1 12345"
              />
              {employeeForm.errors.xe && (
                <p className="text-red-500 text-sm mt-1">
                  {employeeForm.errors.xe}
                </p>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={addEmployee.loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {addEmployee.loading ? "Đang thêm..." : "Thêm nhân viên"}
            </button>
            <button
              type="button"
              onClick={employeeForm.resetForm}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Làm mới
            </button>
          </div>
        </form>

        {addEmployee.error && (
          <div className="mt-4 p-3 rounded bg-red-50 text-red-600 text-sm">
            {addEmployee.error}
          </div>
        )}
        {addEmployee.success && (
          <div className="mt-4 p-3 rounded bg-green-50 text-green-600 text-sm">
            Thêm nhân viên thành công!
          </div>
        )}
      </div>

      {/* Kết quả tìm kiếm */}
      {employeeSearch.employees.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Kết quả tìm kiếm ({employeeSearch.employees.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Tên nhân viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Chức vụ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Biển số xe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Thời gian thêm
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {employeeSearch.employees.map((employee, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {employee.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {employee.position}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {employee.xe}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {employee.time_added
                        ? new Date(employee.time_added).toLocaleString("vi-VN")
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManage;
