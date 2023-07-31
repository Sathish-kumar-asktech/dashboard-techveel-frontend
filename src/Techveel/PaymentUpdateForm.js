import React, { useState } from 'react';
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
} from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Link } from 'react-router-dom';

const students = [
  { id: 1, name: 'John Doe', Course: 'Software Deveopement', joiningDate: '2023-07-15' },
  { id: 2, name: 'Jane Smith', Course: 'Software Testing', joiningDate: '2023-07-20' },
  { id: 3, name: 'Michael Johnson', Course: 'Software Deveopement', joiningDate: '2023-07-10' },
];

const PaymentUpdateForm = () => {
  // State to manage form data
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [doj, setDoj] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [totalFee, setTotalFee] = useState('');
  const [paidFee, setPaidFee] = useState('');
  const [balance, setBalance] = useState('');
  const [date, setDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // State for success message
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Validation error state
  const [errors, setErrors] = useState({});

  // Regular expression patterns for validation
  const datePattern = /^(19|20)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
  const numberPattern = /^\d+$/;

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform form validation here
    const validationErrors = {};

    if (!studentId) {
      validationErrors.studentId = 'Student ID is required';
    }

    if (!name) {
      validationErrors.name = 'Name is required';
    }

    if (!course) {
      validationErrors.course = 'Course chosen is required';
    }

    if (!doj) {
      validationErrors.doj = 'Date of Joining is required';
    } else if (!datePattern.test(doj)) {
      validationErrors.doj = 'Invalid date format';
    }

    if (!totalFee || !numberPattern.test(totalFee)) {
      validationErrors.totalFee = 'Invalid total fee amount';
    }

    if (paymentType === 'partial') {
      if (!paidFee || !numberPattern.test(paidFee)) {
        validationErrors.paidFee = 'Invalid paid fee amount';
      }

      if (!balance || !numberPattern.test(balance)) {
        validationErrors.balance = 'Invalid balance amount';
      }

      if (!date || !datePattern.test(date)) {
        validationErrors.date = 'Invalid date format';
      }
    }

    // Add other validation rules as needed...

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Form data is valid, show success message
    setShowSuccessMessage(true);
    console.log(
      selectedStudent,
      name,
      course,
      doj,
      paymentType,
      paymentMode,
      totalFee,
      paidFee,
      balance,
      date,
      remarks
    );
  };

  function SlideTransition(props) {
    return <Slide {...props} direction="left" />;
  }

  // Function to handle Snackbar close
  const handleCloseSnackbar = () => {
    setShowSuccessMessage(false);
  };

  const today = new Date().toISOString().split('T')[0];

  // Function to handle student selection
  const handleStudentChange = (event, value) => {
    setSelectedStudent(value);
    if (value) {
      setStudentId(value.id);
      setName(value.name);
      setDoj(value.joiningDate);
      setCourse(value.Course);
    } else {
      // If no value is selected, reset the fields to empty
      setStudentId('');
      setName('');
      setDoj('');
      setCourse('');
    }
  };

  return (
    <Container>
      <Box>
        <Link to="/dashboard/manage_payment">
          <Button variant="outlined" color="secondary" startIcon={<KeyboardBackspaceIcon />}>
            Back
          </Button>
        </Link>
      </Box>

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
        Payment Registration
      </Typography>
      <form onSubmit={handleSubmit}>
        <Typography variant="h6" color="#00695c" sx={{ my: 1 }}>
          Student Details
        </Typography>
        <Autocomplete
          sx={{ my: 2 }}
          id="student-autocomplete"
          options={students}
          getOptionLabel={(student) => `${student.id} - ${student.name}`}
          value={selectedStudent}
          onChange={handleStudentChange}
          renderInput={(params) => <TextField {...params} label="Select Student" />}
        />
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} my={1}>
          <TextField
            required
            fullWidth
            label="Student ID"
            // value={selectedStudent.id}
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            error={Boolean(errors.studentId)}
            helperText={errors.studentId}
            disabled
          />

          <TextField
            fullWidth
            required
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={Boolean(errors.name)}
            helperText={errors.name}
            disabled
          />

          <TextField
            required
            fullWidth
            label="Course chosen"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            error={Boolean(errors.course)}
            helperText={errors.course}
            disabled
          />
          <TextField
            fullWidth
            required
            label="Date of Joining"
            type="date"
            value={doj}
            onChange={(e) => setDoj(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            error={Boolean(errors.doj)}
            helperText={errors.doj}
            disabled
          />
        </Stack>
        <Typography variant="h6" color="#00695c" sx={{ my: 1 }}>
          Payment Details
        </Typography>

        <Stack direction={'row'} spacing={3} my={1}>
          <FormControl fullWidth component="fieldset">
            <FormLabel component="legend">Payment Term</FormLabel>
            <RadioGroup
              row
              aria-label="payment-type"
              name="payment-type"
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
            >
              <FormControlLabel value="full" control={<Radio />} label="Full Payment" />
              <FormControlLabel value="partial" control={<Radio />} label="Partial Payment" />
            </RadioGroup>
          </FormControl>

          <FormControl fullWidth component="fieldset">
            <FormLabel component="legend">Mode of Payment</FormLabel>
            <RadioGroup
              row
              aria-label="payment-mode"
              name="payment-mode"
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
            >
              <FormControlLabel value="cash" control={<Radio />} label="Cash" />
              <FormControlLabel value="upi" control={<Radio />} label="UPI" />
            </RadioGroup>
          </FormControl>
        </Stack>
        {paymentType === 'full' && (
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} my={1}>
            <TextField
              required
              label="Total Fee"
              type="number"
              fullWidth
              value={totalFee}
              onChange={(e) => setTotalFee(e.target.value)}
              error={Boolean(errors.totalFee)}
              helperText={errors.totalFee}
            />

            <TextField
              required
              fullWidth
              label="Payment Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                max: today, // Set the maximum date to today's date
              }}
              error={Boolean(errors.date)}
              helperText={errors.date}
            />
          </Stack>
        )}
        {paymentType === 'partial' && (
          <>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} my={1}>
              <TextField
                required
                label="Total Fee"
                type="number"
                fullWidth
                value={totalFee}
                onChange={(e) => setTotalFee(e.target.value)}
                error={Boolean(errors.totalFee)}
                helperText={errors.totalFee}
              />

              <TextField
                required
                label="Paid Fee"
                fullWidth
                type="number"
                value={paidFee}
                onChange={(e) => setPaidFee(e.target.value)}
                error={Boolean(errors.paidFee)}
                helperText={errors.paidFee}
              />

              <TextField
                required
                fullWidth
                label="Balance to be Paid"
                type="number"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                error={Boolean(errors.balance)}
                helperText={errors.balance}
              />

              <TextField
                required
                fullWidth
                label="Payment Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                error={Boolean(errors.date)}
                helperText={errors.date}
              />
            </Stack>
          </>
        )}

        <TextField
          required
          fullWidth
          label="Remarks"
          multiline
          rows={4}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          error={Boolean(errors.remarks)}
          helperText={errors.remarks}
          sx={{ my: 2 }}
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="success"
          sx={{ backgroundColor: '#009688', color: 'white' }}
        >
          Update Payment
        </Button>

        {/* Snackbar for success message */}
        <Snackbar
          open={showSuccessMessage}
          autoHideDuration={5000}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          onClose={handleCloseSnackbar}
        >
          <Alert variant="filled" onClose={handleCloseSnackbar} severity="success" width={'100%'}>
            Form submitted successfully!
          </Alert>
        </Snackbar>
      </form>
    </Container>
  );
};

export default PaymentUpdateForm;
