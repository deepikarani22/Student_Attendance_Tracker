import React from "react";
import { useNavigate } from "react-router-dom";

const ClassInfoCard = ({ classData }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/teacher/class/${classData.name}`);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 cursor-pointer hover:bg-white/20 transition-all shadow-lg border border-white/20">
      <h2 className="text-white text-xl font-semibold mb-4">{classData.name}</h2>
      <p className="text-gray-300 text-sm mb-2">
        Students: <span className="font-semibold text-white">{classData.students?.length || 0}</span>
      </p>
      {classData.createdAt && (
        <p className="text-gray-400 text-xs mb-4">
          Created: {new Date(classData.createdAt).toLocaleDateString()}
        </p>
      )}
      <button
        onClick={handleClick}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 mt-2"
      >
        View Class
      </button>
    </div>
  );
};

export default ClassInfoCard;


/*import React from "react";

function ClassInfoCard({ attd }) {
  return (
    <div className="card-glass border border-gray-900 rounded-xl p-4 shadow-md flex flex-col items-center justify-between h-40 w-full">
      <h2 className="text-3xl text-center font-semibold text-gray-900 tracking-wide">
        {attd.name}
      </h2>
    </div>
  );
}

export default ClassInfoCard;*/
