import React from "react";
import SeetechLogo from "@/media/logo/seetech-logo.png";

export default function Logo({ height = 40, className = "" }) {
  return (
    <img
      src={SeetechLogo}
      alt="SEETECH Logo"
      style={{ height: `${height}px`, width: "auto" }}
      className={`object-contain ${className}`}
    />
  );
}
