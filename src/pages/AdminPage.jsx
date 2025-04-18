import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Typography,
  Stack,
  CircularProgress,
} from "@mui/material";
import PageAccordion from "../components/PageAccordion";
import {
  fetchPagesFromFirestore,
  addPageToFirestore,
  updatePageInFirestore,
  deletePageFromFirestore,
} from "../services/firestore";
import Header from "../components/Header";

const AdminPage = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        setLoading(true);
        const data = await fetchPagesFromFirestore();
        setPages(data);
      } catch (error) {
        console.error("Error fetching pages:", error);
        setPages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  const handleAddPage = () => {
    const newPage = {
      id: Date.now().toString(),
      heading: "",
      inputs: [],
      isEditing: true,
      isNew: true,
    };
    setPages((prev) => [...prev, newPage]);
  };

  const handleUpdatePage = async (updatedPage) => {
    try {
      if (updatedPage.isNew) {
        const savedPage = await addPageToFirestore({
          id: updatedPage.id,
          heading: updatedPage.heading,
          inputs: updatedPage.inputs,
        });
        setPages((prev) =>
          prev.map((p) => (p.id === updatedPage.id ? savedPage : p))
        );
      } else {
        await updatePageInFirestore(updatedPage);
        setPages((prev) =>
          prev.map((p) => (p.id === updatedPage.id ? updatedPage : p))
        );
      }
    } catch (error) {
      console.error("Error updating page:", error);
    }
  };

  const handleDeletePage = async (pageToBeDeleted) => {
    try {
      const pageId = pageToBeDeleted.id;
      if (!pageToBeDeleted.isNew) await deletePageFromFirestore(pageId);
      setPages((prev) => prev.filter((p) => p.id !== pageId));
    } catch (error) {
      console.error("Error deleting page:", error);
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ py: 4, marginTop: "20px" }}>
        <Stack spacing={5} sx={{ alignItems: "center" }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "Georgia, serif",
              fontWeight: "bold",
            }}
          >
            Onboarding Flow
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            pages.map((page, idx) => (
              <PageAccordion
                key={page.id}
                page={page}
                index={idx}
                updatePage={handleUpdatePage}
                deletePage={handleDeletePage}
              />
            ))
          )}
          <Button
            variant="contained"
            size="large"
            sx={{
              fontWeight: 600,
              width: "90%",
              background: "#00531b",
              fontFamily: "Inter, sans-serif",
              padding: "20px 30px",
              borderRadius: "100px",
            }}
            onClick={handleAddPage}
          >
            Create New Page
          </Button>
        </Stack>
      </Container>
    </>
  );
};

export default AdminPage;
