import React from "react";

const StatsCard = (props) => {
  return (
    <div class="w-80 rounded-lg shadow-lg overflow-hidden bg-white">
      <div class="p-4 flex items-center">
        <div class="p-3 rounded-full text-primary bg-primary bg-opacity-10 mr-8">
          {props.icon}
        </div>
        <div>
          <p class="mb-2 text-xl font-medium text-secondary ">{props.title}</p>
          <p class="text-2xl font-semibold text-secondary">{props.stat}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
