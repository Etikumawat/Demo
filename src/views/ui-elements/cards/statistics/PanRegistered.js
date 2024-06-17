import { Beenhere } from "@mui/icons-material";
// ** Custom Components
import StatsWithAreaChart from "@components/widgets/stats/StatsWithAreaChart";

const PanRegistered = ({ kFormatter, panData }) => {
  // ** State
  const data = {
    series: [
      {
        name: "Suppliers",
        data: [12, 22, 30, 22, 38, 39, 42],
      },
    ],
    analyticsData: {
      gstRegistered: panData?.gstRegistered,
      panRegistered: panData?.panRegistered,
    },
  };
  return data !== null ? (
    <>
      <div>
        <StatsWithAreaChart
          icon={<Beenhere sx={{ fontSize: 40 }} />}
          color="primary"
          stats={kFormatter(data.analyticsData.panRegistered)}
          statTitle="PAN Verified Vendor"
          series={data.series}
          type="area"
        />
      </div>
    </>
  ) : null;
};

export default PanRegistered;
