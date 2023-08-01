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
import AddLocationAltRoundedIcon from '@mui/icons-material/AddLocationAltRounded';
import axios from '../../axios';
import './animation.css';

// table header cell styles
const StyledTableCell = styled(TableCell)({
  color: '#424242',
  fontWeight: '600',
  textAlign: 'center',
});

const City = () => {
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
    city: false,
    state: false,
  });
  const [helperTexts, setHelperTexts] = useState({
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
  const [newCityName, setNewCityName] = useState('');
  const [selectedState, setSelectedState] = useState(null);

  // API Integration
  useEffect(() => {
    getStates();
    getCities();
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
  const addNewCity = async (newCity) => {
    try {
      const res = await axios.instance.post('/InsertCity', newCity, {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      getCities();
      setAlertType('success');
      setAlertMessage('New City Added, Successfully!');
      setopenAlert(true);
    } catch (error) {
      console.error('Error adding City:', error);
      setAlertType('error');
      setAlertMessage('Failed to add the city.');
      setopenAlert(true);
    }
  };

  // put Request to edit record
  const UpdateCity = async (cityId, updatedCity) => {
    try {
      await axios.instance.put(`/UpdateCity/${cityId}`, updatedCity, {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      setopenAlert(true);
      setEditID();
      getCities();
      setAlertType('success');
      setAlertMessage('City Updated, Successfully!');
    } catch (error) {
      console.error('Error updating city:', error);
      setAlertType('error');
      setAlertMessage('Failed to update the city.');
      setopenAlert(true);
    }
  };

  // delete Request to delete record
  const deleteState = async (cityId) => {
    try {
      await axios.instance
        .delete(`/deleteCity/${cityId}`, {
          headers: { Authorization: tokent, 'Content-Type': 'application/json' },
        })
        .then((res) => {
          if (res.data === '') {
            getCities();
            setOpenDelete(false);
            setAlertType('warning');
            setAlertMessage('City Deleted, Successfully!');
            setopenAlert(true);
          } else {
            getCities();
            setOpenDelete(false);
            setAlertType('error');
            setAlertMessage("Oops! Can't delete this data. It's connected to other information.");
            setopenAlert(true);
          }
          console.log(res.data);
        });
    } catch (error) {
      console.error('Error deleting city:', error);
      setAlertType('error');
      setAlertMessage('Failed to delete the city.');
      setopenAlert(true);
    }
  };

  // submit button on add or edit
  const handleSubmit = (event) => {
    event.preventDefault();
    // setIsFormSubmitted(false);
    console.log(errors.city, errors.state, selectedState);

    if (
      errors.city ||
      errors.state ||
      selectedState === null ||
      selectedState === 0 ||
      selectedState === undefined ||
      selectedState === ''
    ) {
      setErrors((prevErrors) => ({ ...prevErrors, state: true }));
      setHelperTexts((prevHelperTexts) => ({ ...prevHelperTexts, state: 'Please select a state' }));
      setIsFormSubmitted(true);
      return;
    }

    setErrors((prevErrors) => ({ ...prevErrors, state: false }));
    setHelperTexts((prevHelperTexts) => ({ ...prevHelperTexts, state: '' }));

    const newData = {
      CityName: newCityName,
      StateId: selectedState.StateId,
      CreatedBy: 25,
    };

    console.log('submitted', newData);

    const editData = {
      CityName: newCityName,
      StateId: selectedState.StateId,
      ModifyBy: 25,
    };

    if (operation === 'Add') {
      addNewCity(newData);
    } else if (operation === 'Edit') {
      console.log(editID, editData);
      UpdateCity(editID, editData);
    }
    setNewCityName('');
    setSelectedState(null);
    handleClose();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'city') setNewCityName(value);
    validateInput(name, value);
  };

  const handleInputChangeSelect = (event, newValue) => {
    setSelectedState(newValue);

    if (!newValue) {
      // Check if the newValue is null or undefined
      setErrors((prevErrors) => ({ ...prevErrors, state: true }));
      setHelperTexts((prevHelperTexts) => ({ ...prevHelperTexts, state: 'Please select a state' }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, state: false }));
      setHelperTexts((prevHelperTexts) => ({ ...prevHelperTexts, state: '' }));
    }
  };

  // validations
  const validateInput = (name, value) => {
    let error = false;
    let helperText = '';

    const locationRegex = /^[A-Za-z\s]+$/;
    const editedName = value.toLowerCase().trim();

    // const isDataExists = stateData.some((city) => city.CityName.toLowerCase() === value.toLowerCase().trim());

    const isDataExistsinEDIt = cityData.some(
      (city) => city.CityName.toLowerCase() === editedName && city.CityId !== editID
    );

    const isDataExists = cityData.some((city) => city.CityName.toLowerCase() === editedName);

    if (name === 'city') {
      if (!value.trim()) {
        // If the field is empty, show a different message
        error = true;
        helperText = 'City field cannot be empty';
        setIsFormSubmitted(false);
      } else if (!locationRegex.test(value)) {
        // If the field has a value but doesn't match the regex
        error = true;
        helperText = 'Please enter a valid city';
        setIsFormSubmitted(false);
      } else if (operation === 'Add' && isDataExists) {
        error = true;
        helperText = 'City already exists';
        setIsFormSubmitted(false);
      }else if (operation === 'Edit' && isDataExistsinEDIt ) {
        error = true;
        helperText = 'City already exists';
        setIsFormSubmitted(false);
      }
       
      else {
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
  const handleEdit = (city) => {
    setEditID(city.CityId);
    setNewCityName(city.CityName);
    const selectedStateObj = stateData.find((state) => state.StateId === city.StateId);
    setSelectedState(selectedStateObj);
    // setSelectedState(city.StateName);
    console.log('handle edit data', city);
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
  const handleDeleteConfirmed = (stateId) => {
    deleteState(stateId);
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
    setNewCityName('');
    setSelectedState('');
    errors.city = false;
    errors.state = false;
    helperTexts.state = '';
    helperTexts.city = '';
  };

  // search & filter
  const filteredData = cityData.filter((c) => c.CityName.toLowerCase().includes(searchTerm.toLowerCase()));
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
          City Master
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
            Add City
          </Button>
        </Stack>

        {/* table  */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>S.No</StyledTableCell>
                <StyledTableCell>City</StyledTableCell>
                <StyledTableCell>State</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : filteredData
              ).map((city, index) => (
                <TableRow key={city.CityId} hover>
                  <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell align="center">{city.CityName}</TableCell>
                  <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
                    {city.StateName}
                  </TableCell>
                  <TableCell align="center" sx={{ padding: '0' }}>
                    <IconButton aria-label="Edit" onClick={() => handleEdit(city)}>
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton aria-label="Delete" onClick={() => handleDelete(city.CityId)}>
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
                  {operation} City
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
                  label="City"
                  name="city"
                  value={newCityName}
                  onBlur={handleBlur}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  size="small"
                  error={errors.city}
                  helperText={helperTexts.city}
                  className={isFormSubmitted && errors.city ? 'shake-helper-text' : ''}
                />

                <Autocomplete
                  size="small"
                  name="state"
                  options={stateData}
                  getOptionLabel={(state) => (state ? state.StateName : '')}
                  value={selectedState || null}
                  onChange={handleInputChangeSelect}
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

                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  type="submit"
                  sx={{ textTransform: 'capitalize' }}
                >
                  {operation} City
                </Button>
              </Stack>
            </form>
          </Container>
        </Dialog>

        {/* delete confirmation popup dialog box */}
        <Dialog
          open={openDelete}
          onClose={handleCloseDelete}
          aria-labelledby="alert-dialog-title"
          fullScreen={fullScreen}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle id="alert-dialog-title">{'Are you sure want to Delete?'}</DialogTitle>
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

export default City;
