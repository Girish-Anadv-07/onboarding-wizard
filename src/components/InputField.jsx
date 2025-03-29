import React from "react";
import { Stack, TextField, MenuItem, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const INPUT_TYPES = [
  { value: "text", label: "Text" },
  { value: "textarea", label: "Text Area" },
  { value: "date", label: "Date" },
];

const InputField = ({ field, onChange, onDelete }) => {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <TextField
        select
        label="Type"
        value={field.type}
        onChange={(e) => onChange(field.inputId, "type", e.target.value)}
        sx={{ width: 200 }}
      >
        {INPUT_TYPES.map((type) => (
          <MenuItem key={type.value} value={type.value}>
            {type.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Placeholder"
        value={field.placeholder}
        onChange={(e) => onChange(field.inputId, "placeholder", e.target.value)}
        fullWidth
      />

      <IconButton
        color="error"
        onClick={() => onDelete(field.inputId)}
        aria-label="Delete"
      >
        <DeleteIcon />
      </IconButton>
    </Stack>
  );
};

export default InputField;
