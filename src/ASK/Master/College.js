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
} from '@mui/material';
import Slide from '@mui/material/Slide';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import styled from '@emotion/styled';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SchoolIcon from '@mui/icons-material/School';
import AddLocationAltRoundedIcon from '@mui/icons-material/AddLocationAltRounded';
import axios from '../../axios';
import './animation.css';

// table header cell styles
const StyledTableCell = styled(TableCell)({
  color: '#424242',
  fontWeight: '600',
  textAlign: 'center',
});

const College = () => {
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
    college: false,
    city: false,
    state: false,
  });
  const [helperTexts, setHelperTexts] = useState({
    college: '',
    city: '',
    state: '',
  });
  // alert messages on operations
  const [alertType, setAlertType] = useState('success'); // 'success' or 'error'
  const [alertMessage, setAlertMessage] = useState('');

  // input fields state values
  const [IdToDelete, setIdToDelete] = useState(null);
  const [editID, setEditID] = useState();
  const [cityData, setcityData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [collegeData, setCollegeData] = useState([]);
  const [newCollegeName, setNewCollegeName] = useState('');
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [filteredCityData, setFilteredCityData] = useState([]);

  // API Integration
  useEffect(() => {
    getStates();
    getCities();
    getCollege();
  }, []);

  // get all states Request
  const getStates = async () => {
    try {
      const res = await axios.instance.get('/GetAllState', {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      setStateData(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // get all collegs Request
  const getCollege = async () => {
    try {
      const res = await axios.instance.get('/GetAllCollege', {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      setCollegeData(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // get all Cities Request
  const getCities = async () => {
    try {
      const res = await axios.instance.get('/GetAllCity', {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      setcityData(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // post Request to Add new record
  const addNewCollege = async (newCollege) => {
    try {
      const res = await axios.instance.post('/InsertCollege', newCollege, {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      getCollege();
      setAlertType('success');
      setAlertMessage('New College Added Successfully!');
      setopenAlert(true);
    } catch (error) {
      console.error('Error adding College:', error);
      setAlertType('error');
      setAlertMessage('Failed to add the College.');
      setopenAlert(true);
    }
  };

  // put Request to edit record
  const UpdateCollege = async (collegeId, updatedCollege) => {
    try {
      await axios.instance.put(`/UpdateCollege/${collegeId}`, updatedCollege, {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      setopenAlert(true);
      setEditID();
      getCollege();
      setAlertType('success');
      setAlertMessage('College Updated, Successfully!');
    } catch (error) {
      console.error('Error updating College:', error);
      setAlertType('error');
      setAlertMessage('Failed to update the College.');
      setopenAlert(true);
    }
  };

  // delete Request to delete record
  const deleteCollege = async (deleteId) => {
    try {
      await axios.instance
        .delete(`/DeleteCollege/${deleteId}`, {
          headers: { Authorization: tokent, 'Content-Type': 'application/json' },
        })
        .then((res) => {
          if (res.data === '') {
            getCollege();
            setOpenDelete(false);
            setAlertType('warning');
            setAlertMessage('College Deleted, Successfully!');
            setopenAlert(true);
          } else {
            getCollege();
            setOpenDelete(false);
            setAlertType('error');
            setAlertMessage("Oops! Can't delete this data. It's connected to other information.");
            setopenAlert(true);
          }
          console.log(res.data);
        });
    } catch (error) {
      console.error('Error deleting College:', error);
      setAlertType('error');
      setAlertMessage('Failed to delete the College.');
      setopenAlert(true);
    }
  };

  // submit button on add or edit
  const handleSubmit = (event) => {
    event.preventDefault();
    setIsFormSubmitted(false);
    console.log(
      'Outisde the if ',
      errors.college,
      errors.state,
      errors.city,
      selectedState === null,
      selectedState === 0,
      selectedState === undefined,
      selectedState === '',
      selectedCity === null,
      selectedCity === 0,
      selectedCity === undefined,
      selectedCity === ''
    );

    if (
      errors.college ||
      errors.city ||
      errors.state ||
      selectedState === null ||
      selectedState === 0 ||
      selectedState === undefined ||
      selectedState === '' ||
      selectedCity === null ||
      selectedCity === 0 ||
      selectedCity === undefined ||
      selectedCity === ''
    ) {
      if (
        errors.state ||
        selectedState === null ||
        selectedState === 0 ||
        selectedState === undefined ||
        selectedState === ''
      ) {
        setErrors((prevErrors) => ({ ...prevErrors, state: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          state: 'Please select a state',
        }));
      } else if (
        errors.city ||
        selectedCity === null ||
        selectedCity === 0 ||
        selectedCity === undefined ||
        selectedCity === ''
      ) {
        setErrors((prevErrors) => ({ ...prevErrors, city: true }));
        setHelperTexts((prevHelperTexts) => ({
          ...prevHelperTexts,
          city: 'Please select a state',
        }));
      }
      setIsFormSubmitted(true);
      console.log('state & city error state: ', errors.college, errors.state, errors.city);
      return;
    }

    setErrors((prevErrors) => ({ ...prevErrors, state: false, city: false }));
    setHelperTexts((prevHelperTexts) => ({ ...prevHelperTexts, state: '', city: '' }));

    console.log('state & city error state: ', errors.city, errors.state);

    const newData = {
      CollegeName: newCollegeName,
      CityId: selectedCity.CityId,
      StateId: selectedState.StateId,
      CreatedBy: 25,
    };

    console.log('submitted', newData);

    const editData = {
      CollegeName: newCollegeName,
      CityId: selectedCity.CityId,
      StateId: selectedState.StateId,
      ModifyBy: 25,
    };

    if (operation === 'Add') {
      addNewCollege(newData);
    } else if (operation === 'Edit') {
      console.log(editID, editData);
      UpdateCollege(editID, editData);
    }
    setNewCollegeName('');
    setSelectedState(null);
    setSelectedCity(null);
    handleClose();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'college') setNewCollegeName(value);
    validateInput(name, value);
  };

  const handleInputChangeState = (event, newValue) => {
    setSelectedState(newValue);
    console.log('length', newValue.stateId);
    if (!newValue) {
      setFilteredCityData([]);
      setErrors((prevErrors) => ({ ...prevErrors, state: true }));
      setHelperTexts((prevHelperTexts) => ({ ...prevHelperTexts, state: 'Please select a state' }));
    } else {
      // Filter the city data based on the selected state
      const citiesInSelectedState = cityData.filter((city) => city.StateId === newValue.StateId);
      setFilteredCityData(citiesInSelectedState);
      setErrors((prevErrors) => ({ ...prevErrors, state: false }));
      setHelperTexts((prevHelperTexts) => ({ ...prevHelperTexts, state: '' }));
      console.log('inside the state change ', citiesInSelectedState, errors.state);
      console.log('after selected: ', errors.state);
    }
    // Reset the selected city whenever the state changes
    setSelectedCity(null);
  };

  const handleInputChangeCity = (event, newValue) => {
    setSelectedCity(newValue);
    if (!newValue) {
      // Check if the newValue is null or undefined
      setErrors((prevErrors) => ({ ...prevErrors, city: true }));
      setHelperTexts((prevHelperTexts) => ({ ...prevHelperTexts, city: 'Please select a City' }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, city: false }));
      setHelperTexts((prevHelperTexts) => ({ ...prevHelperTexts, city: '' }));
    }
  };

  // validations
  const validateInput = (name, value) => {
    let error = false;
    let helperText = '';

    const editedName = value.toLowerCase().trim();

    const isDataExists = collegeData.some((college) => college.CollegeName.toLowerCase() === editedName);

    const isExistsinEDIt = collegeData.some(
      (college) => college.CollegeName.toLowerCase() === editedName && college.CollegeId !== editID
    );

    if (name === 'college') {
      if (!value.trim()) {
        // If the field is empty, show a different message
        error = true;
        helperText = 'College field cannot be empty';
        setIsFormSubmitted(false);
      } else if (operation === 'Add' && isDataExists) {
        error = true;
        helperText = 'College already exists';
        setIsFormSubmitted(false);
      }
      if (operation === 'Edit' && isExistsinEDIt) {
        error = true;
        helperText = 'College already exists';
        setIsFormSubmitted(false);
      } else {
        setIsFormSubmitted(true); // Add this line when there are no errors for the city field
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
  const handleEdit = (college) => {
    setEditID(college.CollegeId);
    setNewCollegeName(college.CollegeName);
    const selectedStateObj = stateData.find((state) => state.StateId === college.StateId);
    setSelectedState(selectedStateObj);
    const selectedCityObj = cityData.find((city) => city.CityId === college.CityId);
    setSelectedCity(selectedCityObj);
    // setSelectedState(city.StateName);
    console.log('handle edit data', college, editID);
    handleEditOpen();
  };

  const handleEditOpen = () => {
    setOpen(true);
    setOperation('Edit');
  };

  // handle edit popup dialog
  const handleDelete = (stateId) => {
    setOpenDelete(true);
    setIdToDelete(stateId);
  };
  const handleDeleteConfirmed = (deleteId) => {
    deleteCollege(deleteId);
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
    setNewCollegeName('');
    setSelectedState('');
    setSelectedCity('');
    errors.city = false;
    errors.college = false;
    errors.state = false;
    helperTexts.state = '';
    helperTexts.college = '';
    helperTexts.city = '';
  };

  // search & filter
  const filteredData = collegeData.filter((c) => c.CollegeName.toLowerCase().includes(searchTerm.toLowerCase()));
  // pagination
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredData.length - page * rowsPerPage);
  const totalRows = filteredData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  // const currentPage = Math.min(page, totalPages - 1);
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
          College Master
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
            startIcon={<SchoolIcon />}
          >
            Add College
          </Button>
        </Stack>

        {/* table  */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>S.No</StyledTableCell>
                <StyledTableCell>College Name</StyledTableCell>
                <StyledTableCell>City</StyledTableCell>
                <StyledTableCell>State</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : filteredData
              ).map((data, index) => (
                <TableRow key={data.CollegeId} hover>
                  <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
                    {data.CollegeName}
                  </TableCell>
                  <TableCell align="center">{data.CityName}</TableCell>
                  <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
                    {data.StateName}
                  </TableCell>
                  <TableCell align="center" sx={{ padding: '0' }}>
                    <IconButton aria-label="Edit" onClick={() => handleEdit(data)}>
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton aria-label="Delete" onClick={() => handleDelete(data.CollegeId)}>
                      <DeleteForeverIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={4} />
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
                  {operation} College
                </Typography>
                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Stack>
              <Stack direction={'column'} spacing={2} p={2}>
                <Autocomplete
                  size="small"
                  name="state"
                  options={stateData}
                  getOptionLabel={(state) => (state ? state.StateName : '')}
                  value={selectedState || null}
                  onChange={handleInputChangeState}
                  renderInput={(params) => <TextField {...params} label="Select State" />}
                />

                {errors.state && (
                  <Typography
                    variant="caption"
                    color="error"
                    className={isFormSubmitted && errors.state ? 'shake-helper-text' : ''}
                  >
                    {errors.state && helperTexts.state}
                  </Typography>
                )}

                <Autocomplete
                  size="small"
                  name="city"
                  options={filteredCityData}
                  getOptionLabel={(city) => (city ? city.CityName : '')}
                  value={selectedCity || null}
                  onChange={handleInputChangeCity}
                  renderInput={(params) => <TextField {...params} label="Select City" />}
                />

                {errors.city && (
                  <Typography
                    variant="caption"
                    color="error"
                    className={isFormSubmitted && errors.state ? 'shake-helper-text' : ''}
                  >
                    {errors.city && helperTexts.city}
                  </Typography>
                )}

                <TextField
                  type="text"
                  variant="outlined"
                  color="primary"
                  label="College"
                  name="college"
                  value={newCollegeName}
                  onBlur={handleBlur}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  size="small"
                  error={errors.college}
                  helperText={helperTexts.college}
                  className={isFormSubmitted && errors.college ? 'shake-helper-text' : ''}
                />

                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  type="submit"
                  sx={{ textTransform: 'capitalize' }}
                >
                  Save
                  {/* {operation} College */}
                </Button>
              </Stack>
            </form>
          </Container>
        </Dialog>

        {/* delete confirmation popup dialog box */}
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
      </Grid>
    </>
  );
};

export default College;
