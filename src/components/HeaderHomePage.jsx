import {
  AppBar,
  Toolbar,
  IconButton,
  Stack,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";

const HeaderHomePage = ({
  alreadySubmitted,
  activeStep,
  stepsLength,
  handleBack,
}) => {
  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "white",
          boxShadow: "none",
          px: 2,
          height: " 108px",
          borderBottom: "1px solid rgb(119, 119, 119)",
        }}
      >
        <Toolbar disableGutters>
          <IconButton
            onClick={handleBack}
            disabled={activeStep === 0}
            sx={{
              position: "absolute",
              left: 10,
              top: 33,
              display:
                activeStep === 0 || alreadySubmitted === true
                  ? "none"
                  : "block",
            }}
          >
            <ArrowBackIcon
              sx={{
                color: "black",
              }}
            />
          </IconButton>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{ flexGrow: 1 }}
          >
            <svg
              width="117"
              height="15"
              viewBox="0 0 117 15"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.10352 0.683594H13.623V3.54492L5.5957 11.9238H13.916V15H0.332031V12.0312L8.27148 3.74023H1.10352V0.683594ZM17.9082 0.683594H29.7637V3.74023H22.3418V6.01562H29.2266V8.93555H22.3418V11.7578H29.9785V15H17.9082V0.683594ZM43.1797 12.6367H38.1406L37.4473 15H32.9258L38.3066 0.683594H43.1309L48.5117 15H43.8828L43.1797 12.6367ZM42.252 9.54102L40.6699 4.39453L39.0977 9.54102H42.252ZM51.9375 0.683594H56.3613V11.4746H63.2656V15H51.9375V0.683594ZM66.2715 0.683594H79.7188V4.21875H75.207V15H70.7832V4.21875H66.2715V0.683594ZM83.75 0.683594H88.1738V5.69336H93.0078V0.683594H97.4512V15H93.0078V9.20898H88.1738V15H83.75V0.683594ZM100.945 0.683594H105.857L108.748 5.51758L111.639 0.683594H116.521L110.955 9.00391V15H106.521V9.00391L100.945 0.683594Z"
                fill="black"
              />
            </svg>
          </Stack>
        </Toolbar>
        <Stepper
          alternativeLabel
          activeStep={activeStep}
          connector={<QontoConnector />}
        >
          {Array.from({ length: stepsLength }).map((_, i) => (
            <Step key={i}>
              <StepLabel slots={{ stepIcon: QontoStepIcon }} />
            </Step>
          ))}
        </Stepper>
      </AppBar>
    </>
  );
};

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "rgb(138, 205, 160)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "rgb(138, 205, 160)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
    ...theme.applyStyles("dark", {
      borderColor: theme.palette.grey[800],
    }),
  },
}));

const QontoStepIconRoot = styled("div")(({ theme }) => ({
  color: "#eaeaf0",
  display: "flex",
  height: 22,
  alignItems: "center",
  "& .QontoStepIcon-completedIcon": {
    color: "rgb(138, 205, 160)",
    zIndex: 1,
    fontSize: 18,
  },
  "& .QontoStepIcon-circle": {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
  ...theme.applyStyles("dark", {
    color: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        color: "rgb(138, 205, 160)",
      },
    },
  ],
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <CheckCircleIcon className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
};

export default HeaderHomePage;
