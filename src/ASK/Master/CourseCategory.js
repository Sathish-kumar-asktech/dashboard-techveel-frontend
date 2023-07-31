import {
  Stack,
  TextField,
  useTheme,
  Button,
  Container,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import Slide from '@mui/material/Slide';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import styled from '@emotion/styled';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddLocationAltRoundedIcon from '@mui/icons-material/AddLocationAltRounded';
import axios from '../../axios';
import './animation.css';

// table header cell styles
const StyledTableCell = styled(TableCell)({
  color: '#424242',
  fontWeight: '600',
  textAlign: 'center',
});

const CourseCategoryMaster = () => {
  const [tokent, settokent] = useState(
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudGxpc3QiOlt7IlVzZXJJRCI6IjEiLCJMb2dpbkNvZGUiOiIwMSIsIkxvZ2luTmFtZSI6IkFkbWluIiwiRW1haWxJZCI6ImFkbWluQGdtYWlsLmNvbSIsIlVzZXJUeXBlIjoiQURNSU4ifV0sImlhdCI6MTYzODM1NDczMX0.ZW6zEHIXTxfT-QWEzS6-GuY7bRupf2Jc_tp4fXIRabQ'
  );
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const [open, setOpen] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  // handle snackbar & alert messages on save
  const [openAlert, setopenAlert] = useState(false);
  // At the beginning of the component
  const [openDelete, setOpenDelete] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSearchPage, setCurrentSearchPage] = useState(0);
  const [category, setCategory] = useState('');
  const [operation, setOperation] = useState('Add');
  const [editID, setEditID] = useState();
  const [errors, setErrors] = useState({
    category: false,
  });
  const [helperTexts, setHelperTexts] = useState({
    category: '',
  });
  // alert messages on operations
  const [alertType, setAlertType] = useState('success'); // 'success' or 'error'
  const [alertMessage, setAlertMessage] = useState('');

  // API Integration
  useEffect(() => {
    getCategories();
  }, []);

  // get all course categories Request
  const getCategories = async () => {
    try {
      const res = await axios.instance.get('/GetAllCourseCategory', {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      setCategoryData(res.data);
      console.log(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // post Request to Add course category
  const addNewCategory = async (newCategory) => {
    try {
      const res = await axios.instance.post('/InsertCourseCategory', newCategory, {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      getCategories();
      setAlertType('success');
      setAlertMessage('New Course Category Added, Successfully!');
      setopenAlert(true); // Show a success message using the Snackbar
    } catch (error) {
      console.error('Error adding course category:', error);
      setAlertType('error');
      setAlertMessage('Failed to add the course category.');
      setopenAlert(true);
    }
  };

  // put Request to edit course category
  const updateCategory = async (categoryId, updatedCategory) => {
    try {
      await axios.instance.put(`/UpdateCourseCategory/${categoryId}`, updatedCategory, {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      setopenAlert(true);
      setEditID();
      getCategories();
      setAlertType('success');
      setAlertMessage('Course Category Updated, Successfully!');
      setopenAlert(true);
    } catch (error) {
      console.error('Error updating course category:', error);
      setAlertType('error');
      setAlertMessage('Failed to update the course category.');
      setopenAlert(true);
    }
  };

  // delete Request to delete course category
  const deleteCategory = async (categoryId) => {
    try {
      await axios.instance
        .delete(`/deleteCourseCategory/${categoryId}`, {
          headers: { Authorization: tokent, 'Content-Type': 'application/json' },
        })
        .then((res) => {
          if (res.data === '') {
            getCategories();
            setOpenDelete(false);
            setAlertType('warning');
            setAlertMessage('Course Category Deleted, Successfully!');
            setopenAlert(true);
          } else {
            getCategories();
            setOpenDelete(false);
            setAlertType('error');
            setAlertMessage("Oops! Can't delete this data. It's connected to other information.");
            setopenAlert(true);
          }
        });
    } catch (error) {
      console.error('Error deleting course category:', error);
      setAlertType('error');
      setAlertMessage('Failed to delete the course category.');
      setopenAlert(true);
    }
  };

  // submit button on add or edit
  const handleSubmit = (event) => {
    event.preventDefault();

    if (errors.category) {
      setIsFormSubmitted(true);
      return;
    }

    const newCategory = {
      Course_Category: category,
      CreatedBy: 25,
    };

    const editCategory = {
      Course_Category: category,
      ModifyBy: 25,
    };

    if (operation === 'Add') {
      addNewCategory(newCategory);
    } else if (operation === 'Edit') {
      console.log(editID, editCategory);
      updateCategory(editID, editCategory);
    }
    setCategory('');
    handleClose();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCategory(value);
    validateInput(name, value);
  };

  // validations
  const validateInput = (name, value) => {
    let error = false;
    let helperText = '';

    // const categoryRegex = /^[A-Za-z\s]+$/;
    const isCategoryExists = categoryData.some(
      (category) => category.Course_Category.toLowerCase() === value.toLowerCase().trim()
    );
    if (name === 'category') {
      if (!value.trim()) {
        // If the field is empty, show a different message
        error = true;
        helperText = 'Category field cannot be empty';
        setIsFormSubmitted(false);
      }
      //  else if (!categoryRegex.test(value)) {
      //   // If the field has a value but doesn't match the regex
      //   error = true;
      //   helperText = 'Please enter a valid category';
      //   setIsFormSubmitted(false);
      // }
      else if (isCategoryExists) {
        error = true;
        helperText = 'Category already exists. Please enter a different category name.';
        setIsFormSubmitted(false);
      }
    }

    // Update the errors and helperTexts states correctly
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
    setHelperTexts((prevHelperTexts) => ({
      ...prevHelperTexts,
      [name]: helperText,
    }));
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    if (value.length > 0) {
      validateInput(name, value);
    }
  };

  // handle edit popup dialog
  const handleAddOpen = () => {
    setOpen(true);
    setOperation('Add');
  };

  // handle edit popup dialog
  const handleEdit = (category) => {
    setEditID(category.CourseCategoryId);
    setCategory(category.Course_Category);
    handleEditOpen();
  };
  const handleEditOpen = () => {
    setOpen(true);
    setOperation('Edit');
  };

  // handle delete popup dialog
  const handleDelete = (categoryId) => {
    setOpenDelete(true);
    setEditID(categoryId);
  };
  const handleDeleteConfirmed = (categoryId) => {
    deleteCategory(categoryId);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
    setopenAlert(false);
  };

  const handleCloseAlert = () => {
    setopenAlert(false);
  };

  const handleClose = () => {
    setOpen(false);
    setCategory('');
    setErrors((prevErrors) => ({
      ...prevErrors,
      category: false,
    }));
    setHelperTexts((prevHelperTexts) => ({
      ...prevHelperTexts,
      category: '',
    }));
  };

  // search & filter

  const filteredData = categoryData.filter((c) => c.Course_Category.toLowerCase().includes(searchTerm.toLowerCase()));
  // pagination
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredData.length - page * rowsPerPage);
  const totalRows = filteredData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const currentPage = Math.max(0, Math.min(page, totalPages - 1)); // Clamp to the range [0, totalPages - 1]
  // Reset page to 0 when searchTerm changes
  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  return (
    <>
      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={(props) => <Slide {...props} direction={'right'} />}
      >
        <Alert onClose={handleCloseAlert} severity={alertType} variant="filled" sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>

      <Container sx={{ mt: 2, pt: 4 }} elevation={3} component={Paper}>
        {/* table header */}
        <Typography variant="h6" color="primary" fontWeight={600} mb={2} textAlign="center" sx={{ color: '#616161' }}>
          Course Categories
        </Typography>

        {/* search & add button */}
        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} spacing={2} my={2}>
          <TextField
            type="text"
            variant="outlined"
            color="secondary"
            label="Search"
            size="small"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <Button
            variant="contained"
            color="secondary"
            sx={{ boxShadow: 1 }}
            onClick={handleAddOpen}
            startIcon={<AddLocationAltRoundedIcon />}
          >
            Add Course Category
          </Button>
        </Stack>

        {/* table  */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>S.No</StyledTableCell>
                <StyledTableCell>Course Category</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : filteredData
              ).map((category, index) => (
                <TableRow key={category.CourseCategoryId} hover>
                  <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
                    {category.Course_Category}
                  </TableCell>
                  <TableCell align="center" sx={{ padding: '0' }}>
                    <IconButton aria-label="Edit" onClick={() => handleEdit(category)}>
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton aria-label="Delete" onClick={() => handleDelete(category.CourseCategoryId)}>
                      <DeleteForeverIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={3} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalRows}
          rowsPerPage={rowsPerPage}
          page={currentPage} // Use the calculated currentPage value
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0); // Reset the page when rowsPerPage changes
          }}
          mt={2}
        />
      </Container>

      <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} fullWidth>
        <Container component={Paper} elevation={2} sx={{ py: 2 }}>
          <form onSubmit={handleSubmit}>
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} mr={1}>
              <Typography variant="h5" textAlign={'left'} pl={2} fontWeight={600} color="primary">
                {operation === 'Add' ? 'Add Course Category' : 'Edit Course Category'}
              </Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Stack>
            <Stack direction={'column'} spacing={2} p={2}>
              <TextField
                type="text"
                variant="outlined"
                color="primary"
                label="Category"
                name="category"
                value={category}
                onBlur={handleBlur}
                onChange={handleInputChange}
                fullWidth
                required
                size="small"
                error={errors.category}
                helperText={helperTexts.category}
                className={isFormSubmitted && errors.category ? 'shake-helper-text' : ''}
              />
              <Button
                variant="contained"
                size="small"
                color="primary"
                type="submit"
                sx={{ textTransform: 'capitalize' }}
              >
                {operation === 'Add' ? 'Add Category' : 'Update Category'}
              </Button>
            </Stack>
          </form>
        </Container>
      </Dialog>

      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="responsive-dialog-title"
        fullScreen={fullScreen}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="responsive-dialog-title">Are you sure you want to delete?</DialogTitle>
        <DialogActions>
          <Button variant="contained" autoFocus onClick={handleCloseDelete} color="primary">
            Cancel
          </Button>
          <Button variant="contained" onClick={() => handleDeleteConfirmed(editID)} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CourseCategoryMaster;
