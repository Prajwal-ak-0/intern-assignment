import React from "react";

interface LogoProps {}

const Logo: React.FC<LogoProps> = () => {
  return (
    <div className="flex items-center p-2 cursor-pointer">
      <img src="/logo.png" alt="Logo" className="h-1- w-auto" />
    </div>
  );
};

export default Logo;
