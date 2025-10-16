# Hướng dẫn kết nối Frontend React với Backend Python

## Tổng quan

Dự án này bao gồm:

- **Backend**: Flask API server (Python) chạy trên port 5000
- **Frontend**: React application với Tailwind CSS

## Cấu trúc API

### Backend Endpoints (Flask - Port 5000)

- `GET /latest_plates` - Lấy danh sách biển số mới nhất
- `GET /plates-history?xe=<plate>` - Lấy lịch sử biển số
- `POST /update_plate` - Cập nhật biển số (giả lập)
- `POST /search` - Tìm kiếm nhân viên
- `POST /add_employee` - Thêm nhân viên mới
- `GET /video` - Stream video từ camera

### Frontend Routes (React - Port 3000)

- `/` - Trang chủ (hiển thị camera và danh sách biển số)
- `/manage` - Quản lý người dùng
- `/employees` - Quản lý nhân viên

## Cách chạy dự án

### 1. Chạy Backend (Python Flask)

```bash
cd backend
python app.py
```

Backend sẽ chạy trên: http://127.0.0.1:5000

### 2. Chạy Frontend (React)

```bash
cd frontend-react
npm install
npm start
```

Frontend sẽ chạy trên: http://localhost:3000

## Cấu hình API

### Development Mode

- Frontend sử dụng proxy để gọi API backend
- Proxy được cấu hình trong `package.json`: `"proxy": "http://127.0.0.1:5000"`
- API calls sẽ tự động được proxy đến backend

### Production Mode

- Cần set biến môi trường `REACT_APP_API_BASE` để chỉ định URL backend
- Ví dụ: `REACT_APP_API_BASE=https://your-backend-domain.com`

## Cấu trúc Code Frontend

### API Service (`src/services/api.js`)

- `platesApi`: Quản lý API liên quan đến biển số
- `employeeApi`: Quản lý API liên quan đến nhân viên
- `videoApi`: Quản lý API video stream

### Custom Hooks (`src/hooks/`)

- `usePlates.js`: Hooks quản lý data biển số
- `useEmployee.js`: Hooks quản lý data nhân viên

### Components

- `HomePage.js`: Trang chủ với camera và danh sách biển số
- `EmployeeManage.js`: Trang quản lý nhân viên
- `PlatesTable.js`: Component hiển thị bảng biển số

## Tính năng chính

### 1. Trang chủ (`/`)

- Hiển thị camera stream từ backend
- Danh sách biển số mới nhất (auto-refresh mỗi 2 giây)
- Giả lập biển số để test
- Tra cứu lịch sử biển số
- Tabs: Nhật ký hoạt động, Xe vào, Xe ra

### 2. Quản lý nhân viên (`/employees`)

- Tìm kiếm nhân viên theo tên, chức vụ, biển số
- Thêm nhân viên mới
- Hiển thị danh sách kết quả tìm kiếm

### 3. API Integration

- Sử dụng Axios để gọi API
- Error handling và loading states
- Auto-retry và polling cho real-time data

## Troubleshooting

### Lỗi CORS

- Đảm bảo backend có `CORS(app)` được enable
- Trong development, sử dụng proxy trong `package.json`
- Trong production, cấu hình đúng `REACT_APP_API_BASE`

### Lỗi kết nối API

- Kiểm tra backend có đang chạy trên port 5000
- Kiểm tra proxy configuration
- Xem console browser để debug API calls

### Lỗi MongoDB

- Đảm bảo MongoDB đang chạy
- Kiểm tra connection string trong `backend/app.py`

## Dependencies

### Backend

- Flask
- Flask-CORS
- PyMongo
- OpenCV
- Python 3.7+

### Frontend

- React 19.2.0
- React Router DOM 7.9.4
- Axios 1.6.0
- Tailwind CSS 3.4.18
- React Hot Toast 2.6.0
