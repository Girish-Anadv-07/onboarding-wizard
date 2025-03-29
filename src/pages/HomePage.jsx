import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Stack,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {
  fetchPagesFromFirestore,
  fetchSubmissionByUser,
  saveSubmissionForUser,
} from "../services/firestore";
import HeaderHomePage from "../components/HeaderHomePage";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const HomePage = () => {
  const [pages, setPages] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [formValues, setFormValues] = useState({});
  const [userId, setUserId] = useState("");
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [loadingPages, setLoadingPages] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    const fetchPages = async () => {
      const data = await fetchPagesFromFirestore();
      setPages(data);
      setLoadingPages(false);
    };
    fetchPages();
  }, []);

  const fetchAndProcessUserSubmission = useCallback(
    async (uid) => {
      const submission = await fetchSubmissionByUser(uid);
      if (submission) {
        if (submission.hasSubmitted) {
          setAlreadySubmitted(true);
          setFormValues(submission);
          setActiveStep(pages.length + 1);
        } else {
          setFormValues(submission);
          setActiveStep((submission.lastSaved || 0) + 1);
        }
      }
    },
    [pages.length]
  );

  useEffect(() => {
    if (!userId) return;
    if (pages.length > 0) fetchAndProcessUserSubmission(userId);
  }, [userId, pages.length, fetchAndProcessUserSubmission]);

  const handleInputChange = (pageId, inputId, placeholder, value) => {
    setFormValues((prev) => ({
      ...prev,
      [pageId]: {
        ...(prev[pageId] || {}),
        [inputId]: {
          placeholder,
          value,
        },
      },
    }));
  };

  const saveProgress = async (data) => {
    if (userId) {
      await saveSubmissionForUser(userId, {
        ...data,
        hasSubmitted: false,
      });
    }
  };

  const isCurrentStepValid = () => {
    if (activeStep === 0) {
      const email = formValues["0"]?.email?.value || "";
      const password = formValues["0"]?.password?.value || "";

      return email.trim() !== "" && password.trim() !== "";
    }
    const currentPage = pages[activeStep - 1];
    if (!currentPage) return false;

    return currentPage.inputs.every((field) => {
      const value = formValues[currentPage.id]?.[field.inputId]?.value;
      return value !== undefined && value !== null && value !== "";
    });
  };

  const handleNext = async () => {
    setLoadingAction(true);
    if (activeStep === 0) {
      const email = formValues["0"]?.email?.value;
      const password = formValues["0"]?.password?.value;
      if (!email || !password) {
        setLoadingAction(false);
        return;
      }

      const uid = btoa(email);
      setUserId(uid);

      await fetchAndProcessUserSubmission(uid); // Use the new helper function
    } else {
      const dataToSave = {
        ...formValues,
        lastSaved: activeStep,
      };
      await saveProgress(dataToSave);
    }

    if (activeStep < pages.length) setActiveStep((prev) => prev + 1);
    setLoadingAction(false);
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (alreadySubmitted) return;
    setLoadingAction(true);
    await saveSubmissionForUser(userId, {
      ...formValues,
      hasSubmitted: true,
    });
    setAlreadySubmitted(true);
    setLoadingAction(false);
    setActiveStep(pages.length + 1);
  };

  const renderInput = (field, pageId) => {
    const placeholder = field.placeholder || "Enter value";
    const fieldValue = formValues[pageId]?.[field.inputId]?.value || "";

    switch (field.type) {
      case "text":
      case "textarea":
        return (
          <TextField
            fullWidth
            label={placeholder}
            value={fieldValue}
            multiline={field.type === "textarea"}
            rows={field.type === "textarea" ? 7 : 1}
            onChange={(e) =>
              handleInputChange(
                pageId,
                field.inputId,
                placeholder,
                e.target.value
              )
            }
          />
        );
      case "date":
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={placeholder}
              value={fieldValue ? dayjs(fieldValue) : null}
              onChange={(newValue) =>
                handleInputChange(
                  pageId,
                  field.inputId,
                  placeholder,
                  newValue && dayjs(newValue).isValid()
                    ? dayjs(newValue).toISOString()
                    : ""
                )
              }
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        );
      default:
        return null;
    }
  };

  const currentPage = pages[activeStep - 1];

  return (
    !loadingPages && (
      <>
        <HeaderHomePage
          alreadySubmitted={alreadySubmitted}
          activeStep={activeStep}
          handleBack={handleBack}
          stepsLength={pages.length + 1}
        />
        <Container maxWidth="sm" sx={{ padding: "0px 24px", mt: 10 }}>
          {alreadySubmitted ? (
            <Alert severity="info">
              You have submitted your onboarding details.
            </Alert>
          ) : (
            <Stack spacing={5}>
              {activeStep === 0 && (
                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: "Georgia, serif",
                      fontWeight: "bold",
                      mb: 6,
                    }}
                  >
                    Enter your Login details
                  </Typography>
                  <Stack spacing={5}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={formValues["0"]?.email?.value || ""}
                      onChange={(e) =>
                        handleInputChange("0", "email", "Email", e.target.value)
                      }
                    />
                    <TextField
                      fullWidth
                      label="Password"
                      type="password"
                      value={formValues["0"]?.password?.value || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "0",
                          "password",
                          "Password",
                          e.target.value
                        )
                      }
                    />
                  </Stack>
                </Box>
              )}

              {activeStep > 0 && currentPage && (
                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: "Georgia, serif",
                      fontWeight: "bold",
                      mb: 6,
                    }}
                  >
                    {currentPage.heading}
                  </Typography>
                  <Stack spacing={2}>
                    {currentPage.inputs.map((input) => (
                      <Box key={input.inputId}>
                        {renderInput(input, currentPage.id)}
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}

              <Box>
                <Button
                  variant="contained"
                  onClick={
                    activeStep < pages.length ? handleNext : handleSubmit
                  }
                  loading={loadingAction}
                  disabled={
                    activeStep <= pages.length
                      ? !isCurrentStepValid()
                      : alreadySubmitted
                  }
                  sx={{
                    width: "100%",
                    backgroundColor: "rgb(0, 83, 27)",
                    height: "56px",
                    borderRadius: "8px",
                  }}
                >
                  {activeStep < pages.length ? "Next" : "Submit"}
                </Button>
              </Box>
            </Stack>
          )}
        </Container>
      </>
    )
  );
};

export default HomePage;
