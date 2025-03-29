import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Typography,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import InputField from "./InputField";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

const PageAccordion = ({ page, index, updatePage, deletePage }) => {
  const [expanded, setExpanded] = useState(false);
  const [localPage, setLocalPage] = useState(page);
  const [isEditing, setIsEditing] = useState(page.isEditing || false);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleToggle = () => setExpanded((prev) => !prev);

  const handleFieldChange = (inputId, field, value) => {
    setLocalPage((prevState) => {
      const updatedInputs = prevState.inputs.map((input) =>
        input.inputId === inputId ? { ...input, [field]: value } : input
      );
      return { ...prevState, inputs: updatedInputs };
    });
  };

  const handleAddField = () => {
    const newField = {
      inputId: Date.now(),
      type: "text",
      placeholder: "",
    };
    setLocalPage({
      ...localPage,
      inputs: [...localPage.inputs, newField],
    });
  };

  const handleDeleteField = (inputId) => {
    const updatedInputs = localPage.inputs.filter((f) => f.inputId !== inputId);
    setLocalPage((prevState) => ({ ...prevState, inputs: updatedInputs }));
  };

  const canSavePage = React.useMemo(() => {
    if (!localPage.heading.trim()) return false;
    if (localPage.inputs.length === 0) return false;
    return localPage.inputs.every(
      (input) => input.placeholder?.trim() && input.type?.trim()
    );
  }, [localPage]);

  const handleSave = async () => {
    if (!canSavePage) return;

    try {
      setLoading(true);
      await updatePage({ ...localPage, isEditing: false });
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Accordion
        expanded={expanded}
        onChange={handleToggle}
        sx={{
          width: "750px",
          padding: "20px 15px",
          boxShadow:
            "0 5px 10px rgba(154,160,185,.05), 0 15px 40px rgba(166,173,201,.2)",
          "&::before": {
            display: "none",
          },
          "&:first-of-type": {
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
          },
          "&:last-of-type": {
            borderBottomLeftRadius: "12px",
            borderBottomRightRadius: "12px",
          },
          borderRadius: "12px",
        }}
      >
        <AccordionSummary
          component="div"
          expandIcon={
            <IconButton>
              <ExpandMoreIcon />
            </IconButton>
          }
        >
          <Stack direction="row" justifyContent="space-between" width="100%">
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontFamily: "Georgia, serif",
              }}
            >
              {localPage.heading || `Page ${index + 1}`}
            </Typography>

            <Stack direction="row" spacing={1.5} sx={{ marginRight: "20px" }}>
              {!isEditing && (
                <IconButton
                  sx={{ color: "#1976D2" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                    setExpanded(true);
                  }}
                >
                  <EditIcon />
                </IconButton>
              )}
              <IconButton
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmOpen(true);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          </Stack>
        </AccordionSummary>

        <AccordionDetails>
          <Stack spacing={2}>
            {isEditing ? (
              <>
                <Paper
                  elevation={2}
                  sx={{
                    padding: "40px",
                    boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;",
                    borderRadius: "10px",
                  }}
                >
                  <TextField
                    label="Page Heading"
                    value={localPage.heading}
                    onChange={(e) =>
                      setLocalPage({ ...localPage, heading: e.target.value })
                    }
                    fullWidth
                  />

                  {localPage.inputs.map((field, i) => (
                    <React.Fragment key={field.inputId}>
                      {i === 0 && (
                        <Typography
                          sx={{
                            fontSize: "20px",
                            fontWeight: 700,
                            fontFamily: "Georgia, serif",
                            marginTop: "20px",
                          }}
                        >
                          Input Fields
                        </Typography>
                      )}
                      <Stack
                        spacing={4.5}
                        sx={{
                          padding:
                            localPage.inputs.length === 0 ? "0px" : "25px",
                        }}
                      >
                        <InputField
                          field={field}
                          onChange={handleFieldChange}
                          onDelete={handleDeleteField}
                        />
                      </Stack>
                    </React.Fragment>
                  ))}
                </Paper>

                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ justifyContent: "flex-end" }}
                >
                  <Button
                    variant="outlined"
                    sx={{
                      fontWeight: 600,
                      padding: "10px 20px",
                      borderRadius: "100px",
                    }}
                    onClick={handleAddField}
                  >
                    Add Field
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    startIcon={<SaveIcon />}
                    disabled={!canSavePage}
                    sx={{
                      fontWeight: 600,
                      background: "#00531b",
                      padding: "10px 30px",
                      borderRadius: "100px",
                    }}
                    loading={loading}
                  >
                    Save
                  </Button>
                </Stack>
              </>
            ) : (
              <>
                {localPage.inputs.map((input, index) => (
                  <Typography key={index}>
                    {index + 1}. {input.placeholder} ({input.type})
                  </Typography>
                ))}
              </>
            )}
          </Stack>
        </AccordionDetails>
      </Accordion>

      <DeleteConfirmationDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        loading={loading}
        onConfirm={async () => {
          setLoading(true);
          await deletePage(localPage.id);
          setLoading(false);
          setConfirmOpen(false);
        }}
        title="Delete this page?"
        message="This action cannot be undone. Are you sure you want to delete this page?"
      />
    </>
  );
};

export default PageAccordion;
