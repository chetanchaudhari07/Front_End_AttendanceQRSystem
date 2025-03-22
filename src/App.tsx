import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './page/login';
import QRCodePage from './page/qrpage';
import ScanQRPage from './page/ScanQRPage';


function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/qr" element={<QRCodePage />} />
          <Route path="/scan-qr/:employeeId" element={<ScanQRPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;