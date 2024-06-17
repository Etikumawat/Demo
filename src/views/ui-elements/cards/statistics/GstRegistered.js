// ** React Imports
// ** Custom Components
import StatsWithAreaChart from "@components/widgets/stats/StatsWithAreaChart";
import { Beenhere } from "@mui/icons-material";

const GstRegistered = ({ kFormatter, gstData }) => {
  // ** State
  const data = {
    series: [
      {
        name: "Suppliers",
        data: [15, 40, 36, 40, 39, 55, 60],
      },
    ],
    analyticsData: {
      gstRegistered: gstData?.gstRegistered,
      panRegistered: gstData?.panRegistered,
    },
  };
  return data !== null ? (
    <>
      <div>
        <StatsWithAreaChart
          icon={<Beenhere sx={{ fontSize: 40 }} />}
          color="success"
          stats={kFormatter(data.analyticsData.gstRegistered)}
          statTitle="GST Verified Vendor"
          series={data.series}
          type="area"
        />
      </div>
    </>
  ) : null;
};

export default GstRegistered;
