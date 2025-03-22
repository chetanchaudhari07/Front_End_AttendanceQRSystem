import { useState, useEffect } from "react";
import axios from "axios";

const QRCodePage = () => {
  const [qrCode, setQRCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const employeeId = localStorage.getItem("employeeId");
        const token = localStorage.getItem("token");

        if (!employeeId || !token) {
          setError("Authentication required");
          return;
        }

        const res = await axios.get(
          `https://attendanceqrsystem.onrender.com/qr/generate-qr/${employeeId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setQRCode(res.data.qrCode);
      } catch (err: any) {
        setError("Failed to fetch QR code");
      }
    };

    fetchQRCode();
  }, []);

  console.log(qrCode);

   return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : qrCode ? (
        <img src={qrCode} alt="QR Code" className="w-48 h-48" />
      ) : (
        <p className="text-gray-500">Loading QR Code...</p>
      )}
    </div>
  );
};

export default QRCodePage;
