import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ScanQRPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isMarkedRef = useRef(false);
    const [message, setMessage] = useState("Marking attendance...");
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    useEffect(() => {
        const markAttendance = async () => {
            if (isMarkedRef.current) return;
            isMarkedRef.current = true;

            const urlParts = location.pathname.split("/");
            const employeeId = urlParts[urlParts.length - 1];

            if (!employeeId) {
                setMessage("Invalid QR code! Employee ID is missing.");
                setStatus("error");
                return;
            }

            try {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        try {
                            const { latitude, longitude } = position.coords;
                            const token = localStorage.getItem("token");

                            const response = await axios.post(
                                `http://localhost:8000/attendance/markAttendance/${employeeId}`,
                                { latitude, longitude },
                                { headers: { Authorization: `Bearer ${token}` } }
                            );

                            setMessage(response.data.message);
                            setStatus("success");
                            setTimeout(() => window.close(), 2000);
                        } catch (error) {
                            handleError(error);
                            setTimeout(() => window.close(), 2000);
                        }
                    },
                    () => {
                        setMessage("Location permission denied. Please enable GPS.");
                        setStatus("error");
                        isMarkedRef.current = false;
                    }
                );
            } catch (error) {
                handleError(error);
            }
        };

        const handleError = (error: any) => {
            console.error("Attendance marking error:", error);
            isMarkedRef.current = false;
            setStatus("error");

            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || "Failed to mark attendance.";
                setMessage(errorMessage);
            } else {
                setMessage("An unexpected error occurred.");
            }
        };

        markAttendance();
    }, [location, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
                <div className={`mb-4 text-${status === "error" ? "red" : status === "success" ? "green" : "blue"}-600`}>
                    {status === "loading" && (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" />
                    )}
                    {status === "error" && (
                        <svg className="h-8 w-8 text-red-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                    {status === "success" && (
                        <svg className="h-8 w-8 text-green-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>
                <p className={`text-lg font-medium text-${status === "error" ? "red" : status === "success" ? "green" : "blue"}-600`}>
                    {message}
                </p>
            </div>
        </div>
    );
};

export default ScanQRPage;