import React from 'react';

/** @param {{ label: string }} props */
const TagChip = ({ label }) => (
  <span className="
    text-[0.68rem] font-medium font-mono tracking-[0.02em]
    text-[#8b949e] bg-white/5 border border-white/10
    rounded px-[10px] py-[3px]
  ">
    {label}
  </span>
);

export default TagChip;
