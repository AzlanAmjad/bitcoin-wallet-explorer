import React from "react";
import robotLogo from "../assets/robot.png";

const ClankerInsights = ({ className = "" }) => (
  <div className={`bg-white rounded shadow p-4 flex flex-col ${className}`}>
    <div className="flex items-center gap-2 mb-2">
      <img src={robotLogo} alt="Clanker" className="h-7 w-7 object-contain" />
      <span className="font-semibold text-gray-800">Clanker Insights</span>
    </div>
    <div className="text-gray-600 text-sm">
      Bitcoin's mempool is currently healthy. Network activity is steady. No major anomalies detected. (Mocked AI insight)
    </div>
  </div>
);

export default ClankerInsights;
