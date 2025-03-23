import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ScanQRPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMarkedRef = useRef(false);

  useEffect(() => {
    const markAttendance = async () => {
      if (isMarkedRef.current) return;
      isMarkedRef.current = true; 

      const urlParts = location.pathname.split("/");
      const employeeId = urlParts[urlParts.length - 1];

      if (!employeeId) {
        alert("Invalid QR code! Employee ID is missing.");
        
        return;
      }

      try {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const token = localStorage.getItem("token");

           
            const response = await axios.post(
              `http://localhost:8000/attendance/markAttendance/${employeeId}`,
              { latitude, longitude },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            alert(response.data.message);
            

            setTimeout(()=>{
                window.close();

            },1000)
          },
          () => {
            alert("Location permission denied. Please enable GPS.");
            isMarkedRef.current = false;
          }
        );
      } catch (error) {
        if (axios.isAxiosError(error)) {
          alert(error.response?.data?.message || "Failed to mark attendance.");
        } else {
          alert("Failed to mark attendance.");
        }
        isMarkedRef.current = false;
            window.close();
      }
    };

    markAttendance();
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">Marking attendance...</p>
    </div>
  );
};

export default ScanQRPage;
