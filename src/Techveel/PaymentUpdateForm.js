import React, { useState, useEffect } from 'react';
import {
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Snackbar,
  Alert,
  Autocomplete,
  Typography,
  Stack,
  Container,
  Slide,
  Box,
  Dialog,
  LinearProgress,
  Paper,
  Grid,
} from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Link, useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import axios from '../axios';

function formatDate(inputDate) {
  const date = new Date(inputDate);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

const PaymentUpdateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tokent, settokent] = useState(
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudGxpc3QiOlt7IlVzZXJJRCI6IjEiLCJMb2dpbkNvZGUiOiIwMSIsIkxvZ2luTmFtZSI6IkFkbWluIiwiRW1haWxJZCI6ImFkbWluQGdtYWlsLmNvbSIsIlVzZXJUeXBlIjoiQURNSU4ifV0sImlhdCI6MTYzODM1NDczMX0.ZW6zEHIXTxfT-QWEzS6-GuY7bRupf2Jc_tp4fXIRabQ'
  );

  const [AdmissionData, setAdmissionData] = useState([]);

  // State to manage form data
  const [payerAdmissionId, setpayerAdmissionId] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [paymentMode, setPaymentMode] = useState('cash');
  const [totalFee, setTotalFee] = useState('');
  const [paidFee, setPaidFee] = useState('');
  const [balance, setBalance] = useState('');
  const [prevBalance, setPrevBalance] = useState('');
  const [balanceOnDate, setBalanceOnDate] = useState('');
  // const [paymentdate, setPaymentdate] = useState(new Date().toISOString().substr(0, 10));
  // const [paymentdate, setPaymentdate] = useState(new Date().toISOString().substr(0, 16));
  // const [paymentdate, setPaymentdate] = useState('');
  const [paymentdate, setPaymentdate] = useState(
    new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 16)
  );

  const [remarks, setRemarks] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudentData, setSelectedStudentData] = useState(null);
  const [openLoader, setOpenLoader] = useState(false);

  const [fieldErrors, setFieldErrors] = React.useState({
    selectedStudent: false,
    paymentType: false,
    paymentModeErr: false,
    totalFee: false,
    paidFee: false,
    remarks: false,
    paymentdate: false,
    abovebalance: false,
  });

  const validateErrors = () => {
    const errors = {
      selectedStudent: id ? false : !selectedStudent,
      paymentType: !paymentType,
      paymentModeErr: !paymentMode,
      totalFee: !totalFee,
      paidFee: paidFee.trim() === '' || !paidFee,
      // paidFee: paymentType === 'Partial' && paidFee.trim() === '',
      abovebalance: paidFee > balance,
      remarks: !remarks,
      paymentdate: !paymentdate,
    };
    setFieldErrors((prevFieldErrors) => ({ ...prevFieldErrors, ...errors }));
    return !Object.values(errors).some(Boolean);
  };

  const addNewPayment = async (pay) => {
    setOpenLoader(true);
    try {
      const res = await axios.instance.post('/InsertPayments', pay, {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      if (res.data && res.data.length > 0 && res.data[0].PaymentId !== undefined) {
        setAlertType('success');
        setAlertMessage('New Payment Added, Successfully!');
        setopenAlert(true);
        setTimeout(() => {
          if (id) {
            navigate(`/dashboard/manage_paymnt_history/${id}`);
            setOpenLoader(false);
          } else {
            navigate('/dashboard/manage_payment');
            setOpenLoader(false);
          }
        }, 2000);
      } else {
        setAlertType('error');
        setAlertMessage("Oops! Can't add this data...");
        setopenAlert(true);
        setOpenLoader(false);
      }
    } catch (error) {
      console.error('Error adding new Payment:', error);
      setAlertType('error');
      setAlertMessage('Failed to add the new Payment.');
      setOpenLoader(false);
      setopenAlert(true);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(validateErrors);
    if (!validateErrors()) {
      return;
    }
    console.log('paymentdate: ', paymentdate);
    // Truncate seconds and milliseconds from the PaymentDate
    const truncatedPaymentDate = new Date(paymentdate);
    truncatedPaymentDate.setSeconds(0);
    truncatedPaymentDate.setMilliseconds(0);

    // const formattedPaymentDate = truncatedPaymentDate.toISOString();

    // const formattedPaymentDate = new Date(truncatedPaymentDate).toISOString();

    // const formattedPaymentDate = truncatedPaymentDate.toISOString().replace('T', ' ').slice(0, 19);

    console.log('formattedPaymentDate : ', truncatedPaymentDate);
    const PayData = {
      Admissionid: payerAdmissionId,
      PayType: paymentType,
      PayMode: paymentMode,
      PaymentDate: moment(paymentdate).format('YYYY-MM-DD HH:mm:ss'),
      PaidAmount: paidFee,
      prevBalance,
      BalanceOnDate: balanceOnDate,
      Remarks: remarks,
      CreatedBy: 86,
    };
    console.log('Submitted Data', PayData, 'ID: ', id);
    addNewPayment(PayData);
  };

  const today = new Date().toISOString().split('T')[0];

  // API Integration
  useEffect(() => {
    if (!id) {
      getAdmissionData();
    }
  }, []);

  // Function to handle student selection
  const handleStudentChange = (event, value) => {
    if (value === null) {
      // resetFields();
      setSelectedStudent(null);
      setSelectedStudentData(null);
      setPaidFee('');
      setTotalFee('');
      setBalance('');
    } else {
      setSelectedStudent(value);
      setPaidFee('');
      setFieldErrors((prevFieldErrors) => ({
        ...prevFieldErrors,
        selectedStudent: !value,
      }));
    }
  };

  // get all Cities Request
  const getAdmissionData = async () => {
    setOpenLoader(true);
    try {
      const res = await axios.instance.get('/GetallAdmissionForPayment', {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      setOpenLoader(false);
      setAdmissionData(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // handle snackbar & alert messages on save
  const [openAlert, setopenAlert] = useState(false);
  // alert messages on operations
  const [alertType, setAlertType] = useState('success'); // 'success' or 'error'
  const [alertMessage, setAlertMessage] = useState('');

  const handleCloseAlert = () => {
    setopenAlert(false);
  };

  useEffect(() => {
    const getOneDataAdmisisonData = async (selectedStudent) => {
      setOpenLoader(true);
      try {
        const res = await axios.instance.get(`GetOneAdmission/${selectedStudent}`, {
          headers: { Authorization: tokent, 'Content-Type': 'application/json' },
        });
        const data = res.data;
        const selecteddata = data[0];
        setSelectedStudentData(selecteddata);
        setpayerAdmissionId(selecteddata.AdmissionId);
        setTotalFee(selecteddata.NetAmount);
        setBalance(selecteddata.NetAmount);
        setPrevBalance(selecteddata.NetAmount);
        if (paymentType === 'Full') {
          setPaidFee(selecteddata.NetAmount);
          setBalanceOnDate(0);
        } else {
          setPaidFee('');
        }
        console.log('setpayerAdmissionId', payerAdmissionId);
        setOpenLoader(false);
      } catch (error) {
        // console.error('Error fetching data:', error);
        setOpenLoader(false);
      } finally {
        setOpenLoader(false);
      }
    };
    if (selectedStudent && !id) {
      getOneDataAdmisisonData(selectedStudent.AdmissionId);
    }
  }, [selectedStudent, paymentType]);

  useEffect(() => {
    const GetoneAdmisisonDetails = async (id) => {
      setOpenLoader(true);
      try {
        const res = await axios.instance.get(`GetoneAdmisisonDetails/${id}`, {
          headers: { Authorization: tokent, 'Content-Type': 'application/json' },
        });
        const data = res.data;
        const selecteddata = data[0];
        setSelectedStudentData(selecteddata);
        setPaymentType('Partial');
        setpayerAdmissionId(id ? selecteddata.Admissionid : selecteddata.AdmissionId);
        setTotalFee(selecteddata.NetAmount);
        setBalance(selecteddata.NetAmount - selecteddata.TotalPaidAmount);
        setPrevBalance(selecteddata.NetAmount - selecteddata.TotalPaidAmount);
        console.log('balance', selecteddata.NetAmount - selecteddata.TotalPaidAmount);
        setOpenLoader(false);
      } catch (error) {
        setOpenLoader(false);
      } finally {
        setOpenLoader(false);
      }
    };
    if (id) {
      GetoneAdmisisonDetails(id);
    }
  }, [id]);

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
      <Container maxWidth={'xl'}>
        {id ? (
          <Box>
            <Link to={`/dashboard/manage_paymnt_history/${id}`}>
              <Button variant="outlined" color="secondary" startIcon={<KeyboardBackspaceIcon />}>
                Back
              </Button>
            </Link>
          </Box>
        ) : (
          <Box>
            <Link to="/dashboard/manage_payment">
              <Button variant="outlined" color="secondary" startIcon={<KeyboardBackspaceIcon />}>
                Back
              </Button>
            </Link>
          </Box>
        )}

        <Typography
          variant="h5"
          p={1}
          boxShadow={1}
          borderColor="#e8f5e9"
          textAlign={'center'}
          border={0.5}
          borderRadius={1}
          my={2}
          color="#004d40"
        >
          Payment Receipt
        </Typography>
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" color="#00695c" sx={{ my: 1 }}>
            Students list
          </Typography>
          {!id && (
            <>
              <Autocomplete
                sx={{ my: 2 }}
                size="small"
                id="student-autocomplete"
                options={AdmissionData}
                getOptionLabel={(student) =>
                  `Admisison ID - ${student.AdmissionId} - ${formatDate(student.CreatedDate)} - ${student.FirstName} ${
                    student.LastName
                  } `
                }
                value={selectedStudent}
                onChange={handleStudentChange}
                renderInput={(params) => <TextField {...params} label="Select Student" />}
              />
              {fieldErrors.selectedStudent && (
                <Typography variant="caption" color="error">
                  Please select any student first!
                </Typography>
              )}
            </>
          )}

          {selectedStudentData !== null && (
            <Paper elevation={7} sx={{ p: 2, background: 'initial' }}>
              <Typography variant="h5" color="#607d8b" textAlign={'left'} borderBottom={1} pb={1} mx={2}>
                Student Details
              </Typography>

              <Grid
                container
                justifyContent={'center'}
                alignItems={'center'}
                p={2}
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={6}>
                  <Stack justifyContent={'flex-start'} direction={{ xs: 'column', md: 'row' }}>
                    <Typography variant="h6" color="GrayText" pr={1}>
                      Admission ID :
                    </Typography>
                    <Typography variant="h6" color="#009688">
                      {id ? selectedStudentData.Admissionid : selectedStudentData.AdmissionId}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack justifyContent={'flex-start'} direction={{ xs: 'column', md: 'row' }}>
                    <Typography variant="h6" color="GrayText" pr={1}>
                      Full Name :
                    </Typography>
                    <Typography variant="h6" color="#009688" textTransform={'capitalize'}>
                      {selectedStudentData.FirstName} {selectedStudentData.LastName}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack justifyContent={'flex-start'} direction={{ xs: 'column', md: 'row' }}>
                    <Typography variant="h6" color="GrayText" sx={{ whiteSpace: 'nowrap' }} pr={1}>
                      Course Category :
                    </Typography>
                    <Typography variant="h6" color="#009688">
                      {selectedStudentData.Course_Category}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack justifyContent={'flex-start'} direction={{ xs: 'column', md: 'row' }}>
                    <Typography variant="h6" color="GrayText" sx={{ whiteSpace: 'nowrap' }} pr={1}>
                      Course Choosen :
                    </Typography>
                    <Typography variant="h6" color="#009688">
                      {selectedStudentData.Course_Name}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack justifyContent={'flex-start'} direction={{ xs: 'column', md: 'row' }}>
                    <Typography variant="h6" color="GrayText" pr={1}>
                      Offered Fee :
                    </Typography>
                    <Typography variant="h6" color="#009688">
                      ₹{selectedStudentData.NetAmount}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack justifyContent={'flex-start'} direction={{ xs: 'column', md: 'row' }} pr={1}>
                    <Typography variant="h6" color="GrayText" pr={1}>
                      Balance to be Paid :
                    </Typography>
                    <Typography variant="h6" color="#009688">
                      ₹{balance}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>
          )}
          <Typography variant="h6" color="#00695c" sx={{ my: 1 }}>
            Payment Details
          </Typography>

          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth component="fieldset">
                <FormLabel component="legend">Payment Term</FormLabel>
                <RadioGroup
                  row
                  aria-label="payment-type"
                  name="payment-type"
                  value={paymentType}
                  onChange={(e) => {
                    setPaymentType(e.target.value);
                    setFieldErrors((prevFieldErrors) => ({
                      ...prevFieldErrors,
                      paymentType: !e.target.value.trim() === '',
                    }));
                  }}
                >
                  <FormControlLabel value="Full" control={<Radio />} disabled={!!id} label="Full Payment" />
                  <FormControlLabel value="Partial" control={<Radio />} label="Partial Payment" />
                </RadioGroup>
              </FormControl>
              {fieldErrors.paymentType && (
                <Typography variant="caption" color="error" sx={{ m: 0.5 }}>
                  Please select payment Type
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth component="fieldset">
                <FormLabel component="legend">Mode of Payment</FormLabel>
                <RadioGroup
                  row
                  aria-label="payment-mode"
                  name="payment-mode"
                  value={paymentMode}
                  onChange={(e) => {
                    setPaymentMode(e.target.value);
                    setFieldErrors((prevFieldErrors) => ({
                      ...prevFieldErrors,
                      paymentModeErr: !e.target.value.trim() === '',
                    }));
                  }}
                >
                  <FormControlLabel value="cash" control={<Radio />} label="Cash" />
                  <FormControlLabel value="upi" control={<Radio />} label="UPI" />
                </RadioGroup>
              </FormControl>
              {fieldErrors.paymentModeErr && (
                <Typography variant="caption" color="error" sx={{ m: 0.5 }}>
                  Please select mode of payment
                </Typography>
              )}
            </Grid>
          </Grid>
          {paymentType === 'Full' && (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} my={1}>
              <TextField size="small" label="Total Fee" type="number" fullWidth value={totalFee} disabled />
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
                      : 'Payment date is required'
                    : ''
                }
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  max: today,
                }}
              />
              {/* <TextField
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
                      : 'Payment date is required'
                    : ''
                }
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  max: today,
                }}
              /> */}
            </Stack>
          )}
          {paymentType === 'Partial' && (
            <>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} my={1}>
                <TextField
                  size="small"
                  label="Total Fee"
                  type="number"
                  fullWidth
                  value={totalFee}
                  disabled
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Balance"
                  type="number"
                  value={balance}
                  disabled
                  variant="outlined"
                />

                <TextField
                  size="small"
                  label="Paid Fee"
                  fullWidth
                  type="number"
                  value={paidFee}
                  onChange={(e) => {
                    setPaidFee(e.target.value);
                    const value = e.target.value;
                    setBalanceOnDate(balance - value);
                    setFieldErrors((prevFieldErrors) => ({
                      ...prevFieldErrors,
                      paidFee: !e.target.value.trim() === '' || value <= 0,
                      abovebalance: value > balance,
                    }));
                  }}
                  error={fieldErrors.paidFee || fieldErrors.abovebalance}
                  helperText={
                    fieldErrors.abovebalance
                      ? 'Cannot exceed the balance amount'
                      : fieldErrors.paidFee && 'Please enter valid amount'
                  }
                />

                <TextField
                  size="small"
                  fullWidth
                  label="Payment Date"
                  type="datetime-local"
                  value={paymentdate}
                  onChange={(e) => {
                    const localDate = new Date(`${e.target.value}Z`);
                    // const localDate = new Date(e.target.value + 'Z'); // Append 'Z' to indicate UTC time
                    const offsetMinutes = localDate.getTimezoneOffset();
                    const adjustedDate = new Date(localDate.getTime() + offsetMinutes * 60000);
                    const newDate = adjustedDate.toISOString().substr(0, 16);

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
                        ? 'Payment date and time should not be in the future'
                        : 'Payment date and time is required'
                      : ''
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    max: today,
                  }}
                />

                {/* <TextField
                  size="small"
                  fullWidth
                  label="Payment Date"
                  type="datetime-local"
                  value={paymentdate}
                  onChange={(e) => {
                    const localDate = new Date(e.target.value + 'Z'); // Append 'Z' to indicate UTC time
                    const offsetMinutes = localDate.getTimezoneOffset();
                    const adjustedDate = new Date(localDate.getTime() + offsetMinutes * 60000);
                    const newDate = adjustedDate.toISOString().substr(0, 16);
                  
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
                        ? 'Payment date and time should not be in the future'
                        : 'Payment date and time is required'
                      : ''
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    max: today,
                  }}
                /> */}
              </Stack>
            </>
          )}

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
            fullWidth
            type="submit"
            variant="contained"
            color="success"
            sx={{ backgroundColor: '#009688', color: 'white' }}
          >
            Save Payment
          </Button>
        </form>
      </Container>

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

export default PaymentUpdateForm;
