import React, { useEffect, useState } from 'react';
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
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  LinearProgress
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import Slide from '@mui/material/Slide';
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import styled from '@emotion/styled';
import axios from '../../axios';
import './animation.css';

// table header cell styles

const StyledTableCell = styled(TableCell)({
  color: '#424242',
  fontWeight: '600',
  textAlign: 'center',
});

const EducationStream = () => {
  const [tokent, settokent] = useState(
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudGxpc3QiOlt7IlVzZXJJRCI6IjEiLCJMb2dpbkNvZGUiOiIwMSIsIkxvZ2luTmFtZSI6IkFkbWluIiwiRW1haWxJZCI6ImFkbWluQGdtYWlsLmNvbSIsIlVzZXJUeXBlIjoiQURNSU4ifV0sImlhdCI6MTYzODM1NDczMX0.ZW6zEHIXTxfT-QWEzS6-GuY7bRupf2Jc_tp4fXIRabQ'
  );
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const [open, setOpen] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [openAlert, setopenAlert] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openLoader, setOpenLoader] = useState(false);

  const [idToDelete, setIdToDelete] = useState(null);
  const [degreeData, setDegreeData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [degree, setDegree] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [operation, setOperation] = useState('Add');
  const [editID, setEditID] = useState();
  const [errors, setErrors] = useState({
    degree: false,
  });
  const [helperTexts, setHelperTexts] = useState({
    degree: '',
  });
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    getDegrees();
  }, []);

  // get all degrees Request
  const getDegrees = async () => {
    setOpenLoader(true);
    try {
      const res = await axios.instance.get('/GetAllDegree', {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      setDegreeData(res.data);
      console.log(res.data);
      setOpenLoader(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // post Request to Add degree
  const addNewDegree = async (newDegree) => {
    try {
      const res = await axios.instance.post('/InsertDegree', newDegree, {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      getDegrees();
      setAlertType('success');
      setAlertMessage('New Degree Added Successfully!');
      setopenAlert(true);
    } catch (error) {
      console.error('Error adding degree:', error);
      setAlertType('error');
      setAlertMessage('Failed to add the degree.');
      setopenAlert(true);
    }
  };

  // put Request to edit degree
  const updateDegree = async (degreeId, updatedDegree) => {
    try {
      await axios.instance.put(`/UpdateDegree/${degreeId}`, updatedDegree, {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      setopenAlert(true);
      setEditID();
      getDegrees();
      setAlertType('success');
      setAlertMessage('Degree Updated Successfully!');
      setopenAlert(true);
    } catch (error) {
      console.error('Error updating degree:', error);
      setAlertType('error');
      setAlertMessage('Failed to update the degree.');
      setopenAlert(true);
    }
  };

  // delete Request to delete degree
  const deleteDegree = async (degreeId) => {
    try {
      await axios.instance
        .delete(`/deleteDegree/${degreeId}`, {
          headers: { Authorization: tokent, 'Content-Type': 'application/json' },
        })
        .then((res) => {
          if (res.data === '') {
            getDegrees();
            setOpenDelete(false);
            setAlertType('warning');
            setAlertMessage('Degree Deleted, Successfully!');
            setopenAlert(true);
          } else {
            getDegrees();
            setOpenDelete(false);
            setAlertType('error');
            setAlertMessage("Oops! Can't delete this data. It's connected to other information.");
            setopenAlert(true);
          }
          console.log(res.data);
        });
    } catch (error) {
      console.error('Error deleting degree:', error);
      setAlertType('error');
      setAlertMessage('Failed to delete the degree.');
      setopenAlert(true);
    }
  };

  // submit button on add or edit
  const handleSubmit = (event) => {
    event.preventDefault();

    if (errors.degree) {
      setIsFormSubmitted(true);
      return;
    }

    const newDegree = {
      DegreeName: degree,
      DegreeType: educationLevel,
      CreatedBy: 25,
    };

    const editDegree = {
      DegreeName: degree,
      DegreeType: educationLevel,
      ModifyBy: 25,
    };

    console.log('new  data:', newDegree, 'edit data', editDegree);

    if (operation === 'Add') {
      addNewDegree(newDegree);
    } else if (operation === 'Edit') {
      console.log(editID, editDegree);
      updateDegree(editID, editDegree);
    }
    setDegree('');
    setEducationLevel('');
    setEducationLevel('UG');
    handleClose();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'degree') {
      setDegree(value);
      validateInput(name, value);
    } else if (name === 'educationLevel') {
      setEducationLevel(value);
    }
  };

  const validateInput = (name, value) => {
    let error = false;
    let helperText = '';

    const degreeRegex = /^[A-Za-z\s]+$/;
    const editedName = value.toLowerCase().trim();
    const isDegreeExists = degreeData.some((degree) => degree.DegreeName.toLowerCase() === editedName);
    const isEditExists = degreeData.some(
      (degree) => degree.DegreeName.toLowerCase() === editedName && degree.DegreeId !== editID
    );

    if (name === 'degree') {
      if (!value.trim()) {
        error = true;
        helperText = 'Degree field cannot be empty';
        setIsFormSubmitted(false);
      } else if (operation === 'Add' && isDegreeExists) {
        error = true;
        helperText = 'Degree already exists. Please enter a different degree name.';
        setIsFormSubmitted(false);
      } else if (operation === 'Edit' && isEditExists) {
        error = true;
        helperText = 'Degree already exists. Please enter a different degree name.';
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

  const handleEdit = (degree) => {
    setEditID(degree.DegreeId);
    setDegree(degree.DegreeName);
    setEducationLevel(degree.DegreeType);
    handleEditOpen();
  };

  const handleEditOpen = () => {
    setOpen(true);
    setOperation('Edit');
  };

  const handleDelete = (degreeId) => {
    setOpenDelete(true);
    setEditID(degreeId);
  };

  const handleDeleteConfirmed = (degreeId) => {
    deleteDegree(degreeId);
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
    setDegree('');
    setEducationLevel('');
    setErrors((prevErrors) => ({
      ...prevErrors,
      degree: false,
    }));
    setHelperTexts((prevHelperTexts) => ({
      ...prevHelperTexts,
      degree: '',
    }));
  };

  const filteredData = degreeData.filter((degree) =>
    degree.DegreeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredData.length - page * rowsPerPage);
  const totalRows = filteredData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const currentPage = Math.max(0, Math.min(page, totalPages - 1));

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
          College Degree Master
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
            startIcon={<SchoolIcon />}
            color="secondary"
            sx={{ boxShadow: 1 }}
            onClick={handleAddOpen}
          >
            Add Degree
          </Button>
        </Stack>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>S.No</StyledTableCell>
                <StyledTableCell>Degree</StyledTableCell>
                <StyledTableCell>Education Level</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : filteredData
              ).map((degree, index) => (
                <TableRow key={degree.DegreeId} hover>
                  <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
                    {degree.DegreeName}
                  </TableCell>
                  <TableCell align="center">{degree.DegreeType}</TableCell>
                  <TableCell align="center" sx={{ padding: '0' }}>
                    <IconButton aria-label="Edit" onClick={() => handleEdit(degree)}>
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton aria-label="Delete" onClick={() => handleDelete(degree.DegreeId)}>
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

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalRows}
          rowsPerPage={rowsPerPage}
          page={currentPage}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
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
                  {operation} College Degree
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
                  label="College Degree"
                  name="degree"
                  value={degree}
                  onBlur={handleBlur}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  size="small"
                  error={errors.degree}
                  helperText={helperTexts.degree}
                  className={isFormSubmitted && errors.degree ? 'shake-helper-text' : ''}
                />

                <FormControl>
                  <FormLabel id="demo-form-control-label-placement">UG/PG</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-form-control-label-placement"
                    name="educationLevel"
                    value={educationLevel}
                    onChange={handleInputChange}
                  >
                    <FormControlLabel value="UG" control={<Radio required="true" />} label="UG" labelPlacement="UG" />
                    <FormControlLabel value="PG" control={<Radio required="true" />} label="PG" labelPlacement="PG" />
                  </RadioGroup>
                </FormControl>

                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  type="submit"
                  sx={{ textTransform: 'capitalize' }}
                >
                  Save
                  {/* {operation} College Degree */}
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
      </Grid>

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

export default EducationStream;
