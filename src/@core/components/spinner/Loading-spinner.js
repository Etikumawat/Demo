import classnames from "classnames";
import loading from "../../../assets/images/loading09.gif";
const ComponentSpinner = ({ className }) => {
  return (
    <div
      className={classnames("fallback-spinner", {
        [className]: className,
      })}
    >
      {/* <img className="fallback-logo" src={loading} width={500} alt="logo" /> */}
      <div className="loading">
        {/* <div className="effect-1 effects"></div> */}
        {/* <div className="effect-2 effects"></div> */}
        <div className="effect-3 effects"></div>
      </div>
    </div>
  );
};

export default ComponentSpinner;
