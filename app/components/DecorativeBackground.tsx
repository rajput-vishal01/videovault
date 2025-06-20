import React from "react";

const DecorativeBackground = () => {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
      {/* Subtle base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-100 to-slate-200" />

      {/* Deeper, elegant gradient blobs with lilac and muted tones */}
      <div className="absolute -top-40 -right-40 w-[38rem] h-[38rem] bg-gradient-to-bl from-indigo-400/50 to-violet-300/30 rounded-full blur-[150px] animate-float-fast" />
      <div className="absolute top-1/3 -left-56 w-[30rem] h-[30rem] bg-gradient-to-tr from-purple-400/40 to-fuchsia-300/25 rounded-full blur-[120px] animate-float-slow" />
      <div
        className="absolute top-1/2 right-1/4 w-44 h-44 bg-gradient-to-tl from-pink-500/35 to-purple-300/20 rounded-full blur-[80px] animate-pulse"
        style={{ animationDuration: "8s" }}
      />
      <div className="absolute bottom-1/4 -left-28 w-[32rem] h-[32rem] bg-gradient-to-tr from-lilac-400/35 to-violet-200/20 rounded-full blur-[120px] animate-float-medium" />
      <div className="absolute -bottom-36 -right-28 w-[36rem] h-[36rem] bg-gradient-to-tl from-violet-400/40 to-indigo-200/20 rounded-full blur-[150px] animate-float-slow" />
    </div>
  );
};

export default DecorativeBackground;
