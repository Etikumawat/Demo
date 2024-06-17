// ** React Imports
import { useRef, useState } from "react";

// ** Custom Components
import Wizard from "@components/wizard";

// ** Steps
import FinancialDetails from "./steps-with-validation/FinancialDetails";
import ReviewAndSubmit from "./steps-with-validation/ReviewAndSubmit";
import BusinessDetails from "./steps-with-validation/BusinessDetails";
import CompamyDetails from "./steps-with-validation/CompamyDetails";
import TaxDetails from "./steps-with-validation/TaxDetails";
import AdditionalDetails from "./steps-with-validation/AdditionalDetails";

const WizardHorizontal = ({ data }) => {
  // ** Ref
  const ref = useRef(null);

  // ** State
  const [stepper, setStepper] = useState(null);
  const steps = [
    {
      id: "company-details",
      title: "Company Details",
      subtitle: "Enter Your Company Details.",
      content: <CompamyDetails data={data} stepper={stepper} />,
    },
    {
      id: "BusinessDetails",
      title: "Business Details",
      subtitle: "Add Business Details",
      content: <BusinessDetails data={data} stepper={stepper} />,
    },
    {
      id: "financial-details",
      title: "Financial Details",
      subtitle: "Add Financial Details",
      content: <FinancialDetails data={data} stepper={stepper} />,
    },
    {
      id: "tax-details",
      title: "Tax Details",
      subtitle: "Tax Details",
      content: <TaxDetails data={data} stepper={stepper} />,
    },
    // {
    //   id: "additional-details",
    //   title: "Additional Details",
    //   subtitle: "Additional Details",
    //   content: <AdditionalDetails data={data} stepper={stepper} />,
    // },
    {
      id: "review-and-submit",
      title: "Review and Submit",
      subtitle: "Review and Submit",
      content: <ReviewAndSubmit stepper={stepper} />,
    },
  ];

  return (
    <div className="horizontal-wizard">
      <Wizard instance={(el) => setStepper(el)} ref={ref} steps={steps} />
    </div>
  );
};

export default WizardHorizontal;
