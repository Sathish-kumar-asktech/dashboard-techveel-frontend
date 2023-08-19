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
  LinearProgress, ButtonGroup,
} from '@mui/material';
import * as XLSX from 'xlsx';
import Slide from '@mui/material/Slide';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import React, { useEffect, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import styled from '@emotion/styled';
import EditIcon from '@mui/icons-material/Edit';
import AddCardIcon from '@mui/icons-material/AddCard';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import { Link, useNavigate } from 'react-router-dom';
// import { useHistory } from "react-router-dom";
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import axios from '../axios';
import './animation.css';

// table header cell styles
const StyledTableCell = styled(TableCell)({
  color: '#F1F6F9',
  fontWeight: '800',
  textAlign: 'center',
  backgroundColor: '#394867',
  padding: 'none',
  whiteSpace: 'nowrap',
});

function formatDate(inputDateTime) {
  const isoDate = new Date(inputDateTime);

  const day = isoDate.getUTCDate().toString().padStart(2, '0');
  const month = (isoDate.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = isoDate.getUTCFullYear();

  let hour = isoDate.getUTCHours();
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour %= 12;
  hour = hour || 12; // Convert 0 to 12

  const minute = isoDate.getUTCMinutes().toString().padStart(2, '0');

  return `${day}/${month}/${year} ${hour}:${minute} ${ampm}`;
}

const ManagePayment = () => {
  // eslint-disable-next-line no-restricted-globals
  const navigate = useNavigate();
  const [tokent, settokent] = useState(
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudGxpc3QiOlt7IlVzZXJJRCI6IjEiLCJMb2dpbkNvZGUiOiIwMSIsIkxvZ2luTmFtZSI6IkFkbWluIiwiRW1haWxJZCI6ImFkbWluQGdtYWlsLmNvbSIsIlVzZXJUeXBlIjoiQURNSU4ifV0sImlhdCI6MTYzODM1NDczMX0.ZW6zEHIXTxfT-QWEzS6-GuY7bRupf2Jc_tp4fXIRabQ'
  );
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
 
  // At the beginning of the component
  const [openDelete, setOpenDelete] = useState(false);
  const [stateIdToDelete, setStateIdToDelete] = useState(null);
  const [PaymentsData, setPaymentsData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

   // handle snackbar & alert messages on save
   const [openAlert, setopenAlert] = useState(false);
  // alert messages on operations
  const [alertType, setAlertType] = useState('success'); // 'success' or 'error'
  const [alertMessage, setAlertMessage] = useState('');
  const [openLoader, setOpenLoader] = useState(false);  
  const [openHistory, setOpenHistory] = useState(false);

  // get all states Request
  const formatDateToSend = (date) => {
    if (!date) {
      return ''; // Handle null or empty date
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };

  const formatDateToinitialValues = (date) => {
    if (!date) {
      return ''; // Handle null or empty date
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Format the date as "yyyy-MM-dd"
  };

  // Get the current date and 30 days before the current date
  const currentDate = new Date();
  const fromDateOnCurrentMonth = new Date(currentDate);
  fromDateOnCurrentMonth.setDate(1);

  // Convert fromDate and toDate objects to formatted date strings
  const initialFromDate = formatDateToinitialValues(fromDateOnCurrentMonth);
  const initialToDate = formatDateToinitialValues(currentDate);

  // Set the initial state for fromDate and toDate
  const [fromDate, setFromDate] = useState(initialFromDate);
  const [toDate, setToDate] = useState(initialToDate);

  // console.log('inital values:', fromDate, toDate);
  const handleFromDateChange = (event) => {
    setFromDate(event.target.value);
  };

  const handleToDateChange = (event) => {
    setToDate(event.target.value);
  };

  // API Integration
  useEffect(() => {
    getAllPayments();
    formatDateToinitialValues();
  }, []);

  const getAllPayments = async () => {
    setOpenLoader(true);
    try {
      // Convert fromDate and toDate strings to Date objects
      const fromDateObj = fromDate ? new Date(fromDate) : null;
      const toDateObj = toDate ? new Date(toDate) : null;

      // Format date objects for the API request
      const formattedFromDate = formatDateToSend(fromDateObj);
      const formattedToDate = formatDateToSend(toDateObj);

      const res = await axios.instance.post(
        '/GetAllPayments',
        {
          FromDate: formattedFromDate,
          ToDate: formattedToDate,
        },
        {
          headers: { Authorization: tokent, 'Content-Type': 'application/json' },
        }
      );
      setPaymentsData(res.data);
      console.log('PaymentsData: ', PaymentsData);
      console.log(formatDateToSend(fromDateObj));
      setOpenLoader(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setOpenLoader(false);
    }
  };

  // delete Request to delete state
  const deletePayments = async (payID) => {
    try {
      await axios.instance
        .delete(`/deletePayments/${payID}`, {
          headers: { Authorization: tokent, 'Content-Type': 'application/json' },
        })
        .then((res) => {
          if (res.data === '') {
            getAllPayments();
            setOpenDelete(false);
            setAlertType('warning');
            setAlertMessage('Admission Deleted, Successfully!');
            setopenAlert(true);
          } else {
            getAllPayments();
            setOpenDelete(false);
            setAlertType('error');
            setAlertMessage("Oops! Can't delete this data. It's connected to other information.");
            setopenAlert(true);
          }
          // console.log(res.data);
        });
    } catch (error) {
      console.error('Error deleting Admission:', error);
      setAlertType('error');
      setAlertMessage('Failed to delete the Admission.');
      setopenAlert(true);
    }
  };

  // handleNewAdmission
  const handleNewAdmission = () => {
    navigate('/dashboard/payment', { state: { isEdit: false, PaymentsData: null } });
  };

  // handle delete popup dialog
  const handleDelete = (payID) => {
    setOpenDelete(true);
    setStateIdToDelete(payID);
  };

  const handleDeleteConfirmed = (payID) => {
    deletePayments(payID);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
    setopenAlert(false);
  };

  const handleCloseAlert = () => {
    setopenAlert(false);
  };


  // handleDownloadExcel
  const handleDownloadExcel = () => {
    const data = filteredData.map((pay) => ({
      AdmissionNo : pay.Admissionid,
      FullName: `${pay.FirstName} ${pay.LastName}`,      
      Course_Category: pay.Course_Category,
      Course_Name:pay.Course_Name,
      Course_Fee:pay.Course_Fee,
      Offrered_Fee: pay.NetAmount,
      TotalPaidAmount: pay.TotalPaidAmount,
      Balance: (pay.NetAmount - pay.TotalPaidAmount),
      LastPaymentDate: formatDate(pay.LastPaymentDate),
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Admission');
    XLSX.writeFile(workbook, `PaymentsData+${currentDate}+.xlsx`);
  };

  // search & filter
  const filteredData = PaymentsData.filter((enq) => {
    const searchTermLowerCase = searchTerm.toLowerCase();
    return Object.values(enq).some((value) => {
      if (typeof value === 'string') {
        return value.toLowerCase().includes(searchTermLowerCase);
      }
      return false;
    });
  });
  // pagination
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

      <Container maxWidth={'xl'} sx={{ pt: 2 }} elevation={3} component={Paper}>
        {/* table header */}
        <Typography
          variant="h5"
          p={1}
          boxShadow={1}
          borderColor="#ACB1D6"
          textAlign={'center'}
          border={0.5}
          borderRadius={1}
          my={2}
          color="#394867"
        >
          Manage Payments
        </Typography>

        {/* search & add button */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent={'space-between'}
          alignItems={'center'}
          spacing={2}
          my={3}
        >
          <Stack direction={'row'} spacing={1}>
            <TextField
              fullWidth
              size="small"
              label="From Date"
              type="date"
              value={fromDate}
              onChange={handleFromDateChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              fullWidth
              size="small"
              label="To Date"
              type="date"
              value={toDate}
              onChange={handleToDateChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <IconButton color="primary" onClick={getAllPayments}>
              <PendingActionsIcon />
            </IconButton>
          </Stack>
          <Stack direction={'row'} spacing={2} alignItems={'center'}>
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
              startIcon={<DownloadForOfflineIcon />}
              onClick={handleDownloadExcel}
              color="success"
              title="Download as excel"
              sx={{ color: 'white' }}
            >
              Download
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ borderRadius: 2, boxShadow: 1, whiteSpace: 'nowrap' }}
              onClick={handleNewAdmission}
              endIcon={<AddCardIcon />}
            >
              New Payment
            </Button>
          </Stack>
        </Stack>

        {/* table  */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ padding: 'none' }}>
                <StyledTableCell>S.No</StyledTableCell>
                <StyledTableCell>Admission ID</StyledTableCell>
                <StyledTableCell>Full Name</StyledTableCell>
                <StyledTableCell>Course Category</StyledTableCell>
                <StyledTableCell>Course</StyledTableCell>
                <StyledTableCell>Course Fee</StyledTableCell>                
                <StyledTableCell>Paid Fee</StyledTableCell>
                {/* <StyledTableCell>Balance to be paid</StyledTableCell> */}
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Last payment date</StyledTableCell>
                <StyledTableCell>Payment History</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : filteredData
              ).map((pay, index) => (
                <TableRow key={pay.Admissionid} >
                  <TableCell align="center" padding="none">
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell align="center">
                    {'ADM'}
                    {pay.Admissionid}
                  </TableCell>
                  <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
                    {pay.FirstName} {pay.LastName}
                  </TableCell>

                  <TableCell align="center" padding="normal" sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                    {pay.Course_Category}
                  </TableCell>

                  <TableCell
                    align="center"
                    padding="normal"
                    sx={{
                      textTransform: 'capitalize',
                      // whiteSpace: 'nowrap'
                    }}
                  >
                    {pay.Course_Name}
                  </TableCell>
                  <TableCell
                    align="center"
                    padding="normal"
                    sx={{
                      textTransform: 'capitalize',
                      color: 'green',
                      fontWeight: 600,
                    }}
                  >
                    ₹ {pay.NetAmount}
                  </TableCell>
                  <TableCell
                    align="center"
                    padding="normal"
                    sx={{
                      textTransform: 'capitalize',
                      color: 'green',
                      fontWeight: 600,
                    }}
                  >
                    ₹ {pay.TotalPaidAmount}
                  </TableCell>
                  {/* <TableCell
                    align="center"
                    padding="normal"
                    sx={{
                      color: '#FF8B13',
                      fontWeight: 600,
                    }}
                  >
                    ₹ {pay.NetAmount - pay.TotalPaidAmount}
                  </TableCell> */}
                  <TableCell
                    align="center"
                    padding="normal"
                    sx={{
                      textTransform: 'capitalize',
                    }}
                  >
                    {pay.NetAmount - pay.TotalPaidAmount <= 0 ? (
                      <Button size='small' variant="outlined" color="success" sx={{ whiteSpace: 'nowrap', cursor: 'auto' }}>
                        Fully Paid
                      </Button>
                    ) : (
                      <Button size='small' variant="outlined" color="warning" sx={{ whiteSpace: 'nowrap', cursor: 'auto', color:'#F29727'}}>
                        ₹ {pay.NetAmount - pay.TotalPaidAmount} Balance
                      </Button>
                    )}
                  </TableCell>

                  <TableCell
                    align="center"
                    padding="normal"
                    sx={{
                      textTransform: 'capitalize',
                    }}
                  >
                    {/* {pay.CreatedDate} */}
                    {formatDate(pay.LastPaymentDate)}
                  </TableCell>

                  <TableCell align="center" padding="normal" sx={{ padding: '0' }}>
                    <Link to={{ pathname: `/dashboard/manage_paymnt_history/${pay.Admissionid}` }}>
                      <Button  size={'small'} variant="outlined" color="secondary" startIcon={<MenuOpenIcon/>}>
                        View
                      </Button>
                      {/* <IconButton aria-label="Edit">
                        <EditIcon color="primary" />
                      </IconButton> */}
                    </Link>
                    {/* <IconButton aria-label="Delete" onClick={() => handleDelete(pay.PaymentId)}>
                      <DeleteForeverIcon color="error" />
                    </IconButton> */}
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={10} />
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

      {/* loader popup dialog box */}
      <Dialog
        open={openLoader}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <LinearProgress />
      </Dialog>

      <Dialog
        open={openHistory}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <LinearProgress />
      </Dialog>
    </>
  );
};

export default ManagePayment;
