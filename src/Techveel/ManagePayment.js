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
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  Box,
} from '@mui/material';
import { Link } from 'react-router-dom';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import React, { useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import styled from '@emotion/styled';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddCardIcon from '@mui/icons-material/AddCard';

// import { useHistory } from 'react-router-dom';
import AddLocationAltRoundedIcon from '@mui/icons-material/AddLocationAltRounded';
import Enquiry from './Enquiry';

const StyledTableCell = styled(TableCell)({
  color: 'GrayText',
  fontWeight: '600',
  textAlign: 'center',
});

const ManagePayment = () => {
  const [paymentData, setpaymentData] = useState([]);
  const [state, setState] = useState('');

  const [errors, setErrors] = useState({
    state: false,
  });

  const [helperTexts, setHelperTexts] = useState({
    state: '',
  });

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (errors.state) {
      return;
    }

    console.log(state);

    const newLocation = {
      state,
    };

    setpaymentData([...paymentData, newLocation]);
    setState('');
    handleClose();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'state') setState(value);

    setErrors((prevErrors) => ({
      ...prevErrors,
    }));
    setHelperTexts((prevHelperTexts) => ({
      ...prevHelperTexts,
    }));
  };

  const validateInput = (name, value) => {
    let error = false;
    let helperText = '';

    const locationRegex = /^[A-Za-z\s]+$/;

    if (name === 'state') {
      if (!locationRegex.test(value)) {
        error = true;
        helperText = 'Please enter a valid state';
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
    validateInput(name, value);
  };

  // handle delete popup
  const [openDelete, setOpenDelete] = useState(false);

  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setopenAlert(true);
  };

  const [openAlert, setopenAlert] = useState(false);

  const handleCloseAlert = () => {
    setopenAlert(false);
  };

  const filteredData = paymentData.filter((c) => c.state.toLowerCase().includes(searchTerm.toLowerCase()));
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredData.length - page * rowsPerPage);

  return (
    <>
      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
          Deleted Successfully!
        </Alert>
      </Snackbar>
      <Container sx={{ mt: 2, pt: 4 }} elevation={3} component={Paper}>
        <Typography variant="h4" color="#009688" fontWeight={600} mb={2} textAlign="center">
          Manage Payment
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

          <Link to="/dashboard/payment">
            <Button variant="contained" color="primary" sx={{ boxShadow:'1'}} startIcon={<AddCardIcon />}>
              New Payment
            </Button>
          </Link>
        </Stack>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>S.No</StyledTableCell>
                <StyledTableCell>Student ID</StyledTableCell>
                <StyledTableCell>Student Name</StyledTableCell>
                <StyledTableCell>Assigned Course</StyledTableCell>
                <StyledTableCell>Course Fee</StyledTableCell>
                <StyledTableCell>Payment Mode</StyledTableCell>
                <StyledTableCell>Balance</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : filteredData
              ).map((state, index) => (
                <TableRow key={index} hover>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">{state.state}</TableCell>
                  <TableCell align="center">
                    <IconButton aria-label="Update">
                      <EditIcon color="primary"/>
                    </IconButton>
                    <IconButton aria-label="Delete" onClick={handleClickOpenDelete}>
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
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          mt={2}
        />
      </Container>

      <Grid m={2}>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          // onClose={handleClose}
          fullWidth
        >
          <Container component={Paper} elevation={2} sx={{ py: 2 }}>
            <Enquiry />
          </Container>
        </Dialog>

        {/* delete confirmation  */}
        <Dialog
          open={openDelete}
          onClose={handleCloseDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{'Are you sure want to Delete?'}</DialogTitle>
          <DialogActions sx={{ m: 4 }}>
            <Button variant="contained" color="error" onClick={handleCloseDelete}>
              Yes
            </Button>
            <Button variant="outlined" onClick={handleCloseDelete}>
              No
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </>
  );
};

export default ManagePayment;
