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
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import * as XLSX from 'xlsx';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import LockResetIcon from '@mui/icons-material/LockReset';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import JsPDF from 'jspdf';
import 'jspdf-autotable';
import XLSXS from 'xlsx-js-style';
import axios from '../axios';

const PaymentReports = () => {
  // eslint-disable-next-line no-restricted-globals
  const [tokent, settokent] = useState(
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudGxpc3QiOlt7IlVzZXJJRCI6IjEiLCJMb2dpbkNvZGUiOiIwMSIsIkxvZ2luTmFtZSI6IkFkbWluIiwiRW1haWxJZCI6ImFkbWluQGdtYWlsLmNvbSIsIlVzZXJUeXBlIjoiQURNSU4ifV0sImlhdCI6MTYzODM1NDczMX0.ZW6zEHIXTxfT-QWEzS6-GuY7bRupf2Jc_tp4fXIRabQ'
  );

  // At the beginning of the component
  const [paymentsData, setpaymentsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [fulllName, setfulllName] = useState(null);
  const [selectedcourseCategoryr, setSelectedcourseCategoryr] = useState({
    Course_Category: 'All Categories',
  });
  const [selectedCourse, setSelectedCourse] = useState({
    Course_Name: 'All Courses',
  });
  const [openLoader, setOpenLoader] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [showNoResultsSnackbar, setShowNoResultsSnackbar] = useState(false);
  const noResultsMessage = 'No results found for the applied filters.';
  const [reportType, setReportType] = useState('all');
  // table header cell styles
  const StyledTableCell = styled(TableCell)({
    color: '#DDE6ED',
    fontWeight: '800',
    textAlign: 'center',
    backgroundColor: '#17594A',
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
    if (reportType === 'profile') {
      getAllDataProfile();
    }
  }, [reportType]);

  // get all Cities Request
  const getAllData = async () => {
    setOpenLoader(true);
    try {
      const res = await axios.instance.get('/GetallPaymentsForMIS', {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      setpaymentsData(res.data);
      // console.log('all data recieved: ', res.data);
      setOpenLoader(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // get all Cities Request
  const getAllDataProfile = async () => {
    setOpenLoader(true);
    try {
      const res = await axios.instance.get('/GetallPaymentsForMISProfileWise', {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      setpaymentsData(res.data);
      // console.log('all profile data: ', res.data);
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
      console.log('Courses', res.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const [filters, setFilters] = useState({
    fromDate: initialFromDate,
    toDate: initialToDate,
    name: '',
    courseCategory: '',
    course: '',
    paymentStatus: '',
  });

  const resetFilters = () => {
    setFilters({
      fromDate: initialFromDate,
      toDate: initialToDate,
      name: '',
      courseCategory: '',
      course: '',
      paymentStatus: '',
    });
    setFilteredData([]);
    setfulllName(null);
    setSelectedCourse(null);
    setSelectedcourseCategoryr(null);
    setSelectedcourseCategoryr({ Course_Category: 'All Categories' });
    setSelectedCourse({ Course_Name: 'All Courses' });
  };

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

  // handleDownloadExcel
  const handleDownloadExcelProfileWise = () => {
    const data = filteredData.map((enq, index) => ({
      'S.No': index + 1,
      'Admission ID': enq.Admissionid,
      'Admission Date': formatDate(enq.PaymentDate),
      Name: `${enq.FirstName} ${enq.LastName}`,
      'Course Category': enq.Course_Category,
      Course: enq.Course_Name,
      'Course Fee ₹': enq.Course_Fee,
      'Offered Fee ₹': enq.OfferedFee,
      'Total Paid ₹': enq.TotalPaidAmount,
      'Balance Fee ₹': enq.BalanceFee,
      'Last Payment Date': formatDate(enq.PaymentDate),
    }));

    const wb = XLSXS.utils.book_new();
    const ws = XLSXS.utils.json_to_sheet(data, { origin: 'A8' });
    const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
    const maxColWidths = {};
    const title = 'Payments Summary Report';

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
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 1, c: 10 } }]; // Merging cells A1 to K2

    // Set the title cell's value and styling
    ws.A1 = {
      v: title,
      t: 's',
      s: {
        font: { bold: true, sz: 16 },
        alignment: { horizontal: 'center', vertical: 'center' },
        fill: { fgColor: { rgb: 'CCFFCC' } },
      },
    };

    ws.C4 = { v: 'Name: ', t: 's', s: { font: { bold: true } } };
    ws.D4 = { v: filters.name === '' ? 'ALL Names' : filters.name, t: 's' };

    ws.E4 = { v: 'Payment Status: ', t: 's', s: { font: { bold: true } } };
    ws.F4 = { v: filters.paymentStatus === '' ? 'ALL' : filters.paymentStatus, t: 's' };

    ws.C5 = { v: 'Course Category: ', t: 's', s: { font: { bold: true } } };
    ws.D5 = { v: filters.courseCategory === '' ? 'ALL' : filters.courseCategory, t: 's' };

    ws.E5 = { v: 'Course: ', t: 's', s: { font: { bold: true } } };
    ws.F5 = { v: filters.course === '' ? 'ALL' : filters.course, t: 's' };

    ws.C6 = { v: 'From Date: ', t: 's', s: { font: { bold: true } } };
    ws.D6 = { v: formatDateDob(filters.fromDate), t: 's' };

    ws.E6 = { v: 'To Date: ', t: 's', s: { font: { bold: true } } };
    ws.F6 = { v: formatDateDob(filters.toDate), t: 's' };

    // headers row styling
    const headerRowIndex = '8';
    columns.forEach((col) => {
      const cell = `${col}${headerRowIndex}`;
      // console.log("cell",cell );
      ws[cell].s = {
        fill: { fgColor: { rgb: 'CCFFCC' } },
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

    // excel table contents numbers
    const PriceCellStyle = {
      alignment: { horizontal: 'right' },
      border: {
        left: { style: 'thin', color: { rgb: 'black' } },
        top: { style: 'thin', color: { rgb: 'black' } },
        right: { style: 'thin', color: { rgb: 'black' } },
        bottom: { style: 'thin', color: { rgb: 'black' } },
      },
    };
    for (let i = 1; i <= data.length; i += 1) {
      const rowNumber = i + 8;
      ['G', 'H', 'I', 'J'].forEach((col) => {
        const cell = `${col}${rowNumber}`;
        ws[cell].s = PriceCellStyle;
      });
    }

    // excel table contents strings
    const VarCellStyle = {
      alignment: { horizontal: 'left' },
      border: {
        left: { style: 'thin', color: { rgb: 'black' } },
        top: { style: 'thin', color: { rgb: 'black' } },
        right: { style: 'thin', color: { rgb: 'black' } },
        bottom: { style: 'thin', color: { rgb: 'black' } },
      },
    };
    for (let i = 1; i <= data.length; i += 1) {
      const rowNumber = i + 8;
      ['A', 'B', 'C', 'D', 'E', 'F', 'K'].forEach((col) => {
        const cell = `${col}${rowNumber}`;
        ws[cell].s = VarCellStyle;
      });
    }

    XLSXS.utils.book_append_sheet(wb, ws, 'Payments Summary');
    XLSXS.writeFile(wb, `Payments Summary ${formatDateToinitialValues(new Date())}.xlsx`);
  };

  const handleDownloadExcelaLL = () => {
    const data = filteredData.map((enq, index) => ({
      'S.No': index + 1,
      'Payment ID': enq.PaymentId,
      'Payment Date': formatDate(enq.PaymentDate),
      'Admission ID': enq.Admissionid,
      Name: `${enq.FirstName} ${enq.LastName}`,
      'Course Category': enq.Course_Category,
      Course: enq.Course_Name,
      'Course Fee': enq.Course_Fee,
      'Offered Fee': enq.OfferedFee,
      'Total Paid Amount': enq.TotalPaidAmount,
      'Balance Fee': enq.BalanceFee,
      'Paid Amount': enq.PaidAmount,
      'Balance on Date': enq.BalanceOnDate,
      'Payment Type': enq.PayType,
      'Payment Mode': enq.PayMode,
      Remarks: enq.Remarks,
    }));

    const wb = XLSXS.utils.book_new();
    const ws = XLSXS.utils.json_to_sheet(data, { origin: 'A8' });
    const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];
    const maxColWidths = {};
    const title = 'All Payments Report';

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
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 1, c: 15 } }];
    // Set the title cell's value and styling
    ws.A1 = {
      v: title,
      t: 's',
      s: {
        font: { bold: true, sz: 16 },
        alignment: { horizontal: 'center', vertical: 'center' },
        fill: { fgColor: { rgb: 'CCFFCC' } },  
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

    ws.E4 = { v: 'Payment Status: ', t: 's', s: { font: { bold: true } } };
    ws.F4 = { v: filters.paymentStatus === '' ? 'ALL' : filters.paymentStatus, t: 's' };

    ws.C5 = { v: 'Course Category: ', t: 's', s: { font: { bold: true } } };
    ws.D5 = { v: filters.courseCategory === '' ? 'ALL' : filters.courseCategory, t: 's' };

    ws.E5 = { v: 'Course: ', t: 's', s: { font: { bold: true } } };
    ws.F5 = { v: filters.course === '' ? 'ALL' : filters.course, t: 's' };

    ws.C6 = { v: 'From Date: ', t: 's', s: { font: { bold: true } } };
    ws.D6 = { v: formatDateDob(filters.fromDate), t: 's' };

    ws.E6 = { v: 'To Date: ', t: 's', s: { font: { bold: true } } };
    ws.F6 = { v: formatDateDob(filters.toDate), t: 's' };

    // headers row styling
    const headerRowIndex = '8';
    columns.forEach((col) => {
      const cell = `${col}${headerRowIndex}`;
      // console.log("cell",cell );
      ws[cell].s = {
        fill: { fgColor: { rgb: 'CCFFCC' } },
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

    // excel table contents numbers
    const PriceCellStyle = {
      alignment: { horizontal: 'right' },
      border: {
        left: { style: 'thin', color: { rgb: 'black' } },
        top: { style: 'thin', color: { rgb: 'black' } },
        right: { style: 'thin', color: { rgb: 'black' } },
        bottom: { style: 'thin', color: { rgb: 'black' } },
      },
    };
    for (let i = 1; i <= data.length; i += 1) {
      const rowNumber = i + 8;
      ['H', 'I', 'J', 'K', 'L', 'M'].forEach((col) => {
        const cell = `${col}${rowNumber}`;
        ws[cell].s = PriceCellStyle;
      });
    }

    // excel table contents strings
    const VarCellStyle = {
      alignment: { horizontal: 'left' },
      border: {
        left: { style: 'thin', color: { rgb: 'black' } },
        top: { style: 'thin', color: { rgb: 'black' } },
        right: { style: 'thin', color: { rgb: 'black' } },
        bottom: { style: 'thin', color: { rgb: 'black' } },
      },
    };
    for (let i = 1; i <= data.length; i += 1) {
      const rowNumber = i + 8;
      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'N', 'O', 'P'].forEach((col) => {
        const cell = `${col}${rowNumber}`;
        ws[cell].s = VarCellStyle;
      });
    }

    XLSXS.utils.book_append_sheet(wb, ws, 'Payments Summary');
    XLSXS.writeFile(wb, `Payments Summary ${formatDateToinitialValues(new Date())}.xlsx`);
  };

  const handleDownloadPDFProfile = () => {
    const doc = new JsPDF();
    // Define column headers for the PDF table
    const headers = [
      'S.No',
      'Admission ID',
      'Admission Date',
      'Name',
      'Course Category',
      'Course',
      'Course Fee',
      'Offered Fee',
      'Total Paid Amount',
      'Payment Date',
      'Balance Fee',
    ];

    const data = filteredData.map((enq, index) => ({
      'S.No': index + 1,
      'Admission ID': enq.Admissionid,
      'Admission Date': formatDate(enq.PaymentDate),
      Name: `${enq.FirstName} ${enq.LastName}`,
      'Course Category': enq.Course_Category,
      Course: enq.Course_Name,
      Course_Fee: enq.Course_Fee,
      OfferedFee: enq.OfferedFee,
      TotalPaidAmount: enq.TotalPaidAmount,
      PaymentDate: enq.PaymentDate,
      BalanceFee: enq.BalanceFee,
    }));

    // Add table to the PDF document
    doc.autoTable({
      head: [headers],
      body: data.map((row) => Object.values(row)),
    });

    // Save the PDF with a specific filename
    doc.save(`Payments Summary ${formatDateToinitialValues(new Date())}.pdf`);
  };

  const handleDownloadPDFAll = (data) => {
    const doc = new JsPDF();

    const headers = [
      'S.No',
      'Payment ID',
      'Payment Date',
      'Admission ID',
      'Name',
      'Course Category',
      'Course',
      'Course Fee',
      'Offered Fee',
      'Total Paid Amount',
      'Balance Fee',
      'Paid Amount',
      'Balance on Date',
      'Payment Type',
      'Payment Mode',
      'Remarks',
    ];

    const formattedData = filteredData.map((enq, index) => [
      index + 1,
      enq.PaymentId,
      formatDate(enq.PaymentDate),
      enq.Admissionid,
      `${enq.FirstName} ${enq.LastName}`,
      enq.Course_Category,
      enq.Course_Name,
      enq.Course_Fee,
      enq.OfferedFee,
      enq.TotalPaidAmount,
      enq.BalanceFee,
      enq.PaidAmount,
      enq.BalanceOnDate,
      enq.PayType,
      enq.PayMode,
      enq.Remarks,
    ]);

    doc.autoTable({
      head: [headers],
      body: formattedData,
    });

    doc.save(`All Payments ${formatDateToinitialValues(new Date())}.pdf`);
  };

  const groupedPaymentsByName = {};
  paymentsData.forEach((payment) => {
    const fullName = `${payment.FirstName} ${payment.LastName}`;
    if (!groupedPaymentsByName[fullName]) {
      groupedPaymentsByName[fullName] = [];
    }
    groupedPaymentsByName[fullName].push(payment);
  });

  const applyFilters = () => {
    const filteredDataTable = paymentsData.filter((enq) => {
      const nameFilterLowerCase = filters.name.toLowerCase();

      console.log('enq : ', enq.CourseId, 'filters:', filters.course);

      const enqDate = new Date(enq.PaymentDate);
      enqDate.setHours(0, 0, 0, 0);
      const fromDate = new Date(filters.fromDate);
      fromDate.setHours(0, 0, 0, 0);
      const toDate = new Date(filters.toDate);
      toDate.setHours(0, 0, 0, 0);
      const dateFilterPassed = !filters.fromDate || !filters.toDate || (enqDate >= fromDate && enqDate <= toDate);

      const nameFilterPassed =
        !filters.name || `${enq.FirstName} ${enq.LastName}`.toLowerCase().includes(nameFilterLowerCase);

      const courseCategoryFilterPassed =
        !filters.courseCategory || enq.Course_Category.toLowerCase().includes(filters.courseCategory.toLowerCase());

      const paymentStatusFilter =
        !filters.paymentStatus ||
        (filters.paymentStatus === 'pending' && enq.BalanceFee !== 0) ||
        (filters.paymentStatus === 'full' && enq.BalanceFee === 0);

      const courseFilterPassed =
        !filters.course || enq.Course_Name.toLowerCase().includes(filters.course.toLowerCase());
      // !filters.course || enq.CourseId.includes(filters.course);

      return (
        dateFilterPassed && nameFilterPassed && courseCategoryFilterPassed && courseFilterPassed && paymentStatusFilter
      );
    });

    setFilteredData(filteredDataTable);
    setPage(0);
    // Show Snackbar if there are no results
    if (filteredDataTable.length === 0) {
      setShowNoResultsSnackbar(true);
    } else {
      setShowNoResultsSnackbar(false);
    }
    console.log('applying filters: ', filteredDataTable);
  };

  const handleCloseSnackbar = () => {
    setShowNoResultsSnackbar(false);
  };

  // pagination
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredData.length - page * rowsPerPage);
  const totalRows = filteredData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const currentPage = Math.max(0, Math.min(page, totalPages - 1));

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

        <Stack direction={'row'} justifyContent={'space-between'} spacing={2} pt={1}>
          <Typography variant="h4" textAlign={'left'} color="#1A5D1A">
            Payments Report
          </Typography>
          <FormControl size="small" component="fieldset">
            <RadioGroup
              row
              value={reportType}
              onChange={(e) => {
                setReportType(e.target.value);
              }}
            >
              <FormControlLabel
                value="all"
                control={<Radio />}
                onClick={() => resetFilters()}
                label="All Transactions"
              />
              <FormControlLabel
                value="profile"
                control={<Radio />}
                onClick={() => resetFilters()}
                label="Profile Wise"
              />
            </RadioGroup>
          </FormControl>
        </Stack>

        {/* filters */}
        <Stack direction={'column'} justifyContent={'space-between'} spacing={2} my={3}>
          <Stack direction={{ sm: 'row', xs: 'column' }} spacing={1}>
            <FormControl fullWidth size="small" component="fieldset" required>
              <Autocomplete
                fullWidth
                size="small"
                options={Object.keys(groupedPaymentsByName)}
                getOptionLabel={(fullName) => fullName}
                renderInput={(params) => <TextField {...params} label="Search By Name" />}
                value={fulllName}
                onChange={(e, newValue) => {
                  if (newValue === null) {
                    setfulllName(null);
                    setFilters({ ...filters, name: '' });
                  } else {
                    setfulllName(newValue);
                    setFilters({ ...filters, name: newValue });
                  }
                }}
              />
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel id="paymentStatus">Payment Status</InputLabel>
              <Select
                labelId="paymentStatus"
                id="paymentStatus"
                value={filters.paymentStatus || 'All'}
                label="Enquiry Reference"
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  if (selectedValue === 'All') {
                    setFilters({ ...filters, paymentStatus: null });
                  } else {
                    setFilters({ ...filters, paymentStatus: selectedValue });
                  }
                }}
              >
                <MenuItem value={'All'}>All</MenuItem>
                <MenuItem value={'full'}>Fullypaid</MenuItem>
                <MenuItem value={'pending'}>Pending</MenuItem>
              </Select>
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
                    setFilters({ ...filters, course: newValue.Course_Name });
                  }
                }}
                clearText="Clear"
              />
            </FormControl>
          </Stack>

          <Stack direction={{ xs: 'row' }} spacing={1}>
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
                        onClick={reportType === 'all' ? handleDownloadExcelaLL : handleDownloadExcelProfileWise}
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
                        onClick={reportType === 'all' ? handleDownloadPDFAll : handleDownloadPDFProfile}
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
              <Button variant="contained" color="secondary" onClick={applyFilters} startIcon={<FilterAltIcon />}>
                Apply Filters
              </Button>
              <Button variant="contained" color="warning" onClick={resetFilters} startIcon={<LockResetIcon />}>
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

                      {reportType === 'all' && (
                        <>
                          <StyledTableCell>Payment ID</StyledTableCell>
                          <StyledTableCell>Payment Date</StyledTableCell>
                        </>
                      )}

                      <StyledTableCell>Admission ID</StyledTableCell>
                      {reportType === 'profile' && (
                        <>
                          <StyledTableCell>Last Payment Date</StyledTableCell>
                        </>
                      )}
                      <StyledTableCell>Name</StyledTableCell>
                      <StyledTableCell>Course Category</StyledTableCell>
                      <StyledTableCell>Course</StyledTableCell>
                      <StyledTableCell>Course Fee</StyledTableCell>
                      <StyledTableCell>Offered Fee</StyledTableCell>
                      <StyledTableCell>Total Paid Amount</StyledTableCell>

                      {reportType === 'all' && (
                        <>
                          <StyledTableCell>Balance Fee</StyledTableCell>
                          <StyledTableCell>Paid Amount</StyledTableCell>
                          <StyledTableCell>Balance on Date</StyledTableCell>
                          <StyledTableCell>Payment Type</StyledTableCell>
                          <StyledTableCell>Payment Mode</StyledTableCell>
                          <StyledTableCell>Remarks</StyledTableCell>
                        </>
                      )}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {(rowsPerPage > 0
                      ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : filteredData
                    ).map((enq, index) => (
                      <TableRow
                        key={
                          reportType === 'all'
                            ? `${enq.PaymentId}+${enq.PaymentDate}`
                            : `${enq.Admissionid}+${enq.PaymentDate}`
                        }
                        hover
                      >
                        <TableCell align="center" padding="none">
                          {page * rowsPerPage + index + 1}
                        </TableCell>

                        {reportType === 'all' && (
                          <>
                            <TableCell align="center">
                              {'TECH'}
                              {enq.PaymentId}
                            </TableCell>

                            <TableCell
                              align="center"
                              padding="normal"
                              sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                            >
                              {formatDate(enq.PaymentDate)}
                            </TableCell>
                          </>
                        )}

                        <TableCell align="center">
                          {'TECH'}
                          {enq.Admissionid}
                        </TableCell>

                        {reportType === 'profile' && (
                          <>
                            <TableCell
                              align="center"
                              padding="normal"
                              sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                            >
                              {formatDate(enq.PaymentDate)}
                            </TableCell>
                          </>
                        )}

                        <TableCell align="center" sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                          {enq.FirstName} {enq.LastName}
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
                          ₹ {enq.Course_Fee}
                        </TableCell>

                        <TableCell
                          align="center"
                          padding="normal"
                          sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                        >
                          ₹ {enq.OfferedFee}
                        </TableCell>

                        <TableCell
                          align="center"
                          padding="normal"
                          sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                        >
                          ₹ {enq.TotalPaidAmount}
                        </TableCell>

                        {reportType === 'all' && (
                          <>
                            <TableCell
                              align="center"
                              padding="normal"
                              sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                            >
                              ₹ {enq.BalanceFee}
                            </TableCell>

                            <TableCell
                              align="center"
                              padding="normal"
                              sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                            >
                              ₹ {enq.PaidAmount}
                            </TableCell>

                            <TableCell
                              align="center"
                              padding="normal"
                              sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                            >
                              ₹ {enq.BalanceOnDate}
                            </TableCell>

                            <TableCell
                              align="center"
                              padding="normal"
                              sx={{ textTransform: 'uppercase', whiteSpace: 'nowrap' }}
                            >
                              {enq.PayType}
                            </TableCell>

                            <TableCell
                              align="center"
                              padding="normal"
                              sx={{ textTransform: 'uppercase', whiteSpace: 'nowrap' }}
                            >
                              {enq.PayMode}
                            </TableCell>

                            <TableCell
                              align="center"
                              padding="normal"
                              sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                            >
                              {enq.Remarks}
                            </TableCell>
                          </>
                        )}
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

export default PaymentReports;
