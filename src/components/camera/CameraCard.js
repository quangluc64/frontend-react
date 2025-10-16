import React from "react";

const CameraCard = ({
  title,
  color,
  connected,
  recording,
  description,
  streamUrl,
}) => {
  const bgColor =
    color === "green"
      ? "from-green-500 to-green-600"
      : "from-red-500 to-red-600";
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className={`bg-gradient-to-r ${bgColor} px-6 py-4`}>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                connected ? "bg-green-300" : "bg-red-300"
              }`}
            ></div>
            <span className="text-white text-sm">
              {connected ? "Đang kết nối" : "Mất kết nối"}
            </span>
          </div>
        </div>
      </div>
      <div className="relative bg-gray-900 aspect-video">
        {streamUrl ? (
          <img
            src={streamUrl}
            alt={description || title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Ẩn ảnh khi stream lỗi để hiện overlay
              e.currentTarget.style.display = "none";
            }}
          />
        ) : null}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-70">
          <p className="text-lg font-medium">LIVE</p>
          <p className="text-sm">{description}</p>
        </div>
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
          {recording ? "Đang ghi" : "Tạm dừng"}
        </div>
      </div>
    </div>
  );
};

export default CameraCard;
