import {
  Stack,
  TextField,
  useTheme,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  Dialog,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  IconButton,
  DialogTitle,
  DialogActions,
  Snackbar,
  Alert,
  Autocomplete,
  LinearProgress,
} from '@mui/material';
import Slide from '@mui/material/Slide';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import styled from '@emotion/styled';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import AddLocationAltRoundedIcon from '@mui/icons-material/AddLocationAltRounded';
import axios from '../../axios';
import './animation.css';

// table header cell styles
const StyledTableCell = styled(TableCell)({
  color: '#424242',
  fontWeight: '600',
  textAlign: 'center',
});

const durationData = [{ label: '1 Month' }, { label: '3 Months' }, { label: '6 Months' }, { label: '1 Year' }];

const CoursesMaster = () => {
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [operation, setOperation] = useState('Add');
  const [errors, setErrors] = useState({
    course: false,
    courseCategory: false,
    duration: false,
    fee: false,
  });
  const [helperTexts, setHelperTexts] = useState({
    course: '',
    courseCategory: '',
    duration: '',
    fee: null,
  });
  // alert messages on operations
  const [alertType, setAlertType] = useState('success'); // 'success' or 'error'
  const [alertMessage, setAlertMessage] = useState('');

  // input fields state values
  const [IdToDelete, setIdToDelete] = useState(null);
  const [editID, setEditID] = useState();
  const [courseData, setCourseData] = useState([]);
  const [courseCategoryData, setCourseCategoryData] = useState([]);
  const [newCourseName, setNewCourseName] = useState('');
  const [selectedCourseCategory, setSelectedCourseCategory] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [selectedFee, setSelectedFee] = useState(null);
  const [openLoader, setOpenLoader] = useState(false);

  // API Integration
  useEffect(() => {
    getCourseCategories();
    getCourses();
  }, []);

  // get all course categories Request
  const getCourseCategories = async () => {
    try {
      const res = await axios.instance.get('/GetAllCourseCategory', {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      setCourseCategoryData(res.data);
      console.log('Category', res.data);
    } catch (error) {
      console.error('Error fetching course categories:', error);
    }
  };

  // get all Courses Request
  const getCourses = async () => {
    setOpenLoader(true);
    try {
      const res = await axios.instance.get('/GetAllCourses', {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      setCourseData(res.data);
      setOpenLoader(false);
      console.log('Courses', res.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  // post Request to Add new record
  const addNewCourse = async (newCourse) => {
    try {
      const res = await axios.instance.post('/InsertCourse', newCourse, {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      getCourses();
      setAlertType('success');
      setAlertMessage('New Course Added Successfully!');
      setopenAlert(true);
    } catch (error) {
      console.error('Error adding Course:', error);
      setAlertType('error');
      setAlertMessage('Failed to add the Course.');
      setopenAlert(true);
    }
  };

  // put Request to edit record
  const updateCourse = async (courseId, updatedCourse) => {
    try {
      await axios.instance.put(`/UpdateCourse/${courseId}`, updatedCourse, {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      setopenAlert(true);
      setEditID();
      getCourses();
      setAlertType('success');
      setAlertMessage('Course Updated Successfully!');
    } catch (error) {
      console.error('Error updating Course:', error);
      setAlertType('error');
      setAlertMessage('Failed to update the Course.');
      setopenAlert(true);
    }
  };

  // delete Request to delete record
  const deleteCourse = async (courseId) => {
    try {
      await axios.instance
        .delete(`/DeleteCourse/${courseId}`, {
          headers: { Authorization: tokent, 'Content-Type': 'application/json' },
        })
        .then((res) => {
          if (res.data === '') {
            getCourses();
            setOpenDelete(false);
            setAlertType('warning');
            setAlertMessage('Course Deleted Successfully!');
            setopenAlert(true);
          } else {
            getCourses();
            setOpenDelete(false);
            setAlertType('error');
            setAlertMessage("Oops! Can't delete this data. It's connected to other information.");
            setopenAlert(true);
          }
          console.log(res.data);
        });
    } catch (error) {
      console.error('Error deleting Course:', error);
      setAlertType('error');
      setAlertMessage('Failed to delete the Course.');
      setopenAlert(true);
    }
  };

  // submit button on add or edit
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(errors.course, errors.courseCategory, selectedCourseCategory, selectedDuration, selectedFee);

    if (
      errors.course ||
      errors.courseCategory ||
      errors.fee ||
      errors.duration ||
      selectedCourseCategory === null ||
      selectedCourseCategory === undefined ||
      selectedCourseCategory === '' ||
      selectedCourseCategory === 0 ||
      selectedDuration === null ||
      selectedDuration === undefined ||
      selectedDuration === '' ||
      selectedDuration === 0
    ) {
      if (errors.course) {
        setErrors((prevErrors) => ({ ...prevErrors, course: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          course: 'Please enter a course name',
        }));
      }
      if (errors.fee) {
        setErrors((prevErrors) => ({ ...prevErrors, fee: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          fee: 'Please select a fee',
        }));
        setIsFormSubmitted(true);
      }

      if (
        errors.courseCategory ||
        selectedCourseCategory === null ||
        selectedCourseCategory === undefined ||
        selectedCourseCategory === '' ||
        selectedCourseCategory === 0
      ) {
        setErrors((prevErrors) => ({ ...prevErrors, courseCategory: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          courseCategory: 'Please select a course category',
        }));
        setIsFormSubmitted(true);
      }
      if (
        errors.duration ||
        selectedDuration === null ||
        selectedDuration === undefined ||
        selectedDuration === '' ||
        selectedDuration === 0
      ) {
        setErrors((prevErrors) => ({ ...prevErrors, duration: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          duration: 'Please select a duration',
        }));
      }
      return;
    }

    setErrors((prevErrors) => ({ ...prevErrors, courseCategory: false, course: false, duration: false, fee: false }));
    setHelperTexts((prevHelperTexts) => ({
      ...prevHelperTexts,
      courseCategory: '',
      course: '',
      duration: '',
      fee: '',
    }));

    const newData = {
      Course_Name: newCourseName,
      Course_Duration: selectedDuration.label,
      Course_Fee: selectedFee,
      CourseCategoryId: selectedCourseCategory.CourseCategoryId,
      CreatedBy: 25,
    };

    console.log('submitted', newData);

    const editData = {
      Course_Name: newCourseName,
      Course_Duration: selectedDuration.label,
      Course_Fee: selectedFee,
      CourseCategoryId: selectedCourseCategory.CourseCategoryId,
      ModifyBy: 25,
    };

    console.log('added data', newData);

    if (operation === 'Add') {
      addNewCourse(newData);
    } else if (operation === 'Edit') {
      console.log(editID, editData);
      updateCourse(editID, editData);
    }
    setNewCourseName('');
    setSelectedCourseCategory(null);
    setSelectedDuration(null);
    setSelectedFee(null);
    handleClose();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'course') setNewCourseName(value);
    if (name === 'fee') setSelectedFee(parseFloat(value));
    validateInput(name, value);
  };

  const handleInputChangeSelect = (event, newValue) => {
    console.log(newValue);
    // if (event.target.name === 'courseCategory') {
    setSelectedCourseCategory(newValue);
    console.log('course category slect', selectedCourseCategory);
    if (!newValue) {
      setErrors((prevErrors) => ({ ...prevErrors, courseCategory: true }));
      setHelperTexts((prevHelperTexts) => ({
        ...prevHelperTexts,
        courseCategory: 'Please select a course category',
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, courseCategory: false }));
      setHelperTexts((prevHelperTexts) => ({ ...prevHelperTexts, courseCategory: '' }));
    }
  };
  // validations

  const validateInput = (name, value) => {
    let error = false;
    let helperText = '';

    const courseNameRegex = /^[A-Za-z\s]+$/;
    const isDataExists = courseData.some((course) => course.Course_Name.toLowerCase() === value.toLowerCase().trim());
    const isDataExistsinEdit = courseData.some(
      (course) => course.Course_Name.toLowerCase() === value.toLowerCase().trim() && course.CourseId !== editID
    );

    if (name === 'course') {
      if (!value.trim()) {
        // If the field is empty, show a different message
        error = true;
        helperText = 'Course field cannot be empty';
        setIsFormSubmitted(false);
      } else if (operation === 'Add' && isDataExists) {
        error = true;
        helperText = 'Course already exists';
        setIsFormSubmitted(false);
      } else if (operation === 'Edit' && isDataExistsinEdit) {
        error = true;
        helperText = 'Course already exists';
        setIsFormSubmitted(false);
      } else {
        setIsFormSubmitted(true); // Add this line when there are no errors
      }
    } else if (name === 'fee') {
      if (!value.trim()) {
        // If the field is empty, show a different message
        error = true;
        helperText = 'Fee field cannot be empty';
        setIsFormSubmitted(false);
      } else {
        setIsFormSubmitted(true); // Add this line when there are no errors
      }
    }

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

  const handleEdit = (course) => {
    console.log('Course_Duration from API:', course.Course_Duration);
    setEditID(course.CourseId);
    setNewCourseName(course.Course_Name);
    const selectedCourseCategoryObj = courseCategoryData.find(
      (category) => category.CourseCategoryId === course.CourseCategoryId
    );
    setSelectedCourseCategory(selectedCourseCategoryObj);
    const durationFromApi = course.Course_Duration;
    const selectedDurationObj = durationData.find((duration) => duration.label === durationFromApi) || {
      // Create a new object to represent the duration if not found in durationData
      label: durationFromApi,
    };

    setSelectedDuration(selectedDurationObj);
    // setSelectedDuration(course.Course_Duration);
    console.log('inside edit', selectedDuration, course.duration);
    setSelectedFee(course.Course_Fee);
    handleEditOpen();
  };

  const handleEditOpen = () => {
    setOpen(true);
    setOperation('Edit');
  };

  const handleDelete = (courseId) => {
    setOpenDelete(true);
    setIdToDelete(courseId);
  };

  const handleDeleteConfirmed = (courseId) => {
    deleteCourse(courseId);
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
    setNewCourseName('');
    setSelectedCourseCategory(null);
    setSelectedDuration(null);
    setSelectedFee(null);
    errors.course = false;
    errors.courseCategory = false;
    errors.duration = false;
    errors.fee = false;
    helperTexts.course = '';
    helperTexts.courseCategory = '';
    helperTexts.duration = '';
    helperTexts.fee = '';
  };

  // search & filter
  const filteredData = courseData.filter((course) =>
    course.Course_Name.toLowerCase().includes(searchTerm.toLowerCase())
  );
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

      <Container maxWidth={'xl'} sx={{ mt: 2, pt: 4 }} elevation={3} component={Paper}>
        {/* table header */}
        <Typography variant="h6" color="primary" fontWeight={600} mb={2} textAlign="center" sx={{ color: '#616161' }}>
          Course Master
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
            startIcon={<PlaylistAddIcon />}
          >
            Add Course
          </Button>
        </Stack>

        {/* table  */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>S.No</StyledTableCell>
                <StyledTableCell>Course</StyledTableCell>
                <StyledTableCell>Category</StyledTableCell>
                <StyledTableCell>Duration</StyledTableCell>
                <StyledTableCell>Fee</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : filteredData
              ).map((course, index) => (
                <TableRow key={course.CourseId} hover>
                  <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell align="center">{course.Course_Name}</TableCell>
                  <TableCell align="center">{course.Course_Category}</TableCell>
                  <TableCell align="center">{course.Course_Duration}</TableCell>
                  <TableCell align="center">{course.Course_Fee}</TableCell>
                  <TableCell align="center" sx={{ padding: '0' }}>
                    <IconButton aria-label="Edit" onClick={() => handleEdit(course)}>
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton aria-label="Delete" onClick={() => handleDelete(course.CourseId)}>
                      <DeleteForeverIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
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

      <Grid m={2}>
        {/* add new popup form dialog box */}
        <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} fullWidth>
          <Container component={Paper} elevation={2} sx={{ py: 2 }}>
            <form onSubmit={handleSubmit}>
              <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} mr={1}>
                <Typography variant="h5" textAlign={'left'} pl={2} fontWeight={600} color="primary">
                  {operation} Course
                </Typography>
                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Stack>
              <Stack direction={'column'} spacing={2} p={2}>
                <Autocomplete
                  size="small"
                  name="courseCategory"
                  isOptionEqualToValue={(option, value) => option.Course_Category === value.Course_Category}
                  options={courseCategoryData}
                  getOptionLabel={(category) => (category ? category.Course_Category : '')}
                  value={selectedCourseCategory || null}
                  onChange={handleInputChangeSelect}
                  renderInput={(params) => <TextField {...params} label="Select Course Category" />}
                  fullWidth
                  required
                />
                <TextField
                  type="text"
                  variant="outlined"
                  color="primary"
                  label="Course"
                  name="course"
                  value={newCourseName === null ? '' : newCourseName}
                  onBlur={handleBlur}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  size="small"
                  error={errors.course}
                  helperText={helperTexts.course}
                  className={isFormSubmitted && errors.course ? 'shake-helper-text' : ''}
                />

                {errors.courseCategory && (
                  <Typography
                    variant="caption"
                    color="error"
                    className={isFormSubmitted && errors.courseCategory ? 'shake-helper-text' : ''}
                  >
                    {errors.courseCategory && helperTexts.courseCategory}
                  </Typography>
                )}
                <Autocomplete
                  size="small"
                  name="duration"
                  options={durationData}
                  value={selectedDuration}
                  onChange={(event, newValue) => {
                    setSelectedDuration(newValue);
                    console.log('after select duration', selectedDuration);
                    setErrors((prevErrors) => ({ ...prevErrors, duration: false }));
                    setHelperTexts((prevHelperTexts) => ({ ...prevHelperTexts, duration: '' }));
                  }}
                  getOptionLabel={(option) => option.label || ''}
                  fullWidth
                  required
                  renderInput={(params) => <TextField {...params} label="Select Course Duration" />}
                />

                {errors.duration && (
                  <Typography
                    variant="caption"
                    color="error"
                    className={isFormSubmitted && errors.duration ? 'shake-helper-text' : ''}
                  >
                    {errors.duration && helperTexts.duration}
                  </Typography>
                )}

                <TextField
                  type="number"
                  variant="outlined"
                  color="primary"
                  label="Course Fee"
                  name="fee"
                  value={selectedFee === null ? '' : selectedFee}
                  onBlur={handleBlur}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  size="small"
                  error={errors.fee}
                  helperText={helperTexts.fee}
                  className={isFormSubmitted && errors.fee ? 'shake-helper-text' : ''}
                />

                <Button type="submit" variant="contained" color="primary" size="small" sx={{ boxShadow: 1 }} fullWidth>
                  Save
                  {/* {operation} Course */}
                </Button>
              </Stack>
            </form>
          </Container>
        </Dialog>
      </Grid>

      {/* confirmation dialog */}
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
          <Button variant="contained" onClick={() => handleDeleteConfirmed(IdToDelete)} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* loader popup dialog box */}
      <Dialog
        open={openLoader}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <LinearProgress />
      </Dialog>
    </>
  );
};

export default CoursesMaster;
