import React from "react";

export const Card = ({ titulo, valor, color = "bg-[#5B6BFF]" }) => {
  return (
    <div
      className={`flex flex-col justify-center items-center p-8 rounded-2xl shadow-lg text-white ${color} hover:shadow-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm bg-opacity-90 border border-white/20`}
    >
      <h2 className="text-5xl font-bold mb-3 drop-shadow-md">{valor}</h2>
      <p className="text-sm font-medium uppercase tracking-wider opacity-90">{titulo}</p>
    </div>
  );
};