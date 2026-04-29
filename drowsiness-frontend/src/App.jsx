import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 3000); // auto refresh
    return () => clearInterval(interval);
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
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🚗 Driver Drowsiness Dashboard</h1>

      {alerts.length === 0 ? (
        <p>No alerts yet...</p>
      ) : (
        alerts.map((alert, index) => (
          <div key={index} style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "10px",
            margin: "10px 0"
          }}>
            <h3>Status: {alert.status}</h3>
            <p>Time: {alert.time}</p>
            <p>Location: {alert.location}</p>

            <img
              src={`http://localhost:5000/uploads/${alert.image}`}
              alt="alert"
              width="250"
            />
          </div>
        ))
      )}
    </div>
  );
}

export default App;