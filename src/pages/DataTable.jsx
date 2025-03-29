import React, { useEffect, useState } from "react";
import { Container, Typography, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  fetchPagesFromFirestore,
  fetchAllSubmissions,
} from "../services/firestore";
import Header from "../components/Header";

const DataTablePage = () => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const [pages, submissions] = await Promise.all([
        fetchPagesFromFirestore(),
        fetchAllSubmissions(),
      ]);

      const inputMeta = {};
      inputMeta["email"] = { placeholder: "Email", type: "text" };
      pages.forEach((page) => {
        page.inputs.forEach((input) => {
          inputMeta[input.inputId] = {
            placeholder: input.placeholder,
            type: input.type,
          };
        });
      });

      const typeToWidth = {
        text: 230,
        textarea: 500,
        date: 230,
      };

      const gridColumns = [
        { field: "id", headerName: "ID", width: 70 },
        ...Object.entries(inputMeta).map(([inputId, meta]) => ({
          field: inputId,
          headerName: meta.placeholder,
          width: typeToWidth[meta.type] || 200,
        })),
      ];

      const formattedRows = Object.entries(submissions).map(
        ([_, submission], index) => {
          const row = { id: index + 1 };
          Object.entries(inputMeta).forEach(([inputId, meta]) => {
            let value = "-";

            Object.values(submission).forEach((pageData) => {
              if (
                pageData &&
                typeof pageData === "object" &&
                pageData[inputId]
              ) {
                value = pageData[inputId].value ?? "-";
              }
            });

            row[inputId] = value;
          });
          return row;
        }
      );

      setColumns(gridColumns);
      setRows(formattedRows);
      setLoading(false);
    };

    loadData();
  }, []);
  return (
    <>
      <Header />
      <Container sx={{ mt: 5 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontFamily: "Georgia, serif",
            mb: 3,
            justifyContent: "center",
            display: "flex",
          }}
          gutterBottom
        >
          Onboarding Submissions
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <div style={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={12}
              rowsPerPageOptions={[10, 25, 50, 100]}
              sx={{
                "& .MuiDataGrid-columnHeaders": {
                  fontSize: "16px",
                },
              }}
            />
          </div>
        )}
      </Container>
    </>
  );
};

export default DataTablePage;
