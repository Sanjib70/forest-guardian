import { useNavigate } from "react-router-dom";
import pic1 from "../assets/images/pic1.jpg";
import axios from "axios"
import { useEffect, useState } from "react"

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import EcosystemStats from "../components/EcosystemStats";

const API = import.meta.env.VITE_API_URL

const miniGraphData = [
  { year: "2019", cover: 68 },
  { year: "2020", cover: 70 },
  { year: "2021", cover: 72 },
  { year: "2022", cover: 75 },
  { year: "2023", cover: 78 },
];

const Home = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    forestCount: 0,
    issueCount: 0,
    forestzones: 0,
  })


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token")

        const forestRes = await axios.get(`${API}/api/forest-data`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        const issueRes = await axios.get(`${API}/api/issues`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        const forestData = forestRes.data.data.forestData

        const uniqueZones = new Set(forestData.map(item => item.zone))

        setStats({
          forestCount: forestData.length,
          issueCount: issueRes.data.data.issues.length,
          forestzones: uniqueZones.size
        })

      } catch (err) {
        console.error("Error fetching stats:", err)
      }
    };

    fetchStats()
  }, []);


  return (
    <div className="w-full">
      {/* ================= HERO SECTION ================= */}
      <section className="relative h-[85vh] w-full">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${pic1})`,
        }}
/>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-8 flex items-center justify-between">
          
          {/* LEFT TEXT */}
          <div className="text-white max-w-xl">
            <h1 className="text-4xl md:text-6xl font-bold">
              Forest Guardian Portal
            </h1>

            <p className="mt-4 text-lg text-gray-200">
              Protecting forests, reserve forests, wildlife sanctuaries, and
              urban green ecosystems through real-time monitoring and
              conservation intelligence.
            </p>
          </div>

          {/* RIGHT MINI LINE GRAPH */}
          <div className="hidden lg:block w-[320px]">
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-4 shadow-lg">
              <h3 className="text-white text-sm font-semibold mb-2">
                Forest Cover Trend (%)
              </h3>

              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={miniGraphData}>
                    <XAxis
                      dataKey="year"
                      tick={{ fill: "#e5e7eb", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#064e3b",
                        border: "none",
                        color: "white",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="cover"
                      stroke="#22c55e"
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BAR GRAPH SECTION ================= */}
      <section className="bg-gray-50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <EcosystemStats />
        </div>
      </section>

      {/* ================= DASHBOARD OPTIONS ================= */}
      <section className="bg-emerald-50 py-12">
        <div className="max-w-7xl mx-auto px-6">

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { label: "Forest Data Entries", value:  stats.forestCount},
              { label: "Issue Reports", value: stats.issueCount },
              { label: "Forest Zones", value: stats.forestzones },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md p-6 text-center"
              >
                <p className="text-3xl font-bold text-green-700">
                  {item.value}
                </p>
                <p className="text-gray-600 mt-1">{item.label}</p>
              </div>
            ))}
          </div>

          {/* CLICKABLE OPTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <OptionCard
              title="Interactive Map"
              desc="Explore forest zones"
              icon="🗺️"
              onClick={() => navigate("/map")}
            />

            <OptionCard
              title="Log Forest Data"
              desc="Record observations"
              icon="📊"
              onClick={() => navigate("/forest-data")}
            />

            <OptionCard
              title="Report Issues"
              desc="Alert authorities"
              icon="🚨"
              onClick={() => navigate("/report-issue")}
            />

            <OptionCard
              title="Health Index"
              desc="View health metrics"
              icon="❤️"
              onClick={() => navigate("/health-index")}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

/* ================= OPTION CARD ================= */
const OptionCard = ({ title, desc, icon, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white rounded-xl shadow-md p-6 text-center
                 hover:shadow-lg hover:-translate-y-1 transition"
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{desc}</p>
    </div>
  );
};

export default Home;
