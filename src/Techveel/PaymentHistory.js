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
  LinearProgress,
  Box,
} from '@mui/material';
import * as XLSX from 'xlsx';
import Slide from '@mui/material/Slide';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import React, { useEffect, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import styled from '@emotion/styled';
import EditIcon from '@mui/icons-material/Edit';
import AddCardIcon from '@mui/icons-material/AddCard';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './animation.css';
import { saveAs } from 'file-saver';
import axios from '../axios';

// table header cell styles
const StyledTableCell = styled(TableCell)({
  color: '#F6F4EB',
  fontWeight: '800',
  textAlign: 'center',
  backgroundColor: '#8062D6',
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

const PaymentHistory = () => {
  const { id } = useParams();
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
  const [PaymentsHistoryData, setPaymentsHistoryData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [maxEditable, setmaxEditable] = useState('');

  // handle snackbar & alert messages on save
  const [openAlert, setopenAlert] = useState(false);
  // alert messages on operations
  const [alertType, setAlertType] = useState('success'); // 'success' or 'error'
  const [alertMessage, setAlertMessage] = useState('');
  const [openLoader, setOpenLoader] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profileID, setProfileID] = useState('');
  const [profileData, setProfileData] = useState('');
  const [openEdit, setOpenEdit] = useState(false);

  const [paidFee, setPaidFee] = useState(null);
  const [balance, setBalance] = useState(null);
  const [prevBalance, setPrevBalance] = useState(null);
  const [courseFee, setcourseFee] = useState(null);
  const [paymentdate, setPaymentdate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [editID, setEditID] = useState();

  const [balanceOnDate, setBalanceOnDate] = useState('');

  const today = new Date().toISOString().split('T')[0];

  // API Integration
  useEffect(() => {
    getOneData(id);
  }, []);

  const getOneData = async (id) => {
    setOpenLoader(true);
    try {
      const res = await axios.instance.get(`GetOnePaymentHistory/${id}`, {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      const data = res.data;
      setPaymentsHistoryData(data);
      setProfileData(data[0]);
      // console.log('setProfileDate: ', data[0]);
      // setProfileName(`${data[0].FirstName} ${data[0].LastName}`);
      setBalance(data[0].NetAmount - data[0].TotalPaidAmount);
      setProfileID(data[0].Admissionid);
      setcourseFee(data[0].NetAmount);
      // console.log('After Fetching data : ', data);
      setOpenLoader(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setOpenLoader(false);
    } finally {
      setOpenLoader(false);
    }
  };

  const deletePayments = async (payID) => {
    try {
      await axios.instance
        .delete(`/deletePayments/${payID}`, {
          headers: { Authorization: tokent, 'Content-Type': 'application/json' },
        })
        .then((res) => {
          if (res.data === '') {
            getOneData(id);
            setOpenDelete(false);
            setAlertType('warning');
            setAlertMessage('Admission Deleted, Successfully!');
            setopenAlert(true);
          } else {
            // getOneData(id);
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

  const UpdatePayment = async (editID, EditData) => {
    try {
      await axios.instance
        .put(`/UpdatePayments/${editID}`, EditData, {
          headers: { Authorization: tokent, 'Content-Type': 'application/json' },
        })
        .then((res) => {
          if (res.data === '') {
            setopenAlert(true);
            setEditID();
            getOneData(id);
            setAlertType('success');
            setAlertMessage('Record Updated, Successfully!');
            setopenAlert(true);
          }
        });
    } catch (error) {
      console.error('Error updating record:', error);
      setAlertType('error');
      setAlertMessage('Failed to update the record.');
      setopenAlert(true);
    }
  };

  const [fieldErrors, setFieldErrors] = React.useState({
    paidFee: false,
    remarks: false,
    paymentdate: false,
    overBalance: false,
  });

  const validateErrors = () => {
    const errors = {
      paidFee: !paidFee || paidFee <= 0,
      remarks: !remarks,
      paymentdate: !paymentdate,
      overBalance: paidFee > courseFee,
    };

    setFieldErrors((prevFieldErrors) => ({ ...prevFieldErrors, ...errors }));
    return !Object.values(errors).some(Boolean);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateErrors()) {
      return;
    }

    const EditData = {
      PaidAmount: paidFee,
      PaymentDate: paymentdate,
      Remarks: remarks,
      BalanceOnDate: balanceOnDate,
      ModifyedBy: 86,
    };

    console.log('Submitted Data', EditData, 'ID: ', editID);

    UpdatePayment(editID, EditData);
    handleClose();
  };

  // handleNewPayment
  const handleNewPayment = () => {
    navigate(`/dashboard/payment/${profileID}`);
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
    // console.log(filteredData);
    const data = filteredData.map((pay) => ({
      PaymentID: pay.PaymentId,
      Admissionid: pay.Admissionid,
      FullName: `${pay.FirstName} ${pay.LastName}`,
      PayType: pay.PayType,
      PayMode: pay.PayMode,
      PaidAmount: pay.PaidAmount,
      PaymentDate: formatDate(pay.PaymentDate),
      Remarks: pay.Remarks,
      prevBalance: pay.prevBalance,
      BalanceOnDate: pay.BalanceOnDate,
      TotalPaidAmount: pay.TotalPaidAmount,
      CourseId: pay.CourseId,
      Course_Name: pay.Course_Name,
      Course_Fee: pay.Course_Fee,
      NetAmount: pay.NetAmount,
      CourseTechnologyId: pay.CourseTechnologyId,
      Course_Category: pay.Course_Category,
      CreatedDate: pay.CreatedDate,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Admission');
    XLSX.writeFile(workbook, `PaymentsHistoryData+${new Date()}+.xlsx`);
  };

  const handleClose = () => {
    setOpenEdit(false);
  };

  // handle edit popup dialog
  const handleEdit = (pay) => {
    setEditID(pay.PaymentId);
    setPaidFee(pay.PaidAmount);
    setPrevBalance(pay.prevBalance);
    setmaxEditable(pay.NetAmount - pay.TotalPaidAmount + pay.PaidAmount);
    console.log('setmaxEditable: ', pay.NetAmount - pay.TotalPaidAmount + pay.PaidAmount);
    console.log('setPrevBalance now', pay.prevBalance);
    const formattedDob = new Date(pay.PaymentDate).toISOString().substr(0, 10);
    setPaymentdate(formattedDob);
    setRemarks(pay.Remarks);
    handleEditOpen();
  };

  const handleEditOpen = () => {
    setOpenEdit(true);
  };

  // search & filter
  const filteredData = PaymentsHistoryData.filter((enq) => {
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

  const GetPaymentPrint = async (id) => {
    console.log(id);
    setOpenLoader(true);
    const Print = await axios.instance
      .get(`/GetPaymentPrint/${id}`, { headers: { Authorization: tokent, 'Content-Type': 'application/json' } })
      .then(async (res) => {
        const downloadprogress = await axios.instance
          .get('/GetPaymentReceipt', { responseType: 'blob' })
          .then((res) => {
            const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
            saveAs(pdfBlob, 'PaymentReceipt.pdf');
          });
          setOpenLoader(false);
      });
  };

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
      <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} m={1}>
        <Box>
          <Link to="/dashboard/manage_payment">
            <Button size="small" variant="text" color="inherit" startIcon={<KeyboardBackspaceIcon />} sx={{ mx: 2 }}>
              Back
            </Button>
          </Link>
        </Box>
        {''}
      </Stack>
      <Container maxWidth={'xl'} sx={{ pt: 2 }} elevation={3} component={Paper}>
        {/* table header */}
        <Typography
          variant="h5"
          p={1}
          boxShadow={1}
          borderColor="#5C4B99"
          textAlign={'center'}
          border={0.5}
          borderRadius={1}
          my={2}
          color="#A076F9"
          textTransform={'capitalize'}
        >
          Payment History
        </Typography>

        {/* search & add button */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent={'space-between'}
          alignItems={'center'}
          spacing={2}
          my={1}
        >
          <Stack direction={'row'} spacing={1}>
            <TextField
              type="text"
              variant="outlined"
              color="secondary"
              label="Search"
              size="small"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
          </Stack>
          <Stack direction={'row'} spacing={2} alignItems={'center'}>
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
            {balance > 0 && (
              <Button
                variant="contained"
                color="primary"
                sx={{ borderRadius: 2, boxShadow: 1, whiteSpace: 'nowrap' }}
                onClick={handleNewPayment}
                endIcon={<AddCardIcon />}
              >
                Add Payment
              </Button>
            )}
          </Stack>
        </Stack>

        <Paper elevation={3} sx={{ p: 2, background: 'initial' }}>
          <Typography variant="h5" color="#614BC3" textAlign={'left'} borderBottom={1} pb={1} mx={1}>
            Student Details
          </Typography>

          <Grid
            container
            justifyContent={'center'}
            alignItems={'center'}
            p={1}
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={6}>
              <Stack justifyContent={'flex-start'} direction={{ xs: 'column', md: 'row' }}>
                <Typography variant="h6" color="GrayText" pr={1}>
                  Admission ID :
                </Typography>
                <Typography variant="h6" color="#655DBB">
                  {profileData.Admissionid}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack justifyContent={'flex-start'} direction={{ xs: 'column', md: 'row' }}>
                <Typography variant="h6" color="GrayText" pr={1}>
                  Full Name :
                </Typography>
                <Typography variant="h6" color="#655DBB" textTransform={'capitalize'}>
                  {profileData.FirstName} {profileData.LastName}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack justifyContent={'flex-start'} direction={{ xs: 'column', md: 'row' }}>
                <Typography variant="h6" color="GrayText" sx={{ whiteSpace: 'nowrap' }} pr={1}>
                  Course Category :
                </Typography>
                <Typography variant="h6" color="#655DBB">
                  {profileData.Course_Category}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack justifyContent={'flex-start'} direction={{ xs: 'column', md: 'row' }}>
                <Typography variant="h6" color="GrayText" sx={{ whiteSpace: 'nowrap' }} pr={1}>
                  Course Choosen :
                </Typography>
                <Typography variant="h6" color="#655DBB" textTransform={'capitalize'}>
                  {profileData.Course_Name}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack justifyContent={'flex-start'} direction={{ xs: 'column', md: 'row' }}>
                <Typography variant="h6" color="GrayText" pr={1}>
                  Offered Fee :
                </Typography>
                <Typography variant="h6" color="#655DBB">
                  ₹ {profileData.NetAmount}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack justifyContent={'flex-start'} direction={{ xs: 'column', md: 'row' }} pr={1}>
                <Typography variant="h6" color="GrayText" pr={1}>
                  Balance to be Paid :
                </Typography>
                {profileData.NetAmount - profileData.TotalPaidAmount === 0 ? (
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    sx={{ whiteSpace: 'nowrap', cursor: 'auto', color: 'white' }}
                  >
                    Fully Paid
                  </Button>
                ) : (
                  <Typography variant="h6" color="#655DBB">
                    ₹ {profileData.NetAmount - profileData.TotalPaidAmount}
                  </Typography>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* table  */}
        <Paper elevation={5} sx={{ borderRadius: 1 }}>
          <TableContainer sx={{ my: 1, borderRadius: 1 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ padding: 'none' }}>
                  <StyledTableCell>S.No</StyledTableCell>
                  <StyledTableCell>Payment ID</StyledTableCell>
                  <StyledTableCell>Full Name</StyledTableCell>
                  <StyledTableCell>Remarks</StyledTableCell>
                  <StyledTableCell>Payment Mode</StyledTableCell>
                  <StyledTableCell>Course Fee</StyledTableCell>
                  {/* <StyledTableCell>Before Balance</StyledTableCell> */}
                  <StyledTableCell>Paid Fee</StyledTableCell>
                  <StyledTableCell>Balance on Date</StyledTableCell>
                  <StyledTableCell>Payment Date</StyledTableCell>
                  <StyledTableCell>Receipt</StyledTableCell>
                  <StyledTableCell>Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : filteredData
                ).map((pay, index) => (
                  <TableRow key={pay.PaymentId}>
                    <TableCell align="center" padding="none">
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell align="center">
                      {'PAY'}
                      {pay.PaymentId}
                    </TableCell>
                    <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
                      {pay.FirstName} {pay.LastName}
                    </TableCell>

                    <TableCell
                      align="center"
                      padding="normal"
                      sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                    >
                      {pay.Remarks}
                    </TableCell>

                    <TableCell
                      align="center"
                      padding="normal"
                      sx={{
                        textTransform: 'uppercase',
                      }}
                    >
                      {pay.PayMode}
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
                    {/* <TableCell
                      align="center"
                      padding="normal"
                      sx={{
                        textTransform: 'capitalize',
                        color: 'green',
                        fontWeight: 600,
                      }}
                    >
                      ₹ {pay.prevBalance}
                    </TableCell> */}
                    <TableCell
                      align="center"
                      padding="normal"
                      sx={{
                        textTransform: 'capitalize',
                        color: 'green',
                        fontWeight: 600,
                      }}
                    >
                      ₹ {pay.PaidAmount}
                    </TableCell>
                    <TableCell
                      align="center"
                      padding="normal"
                      sx={{
                        color: '#FF8B13',
                        fontWeight: 600,
                      }}
                    >
                      ₹ {pay.BalanceOnDate}
                    </TableCell>

                    <TableCell
                      align="center"
                      padding="normal"
                      sx={{
                        textTransform: 'capitalize',
                      }}
                    >
                      {formatDate(pay.CreatedDate)}
                    </TableCell>
                    <TableCell
                      align="center"
                      padding="normal"
                      sx={{
                        textTransform: 'capitalize',
                      }}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        color="secondary"
                        sx={{ whiteSpace: 'nowrap', cursor: 'auto', color: '#4C4C6D' }}
                        startIcon={<PrintIcon />}
                        onClick={() => {
                          GetPaymentPrint(pay.PaymentId);
                          console.log(pay.PaymentId);
                        }}
                      >
                        Print
                      </Button>
                    </TableCell>

                    <TableCell align="center" padding="normal" sx={{ padding: '0' }}>
                      <IconButton aria-label="Edit" onClick={() => handleEdit(pay)} title="Edit">
                        <EditIcon color="primary" />
                      </IconButton>
                      <IconButton aria-label="Delete" onClick={() => handleDelete(pay.PaymentId)} title="Delete">
                        <DeleteForeverIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={11} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
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

      <Grid m={2}>
        {/* add new popup form dialog box */}
        <Dialog fullScreen={fullScreen} open={openEdit} onClose={handleClose} fullWidth>
          <Container component={Paper} elevation={2} sx={{ py: 2 }}>
            <form onSubmit={handleSubmit}>
              <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} mr={1}>
                <Typography variant="h5" textAlign={'left'} pl={2} fontWeight={600} color="primary">
                  Edit Payment
                </Typography>
                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Stack>
              <Stack direction={'column'} spacing={2} p={2}>
                <TextField
                  size="small"
                  label="Paid Fee"
                  fullWidth
                  type="number"
                  value={paidFee}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setPaidFee(newValue);
                    setBalanceOnDate(parseFloat(prevBalance) - parseFloat(newValue));
                    console.log('setBalanceOnDate: ', prevBalance - newValue);
                    setFieldErrors((prevFieldErrors) => ({
                      ...prevFieldErrors,
                      paidFee: newValue.trim() === '' || newValue <= 0,
                      overBalance: newValue > maxEditable,
                    }));
                  }}
                  error={fieldErrors.paidFee || fieldErrors.overBalance}
                  helperText={
                    fieldErrors.paidFee
                      ? 'Please enter valid amount'
                      : fieldErrors.overBalance && `Cannot exceed the remaining fee ₹ ${maxEditable}`
                  }
                />
                <TextField
                  size="small"
                  fullWidth
                  label="Payment Date"
                  type="date"
                  value={paymentdate}
                  onChange={(e) => {
                    const newDate = e.target.value;
                    setPaymentdate(newDate);

                    const currentDate = new Date();
                    const selectedDate = new Date(newDate);

                    const isValidDate = newDate.trim() !== '' && selectedDate <= currentDate;

                    setFieldErrors((prevFieldErrors) => ({
                      ...prevFieldErrors,
                      paymentdate: !isValidDate,
                    }));
                  }}
                  error={fieldErrors.paymentdate}
                  helperText={
                    fieldErrors.paymentdate
                      ? fieldErrors.paymentdate && new Date(paymentdate) > new Date()
                        ? 'Payment date should not be in the future'
                        : 'Payment date is // required'
                      : ''
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    max: today,
                  }}
                />
                <TextField
                  fullWidth
                  label="Remarks"
                  multiline
                  rows={4}
                  value={remarks}
                  onChange={(e) => {
                    setRemarks(e.target.value);

                    setFieldErrors((prevFieldErrors) => ({
                      ...prevFieldErrors,
                      remarks: !remarks,
                    }));
                  }}
                  sx={{ my: 2 }}
                  error={fieldErrors.remarks}
                  helperText={fieldErrors.remarks && 'Please provide remarks for this payment'}
                />
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  type="submit"
                  sx={{ textTransform: 'capitalize' }}
                >
                  Save
                </Button>
              </Stack>
            </form>
          </Container>
        </Dialog>
      </Grid>
    </>
  );
};

export default PaymentHistory;
