import PropTypes from "prop-types";
import saplogo from "../../../../SAP_logo.png";
// material-ui
import { styled, useTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { useContext } from "react";
import themeConfig from "../../../../configs/themeConfig";
import axios from "axios";
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";

// project imports
import MainCard from "./MainCard";
import TotalIncomeCard from "./TotalIncomeCard";
import { GeneralContext } from "../../../../utility/context/GeneralContext";
// assets

// styles

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.palette.dark.dark
      : theme.palette.primary.dark,
  color: "#fff",
  overflow: "hidden",
  position: "relative",
  "&:after": {
    content: '""',
    position: "absolute",
    width: 210,
    height: 210,
    background: `linear-gradient(168deg, #000000 -50.94%, rgba(144, 202, 249, 0) 95.49%)`,

    // background: "",
    borderRadius: "50%",
    top: -85,
    right: -95,
    [theme.breakpoints.down("sm")]: {
      top: -105,
      right: -140,
    },
  },
  "&:before": {
    content: '""',
    position: "absolute",
    width: 210,
    height: 210,
    background: `linear-gradient(113deg, #2a2929 -14.02%, rgba(144, 202, 249, 0) 85.50%)`,
    borderRadius: "50%",
    top: -125,
    right: -15,
    opacity: 0.5,
    [theme.breakpoints.down("sm")]: {
      top: -155,
      right: -70,
    },
  },
}));

// ==============================|| DASHBOARD - TOTAL INCOME DARK CARD ||============================== //

const SapRegisteredCard = ({ isLoading }) => {
  const { analyticsData } = useContext(GeneralContext);
  const value = analyticsData;
  useEffect(() => {}, []);
  return (
    <>
      {isLoading ? (
        <TotalIncomeCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box sx={{ p: 0.9 }}>
            <List sx={{ py: 0 }}>
              <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                <ListItemAvatar>
                  {/* <AccountTree sx={{ fontSize: 45 }} /> */}
                  <img src={saplogo} className="img-fluid" width={110} alt="" />
                </ListItemAvatar>
             
                <ListItemText
                  sx={{
                    py: 0,
                    mt: 0.45,
                    mb: 0.45,
                  }}
                  primary={
                    <Typography variant="h4" sx={{ color: "#fff", marginLeft: "20px"  }}>
                      {value?.sapRegistered}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "#fff",
                        mt: 0.25,
                        fontSize: "18px",
                        marginLeft: "20px",
                      }}
                    >
                      SAP Registered Vendor
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

SapRegisteredCard.propTypes = {
  isLoading: PropTypes.bool,
};

export default SapRegisteredCard;
