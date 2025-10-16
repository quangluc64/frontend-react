import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Main from "./components/layout/Main";
import EmployeeManage from "./pages/EmployeeManage";

function App() {
  return (
    <Routes>
      <Route element={<Main />}>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/manage" element={<ManagePage />} /> */}
        <Route path="/employees" element={<EmployeeManage />} />
      </Route>
    </Routes>
  );
}
export default App;
