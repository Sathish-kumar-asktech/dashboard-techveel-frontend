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

const State = () => {
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
  const [stateIdToDelete, setStateIdToDelete] = useState(null);
  const [stateData, setStateData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [state, setState] = useState('');
  const [operation, setOperation] = useState('Add');
  const [editID, setEditID] = useState();
  const [errors, setErrors] = useState({
    state: false,
  });
  const [helperTexts, setHelperTexts] = useState({
    state: '',
  });
  // alert messages on operations
  const [alertType, setAlertType] = useState('success'); // 'success' or 'error'
  const [alertMessage, setAlertMessage] = useState('');

  // API Integration
  useEffect(() => {
    getState();
  }, []);

  // get all states Request
  const getState = async () => {
    try {
      const res = await axios.instance.get('/GetAllState', {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      setStateData(res.data);
      console.log(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // post Request to Add state
  const addNewState = async (newState) => {
    try {
      const res = await axios.instance.post('/InsertState', newState, {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      getState();
      setAlertType('success');
      setAlertMessage('New State Added, Successfully!');
      setopenAlert(true); // Show a success message using the Snackbar
      setopenAlert(true); // Show a success message using the Snackbar
    } catch (error) {
      console.error('Error adding state:', error);
      setAlertType('error');
      setAlertMessage('Failed to add the state.');
      setopenAlert(true);
    }
  };

  // put Request to edit state

  const updateState = async (stateId, updatedState) => {
    try {
      await axios.instance.put(`/UpdateState/${stateId}`, updatedState, {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      setopenAlert(true);
      setEditID();
      getState();
      setAlertType('success');
      setAlertMessage('State Updated, Successfully!');
      setopenAlert(true);
    } catch (error) {
      console.error('Error updating state:', error);
      setAlertType('error');
      setAlertMessage('Failed to update the state.');
      setopenAlert(true);
    }
  };

  // delete Request to delete state
  const deleteState = async (stateId) => {
    try {
      await axios.instance
        .delete(`/deleteState/${stateId}`, {
          headers: { Authorization: tokent, 'Content-Type': 'application/json' },
        })
        .then((res) => {
          if (res.data === '') {
            getState();
            setOpenDelete(false);
            setAlertType('warning');
            setAlertMessage('State Deleted, Successfully!');
            setopenAlert(true);
          } else {
            getState();
            setOpenDelete(false);
            setAlertType('error');
            setAlertMessage("Oops! Can't delete this data. It's connected to other information.");
            setopenAlert(true);
          }
          console.log(res.data);
        });
      // getState();
      // setOpenDelete(false);
      // setAlertType('warning');
      // setAlertMessage('State Deleted, Successfully!');
      // setopenAlert(true);
    } catch (error) {
      console.error('Error deleting state:', error);
      setAlertType('error');
      setAlertMessage('Failed to delete the state.');
      setopenAlert(true);
    }
  };

  // submit button on add or edit
  const handleSubmit = (event) => {
    event.preventDefault();

    if (errors.state) {
      setIsFormSubmitted(true);
      return;
    }

    const newState = {
      StateName: state,
      CreatedBy: 25,
    };

    const editState = {
      StateName: state,
      ModifyBy: 25,
    };

    if (operation === 'Add') {
      addNewState(newState);
    } else if (operation === 'Edit') {
      console.log(editID, editState);
      updateState(editID, editState);
    }
    setState('');
    handleClose();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState(value);
    validateInput(name, value);
  };

  // validations
  const validateInput = (name, value) => {
    let error = false;
    let helperText = '';

    const locationRegex = /^[A-Za-z\s]+$/;
    const editedStateName = value.toLowerCase().trim();

    const isStateExists = stateData.some((state) => state.StateName.toLowerCase() === value.toLowerCase().trim());

    const isStateExistsinEDIt = stateData.some(
      (state) => state.StateName.toLowerCase() === editedStateName && state.StateId !== editID
    );

    if (name === 'state') {
      if (!value.trim()) {
        // If the field is empty, show a different message
        error = true;
        helperText = 'State field cannot be empty';
        setIsFormSubmitted(false);
      } else if (!locationRegex.test(value)) {
        // If the field has a value but doesn't match the regex
        error = true;
        helperText = 'Please enter a valid state';
        setIsFormSubmitted(false);
      } else if (operation === 'Add' && isStateExists) {
        error = true;
        helperText = 'State already exists. Please enter a different state name.';
        setIsFormSubmitted(false);
      }
      else if (operation === 'Edit' && isStateExistsinEDIt) {
        error = true;
        helperText = 'State already exists. Please enter a different state name.';
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
  const handleEdit = (state) => {
    setEditID(state.StateId);
    setState(state.StateName);
    console.log(state.StateId, state.StateName);
    handleEditOpen();
  };
  const handleEditOpen = () => {
    setOpen(true);
    setOperation('Edit');
  };

  // handle delete popup dialog
  const handleDelete = (stateId) => {
    setOpenDelete(true);
    setStateIdToDelete(stateId);
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
    setState('');
    errors.state = false;
    helperTexts.state = '';
  };

  // search & filter

  const filteredData = stateData.filter((c) => c.StateName.toLowerCase().includes(searchTerm.toLowerCase()));
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
          State Master
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
            Add State
          </Button>
        </Stack>

        {/* table  */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>S.No</StyledTableCell>
                <StyledTableCell>State</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : filteredData
              ).map((state, index) => (
                <TableRow key={state.StateId} hover>
                  <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
                    {state.StateName}
                  </TableCell>
                  <TableCell align="center" sx={{ padding: '0' }}>
                    <IconButton aria-label="Edit" onClick={() => handleEdit(state)}>
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton aria-label="Delete" onClick={() => handleDelete(state.StateId)}>
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
                  {operation} State
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
                  label="State"
                  name="state"
                  value={state}
                  onBlur={handleBlur}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  size="small"
                  error={errors.state}
                  helperText={helperTexts.state}
                  className={isFormSubmitted && errors.state ? 'shake-helper-text' : ''}
                />
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  type="submit"
                  sx={{ textTransform: 'capitalize' }}
                >
                  {operation} State
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
          aria-describedby="alert-dialog-description"
          fullScreen={fullScreen}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle id="alert-dialog-title">{'Are you sure want to Delete?'}</DialogTitle>
          <DialogActions>
            <Button variant="contained" autoFocus onClick={handleCloseDelete} color="primary">
              Cancel
            </Button>
            <Button variant="contained" onClick={() => handleDeleteConfirmed(stateIdToDelete)} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </>
  );
};

export default State;
