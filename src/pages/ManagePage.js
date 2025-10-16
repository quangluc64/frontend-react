import React, { useState } from "react";
import toast from "react-hot-toast";

const ManagePage = () => {
  const [people, setPeople] = useState([
    {
      id: 1,
      fullName: "Nguyễn Văn A",
      rank: "Đại úy",
      position: "Đội trưởng",
      unit: "Phòng CSGT",
      licensePlate: "30A-123.45",
    },
  ]);

  const [form, setForm] = useState({
    id: null,
    fullName: "",
    rank: "",
    position: "",
    unit: "",
    licensePlate: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // ✅ Xử lý input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // ✅ Reset form
  const resetForm = () => {
    setForm({
      id: null,
      fullName: "",
      rank: "",
      position: "",
      unit: "",
      licensePlate: "",
    });
    setIsEditing(false);
  };

  // ✅ Thêm mới
  const handleAddPerson = () => {
    if (!form.fullName || !form.licensePlate)
      return toast.error("⚠️ Vui lòng nhập đầy đủ Họ tên và Biển số xe!");
    const newPerson = { ...form, id: Date.now() };
    setPeople([...people, newPerson]);
    toast.success("✅ Thêm nhân sự thành công!");
    resetForm();
  };

  // ✅ Sửa
  const handleEditPerson = (person) => {
    setForm(person);
    setIsEditing(true);
  };

  // ✅ Cập nhật
  const handleUpdatePerson = () => {
    setPeople(people.map((p) => (p.id === form.id ? form : p)));
    toast.success("✏️ Cập nhật thông tin thành công!");
    resetForm();
  };

  // ✅ Xoá
  const handleDeletePerson = (id) => {
    if (window.confirm("🗑️ Bạn có chắc muốn xoá người này không?")) {
      setPeople(people.filter((p) => p.id !== id));
      toast.success("🗑️ Đã xoá người dùng thành công!");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Quản lý nhân sự & phương tiện
      </h1>

      {/* Form thêm/sửa */}
      <div className="bg-white p-5 rounded-xl shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="fullName"
            placeholder="Họ và tên"
            value={form.fullName}
            onChange={handleChange}
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="text"
            name="rank"
            placeholder="Cấp bậc"
            value={form.rank}
            onChange={handleChange}
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="text"
            name="position"
            placeholder="Chức vụ"
            value={form.position}
            onChange={handleChange}
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="text"
            name="unit"
            placeholder="Đơn vị"
            value={form.unit}
            onChange={handleChange}
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="text"
            name="licensePlate"
            placeholder="Biển số xe"
            value={form.licensePlate}
            onChange={handleChange}
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleUpdatePerson}
                className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                Cập nhật
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                Huỷ
              </button>
            </>
          ) : (
            <button
              onClick={handleAddPerson}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Thêm nhân sự
            </button>
          )}
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-green-500 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Họ và tên</th>
              <th className="px-4 py-3 text-left">Cấp bậc</th>
              <th className="px-4 py-3 text-left">Chức vụ</th>
              <th className="px-4 py-3 text-left">Đơn vị</th>
              <th className="px-4 py-3 text-left">Biển số xe</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person) => (
              <tr key={person.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{person.fullName}</td>
                <td className="px-4 py-3">{person.rank}</td>
                <td className="px-4 py-3">{person.position}</td>
                <td className="px-4 py-3">{person.unit}</td>
                <td className="px-4 py-3">{person.licensePlate}</td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button
                    onClick={() => handleEditPerson(person)}
                    className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeletePerson(person.id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
            {people.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagePage;
