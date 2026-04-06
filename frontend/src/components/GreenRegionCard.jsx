const GreenRegionCard = ({ region }) => {
  const {
    name,
    type,
    area,
    forestCover,
    biodiversityIndex,
    threatLevel,
  } = region;

  // Threat color logic
  const threatColor =
    threatLevel === "High"
      ? "text-red-600"
      : threatLevel === "Medium"
      ? "text-yellow-600"
      : "text-green-600";

  return (
    <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition">
      
      {/* Title */}
      <h3 className="text-lg font-semibold text-green-800 mb-1">
        {name}
      </h3>

      {/* Type */}
      <p className="text-sm text-gray-600 mb-3">
        Type: <span className="font-medium">{type}</span>
      </p>

      {/* Details */}
      <div className="space-y-1 text-sm text-gray-700">
        <p>
          Area: <span className="font-medium">{area} km²</span>
        </p>
        <p>
          Forest Cover:{" "}
          <span className="font-medium">{forestCover}%</span>
        </p>
        <p>
          Biodiversity Index:{" "}
          <span className="font-medium">{biodiversityIndex}</span>
        </p>
      </div>

      {/* Threat Level */}
      <div className="mt-4">
        <span className={`font-semibold ${threatColor}`}>
          Threat Level: {threatLevel}
        </span>
      </div>
    </div>
  );
};

export default GreenRegionCard;
