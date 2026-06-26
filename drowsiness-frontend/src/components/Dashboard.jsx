import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await axios.post("http://localhost:5000/location", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });

          console.log("📍 GPS sent");
        } catch (err) {
          console.log("GPS error", err);
        }
      },
      (error) => {
        console.log("Location permission denied", error);
      }
    );
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/alerts");
      setAlerts(res.data);
    } catch (err) {
      console.log("Error fetching alerts");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
        🚗 Driver Drowsiness Dashboard
      </h1>

      <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg text-center mb-8 font-semibold">
        🟢 Real-Time Monitoring Active
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        <div className="bg-white p-4 rounded-xl shadow-lg text-center">
          <h2 className="text-lg font-semibold">Total Alerts</h2>
          <p className="text-3xl font-bold text-blue-600">
            {alerts.length}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-lg text-center">
          <h2 className="text-lg font-semibold">Drowsy Alerts</h2>
          <p className="text-3xl font-bold text-red-600">
            {alerts.filter(a => a.status === "Drowsy").length}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-lg text-center">
          <h2 className="text-lg font-semibold">Yawn Alerts</h2>
          <p className="text-3xl font-bold text-orange-500">
            {alerts.filter(a => a.status === "Yawn").length}
          </p>
        </div>

      </div>

      {alerts.length > 0 && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg mb-6">
          <p className="font-bold text-red-700">
            🚨 Latest Alert: {alerts[0].status}
          </p>

          <p>📍 {alerts[0].location}</p>
        </div>
      )}

      {alerts.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          No alerts yet...
        </div>
      ) : (
        <div className="grid gap-6">

          {alerts.map((alert, index) => (

            <div
              key={index}
              className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-l-8 border-blue-600"
            >

              <div className="flex flex-col lg:flex-row gap-6 items-start">

                <div>

                  <span
                    className={`inline-block px-3 py-1 rounded-full text-white font-semibold ${
                      alert.status === "Drowsy"
                        ? "bg-red-600"
                        : "bg-orange-500"
                    }`}
                  >
                    {alert.status === "Drowsy" ? "😴 Drowsy" : "🥱 Yawn"}
                  </span>

                  <p className="mt-4 text-gray-700">
                    🕒 {new Date(alert.time).toLocaleString()}
                  </p>

                  <p className="mt-2 font-medium">
                    📍 {alert.location || "Location unavailable"}
                  </p>

                  <a
                    href={`https://www.google.com/search?q=${alert.location}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    View Location
                  </a>

                </div>

                <div className="flex-shrink-0">
                  <img
                    src={alert.image}
                    alt="alert"
                    className="rounded-xl shadow-lg w-96 object-cover"
                  />
                </div>

              </div>

            </div>

          ))}

        </div>
      )}

      <footer className="mt-12 text-center text-gray-500 border-t pt-6">

        <p className="font-semibold">
          Real-Time Driver Drowsiness & Yawn Detection System
        </p>

        <p className="mt-2">
          Python • OpenCV • Dlib • React • Express • MongoDB Atlas • Cloudinary
        </p>

        <p className="mt-2 text-sm">
          Developed for Academic Research Project © 2026
        </p>

      </footer>

    </div>
  );
}

export default Dashboard;