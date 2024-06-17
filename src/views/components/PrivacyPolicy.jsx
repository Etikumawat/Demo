import React from "react";
import "./privacypolicy.css";
import Footer from "../../@core/layouts/components/footer";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy">
      <h1>Privacy Policy</h1>
      <p>Last updated: June 6, 2024</p>

      <p>
        This Privacy Policy describes how your personal information is
        collected, used, and shared when you visit or make a purchase from our
        website.
      </p>

      <h2>Information We Collect</h2>
      <p>
        We collect information from you when you visit our site, register on our
        site, place an order, subscribe to our newsletter, or fill out a form.
        This information may include your name, email address, mailing address,
        phone number, and payment information.
      </p>

      <h2>How We Use Your Information</h2>
      <p>
        The information we collect from you may be used in one of the following
        ways:
      </p>
      <ul>
        <li>To personalize your experience</li>
        <li>To improve our website</li>
        <li>To process transactions</li>
        <li>To send periodic emails</li>
      </ul>

      <h2>How We Protect Your Information</h2>
      <p>
        We implement a variety of security measures to maintain the safety of
        your personal information when you place an order or enter, submit, or
        access your personal information.
      </p>

      <h2>Sharing Your Information</h2>
      <p>
        We do not sell, trade, or otherwise transfer to outside parties your
        personally identifiable information. This does not include trusted third
        parties who assist us in operating our website, conducting our business,
        or servicing you, so long as those parties agree to keep this
        information confidential.
      </p>

      <h2>Your Consent</h2>
      <p>By using our site, you consent to our privacy policy.</p>

      <h2>Changes to Our Privacy Policy</h2>
      <p>
        If we decide to change our privacy policy, we will post those changes on
        this page, and/or update the Privacy Policy modification date above.
      </p>

      <h2>Contacting Us</h2>
      <p>
        If there are any questions regarding this privacy policy, you may
        contact us using the information below:
      </p>
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <hr></hr>
        <Footer />
        <hr />
      </div>
    </div>
  );
};

export default PrivacyPolicy;
