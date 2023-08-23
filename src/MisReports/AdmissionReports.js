import {
  Stack,
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  Dialog,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  LinearProgress,
  FormControl,
  Autocomplete,
  InputLabel,
  Select,
  MenuItem,
  Grow,
  Collapse,
  Snackbar,
  Alert,
  Slide,
  Avatar,
} from '@mui/material';
import * as XLSX from 'xlsx';
import XLSXS from 'xlsx-js-style';
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import LockResetIcon from '@mui/icons-material/LockReset';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import JsPDF from 'jspdf';
import 'jspdf-autotable';

import axios from '../axios';
// import './animation.css';

const AdmissionReports = () => {
  // eslint-disable-next-line no-restricted-globals
  const [tokent, settokent] = useState(
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudGxpc3QiOlt7IlVzZXJJRCI6IjEiLCJMb2dpbkNvZGUiOiIwMSIsIkxvZ2luTmFtZSI6IkFkbWluIiwiRW1haWxJZCI6ImFkbWluQGdtYWlsLmNvbSIsIlVzZXJUeXBlIjoiQURNSU4ifV0sImlhdCI6MTYzODM1NDczMX0.ZW6zEHIXTxfT-QWEzS6-GuY7bRupf2Jc_tp4fXIRabQ'
  );

  // At the beginning of the component
  const [admissionData, setadmissionData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [fulllName, setfulllName] = useState(null);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState(null);
  const [selectedcourseCategoryr, setSelectedcourseCategoryr] = useState({
    Course_Category: 'All Categories',
  });
  const [selectedCourse, setSelectedCourse] = useState({
    Course_Name: 'All Courses',
  });
  const [preferredDays, setPreferredDays] = React.useState('');
  const [openLoader, setOpenLoader] = useState(false);

  const [categoryData, setCategoryData] = useState([]);
  const [courseData, setCourseData] = useState([]);

  const [showNoResultsSnackbar, setShowNoResultsSnackbar] = useState(false);
  const noResultsMessage = 'No results found for the applied filters.';

  // table header cell styles
  const StyledTableCell = styled(TableCell)({
    color: '#E8F9FD',
    fontWeight: '800',
    textAlign: 'center',
    backgroundColor: '#164B60',
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

  function formatDateDob(inputDateTime) {
    const isoDate = new Date(inputDateTime);

    const day = isoDate.getUTCDate().toString().padStart(2, '0');
    const month = (isoDate.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = isoDate.getUTCFullYear();

    let hour = isoDate.getUTCHours();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour %= 12;
    hour = hour || 12; // Convert 0 to 12

    const minute = isoDate.getUTCMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year}`;
  }

  // Set the initial state for fromDate and toDate
  const formatDateToinitialValues = (date) => {
    if (!date) {
      return '';
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get the current date and 30 days before the current date
  const currentDate = new Date();
  const fromDateOnCurrentMonth = new Date(currentDate);
  fromDateOnCurrentMonth.setDate(1);

  // Convert fromDate and toDate objects to formatted date strings
  const initialFromDate = formatDateToinitialValues(fromDateOnCurrentMonth);
  const initialToDate = formatDateToinitialValues(currentDate);

  // API Integration
  useEffect(() => {
    getAllData();
    getCategories();
    getCourses();
    formatDateToinitialValues();
  }, []);

  // get all Cities Request
  const getAllData = async () => {
    setOpenLoader(true);
    try {
      const res = await axios.instance.get('/GetallAdmissionForMIS', {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      setadmissionData(res.data);
      // console.log('all data recieved: ', res.data);
      setOpenLoader(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // get all course categories Request
  const getCategories = async () => {
    try {
      const res = await axios.instance.get('/GetAllCourseCategory', {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      setCategoryData(res.data);
      // console.log('getCategories : ', res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // get all Courses Request
  const getCourses = async () => {
    try {
      const res = await axios.instance.get('/GetAllCourses', {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      setCourseData(res.data);
      // console.log('Courses', res.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  // handleDownloadExcel
  // const handleDownloadExcel = () => {
  //   console.log('excel object enq:', filteredData);

  //   const data = filteredData.map((enq, index) => ({
  //     'S.No': index + 1,
  //     'Admission ID': enq.AdmissionId,
  //     'Admission Date': formatDate(enq.AdmissionDate),
  //     Name: `${enq.FirstName} ${enq.LastName}`,
  //     'Student Photo': `${axios.baseURL}AdmissionDocs/${enq.profilePhoto}`,
  //     Phone: enq.PhoneNumber,
  //     Email: enq.Email,
  //     Gender: enq.Gender === 'm' ? 'Male' : 'Female',
  //     DOB: formatDateDob(enq.Dob),
  //     'Course Category': enq.Course_Category,
  //     Course: enq.Course_Name,
  //     City: enq.CityName,
  //     State: enq.StateName || '',
  //     'Graduation Type': enq.GraduationType === 'ug' ? 'UG' : 'PG',
  //     'College Name': enq.CollegeName,
  //     'Degree/Stream': enq.DegreeName,
  //     'UG %': enq.UGPer,
  //     'UG Passed Out': enq.UGPassedOut,
  //     'PG %': enq.PGPassedOut === 'N/A' ? '' : enq.PGPer,
  //     'PG Passed Out': enq.PGPassedOut === 'N/A' ? '' : enq.PGPassedOut,
  //     'Preferred Day': enq.PerferenceDay,
  //     'Preferred Mode': enq.PerferenceMode,
  //     'Preferred Timing': enq.PerferenceTiming,
  //     'Referred By': enq.ReferenceBy || '',
  //     'Referred Contact Number': enq.ReferenceContactNumber || '',
  //     'Course Fee': enq.Course_Fee,
  //     Discount: enq.DiscountAmount,
  //     'Offered Fee': enq.NetAmount,
  //     'Working Status': enq.WorkingStatus === 'n' ? 'No' : 'Yes',
  //     'Enquiry ID': enq.EnquiryId,
  //     'Enquiry Date': enq.EnquiryDate ? formatDate(enq.EnquiryDate) : '',
  //   }));

  //   const worksheet = XLSX.utils.json_to_sheet(data);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Enquiries');
  //   XLSX.writeFile(workbook, `Admission Data-${formatDateToinitialValues(new Date())}.xlsx`);
  // };

  // handleDownloadPDF
  const handleDownloadPDF = () => {
    const doc = new JsPDF();

    // Define column headers for the PDF table
    const headers = [
      'S.No',
      'Admission ID',
      'Admission Date',
      'Name',
      'Student Photo',
      'Phone',
      'Email',
      'Gender',
      'DOB',
      'Course Category',
      'Course',
      'City',
      'State',
      'Graduation Type',
      'College Name',
      'Degree/Stream',
      'UG %',
      'UG Passed Out',
      'PG %',
      'PG Passed Out',
      'Preferred Day',
      'Preferred Mode',
      'Preferred Timing',
      'Referred By',
      'Referred Contact Number',
      'Course Fee',
      'Discount',
      'Offered Fee',
      'Working Status',
      'Enquiry ID',
      'Enquiry Date',
    ];

    const data = filteredData.map((enq, index) => [
      index + 1,
      enq.AdmissionId,
      formatDate(enq.AdmissionDate),
      `${enq.FirstName} ${enq.LastName}`,
      enq.profilePhoto,
      enq.PhoneNumber,
      enq.Email,
      enq.Gender === 'm' ? 'Male' : 'Female',
      formatDateDob(enq.Dob),
      enq.Course_Category,
      enq.Course_Name,
      enq.CityName,
      enq.StateName || '',
      enq.GraduationType === 'ug' ? 'UG' : 'PG',
      enq.CollegeName,
      enq.DegreeName,
      enq.UGPer,
      enq.UGPassedOut,
      enq.PGPer,
      enq.PGPassedOut === 'N/A' ? '' : enq.PGPer,
      enq.PerferenceDay,
      enq.PerferenceMode,
      enq.PerferenceTiming,
      enq.ReferenceBy || '',
      enq.ReferenceContactNumber || '',
      enq.Course_Fee,
      enq.DiscountAmount,
      enq.NetAmount,
      enq.WorkingStatus === 'n' ? 'No' : 'Yes',
      enq.EnquiryId,
      enq.EnquiryDate ? formatDate(enq.EnquiryDate) : '',
    ]);

    // Add table to the PDF document
    doc.autoTable({
      head: [headers],
      body: data,
    });

    // Save the PDF with a specific filename
    doc.save(`AdmissionData_${formatDateToinitialValues(new Date())}.pdf`);
  };

  const handleDownloadExcel = () => {
    const data = filteredData.map((enq, index) => ({
      'S.No': index + 1,
      'Admission ID': enq.AdmissionId,
      'Admission Date': formatDate(enq.AdmissionDate),
      Name: `${enq.FirstName} ${enq.LastName}`,
      'Student Photo': `${axios.baseURL}AdmissionDocs/${enq.profilePhoto}`,
      Phone: enq.PhoneNumber,
      Email: enq.Email,
      Gender: enq.Gender === 'm' ? 'Male' : 'Female',
      DOB: formatDateDob(enq.Dob),
      'Course Category': enq.Course_Category,
      Course: enq.Course_Name,
      City: enq.CityName,
      State: enq.StateName || '',
      'Graduation Type': enq.GraduationType === 'ug' ? 'UG' : 'PG',
      'College Name': enq.CollegeName,
      'Degree/Stream': enq.DegreeName,
      'UG %': enq.UGPer,
      'UG Passed Out': enq.UGPassedOut,
      'PG %': enq.PGPassedOut === 'N/A' ? '' : enq.PGPer,
      'PG Passed Out': enq.PGPassedOut === 'N/A' ? '' : enq.PGPassedOut,
      'Preferred Day': enq.PerferenceDay,
      'Preferred Mode': enq.PerferenceMode,
      'Preferred Timing': enq.PerferenceTiming,
      'Referred By': enq.ReferenceBy || '',
      'Referred Contact Number': enq.ReferenceContactNumber || '',
      'Course Fee': enq.Course_Fee,
      Discount: enq.DiscountAmount,
      'Offered Fee': enq.NetAmount,
      'Working Status': enq.WorkingStatus === 'n' ? 'No' : 'Yes',
      'Enquiry ID': enq.EnquiryId,
      'Enquiry Date': enq.EnquiryDate ? formatDate(enq.EnquiryDate) : '',
    }));

    const wb = XLSXS.utils.book_new();
    const ws = XLSXS.utils.json_to_sheet(data, { origin: 'A8' });
    const columns = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
      'AA',
      'AB',
      'AC',
      'AD',
      'AE',
    ];

    const maxColWidths = {};
    const title = 'ADMISSIONS REPORT';

    // SETTING UP WIDTH DYNAMICALLY
    data.forEach((row) => {
      for (const col in row) {
        if (Object.prototype.hasOwnProperty.call(row, col)) {
          const cellValue = row[col] ? row[col].toString() : '';
          maxColWidths[col] = Math.max(maxColWidths[col] || 0, cellValue.length + 15);
        }
      }
    });

    const wscols = Object.keys(maxColWidths).map((col) => ({ wch: maxColWidths[col] }));

    ws['!cols'] = wscols;

    // Merging cells for the title
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 1, c: 30 } }];
    // Set the title cell's value and styling
    ws.A1 = {
      v: title,
      t: 's',
      s: {
        font: { bold: true, sz: 16 },
        alignment: { horizontal: 'center', vertical: 'center' },
        fill: { fgColor: { rgb: '88a3ca' } },
        border: {
          left: { style: 'thin', color: { rgb: '000000' } },
          top: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
        },
      },
    };

    ws.C4 = { v: 'Name: ', t: 's', s: { font: { bold: true } } };
    ws.D4 = { v: filters.name === '' ? 'ALL Names' : filters.name, t: 's' };

    ws.E4 = { v: 'Phone: ', t: 's', s: { font: { bold: true } } };
    ws.F4 = { v: filters.phoneNumber === '' ? 'ALL' : filters.phoneNumber, t: 's' };

    ws.G4 = { v: 'Class Mode: ', t: 's', s: { font: { bold: true } } };
    ws.H4 = { v: filters.preferredMode === '' ? 'Both' : filters.preferredMode, t: 's' };

    ws.I4 = { v: 'Enquiry Ref: ', t: 's', s: { font: { bold: true } } };
    ws.J4 = { v: filters.hasEnquiryReference === '' ? 'ALL' : filters.hasEnquiryReference, t: 's' };

    ws.C5 = { v: 'Course Category: ', t: 's', s: { font: { bold: true } } };
    ws.D5 = { v: filters.courseCategory === '' ? 'ALL' : filters.courseCategory, t: 's' };

    ws.E5 = { v: 'Course: ', t: 's', s: { font: { bold: true } } };
    ws.F5 = { v: filters.course === '' ? 'ALL' : filters.course, t: 's' };

    ws.G5 = { v: 'Preferred Days: ', t: 's', s: { font: { bold: true } } };
    ws.H5 = { v: filters.preferredDays === '' ? 'All Days' : filters.preferredDays, t: 's' };

    ws.I5 = { v: 'Working: ', t: 's', s: { font: { bold: true } } };
    ws.J5 = { v: filters.working === '' ? 'ALL' : filters.working, t: 's' };

    ws.C6 = { v: 'From Date: ', t: 's', s: { font: { bold: true } } };
    ws.D6 = { v: formatDateDob(filters.fromDate), t: 's' };

    ws.E6 = { v: 'To Date: ', t: 's', s: { font: { bold: true } } };
    ws.F6 = { v: formatDateDob(filters.toDate), t: 's' };

    ws.G6 = { v: 'Admisison Type: ', t: 's', s: { font: { bold: true } } };
    ws.H6 = { v: filters.isReferred === '' ? 'Both' : filters.isReferred, t: 's' };

    // headers row styling
    const headerRowIndex = '8';
    columns.forEach((col) => {
      const cell = `${col}${headerRowIndex}`;
      // console.log("cell",cell );
      ws[cell].s = {
        fill: { fgColor: { rgb: '88b0ca' } },
        alignment: { horizontal: 'center' },
        font: { bold: true, sz: 12 },
        border: {
          left: { style: 'thin', color: { rgb: 'black' } },
          top: { style: 'thin', color: { rgb: 'black' } },
          right: { style: 'thin', color: { rgb: 'black' } },
          bottom: { style: 'thin', color: { rgb: 'black' } },
        },
      };
    });

    // excel table contents
    const CellStyle = {
      alignment: { horizontal: 'center' },
      border: {
        left: { style: 'thin', color: { rgb: 'black' } },
        top: { style: 'thin', color: { rgb: 'black' } },
        right: { style: 'thin', color: { rgb: 'black' } },
        bottom: { style: 'thin', color: { rgb: 'black' } },
      },
    };
    for (let i = 1; i <= data.length; i += 1) {
      const rowNumber = i + 8;
     columns.forEach((col) => {
        const cell = `${col}${rowNumber}`;
        ws[cell].s = CellStyle;
      });
    }

    XLSXS.utils.book_append_sheet(wb, ws, 'Payments Summary');
    XLSXS.writeFile(wb, `Payments Summary ${formatDateToinitialValues(new Date())}.xlsx`);
  };

  const [filters, setFilters] = useState({
    fromDate: initialFromDate,
    toDate: initialToDate,
    name: '',
    phoneNumber: '',
    courseCategory: '',
    course: '',
    preferredMode: '',
    preferredDays: '',
    working: '',
    hasEnquiryReference: '',
    isReferred: '',
  });

  const resetFilters = () => {
    setFilters({
      fromDate: initialFromDate,
      toDate: initialToDate,
      name: '',
      phoneNumber: '',
      courseCategory: '',
      course: '',
      preferredMode: '',
      preferredDays: '',
      working: '',
      hasEnquiryReference: '',
      isReferred: '',
    });
    setFilteredData([]);
    setSelectedPhoneNumber(null);
    setfulllName(null);
    setSelectedCourse(null);
    setSelectedcourseCategoryr(null);
    setSelectedcourseCategoryr({ Course_Category: 'All Categories' });
    setSelectedCourse({ Course_Name: 'All Courses' });
  };

  const applyFilters = () => {
    const filteredDataTable = admissionData.filter((enq) => {
      const nameFilterLowerCase = filters.name.toLowerCase();

      console.log('enq.filters:', filters.fromDate, 'and', filters.toDate);

      const enqDate = new Date(enq.AdmissionDate);
      enqDate.setHours(0, 0, 0, 0);
      const fromDate = new Date(filters.fromDate);
      fromDate.setHours(0, 0, 0, 0);
      const toDate = new Date(filters.toDate);
      toDate.setHours(0, 0, 0, 0);
      const dateFilterPassed = !filters.fromDate || !filters.toDate || (enqDate >= fromDate && enqDate <= toDate);

      const nameFilterPassed =
        !filters.name || `${enq.FirstName} ${enq.LastName}`.toLowerCase().includes(nameFilterLowerCase);

      const phoneNumberFilterPassed = !filters.phoneNumber || enq.PhoneNumber.includes(filters.phoneNumber);

      const courseCategoryFilterPassed =
        !filters.courseCategory || enq.Course_Category.toLowerCase().includes(filters.courseCategory.toLowerCase());

      const courseFilterPassed = !filters.course || enq.CourseTechnologyId.includes(filters.course);

      const preferredModeFilterPassed =
        !filters.preferredMode || enq.PerferenceMode.toLowerCase() === filters.preferredMode.toLowerCase();

      const preferredDaysFilterPassed =
        !filters.preferredDays || enq.PerferenceDay.toLowerCase() === filters.preferredDays.toLowerCase();

      const workingFilterPassed = !filters.working || enq.WorkingStatus.toLowerCase() === filters.working.toLowerCase();

      const hasEnquiryReferenceFilterPassed =
        !filters.hasEnquiryReference ||
        (filters.hasEnquiryReference === 'yes' && enq.EnquiryId !== '0') ||
        (filters.hasEnquiryReference === 'no' && enq.EnquiryId === '0');

      const isReferredFilterPassed =
        !filters.isReferred ||
        (filters.isReferred === 'yes' && enq.ReferenceBy) ||
        (filters.isReferred === 'no' && !enq.ReferenceBy);

      return (
        dateFilterPassed &&
        nameFilterPassed &&
        phoneNumberFilterPassed &&
        courseCategoryFilterPassed &&
        courseFilterPassed &&
        preferredModeFilterPassed &&
        preferredDaysFilterPassed &&
        workingFilterPassed &&
        hasEnquiryReferenceFilterPassed &&
        isReferredFilterPassed
      );
    });

    setFilteredData(filteredDataTable);

    // Show Snackbar if there are no results
    if (filteredDataTable.length === 0) {
      setShowNoResultsSnackbar(true);
    } else {
      setShowNoResultsSnackbar(false);
    }
    console.log('applying filters: ', filteredDataTable);
  };

  // pagination
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredData.length - page * rowsPerPage);
  const totalRows = filteredData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const currentPage = Math.max(0, Math.min(page, totalPages - 1));

  const handleCloseSnackbar = () => {
    setShowNoResultsSnackbar(false);
  };

  return (
    <>
      <Container maxWidth={'xl'} sx={{ pt: 2, p: 1 }} elevation={3} component={Paper}>
        <Snackbar
          open={showNoResultsSnackbar}
          autoHideDuration={4000}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity="info" variant="filled" sx={{ width: '100%' }}>
            {noResultsMessage}
          </Alert>
        </Snackbar>

        {/* table header */}
        <Typography variant="h4" textAlign={'left'} my={2} color="#252B48">
          Admissions Report
        </Typography>

        {/* filters  */}
        <Stack direction={'column'} justifyContent={'space-between'} spacing={2} my={3}>
          <Stack direction={{ sm: 'row', xs: 'column' }} spacing={1}>
            <FormControl fullWidth size="small" component="fieldset" required>
              <Autocomplete
                fullWidth
                size="small"
                options={admissionData}
                getOptionLabel={(enq) =>
                  enq ? `${enq.FirstName} ${enq.LastName}(EnquiryId: ${enq.AdmissionId}) ` : ''
                }
                isOptionEqualToValue={(option, value) => option.AdmissionId === value?.AdmissionId}
                renderInput={(params) => <TextField {...params} label="Search By Name" />}
                value={fulllName}
                onChange={(e, newValue) => {
                  if (newValue === null) {
                    setfulllName(null);
                    setFilters({ ...filters, name: '' });
                  } else {
                    setfulllName(newValue);
                    const fullName = `${newValue.FirstName} ${newValue.LastName}`.toLowerCase();
                    setFilters({ ...filters, name: fullName });
                  }
                }}
              />
            </FormControl>
            <FormControl fullWidth size="small" component="fieldset" required>
              <Autocomplete
                fullWidth
                size="small"
                options={admissionData}
                getOptionLabel={(enq) => (enq ? enq.PhoneNumber : '')}
                isOptionEqualToValue={(option, value) => option.EnquiryId === (value ? value.EnquiryId : null)}
                renderInput={(params) => <TextField {...params} label="Search By Number" />}
                value={selectedPhoneNumber}
                onChange={(e, newValue) => {
                  if (newValue === null) {
                    setSelectedPhoneNumber(null);
                    setFilters({ ...filters, phoneNumber: '' });
                  } else {
                    setSelectedPhoneNumber(newValue);
                    setFilters({ ...filters, phoneNumber: newValue.PhoneNumber });
                  }
                }}
              />
            </FormControl>
          </Stack>

          <Stack direction={{ sm: 'row', xs: 'column' }} spacing={1} my={1}>
            <FormControl size="small" fullWidth component="fieldset" required>
              <Autocomplete
                size="small"
                fullWidth
                options={[{ Course_Category: 'All Categories' }, ...categoryData]}
                getOptionLabel={(ctgry) => ctgry.Course_Category}
                isOptionEqualToValue={(option, value) => option.Course_Category === value.Course_Category}
                renderInput={(params) => <TextField {...params} label="Course Category" />}
                value={selectedcourseCategoryr}
                onChange={(e, newValue) => {
                  setSelectedcourseCategoryr(newValue); // Update the selected value

                  if (newValue === null || newValue.Course_Category === 'All') {
                    setFilters({ ...filters, courseCategory: '' });
                  } else {
                    setFilters({ ...filters, courseCategory: newValue.Course_Category });
                  }
                }}
                clearText="Clear"
              />
            </FormControl>

            <FormControl size="small" fullWidth component="fieldset" required>
              <Autocomplete
                size="small"
                fullWidth
                options={[{ Course_Name: 'All Courses' }, ...courseData]}
                getOptionLabel={(crs) => crs.Course_Name}
                isOptionEqualToValue={(option, value) => option.Course_Name === value.Course_Name}
                renderInput={(params) => <TextField {...params} label="Course" />}
                value={selectedCourse}
                onChange={(e, newValue) => {
                  setSelectedCourse(newValue);

                  if (newValue === null || newValue.Course_Name === 'All') {
                    setFilters({ ...filters, course: '' });
                  } else {
                    setFilters({ ...filters, course: newValue.CourseId });
                  }
                }}
                clearText="Clear"
              />
            </FormControl>
          </Stack>

          <Stack direction={{ sm: 'row', xs: 'column' }} spacing={1}>
            <FormControl size="small" fullWidth>
              <InputLabel id="preferredDays">Preferred Days</InputLabel>
              <Select
                labelId="preferredDays"
                id="preferredDays"
                value={filters.preferredDays || 'All Days'}
                label="Preferred Days"
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  if (selectedValue === 'All Days') {
                    setFilters({ ...filters, preferredDays: null });
                  } else {
                    setFilters({ ...filters, preferredDays: selectedValue });
                  }
                }}
              >
                <MenuItem value={'All Days'}>All Days</MenuItem>
                <MenuItem value={'weekend'}>Weekend</MenuItem>
                <MenuItem value={'weekdays'}>Weekdays</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth>
              <InputLabel id="Preferredmode">Class Mode</InputLabel>
              <Select
                variant="outlined"
                labelId="Preferredmode"
                id="Preferredmode"
                value={filters.preferredMode || 'All Modes'}
                label="Class Mode"
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  if (selectedValue === 'All Modes') {
                    setFilters({ ...filters, preferredMode: null });
                  } else {
                    setFilters({ ...filters, preferredMode: selectedValue });
                  }
                }}
              >
                <MenuItem value={'All Modes'}>All Modes</MenuItem>
                <MenuItem value={'online'}>Online</MenuItem>
                <MenuItem value={'offline'}>Offline</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth>
              <InputLabel id="AdmissionMode">Admission Mode</InputLabel>
              <Select
                labelId="AdmissionMode"
                id="AdmissionMode"
                value={filters.isReferred || 'All'}
                label="Admission Mode"
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  if (selectedValue === 'All') {
                    setFilters({ ...filters, isReferred: null });
                  } else {
                    setFilters({ ...filters, isReferred: selectedValue });
                  }
                }}
              >
                <MenuItem value={'All'}>All</MenuItem>
                <MenuItem value={'no'}>Direct</MenuItem>
                <MenuItem value={'yes'}>Referrel</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth>
              <InputLabel id="hasEnquiryReference">Enquiry Reference</InputLabel>
              <Select
                labelId="hasEnquiryReference"
                id="hasEnquiryReference"
                value={filters.hasEnquiryReference || 'All'}
                label="Enquiry Reference"
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  if (selectedValue === 'All') {
                    setFilters({ ...filters, hasEnquiryReference: null });
                  } else {
                    setFilters({ ...filters, hasEnquiryReference: selectedValue });
                  }
                }}
              >
                <MenuItem value={'All'}>All</MenuItem>
                <MenuItem value={'yes'}>Yes</MenuItem>
                <MenuItem value={'no'}>No</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Stack direction={{ xs: 'row' }} spacing={1}>
            <FormControl size="small" fullWidth>
              <InputLabel id="workigStatus">Working Status</InputLabel>
              <Select
                labelId="workigStatus"
                id="workigStatus"
                value={filters.working || 'All'}
                label="Working Status"
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  if (selectedValue === 'All') {
                    setFilters({ ...filters, working: null });
                  } else {
                    setFilters({ ...filters, working: selectedValue });
                  }
                }}
              >
                <MenuItem value={'All'}>All</MenuItem>
                <MenuItem value={'y'}>Yes</MenuItem>
                <MenuItem value={'n'}>No</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              size="small"
              label="From Date"
              type="date"
              value={filters.fromDate}
              onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              fullWidth
              size="small"
              label="To Date"
              type="date"
              value={filters.toDate}
              onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Stack>

          <Stack direction={{ xs: 'row' }} spacing={1} justifyContent={'flex-end'}>
            {filteredData.length > 0 && (
              <Stack direction="row" spacing={1}>
                {
                  <>
                    <Grow in={filteredData.length > 0}>
                      <Button
                        variant="contained"
                        startIcon={<DownloadForOfflineIcon />}
                        onClick={handleDownloadExcel}
                        color="success"
                        title="Download as excel"
                        sx={{ color: 'white' }}
                      >
                        Excel
                      </Button>
                    </Grow>
                    <Grow in={filteredData.length > 0}>
                      <Button
                        variant="outlined"
                        startIcon={<PictureAsPdfIcon />}
                        onClick={handleDownloadPDF}
                        color="error"
                        aria-label="Download as PDF"
                      >
                        PDF
                      </Button>
                    </Grow>
                  </>
                }
              </Stack>
            )}

            <Stack direction={'row'} spacing={1}>
              <Button
                // size="small"
                variant="contained"
                color="secondary"
                onClick={applyFilters}
                startIcon={<FilterAltIcon />}
              >
                Apply Filters
              </Button>
              <Button
                // size="small"
                variant="contained"
                color="warning"
                onClick={resetFilters}
                startIcon={<LockResetIcon />}
              >
                reset
              </Button>
            </Stack>
          </Stack>
        </Stack>

        <Collapse in={filteredData.length > 0}>
          <>
            {/* table  */}
            <Paper elevation={5} sx={{ borderRadius: 1 }}>
              <TableContainer sx={{ borderRadius: 1 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ padding: 'none' }}>
                      <StyledTableCell>S.No</StyledTableCell>
                      <StyledTableCell>Admission ID</StyledTableCell>
                      <StyledTableCell>Admission Date</StyledTableCell>
                      <StyledTableCell>Name</StyledTableCell>
                      <StyledTableCell>Student Photo</StyledTableCell>
                      <StyledTableCell>Phone</StyledTableCell>
                      <StyledTableCell>Email</StyledTableCell>
                      <StyledTableCell>Gender</StyledTableCell>
                      <StyledTableCell>DOB</StyledTableCell>
                      <StyledTableCell>Course Category</StyledTableCell>
                      <StyledTableCell>Course</StyledTableCell>
                      <StyledTableCell>City</StyledTableCell>
                      <StyledTableCell>State</StyledTableCell>
                      <StyledTableCell>Graduation Type</StyledTableCell>
                      <StyledTableCell>College Name</StyledTableCell>
                      <StyledTableCell>Degree/Stream</StyledTableCell>
                      <StyledTableCell>UG %</StyledTableCell>
                      <StyledTableCell>UG Passed Out</StyledTableCell>
                      <StyledTableCell>PG %</StyledTableCell>
                      <StyledTableCell>PG Passed Out</StyledTableCell>
                      <StyledTableCell>Preferred Day</StyledTableCell>
                      <StyledTableCell>Preferred Mode</StyledTableCell>
                      <StyledTableCell>Preferred Timing</StyledTableCell>
                      <StyledTableCell>Referred By</StyledTableCell>
                      <StyledTableCell>Referred Contact Number</StyledTableCell>
                      <StyledTableCell>Course Fee</StyledTableCell>
                      <StyledTableCell>Discount</StyledTableCell>
                      <StyledTableCell>Offered Fee</StyledTableCell>
                      <StyledTableCell>Working Status</StyledTableCell>
                      <StyledTableCell>Enquiry ID</StyledTableCell>
                      <StyledTableCell>Enquiry Date</StyledTableCell>
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
                          {'TECH'}
                          {enq.AdmissionId}
                        </TableCell>

                        <TableCell
                          align="center"
                          padding="normal"
                          sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                        >
                          {formatDate(enq.AdmissionDate)}
                        </TableCell>

                        <TableCell align="center" sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                          {enq.FirstName} {enq.LastName}
                        </TableCell>

                        <TableCell align="center" sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                          <Stack p={0} justifyContent={'center'} alignItems={'center'} m={0}>
                            <Avatar
                              alt={`${enq.FirstName}`}
                              src={`${axios.baseURL}AdmissionDocs/${enq.profilePhoto}`}
                            />
                          </Stack>
                        </TableCell>

                        <TableCell
                          align="center"
                          padding="none"
                          sx={{ textTransform: 'capitalize', color: 'inherit', whiteSpace: 'nowrap' }}
                        >
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

                        <TableCell
                          align="center"
                          padding="none"
                          sx={{ textTransform: 'capitalize', color: 'inherit', whiteSpace: 'nowrap' }}
                        >
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

                        <TableCell
                          align="center"
                          padding="normal"
                          sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                        >
                          {enq.Gender}
                        </TableCell>

                        <TableCell
                          align="center"
                          padding="normal"
                          sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                        >
                          {formatDateDob(enq.Dob)}
                        </TableCell>

                        <TableCell
                          align="center"
                          padding="normal"
                          sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                        >
                          {enq.Course_Category}
                        </TableCell>

                        <TableCell
                          align="center"
                          padding="normal"
                          sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                        >
                          {enq.Course_Name}
                        </TableCell>

                        <TableCell
                          align="center"
                          padding="normal"
                          sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                        >
                          {enq.CityName}
                        </TableCell>

                        <TableCell
                          align="center"
                          padding="normal"
                          sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                        >
                          {enq.StateName}
                        </TableCell>

                        <TableCell
                          align="center"
                          padding="normal"
                          sx={{ textTransform: 'uppercase', whiteSpace: 'nowrap' }}
                        >
                          {enq.GraduationType}
                        </TableCell>

                        <TableCell
                          align="center"
                          padding="normal"
                          sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                        >
                          {enq.CollegeName}
                        </TableCell>

                        <TableCell
                          align="center"
                          padding="normal"
                          sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                        >
                          {enq.DegreeName}
                        </TableCell>

                        <TableCell
                          align="center"
                          padding="normal"
                          sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                        >
                          {enq.UGPer}
                        </TableCell>
                        <TableCell
                          align="center"
                          padding="normal"
                          sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                        >
                          {enq.UGPassedOut}
                        </TableCell>
                        <TableCell
                          align="center"
                          padding="normal"
                          sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                        >
                          {enq.PGPassedOut === 'N/A' ? ' ' : enq.PGPer}
                        </TableCell>

                        <TableCell
                          align="center"
                          padding="normal"
                          sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                        >
                          {enq.PGPassedOut === 'N/A' ? ' ' : enq.PGPassedOut}
                        </TableCell>

                        <TableCell
                          align="center"
                          padding="normal"
                          sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                        >
                          {enq.PerferenceDay}
                        </TableCell>
                        <TableCell
                          align="center"
                          padding="normal"
                          sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                        >
                          {enq.PerferenceMode}
                        </TableCell>

                        <TableCell
                          align="center"
                          padding="normal"
                          sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                        >
                          {enq.PerferenceTiming}
                        </TableCell>

                        <TableCell
                          align="center"
                          padding="normal"
                          sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                        >
                          {enq.ReferenceBy}
                        </TableCell>
                        <TableCell
                          align="center"
                          padding="normal"
                          sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                        >
                          {enq.ReferenceContactNumber}
                        </TableCell>

                        <TableCell
                          align="center"
                          padding="normal"
                          sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                        >
                          {enq.Course_Fee}
                        </TableCell>

                        <TableCell
                          align="center"
                          padding="normal"
                          sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                        >
                          {enq.DiscountAmount}
                        </TableCell>
                        <TableCell
                          align="center"
                          padding="normal"
                          sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                        >
                          {enq.NetAmount}
                        </TableCell>

                        <TableCell
                          align="center"
                          padding="normal"
                          sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                        >
                          {enq.WorkingStatus}
                        </TableCell>

                        <TableCell
                          align="center"
                          padding="normal"
                          sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                        >
                          {enq.EnquiryId === '0' ? '--' : enq.EnquiryId}
                        </TableCell>
                        <TableCell
                          align="center"
                          padding="normal"
                          sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                        >
                          {enq.EnquiryDate === null ? '--' : formatDate(enq.EnquiryDate)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={7} />
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
          </>
        </Collapse>
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

export default AdmissionReports;
