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
  LinearProgress
} from '@mui/material';
import Slide from '@mui/material/Slide';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import styled from '@emotion/styled';
import EditIcon from '@mui/icons-material/Edit';
import PlaylistAddCircleIcon from '@mui/icons-material/PlaylistAddCircle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import axios from '../../axios';
import './animation.css';

const StyledTableCell = styled(TableCell)({
  color: '#424242',
  fontWeight: '600',
  textAlign: 'center',
});

const TermsConditions = () => {
  const [tokent, settokent] = useState(
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudGxpc3QiOlt7IlVzZXJJRCI6IjEiLCJMb2dpbkNvZGUiOiIwMSIsIkxvZ2luTmFtZSI6IkFkbWluIiwiRW1haWxJZCI6ImFkbWluQGdtYWlsLmNvbSIsIlVzZXJUeXBlIjoiQURNSU4ifV0sImlhdCI6MTYzODM1NDczMX0.ZW6zEHIXTxfT-QWEzS6-GuY7bRupf2Jc_tp4fXIRabQ'
  );
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const [open, setOpen] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [openAlert, setopenAlert] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [tcIdToDelete, setTcIdToDelete] = useState(null);
  const [termsConditionsData, setTermsConditionsData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [termsConditions, setTermsConditions] = useState('');
  const [operation, setOperation] = useState('Add');
  const [editTcId, setEditTcId] = useState();
  const [errors, setErrors] = useState({
    termsConditions: false,
  });
  const [helperTexts, setHelperTexts] = useState({
    termsConditions: '',
  });
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [openLoader, setOpenLoader] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    getTermsConditions();
  }, []);

  const getTermsConditions = async () => {
    setOpenLoader(true);
    try {
      const res = await axios.instance.get('/GetAllTNC', {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      setTermsConditionsData(res.data);
      console.log(res.data);
      setOpenLoader(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const addNewTermsConditions = async (newTermsConditions) => {
    try {
      const res = await axios.instance.post('/InsertTNC', newTermsConditions, {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      getTermsConditions();
      setAlertType('success');
      setAlertMessage('New Terms & Conditions Added, Successfully!');
      setopenAlert(true);
    } catch (error) {
      console.error('Error adding terms & conditions:', error);
      setAlertType('error');
      setAlertMessage('Failed to add the terms & conditions.');
      setopenAlert(true);
    }
  };

  const updateTermsConditions = async (tcId, updatedTermsConditions) => {
    try {
      await axios.instance.put(`/UpdateTNC/${tcId}`, updatedTermsConditions, {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      setopenAlert(true);
      setEditTcId();
      getTermsConditions();
      setAlertType('success');
      setAlertMessage('Terms & Conditions Updated, Successfully!');
      setopenAlert(true);
    } catch (error) {
      console.error('Error updating terms & conditions:', error);
      setAlertType('error');
      setAlertMessage('Failed to update the terms & conditions.');
      setopenAlert(true);
    }
  };

  const deleteTermsConditions = async (tcId) => {
    try {
      await axios.instance
        .delete(`/DeleteTNC/${tcId}`, {
          headers: { Authorization: tokent, 'Content-Type': 'application/json' },
        })
        .then((res) => {
          if (res.data === '') {
            getTermsConditions();
            setOpenDelete(false);
            setAlertType('warning');
            setAlertMessage('T&C Deleted, Successfully!');
            setopenAlert(true);
          } else {
            getTermsConditions();
            setOpenDelete(false);
            setAlertType('error');
            setAlertMessage("Oops! Can't delete this data. It's connected to other information.");
            setopenAlert(true);
          }
          console.log(res.data);
        });
    } catch (error) {
      console.error('Error deleting terms & conditions:', error);
      setAlertType('error');
      setAlertMessage('Failed to delete the terms & conditions.');
      setopenAlert(true);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (errors.termsConditions) {
      setIsFormSubmitted(true);
      return;
    }

    const newTermsConditions = {
      TermsConditions: termsConditions,
      CreatedBy: 25,
    };

    const editTermsConditions = {
      TermsConditions: termsConditions,
      ModifyBy: 25,
    };

    if (operation === 'Add') {
      addNewTermsConditions(newTermsConditions);
    } else if (operation === 'Edit') {
      updateTermsConditions(editTcId, editTermsConditions);
    }
    setTermsConditions('');
    handleClose();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTermsConditions(value);
    validateInput(name, value);
  };

  const validateInput = (name, value) => {
    let error = false;
    let helperText = '';

    const isTcExists = termsConditionsData.some(
      (tc) => tc.TermsConditions.toLowerCase() === value.toLowerCase().trim()
    );
    const isTcExistsinEdit = termsConditionsData.some(
      (tc) => tc.TermsConditions.toLowerCase() === value.toLowerCase().trim() && tc.TCId !== editTcId
    );

    if (name === 'termsConditions') {
      if (!value.trim()) {
        error = true;
        helperText = 'Terms & Conditions field cannot be empty';
        setIsFormSubmitted(false);
      } else if (operation === 'Add' && isTcExists) {
        error = true;
        helperText = 'Terms & Conditions already exists. Please enter a different text.';
        setIsFormSubmitted(false);
      }
      if (operation === 'Edit' && isTcExistsinEdit) {
        error = true;
        helperText = 'Terms & Conditions already exists. Please enter a different text.';
        setIsFormSubmitted(false);
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

  const handleAddOpen = () => {
    setOpen(true);
    setOperation('Add');
  };

  const handleEdit = (termsConditions) => {
    setEditTcId(termsConditions.TCId);
    setTermsConditions(termsConditions.TermsConditions);
    handleEditOpen();
  };

  const handleEditOpen = () => {
    setOpen(true);
    setOperation('Edit');
  };

  const handleDelete = (tcId) => {
    setOpenDelete(true);
    setTcIdToDelete(tcId);
  };

  const handleDeleteConfirmed = (tcId) => {
    deleteTermsConditions(tcId);
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
    setTermsConditions('');
    errors.termsConditions = false;
    helperTexts.termsConditions = '';
  };

  const filteredData = termsConditionsData.filter((tc) =>
    tc.TermsConditions.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <Container maxWidth={"xl"}  sx={{ mt: 2, pt: 4 }} elevation={3} component={Paper}>
        <Typography variant="h6" color="primary" fontWeight={600} mb={2} textAlign="center" sx={{ color: '#616161' }}>
          Terms & Conditions Master
        </Typography>

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
            startIcon={<PlaylistAddCircleIcon />}
          >
            Add T&C
          </Button>
        </Stack>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>S.No</StyledTableCell>
                <StyledTableCell>Terms & Conditions</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : filteredData
              ).map((tc, index) => (
                <TableRow key={tc.TCId} hover>
                  <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      textTransform: 'capitalize',
                      textOverflow: 'ellipsis',
                      maxWidth: '150px',
                      overflow: 'hidden',
                    }}
                  >
                    {tc.TermsConditions}
                  </TableCell>
                  <TableCell align="center" sx={{ padding: '0' }}>
                    <IconButton aria-label="Edit" onClick={() => handleEdit(tc)}>
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton aria-label="Delete" onClick={() => handleDelete(tc.TCId)}>
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
        <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} fullWidth>
          <Container component={Paper} elevation={2} sx={{ py: 2 }}>
            <form onSubmit={handleSubmit}>
              <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} mr={1}>
                <Typography variant="h5" textAlign={'left'} pl={2} fontWeight={600} color="primary">
                  {operation} Terms & Conditions
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
                  label="Terms & Conditions"
                  name="termsConditions"
                  value={termsConditions}
                  onBlur={handleBlur}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  size="small"
                  multiline
                  rows={8}
                  error={errors.termsConditions}
                  helperText={helperTexts.termsConditions}
                  className={isFormSubmitted && errors.termsConditions ? 'shake-helper-text' : ''}
                />
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  type="submit"
                  sx={{ textTransform: 'capitalize' }}
                >
                  Save
                  {/* {operation} T & C */}
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
            <Button variant="contained" onClick={() => handleDeleteConfirmed(tcIdToDelete)} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>

      {/* /* loader popup dialog box */} 
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

export default TermsConditions;
