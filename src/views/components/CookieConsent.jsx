// CookieConsent.js
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import "./cookieConsent.css";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = Cookies.get("cookie_consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    Cookies.set("cookie_consent", "accepted", { expires: 365 });
    setIsVisible(false);
  };

  const handleDecline = () => {
    Cookies.set("cookie_consent", "declined", { expires: 365 });
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-consent">
      <div className="cookie-consent-content">
        <p>
          We use cookies to ensure you get the best experience on our website.
          By continuing to use our site, you consent to our use of cookies.{" "}
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
            Learn more
          </a>
        </p>
        <div className="cookie-consent-buttons">
          <button onClick={handleAccept} className="btn-accept">
            Accept
          </button>
          <button onClick={handleDecline} className="btn-decline">
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
