import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/**
 * This data represents different ecosystem types
 * You will later replace this with API data (axios)
 */
const ecosystemData = [
  {
    name: "Reserve Forest",
    forestCover: 78,
    biodiversity: 82,
  },
  {
    name: "Protected Forest",
    forestCover: 65,
    biodiversity: 70,
  },
  {
    name: "Wildlife Sanctuary",
    forestCover: 72,
    biodiversity: 88,
  },
  {
    name: "Urban Green Zone",
    forestCover: 40,
    biodiversity: 35,
  },
];

const EcosystemStats = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-green-800">
        Ecosystem Health Overview
      </h2>

      <div className="w-full h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ecosystemData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Bar dataKey="forestCover" name="Forest Cover (%)" fill="#166534" />
            <Bar dataKey="biodiversity" name="Biodiversity Index" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EcosystemStats;
