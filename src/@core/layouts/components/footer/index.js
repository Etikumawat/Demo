// ** Icons Import
import { useState } from "react";
import CookieConsent from "../../../../views/components/CookieConsent";

const Footer = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  return (
    <p className="clearfix mb-0">
      <span className="float-md-start">
        SupplierX © {new Date().getFullYear()} Powered By {""}
        <a
          href="https://www.aeonx.digital/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            borderBottom: isHovered
              ? "2px solid #f26c13"
              : "2px solid transparent",
            transition: "border-bottom 0.3s ease-in-out",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          https://www.aeonx.digital
        </a>
        {/* <span className="d-none d-sm-inline-block">, All rights Reserved</span> */}
      </span>
      {/* <span className="float-md-end d-none d-md-block">
        Hand-crafted & Made by Aeonx Digital
      </span> */}
    </p>
  );
};

export default Footer;
