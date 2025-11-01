import React, { useState } from "react";

function NotificationIcon() {
  const [count, setCount] = useState(3);
  const handleClick = () => {
    alert("Open notifications");
    setCount(0);
  };
  return (
    <div className="relative inline-block" onClick={handleClick}>
      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/6 hover:bg-white/10 cursor-pointer">
        🔔
      </div>

      {count > 0 && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center">
          {count}
        </div>
      )}
    </div>
  );
}

export default NotificationIcon;
