import React from "react";

interface StatusProps {
  text: string;
  icon: React.ElementType;
  bg: string;
  color: string;
}

const Status: React.FC<StatusProps> = ({ text, icon: Icon, bg, color }) => {
  return (
    <div
      className={`
    ${bg}
    ${color}
    px-2
    rounded
    flex
    items-center
    gap-1
    `}
    >
      {text} <Icon size={15} />
    </div>
  );
};

export default Status;
