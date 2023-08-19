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
} from '@mui/material';
import * as XLSX from 'xlsx';
import Slide from '@mui/material/Slide';
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import React, { useEffect, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import styled from '@emotion/styled';
import EditIcon from '@mui/icons-material/Edit';
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
  color: '#424242',
  fontWeight: '800',
  textAlign: 'center',
  backgroundColor: '#e3f2fd',
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

const ManageAdmissionTable = () => {
  // eslint-disable-next-line no-restricted-globals
  const navigate = useNavigate();
  const [tokent, settokent] = useState(
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudGxpc3QiOlt7IlVzZXJJRCI6IjEiLCJMb2dpbkNvZGUiOiIwMSIsIkxvZ2luTmFtZSI6IkFkbWluIiwiRW1haWxJZCI6ImFkbWluQGdtYWlsLmNvbSIsIlVzZXJUeXBlIjoiQURNSU4ifV0sImlhdCI6MTYzODM1NDczMX0.ZW6zEHIXTxfT-QWEzS6-GuY7bRupf2Jc_tp4fXIRabQ'
  );
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  // handle snackbar & alert messages on save
  const [openAlert, setopenAlert] = useState(false);
  // At the beginning of the component
  const [openDelete, setOpenDelete] = useState(false);
  const [stateIdToDelete, setStateIdToDelete] = useState(null);
  const [AdmissionData, setAdmissionData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  // alert messages on operations
  const [alertType, setAlertType] = useState('success'); // 'success' or 'error'
  const [alertMessage, setAlertMessage] = useState('');
  const [openLoader, setOpenLoader] = useState(false);

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
    getAdmissions();
    formatDateToinitialValues();
  }, []);

  const getAdmissions = async () => {
    setOpenLoader(true);
    try {
      // Convert fromDate and toDate strings to Date objects
      const fromDateObj = fromDate ? new Date(fromDate) : null;
      const toDateObj = toDate ? new Date(toDate) : null;

      // Format date objects for the API request
      const formattedFromDate = formatDateToSend(fromDateObj);
      const formattedToDate = formatDateToSend(toDateObj);

      const res = await axios.instance.post(
        '/GetAllAdmission',
        {
          FromDate: formattedFromDate,
          ToDate: formattedToDate,
        },
        {
          headers: { Authorization: tokent, 'Content-Type': 'application/json' },
        }
      );
      setAdmissionData(res.data);
      // console.log(res.data);
      console.log(formatDateToSend(fromDateObj));
      setOpenLoader(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setOpenLoader(false);
    }
  };

  // delete Request to delete state
  const deleteAdmission = async (admId) => {
    try {
      await axios.instance
        .delete(`/deleteAdmission/${admId}`, {
          headers: { Authorization: tokent, 'Content-Type': 'application/json' },
        })
        .then((res) => {
          if (res.data === '') {
            getAdmissions();
            setOpenDelete(false);
            setAlertType('warning');
            setAlertMessage('Admission Deleted, Successfully!');
            setopenAlert(true);
          } else {
            getAdmissions();
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
    navigate('/dashboard/admission', { state: { isEdit: false, AdmissionData: null } });
  };

  // handle delete popup dialog
  const handleDelete = (admId) => {
    setOpenDelete(true);
    setStateIdToDelete(admId);
  };

  const handleDeleteConfirmed = (admId) => {
    deleteAdmission(admId);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
    setopenAlert(false);
  };

  const handleCloseAlert = () => {
    setopenAlert(false);
  };

  const handleDownloadExcel = () => {
    // console.log(filteredData);
    const data = filteredData.map((enq) => ({
      ID: enq.AdmissionId,
      FullName: `${enq.FirstName} ${enq.LastName}`,
      Phone: enq.PhoneNumber,
      Email: enq.Email,         
      Gender: enq.Gender,   
      DOB: formatDate(enq.Dob),
      CourseCategory: enq.Course_Category,
      Course: enq.Course_Name,      
      Address1: enq.Address1,
      Address2: enq.Address2,      
      CityName: enq.CityName,      
      StateName: enq.StateName,      
      ZipCode: enq.ZipCode,      
      GraduationType: enq.GraduationType,
      CollegeName: enq.CollegeName,
      DegreeName: enq.DegreeName,
      HSCPassedOut: enq.HscPassedout,
      HSCPercentage: enq.HscPer,
      UGPassedOut: enq.UGPassedOut,
      UGPercentage: enq.UGPer,
      PGPassedOut: enq.PGPassedOut,
      PGPercentage: enq.PGPer,
      SSLCPassedOut: enq.SslcPassedout,
      SSLCPercentage: enq.SslcPer,
      WorkingCompany: enq.WorkingCompany,
      WorkingIndustry: enq.WorkingIndustry,
      ReferenceBy: enq.ReferenceBy,
      ReferenceContactNumber: enq.ReferenceContactNumber,
      PreferenceDay: enq.PerferenceDay,
      PreferenceMode: enq.PerferenceMode,
      PreferenceTiming: enq.PerferenceTiming,
      AdmissionId: enq.AdmissionId,
      AdmissionNo: enq.AdmissionNo,
      CourseId: enq.CourseId,
      CourseTechnologyId: enq.CourseTechnologyId,
      DiscountAmount: enq.DiscountAmount,
      NetAmount: enq.NetAmount,
      WorkingStatus: enq.WorkingStatus,
      photo: enq.doc1,
      pancard: enq.doc2,
      aadhaar: enq.doc3,
      collegeID: enq.doc4,      
      EnquiryDate: formatDate(enq.CreatedDate),      
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Admission');
    XLSX.writeFile(workbook, `AdmissionData+${currentDate}+.xlsx`);
  };

  // search & filter
  const filteredData = AdmissionData.filter((enq) => {
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
          borderColor="#e8f5e9"
          textAlign={'center'}
          border={0.5}
          borderRadius={1}
          my={2}
          color="#0277bd"
        >
          Manage Admissions
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
            <IconButton
              color="primary"
              // sx={{
              //   backgroundColor: '#2196F3',
              //   color: '#FFFFFF',
              //   padding: '8px',
              // }}
              onClick={getAdmissions}
            >
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
              sx={{ boxShadow: 1, whiteSpace: 'nowrap' }}
              onClick={handleNewAdmission}
              endIcon={<ContactSupportIcon />}
            >
              New Admission
            </Button>
          </Stack>
        </Stack>

        {/* table  */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ padding: 'none' }}>
                <StyledTableCell>S.No</StyledTableCell>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Full Name</StyledTableCell>
                <StyledTableCell>Phone</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Course Category</StyledTableCell>
                <StyledTableCell>Course</StyledTableCell>
                <StyledTableCell>Admission Date</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : filteredData
              ).map((enq, index) => (
                <TableRow key={enq.AdmissionId} hover>
                  <TableCell align="center" padding="none">
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell align="center">
                    {'ADM'}
                    {enq.AdmissionId}
                  </TableCell>
                  <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
                    {enq.FirstName} {enq.LastName}
                  </TableCell>

                  <TableCell align="center" padding="none" sx={{ textTransform: 'capitalize', color: 'inherit' }}>
                    <Button
                      component="a"
                      variant="text"
                      title="Click to Call"
                      href={`tel:${+91}${enq.PhoneNumber}`}
                      sx={{ color: 'inherit', fontWeight: 400 }}
                      startIcon={<CallIcon color="success" />}
                    >
                      {enq.PhoneNumber}
                    </Button>
                  </TableCell>

                  <TableCell align="center" padding="none" sx={{ textTransform: 'capitalize', color: 'inherit' }}>
                    <Button
                      component="a"
                      variant="text"
                      color="inherit"
                      title="Click to Mail"
                      href={`mailto:${enq.Email}`}
                      sx={{ fontWeight: 400, color: 'inherit', textTransform: 'lowercase' }}
                      startIcon={<EmailIcon color="error" />}
                    >
                      {enq.Email}
                    </Button>
                  </TableCell>

                  <TableCell align="center" padding="normal" sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                    {enq.Course_Category}
                  </TableCell>

                  <TableCell
                    align="center"
                    padding="normal"
                    sx={{
                      textTransform: 'capitalize',
                      // whiteSpace: 'nowrap'
                    }}
                  >
                    {enq.Course_Name}
                  </TableCell>

                  <TableCell
                    align="center"
                    padding="normal"
                    sx={{
                      textTransform: 'capitalize',
                      // whiteSpace: 'nowrap'
                    }}
                  >
                    {/* {enq.CreatedDate} */}
                    {formatDate(enq.CreatedDate)}
                  </TableCell>

                  <TableCell align="center" padding="normal" sx={{ padding: '0' }}>
                    <Link to={{ pathname: `/dashboard/admission/${enq.AdmissionId}` }}>
                      <IconButton aria-label="Edit">
                        <EditIcon color="primary" />
                      </IconButton>
                    </Link>
                    <IconButton aria-label="Delete" onClick={() => handleDelete(enq.AdmissionId)}>
                      <DeleteForeverIcon color="error" />
                    </IconButton>
                  </TableCell>
                  
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={8} />
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
    </>
  );
};

export default ManageAdmissionTable;
