import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import {
  Container,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Autocomplete,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormLabel,
  Stack,
  Grid,
  Snackbar,
  Alert,
  Slide,
  Dialog,
  LinearProgress,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import styled from '@emotion/styled';
import { Link, useNavigate, useParams } from 'react-router-dom';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from '../axios';

const useStyles = styled((theme) => ({
  fileInput: {
    display: 'none',
  },
  chooseFileButton: {
    marginRight: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

const StyledButton = styled(Button)({
  whiteSpace: 'nowrap',
});

const steps = ['Basic Information', 'Education Details', 'Residential Address', 'Documents', 'Complete Application'];

// Function to generate the year options dynamically
const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const options = [];
  for (let year = currentYear + 5; year >= currentYear - 15; year -= 1) {
    options.push(year.toString());
  }
  return options;
};

const generateYearOptionsSchool = () => {
  const currentYear = new Date().getFullYear();
  const options = [];
  for (let year = currentYear; year >= currentYear - 15; year -= 1) {
    options.push(year.toString());
  }
  return options;
};

function formatDate(inputDate) {
  const date = new Date(inputDate);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export default function AdmissionForm() {
  const { id } = useParams();
  const [tokent, settokent] = React.useState(
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudGxpc3QiOlt7IlVzZXJJRCI6IjEiLCJMb2dpbkNvZGUiOiIwMSIsIkxvZ2luTmFtZSI6IkFkbWluIiwiRW1haWxJZCI6ImFkbWluQGdtYWlsLmNvbSIsIlVzZXJUeXBlIjoiQURNSU4ifV0sImlhdCI6MTYzODM1NDczMX0.ZW6zEHIXTxfT-QWEzS6-GuY7bRupf2Jc_tp4fXIRabQ'
  );
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());

  // form fields variables & states
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [fatherName, setFatherName] = React.useState('');
  const [dob, setDob] = React.useState('');
  const [contactNumber, setContactNumber] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [educationLevel, setEducationLevel] = React.useState('ug');
  const [degree, setDegree] = React.useState('');
  const [collegeName, setCollegeName] = React.useState('');
  const [preferredMode, setPreferredMode] = React.useState('');
  const [preferredDays, setPreferredDays] = React.useState('');
  const [preferredTimings, setPreferredTimings] = React.useState('');
  const [prefCourseCategory, setPrefCourseCategory] = React.useState('');
  const [prefTechnology, setPrefTechnology] = React.useState('');
  const [sslcMarks, setSSLCMarks] = React.useState('');
  const [sslcYear, setSSLCYear] = React.useState('');
  const [hscMarks, setHSCMarks] = React.useState('');
  const [hscYear, setHSCYear] = React.useState('');
  const [ugMarks, setUGMarks] = React.useState();
  const [ugYear, setUGYear] = React.useState('');
  const [pgMarks, setPGMarks] = React.useState('');
  const [pgYear, setPGYear] = React.useState();
  const [working, setWorking] = React.useState('');
  const [industry, setIndustry] = React.useState('');
  const [companyName, setCompanyName] = React.useState('');
  const [refereedByName, setRefereedByName] = React.useState('');
  const [refereedByContact, setRefereedByContact] = React.useState('');
  const [cityData, setcityData] = React.useState([]);
  const [stateData, setStateData] = useState([]);
  const [collegeData, setCollegeData] = React.useState([]);
  const [degreeData, setDegreeData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [filteredCourseData, setFilteredCourseData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [filteredCityData, setFilteredCityData] = useState([]);
  const [areYouReferred, setAreYouReferred] = useState('');

  // Residential address details
  const [address1, setAddress1] = React.useState('');
  const [address2, setAddress2] = React.useState('');
  const [city, setCity] = React.useState('');
  const [state, setState] = React.useState('');
  const [pinCode, setPinCode] = React.useState('');

  // file upload
  const classes = useStyles();
  const [selectedFilePhoto, setSelectedFilePhoto] = useState('');
  const [selectedFilePan, setSelectedFilePan] = React.useState(null);
  const [selectedFileAadhaar, setSelectedFileAadhaar] = React.useState(null);
  const [selectedFileCollegeID, setSelectedFileCollegeID] = React.useState(null);
  const [newPhotoPreviewFileState, setNewPhotoPreviewFileState] = useState('');
  const [newPanPreviewFileState, setNewPanPreviewFileState] = useState('');
  const [newAadhaarPreviewFileState, setNewAadhaarPreviewFileState] = useState('');
  const [newCollegeIDPreviewFileState, setNewCollegeIDPreviewFileState] = useState('');

  const [openPreview, setOpenPreview] = useState(false);
  const [discount, setDiscount] = React.useState('');
  const [finalFee, setFinalFee] = React.useState('');
  const [selectedPreviewFile, setSelectedPreviewFile] = useState(null);

  // alert messages on operations
  const [alertType, setAlertType] = useState('success'); // 'success' or 'error'
  const [openAlert, setopenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [openLoader, setOpenLoader] = useState(false);

  // alreadyenquired
  const [alreadyEnquired, setAlreadyEnquired] = useState('n');
  const [enquiryData, setenquiryData] = useState([]);
  const [selectedEnquiryID, setselectedEnquiryID] = useState('');

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB (adjust as needed)
  const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

  const handleFileChange = (event, fileType) => {
    const file = event.target.files[0];

    // File size validation
    if (file.size > MAX_FILE_SIZE) {
      alert('File size exceeds the maximum allowed size (5 MB).');
      return;
    }

    // File type validation
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      alert('Invalid file type. Allowed types are JPEG, PNG, and PDF.');
      return;
    }

    // Update the selected file and error state based on the fileType
    if (fileType === 'photo') {
      setSelectedFilePhoto(file);
      setNewPhotoPreviewFileState(URL.createObjectURL(file));
      setFieldErrors((prevFieldErrors) => ({ ...prevFieldErrors, selectedFilePhoto: false }));
    } else if (fileType === 'pan') {
      setSelectedFilePan(file);
      setNewPanPreviewFileState(URL.createObjectURL(file));
      setFieldErrors((prevFieldErrors) => ({ ...prevFieldErrors, selectedFilePan: false }));
    } else if (fileType === 'aadhaar') {
      setSelectedFileAadhaar(file);
      setNewAadhaarPreviewFileState(URL.createObjectURL(file));
      setFieldErrors((prevFieldErrors) => ({ ...prevFieldErrors, selectedFileAadhaar: false }));
    } else if (fileType === 'collegeID') {
      setSelectedFileCollegeID(file);
      setNewCollegeIDPreviewFileState(URL.createObjectURL(file));
      setFieldErrors((prevFieldErrors) => ({ ...prevFieldErrors, selectedFileCollegeID: false }));
    }
  };

  const isImageFile = (file) => {
    const imageExtensions = /\.(jpeg|jpg|png)$/i;
    return typeof file === 'string' && imageExtensions.test(file);
  };

  const handleOpenPreview = (type) => () => {
    let selectedPreviewFile = '';

    switch (type) {
      case 'photo':
        selectedPreviewFile = newPhotoPreviewFileState;
        break;
      case 'pan':
        selectedPreviewFile = newPanPreviewFileState;
        break;
      case 'aadhaar':
        selectedPreviewFile = newAadhaarPreviewFileState;
        break;
      case 'collegeID':
        selectedPreviewFile = newCollegeIDPreviewFileState;
        break;
      default:
        break;
    }

    if (selectedPreviewFile) {
      console.log('selectedPreviewFile: ', selectedPreviewFile);
      setSelectedPreviewFile(selectedPreviewFile);
      setOpenPreview(true);
    }
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
  };

  const handleCloseAlert = () => {
    setopenAlert(false);
  };

  const [fieldErrors, setFieldErrors] = React.useState({
    // basic info step
    firstName: false,
    lastName: false,
    fatherName: false,
    dob: false,
    ageBelow18: false,
    gender: false,
    educationLevel: false,
    email: false,
    contactNumber: false,
    city: false,

    // education details step
    degree: false,
    collegeName: false,
    sslcMarks: false,
    sslcYear: false,
    hscMarks: false,
    hscYear: false,
    ugMarks: false,
    ugYear: false,
    pgMarks: false,
    pgYear: false,

    // address details
    address1: false,
    address2: false,
    pinCode: false,
    state: false,
    Stdcity: false,

    // attachments validation
    selectedFilePhoto: false,
    selectedFilePan: false,
    selectedFileAadhaar: false,
    selectedFileCollegeID: false,

    // other preferences step
    preferredMode: false,
    preferredDays: false,
    preferredTimings: false,
    prefCourseCategory: false,
    prefTechnology: false,
    discount: false,
    working: false,
    areYouReferred: false,
    companyName: false,
    industry: false,
    refereedByName: false,
    refereedByContact: false,

    alreadyEnquired: false,
    selectedEnquiryIDerr: false,
  });

  const resetFields = () => {
    setFirstName('');
    setLastName('');
    setFatherName('');
    setCity(null);
    setState(null);
    setDob('');
    setContactNumber('');
    setEmail('');
    setGender('');
    setEducationLevel('');
    setDegree(null);
    setCollegeName(null);
    setPreferredMode('');
    setPreferredDays([]);
    setPreferredTimings([]);
    setPrefCourseCategory(null);
    setPrefTechnology(null);
    setSSLCMarks('');
    setSSLCYear('');
    setHSCMarks('');
    setHSCYear('');
    setUGMarks('');
    setUGYear('');
    setPGMarks('');
    setPGYear('');
    setWorking('');
    setIndustry('');
    setCompanyName('');
    setRefereedByName('');
    setRefereedByContact('');
    setFinalFee('');
    setselectedEnquiryID('');
  };

  const navigate = useNavigate();

  const calculateMaxDate = () => {
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() - 18);
    return currentDate.toISOString().split('T')[0];
  };

  // API Integration
  React.useEffect(() => {
    getCities();
    getStates();
    getCollege();
    getDegrees();
    getCategories();
    getCourses();
    // getEnquiries();
  }, []);

  // pre fill based on selected enquiry reference
  useEffect(() => {
    const getOneDataEquiryRef = async (selectedEnquiryID) => {
      setOpenLoader(true);
      try {
        const res = await axios.instance.get(`GetOneEnquiry/${selectedEnquiryID}`, {
          headers: { Authorization: tokent, 'Content-Type': 'application/json' },
        });
        const data = res.data;
        console.log('after seleting enq id from ref: ', data);
        data.forEach((editDataonID) => {
          const {
            FirstName,
            LastName,
            FatherName,
            CityId,
            Dob,
            PhoneNumber,
            Email,
            Gender,
            GraduationType,
            DegreeId,
            CollegeId,
            PerferenceMode,
            PerferenceDay,
            PerferenceTiming,
            CourseId, // course category
            CourseTechnologyId, // course skills
            SslcPer,
            SslcPassedout,
            HscPer,
            HscPassedout,
            UGPer,
            UGPassedOut,
            PGPer,
            PGPassedOut,
            WorkingStatus,
            WorkingIndustry,
            WorkingCompany,
            ReferenceBy,
            ReferenceContactNumber,
            // Add other properties here
          } = editDataonID;
          const formattedDob = new Date(Dob).toISOString().substr(0, 10);
          const selectedCityObj = cityData.find((city) => city.CityId === CityId);
          const selectedStateObj = stateData.find((ste) => ste.StateId === selectedCityObj.StateId);
          const selectedCollegeObj = collegeData.find((clg) => clg.CollegeId === CollegeId);
          const selectedDegreeObj = degreeData.find((deg) => deg.DegreeId === DegreeId);
          const selectedCousreCategoryObj = categoryData.find((catgry) => catgry.CourseCategoryId === CourseId);
          const selectedCousreObj = courseData.find((crse) => crse.CourseId === CourseTechnologyId);
          console.log('all city:', collegeData);
          console.log('selected new', collegeData, CollegeId);
          setFirstName(FirstName);
          setLastName(LastName);
          setFatherName(FatherName);
          setCity(selectedCityObj);
          setState(selectedStateObj);
          setDob(formattedDob);
          setContactNumber(PhoneNumber);
          setEmail(Email);
          setGender(Gender);
          setEducationLevel(GraduationType);
          setDegree(selectedDegreeObj);
          setCollegeName(selectedCollegeObj);
          setPreferredMode(PerferenceMode);
          setPreferredDays(PerferenceDay);
          setPreferredTimings(PerferenceTiming);
          setPrefCourseCategory(selectedCousreCategoryObj);
          setPrefTechnology(selectedCousreObj);
          setSSLCMarks(SslcPer);
          setSSLCYear(SslcPassedout);
          setHSCMarks(HscPer);
          setHSCYear(HscPassedout);
          setUGMarks(UGPer);
          setUGYear(UGPassedOut);
          setPGMarks(PGPer);
          setPGYear(PGPassedOut);
          setWorking(WorkingStatus);
          setIndustry(WorkingIndustry);
          setCompanyName(WorkingCompany);
          setRefereedByName(ReferenceBy);
          setRefereedByContact(ReferenceContactNumber);
          setFinalFee(selectedCousreObj.Course_Fee);
        });
        console.log('After Fetching: ', data);
        setOpenLoader(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setOpenLoader(false);
      } finally {
        setOpenLoader(false);
      }
    };
    if (selectedEnquiryID) {
      getOneDataEquiryRef(selectedEnquiryID.EnquiryId);
    }
  }, [selectedEnquiryID, cityData, collegeData, courseData, categoryData, degreeData]);

  useEffect(() => {
    const getEnquiries = async () => {
      setOpenLoader(true);
      try {
        const res = await axios.instance.get('/GetallEnquiryforAdmission', {
          headers: { Authorization: tokent, 'Content-Type': 'application/json' },
        });
        setenquiryData(res.data);
        // console.log(res.data);
        // console.log(formatDateToSend(fromDateObj));
        setOpenLoader(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setOpenLoader(false);
      }
    };
    if (alreadyEnquired === 'y') getEnquiries();
  }, [alreadyEnquired]);

  // get all Cities Request
  const getCities = async () => {
    try {
      const res = await axios.instance.get('/GetAllCity', {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      setcityData(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // get all states Request
  const getStates = async () => {
    try {
      const res = await axios.instance.get('/GetAllState', {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      setStateData(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // get all collegs Request
  const getCollege = async () => {
    try {
      const res = await axios.instance.get('/GetAllCollege', {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      setCollegeData(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // get all degrees Request
  const getDegrees = async () => {
    try {
      const res = await axios.instance.get('/GetAllDegree', {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      setDegreeData(res.data);
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
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    const getOneData = async (id) => {
      setOpenLoader(true);
      try {
        const res = await axios.instance.get(`GetOneAdmission/${id}`, {
          headers: { Authorization: tokent, 'Content-Type': 'application/json' },
        });
        const data = res.data;
        data.forEach((editDataonID) => {
          const {
            FirstName,
            LastName,
            FatherName,
            Address1,
            Address2,
            CityId,
            StateId,
            ZipCode,
            doc1,
            doc2,
            doc3,
            doc4,
            Dob,
            PhoneNumber,
            Email,
            Gender,
            GraduationType,
            DegreeId,
            CollegeId,
            PerferenceMode,
            PerferenceDay,
            PerferenceTiming,
            CourseId, // course category
            CourseTechnologyId, // course skills
            SslcPer,
            SslcPassedout,
            HscPer,
            HscPassedout,
            UGPer,
            UGPassedOut,
            PGPer,
            PGPassedOut,
            WorkingStatus,
            WorkingIndustry,
            WorkingCompany,
            DiscountAmount,
            NetAmount,
            ReferenceBy,
            ReferenceContactNumber,
            // Add other properties here
          } = editDataonID;
          const formattedDob = new Date(Dob).toISOString().substr(0, 10);
          const selectedCityObj = cityData.find((city) => city.CityId === CityId);
          const selectedStateObj = stateData.find((ste) => ste.StateId === StateId);
          const selectedCollegeObj = collegeData.find((clg) => clg.CollegeId === CollegeId);
          const selectedDegreeObj = degreeData.find((deg) => deg.DegreeId === DegreeId);
          const selectedCousreCategoryObj = categoryData.find((catgry) => catgry.CourseCategoryId === CourseId);
          const selectedCousreObj = courseData.find((crse) => crse.CourseId === CourseTechnologyId);
          setFirstName(FirstName);
          setLastName(LastName);
          setFatherName(FatherName);
          setAddress1(Address1);
          setAddress2(Address2);
          setCity(selectedCityObj);
          setState(selectedStateObj);
          setPinCode(ZipCode);
          setDob(formattedDob);
          setSelectedFilePhoto(`${axios.baseURL}AdmissionDocs/${doc1}`);
          setSelectedFilePan(`${axios.baseURL}AdmissionDocs/${doc2}`);
          setSelectedFileAadhaar(`${axios.baseURL}AdmissionDocs/${doc3}`);
          setSelectedFileCollegeID(`${axios.baseURL}AdmissionDocs/${doc4}`);
          // Set new states for preview URLs
          setNewPhotoPreviewFileState(`${axios.baseURL}AdmissionDocs/${doc1}`);
          setNewPanPreviewFileState(`${axios.baseURL}AdmissionDocs/${doc2}`);
          setNewAadhaarPreviewFileState(`${axios.baseURL}AdmissionDocs/${doc3}`);
          setNewCollegeIDPreviewFileState(`${axios.baseURL}AdmissionDocs/${doc4}`);
          setDiscount(DiscountAmount);
          setFinalFee(NetAmount);
          setContactNumber(PhoneNumber);
          setEmail(Email);
          setGender(Gender);
          setEducationLevel(GraduationType);
          setDegree(selectedDegreeObj);
          setCollegeName(selectedCollegeObj);
          setPreferredMode(PerferenceMode);
          setPreferredDays(PerferenceDay);
          setPreferredTimings(PerferenceTiming);
          setPrefCourseCategory(selectedCousreCategoryObj);
          setPrefTechnology(selectedCousreObj);
          setSSLCMarks(SslcPer);
          setSSLCYear(SslcPassedout);
          setHSCMarks(HscPer);
          setHSCYear(HscPassedout);
          setUGMarks(UGPer);
          setUGYear(UGPassedOut);
          setPGMarks(PGPer);
          setPGYear(PGPassedOut);
          setWorking(WorkingStatus);
          setIndustry(WorkingIndustry);
          setCompanyName(WorkingCompany);
          setRefereedByName(ReferenceBy);
          setRefereedByContact(ReferenceContactNumber);
        });
        // console.log('After Fetching: ', data);
        setOpenLoader(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setOpenLoader(false);
      } finally {
        setOpenLoader(false);
      }
    };
    if (id) {
      getOneData(id);
    }
  }, [id, cityData, stateData, collegeData, courseData, categoryData, degreeData]);

  // post Request to Add new record
  const addNewAdmission = async (Admissiondata) => {
    setOpenLoader(true);
    // console.log(Admissiondata, 'Admissiondata');
    try {
      const res = await axios.instance.post('/InsertAdmission', Admissiondata, {
        headers: {
          Authorization: tokent,
          'Content-Type': 'multipart/form-data',
        },
      });

      // console.log(res);

      if (res.data && res.data.length > 0 && res.data[0].AdmissionId !== undefined) {
        setAlertType('success');
        setAlertMessage('Admission Done, Successfully!');
        setopenAlert(true);
        setOpenLoader(false);
        setTimeout(() => {
          navigate('/dashboard/manage_admission');
        }, 4000);
      } else if (
        res.data ===
        'Error 50001, severity 16, state 3 was raised, but no message with that error number was found in sys.messages. If error is larger than 50000, make sure the user-defined message is added using sp_addmessage.'
      ) {
        setAlertType('warning');
        setAlertMessage('Phone or email are already in use. Please provide new information.');
        setopenAlert(true);
        setOpenLoader(false);
      } else {
        setAlertType('error');
        setAlertMessage("Oops! Can't add this data...");
        setopenAlert(true);
        setOpenLoader(false);
      }
    } catch (error) {
      console.error('Error adding new Admission:', error);
      setAlertType('error');
      setAlertMessage('Failed to add the new Admission.');
      setOpenLoader(false);
      setopenAlert(true);
    }
  };

  // put Request to edit record
  const UpdateAdmission = async (id, Admissiondata) => {
    setOpenLoader(true);
    try {
      await axios.instance
        .put(`/UpdateAdmission`, Admissiondata, {
          headers: { Authorization: tokent, 'Content-Type': 'multipart/form-data' },
        })
        .then((res) => {
          if (res.data === '') {
            setopenAlert(true);
            setAlertType('success');
            setAlertMessage('Admission Details Updated, Successfully!');
            setOpenLoader(false);
            setTimeout(() => {
              navigate('/dashboard/manage_admission'); // Redirect to the desired path
            }, 2000);
          } else {
            setAlertType('error');
            setAlertMessage("Oops! Can't add this data...");
            setopenAlert(true);
            setOpenLoader(false);
          }
          // console.log(res.data);
        });
    } catch (error) {
      console.error('Error updating Admission Details:', error);
      setAlertType('error');
      setAlertMessage('Failed to update the Admission Details.');
      setopenAlert(true);
    }
  };

  // Custom validation regex patterns
  const addressRegex = /^[a-zA-Z0-9\s.,:'/()\-\x{2013}\x{2014}]{1,100}$/;
  const nameRegex = /^[A-Za-z\s]+$/;
  const contactRegex = /^\d{10}$/;
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  const marksRegex = /^(100(\.00?)?|\d{0,2}(\.\d{1,2})?)$/;
  const pincodeRegex = /^\d{6}$/;

  // Updated form validation functions
  const validateBasicInfo = () => {
    const currentDate = new Date();
    const dobDate = new Date(dob);
    const age = currentDate.getFullYear() - dobDate.getFullYear();

    const errors = {
      firstName: !nameRegex.test(firstName),
      lastName: !nameRegex.test(lastName),
      fatherName: !nameRegex.test(fatherName),
      dob: dob.trim() === '',
      alreadyEnquired: alreadyEnquired.trim() === '',
      selectedEnquiryID: alreadyEnquired === 'y' && !selectedEnquiryID,
      gender: gender.trim() === '',
      educationLevel: educationLevel.trim() === '',
      contactNumber: !contactRegex.test(contactNumber),
      email: !emailRegex.test(email),
      ageBelow18: age < 18,
    };
    setFieldErrors((prevFieldErrors) => ({ ...prevFieldErrors, ...errors }));
    return !Object.values(errors).some(Boolean);
  };

  const validateEducationDetails = () => {
    const errors = {
      degree: !degree,
      collegeName: !collegeName,
      sslcYear: !sslcYear,
      hscYear: !hscYear,
      ugYear: !ugYear,
      sslcMarks: !sslcMarks,
      hscMarks: !hscMarks,
      ugMarks: !ugMarks,
      pgYear: educationLevel === 'pg' ? !pgYear : false,
      pgMarks: educationLevel === 'pg' ? !pgMarks : false,
    };
    setFieldErrors((prevFieldErrors) => ({ ...prevFieldErrors, ...errors }));
    return !Object.values(errors).some(Boolean);
  };

  const validateAddress = () => {
    const errors = {
      address1: !addressRegex.test(address1),
      address2: !addressRegex.test(address2),
      state: !state,
      city: !city,
      pinCode: !pincodeRegex.test(pinCode),
    };
    setFieldErrors((prevFieldErrors) => ({ ...prevFieldErrors, ...errors }));
    return !Object.values(errors).some(Boolean);
  };

  const validateAttachments = () => {
    const errors = {
      selectedFilePhoto: !selectedFilePhoto,
      selectedFilePan: !selectedFilePan,
      selectedFileAadhaar: !selectedFileAadhaar,
      selectedFileCollegeID: !selectedFileCollegeID,
    };
    setFieldErrors((prevFieldErrors) => ({ ...prevFieldErrors, ...errors }));
    return !Object.values(errors).some(Boolean);
  };

  const validateOthers = () => {
    const errors = {
      preferredMode: preferredMode.trim() === '',
      preferredDays: preferredDays.trim() === '',
      preferredTimings: preferredTimings.trim() === '',
      prefCourseCategory: !prefCourseCategory.Course_Category,
      prefTechnology: !prefTechnology.Course_Name,
      working: working.trim() === '',
      areYouReferred: areYouReferred.trim() === '',
      industry: working === 'y' && industry.trim() === '',
      companyName: working === 'y' && companyName.trim() === '',
      refereedByName: areYouReferred === 'y' && refereedByName.trim() === '',
      refereedByContact: areYouReferred === 'y' && refereedByContact.trim() === '',
    };
    setFieldErrors((prevFieldErrors) => ({ ...prevFieldErrors, ...errors }));
    return !Object.values(errors).some(Boolean);
  };

  const isStepOptional = (step) => {
    return step === -1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    if (activeStep === 0 && !validateBasicInfo()) {
      return;
    }

    if (activeStep === 1 && !validateEducationDetails()) {
      return;
    }

    if (activeStep === 2 && !validateAddress()) {
      return;
    }

    if (activeStep === 3 && !validateAttachments()) {
      return;
    }

    if (activeStep === 4 && !validateOthers()) {
      return;
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  // const handleFormSubmit = () => {
  //   if (activeStep === 4 && !validateOthers()) {
  //     return;
  //   }
  //   const formData = new FormData();
  //   formData.append('AdmissionId', id);
  //   formData.append('FirstName', firstName);
  //   formData.append('LastName', lastName);
  //   formData.append('FatherName', fatherName);
  //   formData.append('Dob', dob);
  //   formData.append('PhoneNumber', contactNumber);
  //   formData.append('Email', email);
  //   formData.append('Gender', gender);
  //   formData.append('GraduationType', educationLevel);
  //   formData.append('Address1', address1);
  //   formData.append('Address2', address2);
  //   formData.append('CityId', city.CityId);
  //   formData.append('StateId', state.StateId);
  //   formData.append('ZipCode', pinCode);
  //   formData.append('doc1', selectedFilePhoto);
  //   formData.append('doc2', selectedFilePan);
  //   formData.append('doc3', selectedFileAadhaar);
  //   formData.append('doc4', selectedFileCollegeID);
  //   formData.append('DegreeId', degree.DegreeId);
  //   formData.append('CollegeId', collegeName.CollegeId);
  //   formData.append('PerferenceMode', preferredMode);
  //   formData.append('PerferenceDay', preferredDays);
  //   formData.append('PerferenceTiming', preferredTimings);
  //   formData.append('CourseId', prefCourseCategory.CourseCategoryId);
  //   formData.append('CourseTechnologyId', prefTechnology.CourseId);
  //   formData.append('SslcPer', sslcMarks);
  //   formData.append('SslcPassedout', sslcYear);
  //   formData.append('HscPer', hscMarks);
  //   formData.append('HscPassedout', hscYear);
  //   formData.append('UGPer', ugMarks);
  //   formData.append('UGPassedOut', ugYear);
  //   formData.append('PGPer', pgMarks.length !== 0 ? pgMarks : 0);
  //   formData.append('PGPassedOut', !pgYear ? 'N/A' : pgYear);
  //   formData.append('WorkingStatus', working);
  //   formData.append('WorkingIndustry', industry);
  //   formData.append('WorkingCompany', companyName);
  //   formData.append('ReferenceBy', refereedByName);
  //   formData.append('ReferenceContactNumber', refereedByContact);
  //   formData.append('DiscountAmount', discount);
  //   formData.append('NetAmount', finalFee);
  //   formData.append(!id ? 'CreatedBy' : 'Modifyby', 86);
  //   if (!id) {
  //     addNewAdmission(formData);
  //   } else {
  //     UpdateAdmission(id, formData);
  //   }
  // };

  const handleFormSubmit = () => {
    if (activeStep === 4 && !validateOthers()) {
      return;
    }
    const formData = new FormData();
    if (id) {
      formData.append('AdmissionId', id);
    }
    formData.append('FirstName', firstName);
    formData.append('LastName', lastName);
    formData.append('FatherName', fatherName);
    formData.append('Dob', dob);
    formData.append('PhoneNumber', contactNumber);
    formData.append('Email', email);
    formData.append('Gender', gender);
    formData.append('GraduationType', educationLevel);
    formData.append('Address1', address1);
    formData.append('Address2', address2);
    formData.append('CityId', city.CityId);
    formData.append('StateId', state.StateId);
    formData.append('ZipCode', pinCode);
    formData.append('doc1', selectedFilePhoto);
    formData.append('doc2', selectedFilePan);
    formData.append('doc3', selectedFileAadhaar);
    formData.append('doc4', selectedFileCollegeID);
    formData.append('DegreeId', degree.DegreeId);
    formData.append('CollegeId', collegeName.CollegeId);
    formData.append('PerferenceMode', preferredMode);
    formData.append('PerferenceDay', preferredDays);
    formData.append('PerferenceTiming', preferredTimings);
    formData.append('CourseId', prefCourseCategory.CourseCategoryId);
    formData.append('CourseTechnologyId', prefTechnology.CourseId);
    formData.append('SslcPer', sslcMarks);
    formData.append('SslcPassedout', sslcYear);
    formData.append('HscPer', hscMarks);
    formData.append('HscPassedout', hscYear);
    formData.append('UGPer', ugMarks);
    formData.append('UGPassedOut', ugYear);
    formData.append('PGPer', pgMarks.length !== 0 ? pgMarks : 0);
    formData.append('PGPassedOut', !pgYear ? 'N/A' : pgYear);
    formData.append('WorkingStatus', working);
    formData.append('WorkingIndustry', industry);
    formData.append('WorkingCompany', companyName);
    formData.append('ReferenceBy', refereedByName);
    formData.append('ReferenceContactNumber', refereedByContact);
    formData.append('DiscountAmount', discount);
    formData.append('NetAmount', finalFee);
    formData.append(!id ? 'CreatedBy' : 'Modifyby', 86);

    formData.append('EnquiryId', alreadyEnquired === 'y' ? selectedEnquiryID.EnquiryId : 0);

    if (!id) {
      addNewAdmission(formData);
    } else {
      UpdateAdmission(id, formData);
    }
  };

  const [orientation, setOrientation] = React.useState(() => {
    return window.innerWidth <= 760 ? 'vertical' : 'horizontal';
  });

  // Update orientation when the window is resized
  React.useEffect(() => {
    function handleResize() {
      setOrientation(window.innerWidth <= 760 ? 'vertical' : 'horizontal');
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleDiscountChange = (e) => {
    const courseFee = prefTechnology.Course_Fee;
    const newDiscount = e.target.value;
    if (newDiscount >= 0) {
      setDiscount(newDiscount);
      if (newDiscount > courseFee) {
        setFieldErrors((prevFieldErrors) => ({
          ...prevFieldErrors,
          discount: true,
        }));
        setFinalFee(courseFee);
      } else {
        setFieldErrors((prevFieldErrors) => ({
          ...prevFieldErrors,
          discount: false,
        }));
        setFinalFee(courseFee - newDiscount);
      }
    } else {
      setFieldErrors((prevFieldErrors) => ({
        ...prevFieldErrors,
        discount: false,
      }));
      setFinalFee(courseFee);
    }
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
      <Container maxWidth={'xl'}>
        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <Box>
            <Link to="/dashboard/manage_admission">
              <Button variant="outlined" color="info" startIcon={<KeyboardBackspaceIcon />}>
                Back
              </Button>
            </Link>
          </Box>
          <Stack
            direction={{ md: 'row', xs: 'column' }}
            justifyContent={'space-between'}
            alignItems={'center'}
            spacing={3}
            my={1}
            p={1}
          >
            <FormLabel component="legend" sx={{ fontWeight: 600, whiteSpace: 'nowrap', color: '#009688' }}>
              Have you Previously made an Enquiry?
            </FormLabel>
            <FormControl size="small" component="fieldset">
              <RadioGroup
                row
                value={alreadyEnquired}
                onChange={(e) => {
                  setAlreadyEnquired(e.target.value);
                  setFieldErrors((prevFieldErrors) => ({
                    ...prevFieldErrors,
                    alreadyEnquired: !e.target.value.trim() === '',
                  }));
                }}
              >
                <FormControlLabel value="y" control={<Radio />} label="Yes" />
                <FormControlLabel value="n" control={<Radio />} onClick={() => resetFields()} label="No" />
              </RadioGroup>
              {fieldErrors.alreadyEnquired && (
                <Typography variant="caption" color="error" sx={{ px: 1.5 }}>
                  Please select any option
                </Typography>
              )}
            </FormControl>
          </Stack>
        </Stack>
        {alreadyEnquired === 'y' && (
          <FormControl fullWidth size="small" component="fieldset" required>
            <Autocomplete
              size="small"
              options={enquiryData}
              getOptionLabel={(enq) =>
                enq
                  ? `Enquiry ID - ${enq.EnquiryId} - ${formatDate(enq.CreatedDate)} - ${enq.FirstName} ${enq.LastName} `
                  : // `Enquiry ID - ${enq.EnquiryId} & Full Name: ${enq.FirstName} ${enq.LastName}`
                    ''
              }
              isOptionEqualToValue={(option, value) => option.EnquiryId === value?.EnquiryId}
              // isOptionEqualToValue={((option, value) => option.EnquiryId === value.EnquiryId) ?? undefined}
              renderInput={(params) => <TextField {...params} label="Select Enquiry Reference" />}
              value={selectedEnquiryID}
              onChange={(e, newValue) => {
                if (newValue === null) {
                  resetFields();
                  setselectedEnquiryID(null);
                } else {
                  setselectedEnquiryID(newValue);
                  setFieldErrors((prevFieldErrors) => ({
                    ...prevFieldErrors,
                    selectedEnquiryIDerr: !newValue,
                  }));
                }
              }}
            />
            {fieldErrors.selectedEnquiryIDerr && (
              <Typography variant="caption" color="error" sx={{ m: 0.5, px: 1.5 }}>
                Please select enquiry reference
              </Typography>
            )}
          </FormControl>
        )}
        <>
          <Typography
            variant="h4"
            p={1}
            boxShadow={1}
            borderColor="#e8f5e9"
            textAlign={'center'}
            border={0.5}
            borderRadius={1}
            my={2}
            color="#009688"
          >
            Student Enrollment Application{' '}
          </Typography>

          <Box sx={{ width: '100%' }}>
            <Stepper nonLinear activeStep={activeStep} orientation={orientation}>
              {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};
                if (isStepOptional(index)) {
                  labelProps.optional = <Typography variant="caption">Optional</Typography>;
                }
                if (isStepSkipped(index)) {
                  stepProps.completed = false;
                }
                // Updated to highlight the step if there are errors in that step
                if (fieldErrors && Object.values(fieldErrors).some(Boolean) && index <= activeStep) {
                  stepProps.error = true;
                }

                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            {activeStep === steps.length ? (
              <>
                <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <Box sx={{ flex: '1 1 auto' }} />
                  <Button onClick={handleReset}>Reset</Button>
                </Box>
              </>
            ) : (
              <>
                <form onSubmit={handleFormSubmit}>
                  {activeStep === 0 && (
                    <>
                      <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', pt: 2 }}>
                        <Typography variant="h6" color="#0288d1">
                          Contact Details:
                        </Typography>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} my={1}>
                          <TextField
                            size="small"
                            fullWidth
                            label="First Name"
                            value={firstName}
                            onChange={(e) => {
                              setFirstName(e.target.value);
                              setFieldErrors((prevFieldErrors) => ({
                                ...prevFieldErrors,
                                firstName: !nameRegex.test(e.target.value),
                              }));
                            }}
                            error={fieldErrors.firstName}
                            helperText={fieldErrors.firstName && 'Enter valid name'}
                          />

                          <TextField
                            size="small"
                            fullWidth
                            label="Last Name"
                            value={lastName}
                            onChange={(e) => {
                              setLastName(e.target.value);
                              setFieldErrors((prevFieldErrors) => ({
                                ...prevFieldErrors,
                                lastName: !nameRegex.test(e.target.value),
                              }));
                            }}
                            error={fieldErrors.lastName}
                            helperText={fieldErrors.lastName && 'Enter valid name'}
                          />

                          <TextField
                            size="small"
                            fullWidth
                            label="Father Name"
                            value={fatherName}
                            onChange={(e) => {
                              setFatherName(e.target.value);
                              setFieldErrors((prevFieldErrors) => ({
                                ...prevFieldErrors,
                                fatherName: !nameRegex.test(e.target.value),
                              }));
                            }}
                            error={fieldErrors.fatherName}
                            helperText={fieldErrors.fatherName && 'Enter valid name'}
                          />
                        </Stack>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} my={1}>
                          <TextField
                            size="small"
                            fullWidth
                            type="date"
                            label="Date of Birth"
                            value={dob}
                            sx={{ pt: 2 }}
                            onChange={(e) => {
                              const newDate = e.target.value;
                              setDob(newDate);
                              // setDob(e.target.value);
                              const isValidDate = newDate.trim() !== '';
                              const isAgeBelow18 = new Date(newDate) > calculateMaxDate();
                              setFieldErrors((prevFieldErrors) => ({
                                ...prevFieldErrors,
                                dob: !isValidDate,
                                ageBelow18: isAgeBelow18,
                              }));
                            }}
                            error={fieldErrors.dob || fieldErrors.ageBelow18} // Update error condition
                            helperText={
                              (fieldErrors.dob && 'Invalid date of birth') ||
                              (fieldErrors.ageBelow18 && 'Age must be 18 or above')
                            }
                            InputLabelProps={{
                              shrink: true,
                            }}
                            inputProps={{
                              max: calculateMaxDate(),
                              // min:calculateMinDate()
                            }}
                          />
                          <FormControl size="small" fullWidth component="fieldset">
                            <FormLabel component="legend">Gender</FormLabel>
                            <RadioGroup
                              row
                              value={gender}
                              onChange={(e) => {
                                setGender(e.target.value);
                                setFieldErrors((prevFieldErrors) => ({
                                  ...prevFieldErrors,
                                  gender: !e.target.value.trim() === '',
                                }));
                              }}
                            >
                              <FormControlLabel value="m" control={<Radio />} label="Male" />
                              <FormControlLabel value="f" control={<Radio />} label="Female" />
                            </RadioGroup>
                            {fieldErrors.gender && (
                              <Typography variant="caption" color="error" sx={{ px: 1.5 }}>
                                Please select your gender
                              </Typography>
                            )}
                          </FormControl>
                          <FormControl size="small" fullWidth component="fieldset">
                            <FormLabel component="legend">UG/PG</FormLabel>
                            <RadioGroup
                              row
                              value={educationLevel}
                              onChange={(e) => {
                                setEducationLevel(e.target.value);
                                setFieldErrors((prevFieldErrors) => ({
                                  ...prevFieldErrors,
                                  educationLevel: !e.target.value.trim() === '',
                                }));
                              }}
                            >
                              <FormControlLabel value="ug" control={<Radio />} label="UG" />
                              <FormControlLabel value="pg" control={<Radio />} label="PG" />
                            </RadioGroup>
                            {fieldErrors.educationLevel && (
                              <Typography variant="caption" color="error" sx={{ m: 0, px: 1.5 }}>
                                Please select your education level
                              </Typography>
                            )}
                          </FormControl>
                        </Stack>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} my={1}>
                          <TextField
                            size="small"
                            type="number"
                            fullWidth
                            label="Contact Number"
                            value={contactNumber}
                            onChange={(e) => {
                              setContactNumber(e.target.value);
                              setFieldErrors((prevFieldErrors) => ({
                                ...prevFieldErrors,
                                contactNumber: !contactRegex.test(e.target.value),
                              }));
                            }}
                            error={fieldErrors.contactNumber}
                            helperText={fieldErrors.contactNumber && 'Enter 10 digit mobile number'}
                          />
                          <TextField
                            size="small"
                            fullWidth
                            label="Email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setFieldErrors((prevFieldErrors) => ({
                                ...prevFieldErrors,
                                email: !emailRegex.test(e.target.value),
                              }));
                            }}
                            error={fieldErrors.email}
                            helperText={fieldErrors.email && 'Enter valid email address'}
                          />
                        </Stack>
                      </Box>
                    </>
                  )}
                  {activeStep === 1 && (
                    <>
                      <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', pt: 2 }}>
                        <Typography variant="h6" color="#0288d1">
                          College:
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} my={1}>
                          <FormControl size="small" fullWidth component="fieldset" required>
                            <Autocomplete
                              size="small"
                              fullWidth
                              options={collegeData}
                              getOptionLabel={(clg) => (clg ? clg.CollegeName : '')}
                              isOptionEqualToValue={
                                ((option, value) => option?.CollegeId === value?.CollegeId) ?? undefined
                              }
                              renderInput={(params) => <TextField {...params} label="College" />}
                              value={collegeName}
                              onChange={(e, newValue) => {
                                setCollegeName(newValue);
                                setFieldErrors((prevFieldErrors) => ({
                                  ...prevFieldErrors,
                                  collegeName: !newValue,
                                }));
                              }}
                            />
                            {fieldErrors.collegeName && (
                              <Typography variant="caption" color="error" sx={{ m: 0.5, px: 1.5 }}>
                                Please select your college/university
                              </Typography>
                            )}
                          </FormControl>

                          <FormControl size="small" fullWidth component="fieldset" required>
                            <Autocomplete
                              size="small"
                              fullWidth
                              options={degreeData}
                              getOptionLabel={(deg) => (deg ? deg.DegreeName : '')}
                              isOptionEqualToValue={
                                ((option, value) => option?.DegreeId === value?.DegreeId) ?? undefined
                              }
                              renderInput={(params) => <TextField {...params} label="Degree/Stream" />}
                              value={degree}
                              onChange={(e, newValue) => {
                                setDegree(newValue);
                                setFieldErrors((prevFieldErrors) => ({
                                  ...prevFieldErrors,
                                  degree: !newValue,
                                }));
                              }}
                            />
                            {fieldErrors.degree && (
                              <Typography variant="caption" color="error" sx={{ m: 0.5, px: 1.5 }}>
                                Please select your degree/stream
                              </Typography>
                            )}
                          </FormControl>
                        </Stack>

                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                          <Grid item xs={6}>
                            <Typography variant="h6" color="#0288d1">
                              SSLC:
                            </Typography>
                            <Stack direction={{ md: 'row', xs: 'column' }} spacing={3} my={1}>
                              <TextField
                                size="small"
                                type="number"
                                fullWidth
                                label="Marks in Percentage"
                                value={sslcMarks}
                                required
                                onChange={(e) => {
                                  setSSLCMarks(e.target.value);
                                  setFieldErrors((prevFieldErrors) => ({
                                    ...prevFieldErrors,
                                    sslcMarks: !marksRegex.test(e.target.value) || !e.target.value,
                                  }));
                                }}
                                error={fieldErrors.sslcMarks}
                                helperText={fieldErrors.sslcMarks && 'Enter valid marks in percentage'}
                              />

                              <FormControl size="small" fullWidth component="fieldset" required>
                                <Autocomplete
                                  size="small"
                                  fullWidth
                                  isOptionEqualToValue={(option, value) =>
                                    !!(option && option.value && value && value.value) && option.value === value.value
                                  }
                                  options={generateYearOptionsSchool()}
                                  renderInput={(params) => <TextField {...params} label="Year of Passed Out" />}
                                  value={sslcYear}
                                  onChange={(e, newValue) => {
                                    setSSLCYear(newValue);
                                    setFieldErrors((prevFieldErrors) => ({
                                      ...prevFieldErrors,
                                      sslcYear: !newValue,
                                    }));
                                  }}
                                />
                                {fieldErrors.sslcYear && (
                                  <Typography variant="caption" color="error" sx={{ m: 0.5, px: 1.5 }}>
                                    Year of passing is required
                                  </Typography>
                                )}
                              </FormControl>
                            </Stack>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography variant="h6" color="#0288d1">
                              HSC/Diploma:
                            </Typography>
                            <Stack direction={{ md: 'row', xs: 'column' }} spacing={3} my={1}>
                              <TextField
                                size="small"
                                type="number"
                                fullWidth
                                label="Marks in Percentage"
                                value={hscMarks}
                                onChange={(e) => {
                                  setHSCMarks(e.target.value);
                                  setFieldErrors((prevFieldErrors) => ({
                                    ...prevFieldErrors,
                                    hscMarks: !marksRegex.test(e.target.value) || !e.target.value,
                                  }));
                                }}
                                error={fieldErrors.hscMarks}
                                helperText={fieldErrors.hscMarks && 'Enter valid marks in percentage'}
                              />

                              <FormControl size="small" fullWidth component="fieldset" required>
                                <Autocomplete
                                  size="small"
                                  fullWidth
                                  isOptionEqualToValue={(option, value) =>
                                    !!(option && option.value && value && value.value) && option.value === value.value
                                  }
                                  options={generateYearOptionsSchool()}
                                  renderInput={(params) => <TextField {...params} label="Year of Passed Out" />}
                                  value={hscYear}
                                  onChange={(e, newValue) => {
                                    setHSCYear(newValue);
                                    setFieldErrors((prevFieldErrors) => ({
                                      ...prevFieldErrors,
                                      hscYear: !newValue,
                                    }));
                                  }}
                                />
                                {fieldErrors.hscYear && (
                                  <Typography variant="caption" color="error" sx={{ m: 0.5, px: 1.5 }}>
                                    Year of passing is required
                                  </Typography>
                                )}
                              </FormControl>
                            </Stack>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography variant="h6" color="#0288d1">
                              UG:
                            </Typography>
                            <Stack direction={{ md: 'row', xs: 'column' }} spacing={3} my={1}>
                              <TextField
                                size="small"
                                type="number"
                                fullWidth
                                label="Marks in Percentage"
                                value={ugMarks}
                                onChange={(e) => {
                                  setUGMarks(e.target.value);
                                  setFieldErrors((prevFieldErrors) => ({
                                    ...prevFieldErrors,
                                    ugMarks: !marksRegex.test(e.target.value) || !e.target.value,
                                  }));
                                }}
                                error={fieldErrors.ugMarks}
                                helperText={fieldErrors.ugMarks && 'Enter valid marks in percentage'}
                              />
                              <FormControl size="small" fullWidth component="fieldset" required>
                                <Autocomplete
                                  size="small"
                                  fullWidth
                                  isOptionEqualToValue={(option, value) =>
                                    !!(option && option.value && value && value.value) && option.value === value.value
                                  }
                                  options={generateYearOptions()}
                                  renderInput={(params) => <TextField {...params} label="Year of Passed Out" />}
                                  value={ugYear}
                                  onChange={(e, newValue) => {
                                    setUGYear(newValue);
                                    setFieldErrors((prevFieldErrors) => ({
                                      ...prevFieldErrors,
                                      ugYear: !newValue,
                                    }));
                                  }}
                                />
                                {fieldErrors.ugYear && (
                                  <Typography variant="caption" color="error" sx={{ m: 0.5, px: 1.5 }}>
                                    Year of passing is required
                                  </Typography>
                                )}
                              </FormControl>
                            </Stack>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography variant="h6" color="#0288d1">
                              PG:
                            </Typography>
                            <Stack direction={{ md: 'row', xs: 'column' }} spacing={3} my={1}>
                              <TextField
                                size="small"
                                type="number"
                                fullWidth
                                label="Marks in Percentage"
                                value={pgMarks}
                                onChange={(e) => {
                                  setPGMarks(e.target.value);
                                  setFieldErrors((prevFieldErrors) => ({
                                    ...prevFieldErrors,
                                    pgMarks: educationLevel === 'pg' ? !marksRegex.test(e.target.value) : false,
                                  }));
                                }}
                                error={fieldErrors.pgMarks}
                                helperText={fieldErrors.pgMarks && 'Enter valid marks in percentage'}
                              />

                              <FormControl size="small" fullWidth component="fieldset" required>
                                <Autocomplete
                                  size="small"
                                  fullWidth
                                  isOptionEqualToValue={(option, value) =>
                                    !!(option && option.value && value && value.value) && option.value === value.value
                                  }
                                  options={generateYearOptions()}
                                  renderInput={(params) => <TextField {...params} label="Year of Passed Out" />}
                                  value={pgYear}
                                  onChange={(e, newValue) => {
                                    setPGYear(newValue);
                                    setFieldErrors((prevFieldErrors) => ({
                                      ...prevFieldErrors,
                                      pgYear: educationLevel === 'pg' ? !newValue : false,
                                    }));
                                  }}
                                />
                                {fieldErrors.pgYear && (
                                  <Typography variant="caption" color="error" sx={{ m: 0.5, px: 1.5 }}>
                                    Year of passing is required
                                  </Typography>
                                )}
                              </FormControl>
                            </Stack>
                          </Grid>
                        </Grid>
                      </Box>
                    </>
                  )}
                  {activeStep === 2 && (
                    <>
                      <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', pt: 2 }}>
                        <Typography variant="h6" color="#0288d1" sx={{ py: 1 }}>
                        Residential Address :
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} my={1}>
                          <TextField
                            size="small"
                            fullWidth
                            label="Address line 1"
                            value={address1}
                            onChange={(e) => {
                              setAddress1(e.target.value);
                              setFieldErrors((prevFieldErrors) => ({
                                ...prevFieldErrors,
                                address1: !addressRegex.test(e.target.value),
                              }));
                            }}
                            error={fieldErrors.address1}
                            helperText={fieldErrors.address1 && 'Enter Address Line 1'}
                          />
                          <TextField
                            size="small"
                            fullWidth
                            label="Address line 2"
                            value={address2}
                            onChange={(e) => {
                              setAddress2(e.target.value);
                              setFieldErrors((prevFieldErrors) => ({
                                ...prevFieldErrors,
                                address2: !addressRegex.test(e.target.value),
                              }));
                            }}
                            error={fieldErrors.address2}
                            helperText={fieldErrors.address2 && 'Enter Address Line 1'}
                          />
                        </Stack>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} my={1}>
                          <FormControl size="small" fullWidth component="fieldset" required>
                            <Autocomplete
                              size="small"
                              fullWidth
                              options={stateData}
                              getOptionLabel={(state) => (state ? state.StateName : '')}
                              isOptionEqualToValue={
                                ((option, value) => option?.StateId === value?.StateId) ?? undefined
                              }
                              renderInput={(params) => <TextField {...params} label="State/Province" />}
                              value={state}
                              onChange={(e, newValue) => {
                                setState(newValue);
                                const citiesInSelectedState = cityData.filter(
                                  (city) => city.StateId === newValue.StateId
                                );
                                // console.log('selected state:', newValue);
                                setFilteredCityData(citiesInSelectedState);
                                // console.log('based on selected state: ', cityData);
                                setCity(null);
                                setFieldErrors((prevFieldErrors) => ({
                                  ...prevFieldErrors,
                                  state: !newValue,
                                }));
                              }}
                            />
                            {fieldErrors.state && (
                              <Typography variant="caption" color="error" sx={{ m: 0.5, px: 1.5 }}>
                                Please select the State/Province
                              </Typography>
                            )}
                          </FormControl>

                          <FormControl size="small" fullWidth component="fieldset" required>
                            <Autocomplete
                              size="small"
                              fullWidth
                              options={filteredCityData}
                              getOptionLabel={(city) => (city ? city.CityName : '')}
                              isOptionEqualToValue={((option, value) => option?.CityId === value?.CityId) ?? undefined}
                              renderInput={(params) => <TextField {...params} label="City" />}
                              value={city}
                              onChange={(e, newValue) => {
                                setCity(newValue);
                                setFieldErrors((prevFieldErrors) => ({
                                  ...prevFieldErrors,
                                  city: !newValue,
                                }));
                                // console.log('selected city:', newValue);
                              }}
                            />
                            {fieldErrors.city && (
                              <Typography variant="caption" color="error" sx={{ m: 0.5, px: 1.5 }}>
                                Please select the city
                              </Typography>
                            )}
                          </FormControl>
                          <TextField
                            size="small"
                            type="number"
                            fullWidth
                            label="Zip/PostalCode"
                            value={pinCode}
                            onChange={(e) => {
                              setPinCode(e.target.value);
                              setFieldErrors((prevFieldErrors) => ({
                                ...prevFieldErrors,
                                pinCode: !pincodeRegex.test(e.target.value),
                              }));
                            }}
                            error={fieldErrors.pinCode}
                            helperText={fieldErrors.pinCode && 'Enter 6 digit valid pincode'}
                          />
                        </Stack>
                      </Box>
                    </>
                  )}
                  {activeStep === 3 && (
                    <>
                      <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', pt: 2 }}>
                        <Typography variant="h6" color="#0288d1">
                          Upload Documents:
                        </Typography>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                          <Grid item xs={12} md={6}>
                            <Stack direction={'column'} spacing={2} my={1}>
                              {/* <FormLabel>Photo:</FormLabel> */}
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                                border={1}
                                borderRadius={1}
                                borderColor="#e0e0e0"
                                p={1}
                                justifyContent="space-between"
                              >
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <Box>
                                    <label htmlFor="fileInput">
                                      <StyledButton
                                        fullWidth
                                        component="span"
                                        className={classes.chooseFileButton}
                                        variant="outlined"
                                        size="small"
                                        startIcon={<AttachFileIcon />}
                                      >
                                        {selectedFilePhoto ? 'Change Photo' : 'Choose Photo:'}
                                      </StyledButton>
                                      <input
                                        className={classes.fileInput}
                                        id="fileInput"
                                        type="file"
                                        onChange={(event) => {
                                          handleFileChange(event, 'photo');
                                        }}
                                        style={{ display: 'none' }}
                                      />
                                    </label>
                                  </Box>
                                  <Typography textTransform={'capitalize'} variant="caption" color="inherit">
                                    {selectedFilePhoto ? selectedFilePhoto.name : 'No file chosen'}
                                  </Typography>
                                </Stack>
                                {selectedFilePhoto && (
                                  <Button variant="outlined" size="small" onClick={handleOpenPreview('photo')}>
                                    Preview
                                  </Button>
                                )}
                              </Stack>
                            </Stack>
                            {fieldErrors.selectedFilePan && (
                              <Typography variant="caption" color="error" sx={{ m: 0.5, px: 1.5 }}>
                                Please attach the photo
                              </Typography>
                            )}
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Stack direction={'column'} spacing={2} my={1}>
                              {/* <FormLabel>Photo:</FormLabel> */}
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                                border={1}
                                borderRadius={1}
                                borderColor="#e0e0e0"
                                p={1}
                                justifyContent="space-between"
                              >
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <Box>
                                    <label htmlFor="fileInputPan">
                                      <StyledButton
                                        fullWidth
                                        component="span"
                                        className={classes.chooseFileButton}
                                        variant="outlined"
                                        size="small"
                                        startIcon={<AttachFileIcon />}
                                      >
                                        {selectedFilePan ? 'Change pancard' : 'Choose pancard:'}
                                      </StyledButton>
                                      <input
                                        className={classes.fileInput}
                                        id="fileInputPan"
                                        type="file"
                                        onChange={(event) => handleFileChange(event, 'pan')}
                                        style={{ display: 'none' }}
                                      />
                                    </label>
                                  </Box>
                                  <Typography textTransform={'capitalize'} variant="caption" color="inherit">
                                    {selectedFilePan ? selectedFilePan.name : 'No file chosen'}
                                  </Typography>
                                </Stack>
                                {selectedFilePan && (
                                  <Button variant="outlined" size="small" onClick={handleOpenPreview('pan')}>
                                    Preview
                                  </Button>
                                )}
                              </Stack>
                            </Stack>
                            {fieldErrors.selectedFilePan && (
                              <Typography variant="caption" color="error" sx={{ m: 0.5, px: 1.5 }}>
                                Please attach your pancard
                              </Typography>
                            )}
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Stack direction={'column'} spacing={2} my={1}>
                              {/* <FormLabel>Photo:</FormLabel> */}
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                                border={1}
                                borderRadius={1}
                                borderColor="#e0e0e0"
                                p={1}
                                justifyContent="space-between"
                              >
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <Box>
                                    <label htmlFor="fileInputAadhaar">
                                      <StyledButton
                                        fullWidth
                                        component="span"
                                        className={classes.chooseFileButton}
                                        variant="outlined"
                                        size="small"
                                        startIcon={<AttachFileIcon />}
                                      >
                                        {selectedFileAadhaar ? 'Change aadhaar' : 'Choose aadhaar:'}
                                      </StyledButton>
                                      <input
                                        className={classes.fileInput}
                                        id="fileInputAadhaar"
                                        type="file"
                                        onChange={(event) => handleFileChange(event, 'aadhaar')}
                                        style={{ display: 'none' }}
                                      />
                                    </label>
                                  </Box>
                                  <Typography textTransform={'capitalize'} variant="caption" color="inherit">
                                    {selectedFileAadhaar ? selectedFileAadhaar.name : 'No file chosen'}
                                  </Typography>
                                </Stack>
                                {selectedFileAadhaar && (
                                  <Button variant="outlined" size="small" onClick={handleOpenPreview('aadhaar')}>
                                    Preview
                                  </Button>
                                )}
                              </Stack>
                            </Stack>
                            {fieldErrors.selectedFileAadhaar && (
                              <Typography variant="caption" color="error" sx={{ m: 0.5, px: 1.5 }}>
                                Please select your aadhaar card
                              </Typography>
                            )}
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Stack direction={'column'} spacing={2} my={1}>
                              {/* <FormLabel>Photo:</FormLabel> */}
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                                border={1}
                                borderRadius={1}
                                borderColor="#e0e0e0"
                                p={1}
                                justifyContent="space-between"
                              >
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <Box>
                                    <label htmlFor="fileInputCollegeID">
                                      <StyledButton
                                        fullWidth
                                        component="span"
                                        className={classes.chooseFileButton}
                                        variant="outlined"
                                        size="small"
                                        startIcon={<AttachFileIcon />}
                                      >
                                        {selectedFileCollegeID ? 'Change college ID' : 'Choose college ID:'}
                                      </StyledButton>
                                      <input
                                        className={classes.fileInput}
                                        id="fileInputCollegeID"
                                        type="file"
                                        onChange={(event) => handleFileChange(event, 'collegeID')}
                                        style={{ display: 'none' }}
                                      />
                                    </label>
                                  </Box>
                                  <Typography textTransform={'capitalize'} variant="caption" color="inherit">
                                    {selectedFileCollegeID ? selectedFileCollegeID.name : 'No file chosen'}
                                  </Typography>
                                </Stack>
                                {selectedFileCollegeID && (
                                  <Button variant="outlined" size="small" onClick={handleOpenPreview('collegeID')}>
                                    Preview
                                  </Button>
                                )}
                              </Stack>
                            </Stack>
                            {fieldErrors.selectedFileCollegeID && (
                              <Typography variant="caption" color="error" sx={{ m: 0.5, px: 1.5 }}>
                                Please attach your college id card
                              </Typography>
                            )}
                          </Grid>
                          {/* Dialog for previewing the selected file */}
                          <Dialog open={openPreview} onClose={handleClosePreview}>
                            <DialogTitle>File Preview</DialogTitle>
                            <DialogContent>
                              {selectedPreviewFile ? (
                                // Check if the selected file is an image file
                                isImageFile(selectedPreviewFile) ? (
                                  // If it's an image, render the image preview
                                  <img
                                    src={selectedPreviewFile}
                                    // src={URL.createObjectURL(selectedPreviewFile)}
                                    alt="Preview"
                                    style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
                                  />
                                ) : (
                                  <iframe
                                    src={selectedPreviewFile}
                                    title="PDF Preview"
                                    style={{ width: '100%', height: '500px', border: 'none' }}
                                  />
                                )
                              ) : (
                                // If no file is selected for preview, display a message
                                <Typography>No file selected for preview.</Typography>
                              )}
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={handleClosePreview} color="primary">
                                Close
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </Grid>
                      </Box>
                    </>
                  )}
                  {activeStep === 4 && (
                    <>
                      <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', pt: 2 }}>
                        <Typography variant="h6" color="#0288d1">
                          Preferences:
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} my={1}>
                          <FormControl size="small" fullWidth>
                            <InputLabel id="Preferredmode">Preferred Mode</InputLabel>
                            <Select
                              labelId="Preferredmode"
                              id="Preferredmode"
                              value={preferredMode}
                              label="Preferred Mode"
                              onChange={(e) => {
                                setPreferredMode(e.target.value);
                                setFieldErrors((prevFieldErrors) => ({
                                  ...prevFieldErrors,
                                  preferredMode: !e.target.value,
                                }));
                              }}
                            >
                              <MenuItem value={'online'}>Online</MenuItem>
                              <MenuItem value={'offline'}>Offline</MenuItem>
                            </Select>
                            {fieldErrors.preferredMode && (
                              <Typography variant="caption" color="error" sx={{ m: 0.5, px: 1.5 }}>
                                Select any preference
                              </Typography>
                            )}
                          </FormControl>

                          <FormControl size="small" fullWidth>
                            <InputLabel id="preferredDays">Preferred Days</InputLabel>
                            <Select
                              labelId="preferredDays"
                              id="preferredDays"
                              value={preferredDays}
                              label="Preferred Days"
                              onChange={(e) => {
                                setPreferredDays(e.target.value);
                                setFieldErrors((prevFieldErrors) => ({
                                  ...prevFieldErrors,
                                  preferredDays: !e.target.value,
                                }));
                              }}
                            >
                              <MenuItem value={'weekend'}>Weekend</MenuItem>
                              <MenuItem value={'weekdays'}>Weekdays</MenuItem>
                            </Select>
                            {fieldErrors.preferredDays && (
                              <Typography variant="caption" color="error" sx={{ m: 0.5, px: 1.5 }}>
                                Select any preference
                              </Typography>
                            )}
                          </FormControl>
                          <FormControl size="small" fullWidth>
                            <InputLabel id="preferredTimings">Preferred Timings</InputLabel>
                            <Select
                              labelId="preferredTimings"
                              id="preferredTimings"
                              value={preferredTimings}
                              label="Preferred Timings"
                              onChange={(e) => {
                                setPreferredTimings(e.target.value);
                                setFieldErrors((prevFieldErrors) => ({
                                  ...prevFieldErrors,
                                  preferredTimings: !e.target.value,
                                }));
                              }}
                            >
                              <MenuItem value="morning">Morning</MenuItem>
                              <MenuItem value="afternoon">Afternoon</MenuItem>
                              <MenuItem value="evening">Evening</MenuItem>
                            </Select>
                            {fieldErrors.preferredTimings && (
                              <Typography variant="caption" color="error" sx={{ m: 0.5, px: 1.5 }}>
                                Select any preference
                              </Typography>
                            )}
                          </FormControl>
                        </Stack>

                        <Stack direction={{ md: 'row', xs: 'column' }} spacing={3} my={1}>
                          <FormControl size="small" fullWidth component="fieldset" required>
                            <Autocomplete
                              size="small"
                              fullWidth
                              options={categoryData}
                              getOptionLabel={(ctgry) => (ctgry ? ctgry.Course_Category : '')}
                              isOptionEqualToValue={(option, value) =>
                                option.CourseCategoryId === value.CourseCategoryId
                              }
                              renderInput={(params) => <TextField {...params} label="Preferred Course" />}
                              value={prefCourseCategory}
                              onChange={(e, newValue) => {
                                setPrefCourseCategory(newValue);

                                if (!newValue) {
                                  setPrefTechnology('');
                                  setFinalFee('');
                                  setFieldErrors((prevFieldErrors) => ({
                                    ...prevFieldErrors,
                                    prefCourseCategory: true,
                                    prefTechnology: true,
                                  }));
                                  setDiscount('');
                                } else {
                                  const coursesInSelectedState = courseData.filter(
                                    (crs) => crs.CourseCategoryId === newValue.CourseCategoryId
                                  );
                                  setFilteredCourseData(coursesInSelectedState);
                                  setPrefTechnology('');
                                  setFinalFee('');
                                  setFieldErrors((prevFieldErrors) => ({
                                    ...prevFieldErrors,
                                    prefCourseCategory: false,
                                    prefTechnology: true,
                                  }));
                                }
                              }}
                            />
                            {fieldErrors.prefCourseCategory && (
                              <Typography variant="caption" color="error" sx={{ m: 0.5, px: 1.5 }}>
                                Select preferred course category
                              </Typography>
                            )}
                          </FormControl>

                          <FormControl size="small" fullWidth component="fieldset" required>
                            <Autocomplete
                              size="small"
                              fullWidth
                              options={filteredCourseData}
                              getOptionLabel={(crs) => (crs ? crs.Course_Name : '')}
                              isOptionEqualToValue={
                                ((option, value) => option?.CourseId === value?.CourseId) ?? undefined
                              }
                              renderInput={(params) => <TextField {...params} label="Preferred Technology" />}
                              value={prefTechnology}
                              onChange={(e, newValue) => {
                                setPrefTechnology(newValue);
                                if (newValue) {
                                  setFinalFee(newValue.Course_Fee);
                                  setFieldErrors((prevFieldErrors) => ({
                                    ...prevFieldErrors,
                                    prefTechnology: false,
                                  }));
                                } else {
                                  setFinalFee('');
                                  setFieldErrors((prevFieldErrors) => ({
                                    ...prevFieldErrors,
                                    prefTechnology: true,
                                  }));
                                }
                                setDiscount('');
                              }}
                            />
                            {fieldErrors.prefTechnology && (
                              <Typography variant="caption" color="error" sx={{ m: 0.5, px: 1.5 }}>
                                Select preferred technology
                              </Typography>
                            )}
                          </FormControl>

                          <TextField
                            fullWidth
                            type="number"
                            size="small"
                            label="Discount in INR (if applicable):"
                            value={discount}
                            onChange={handleDiscountChange}
                            error={fieldErrors.discount}
                            helperText={fieldErrors.discount && 'Discount cannot exceed course fee'}
                          />
                        </Stack>

                        {prefTechnology && (
                          <Stack
                            direction={'row'}
                            justifyContent={'space-evenly'}
                            alignItems={'center'}
                            spacing={3}
                            my={1}
                            border={1}
                            borderRadius={1}
                            p={1}
                          >
                            <Typography fullWidth variant="h6" color="#00695c">
                              Course Fee : ₹ {prefTechnology.Course_Fee}
                            </Typography>
                            <Typography fullWidth variant="h6" color={'#00695c'}>
                              Course Duration: {prefTechnology.Course_Duration}
                            </Typography>

                            <Typography variant="h6" color={'#00695c'}>
                              Final Fee After Discount : ₹ {finalFee ?? prefTechnology.Course_Fee}
                              {/* Final Fee After Discount : ₹ {finalFee ? finalFee : prefTechnology.Course_Fee} */}
                            </Typography>
                          </Stack>
                        )}
                        <Stack direction={{ md: 'row', xs: 'column' }} spacing={3} my={1}>
                          <FormControl size="small" fullWidth component="fieldset">
                            <FormLabel component="legend">Are You Working Professional?</FormLabel>
                            <RadioGroup
                              row
                              value={working}
                              onChange={(e) => {
                                setWorking(e.target.value);
                                setFieldErrors((prevFieldErrors) => ({
                                  ...prevFieldErrors,
                                  working: !e.target.value.trim() === '',
                                }));
                              }}
                            >
                              <FormControlLabel value="y" control={<Radio />} label="Yes" />
                              <FormControlLabel value="n" control={<Radio />} label="No" />
                            </RadioGroup>
                            {fieldErrors.working && (
                              <Typography variant="caption" color="error" sx={{ px: 1.5 }}>
                                Please select any option
                              </Typography>
                            )}
                          </FormControl>

                          <FormControl size="small" fullWidth component="fieldset">
                            <FormLabel component="legend">Are You Referred by Someone?</FormLabel>
                            <RadioGroup
                              row
                              value={areYouReferred}
                              onChange={(e) => {
                                setAreYouReferred(e.target.value);
                                setFieldErrors((prevFieldErrors) => ({
                                  ...prevFieldErrors,
                                  areYouReferred: !e.target.value.trim() === '',
                                }));
                              }}
                            >
                              <FormControlLabel value="y" control={<Radio />} label="Yes" />
                              <FormControlLabel value="n" control={<Radio />} label="No" />
                            </RadioGroup>
                            {fieldErrors.areYouReferred && (
                              <Typography variant="caption" color="error" sx={{ px: 1.5 }}>
                                Please select any option
                              </Typography>
                            )}
                          </FormControl>
                        </Stack>
                        {working === 'y' && (
                          <>
                            <Stack direction={{ md: 'row', xs: 'column' }} spacing={3} my={1}>
                              <TextField
                                size="small"
                                fullWidth
                                label="Industry"
                                value={industry}
                                onChange={(e) => {
                                  setIndustry(e.target.value);
                                  setFieldErrors((prevFieldErrors) => ({
                                    ...prevFieldErrors,
                                    industry: e.target.value.trim() === '',
                                  }));
                                }}
                                error={fieldErrors.industry}
                                helperText={fieldErrors.industry && 'Industry is required'}
                              />

                              <TextField
                                size="small"
                                fullWidth
                                label="Company Name"
                                value={companyName}
                                onChange={(e) => {
                                  setCompanyName(e.target.value);
                                  setFieldErrors((prevFieldErrors) => ({
                                    ...prevFieldErrors,
                                    companyName: e.target.value.trim() === '',
                                  }));
                                }}
                                error={fieldErrors.companyName}
                                helperText={fieldErrors.companyName && 'Company name is required'}
                              />
                            </Stack>
                          </>
                        )}

                        {areYouReferred === 'y' && (
                          <Stack direction={{ md: 'row', xs: 'column' }} spacing={3} my={1}>
                            <TextField
                              size="small"
                              fullWidth
                              label="Referred By Name"
                              value={refereedByName}
                              onChange={(e) => {
                                setRefereedByName(e.target.value);
                                setFieldErrors((prevFieldErrors) => ({
                                  ...prevFieldErrors,
                                  refereedByName: !nameRegex.test(e.target.value),
                                }));
                              }}
                              error={fieldErrors.refereedByName}
                              helperText={fieldErrors.refereedByName && 'Enter valid name'}
                            />
                            <TextField
                              size="small"
                              type="number"
                              fullWidth
                              label="Referred By Contact Number"
                              value={refereedByContact}
                              onChange={(e) => {
                                setRefereedByContact(e.target.value);
                                setFieldErrors((prevFieldErrors) => ({
                                  ...prevFieldErrors,
                                  refereedByContact: !contactRegex.test(e.target.value),
                                }));
                              }}
                              error={fieldErrors.refereedByContact}
                              helperText={fieldErrors.refereedByContact && 'Enter 10 digit mobile number'}
                            />
                          </Stack>
                        )}
                      </Box>
                    </>
                  )}
                  <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                      Back
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    {isStepOptional(activeStep) && (
                      <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                        Skip
                      </Button>
                    )}
                    {activeStep === steps.length - 1 ? (
                      <Button
                        onClick={handleFormSubmit}
                        color="primary"
                        endIcon={<CheckCircleIcon />}
                        variant="contained"
                      >
                        Submit Application
                      </Button>
                    ) : (
                      <Button onClick={handleNext}>Next</Button>
                    )}
                  </Box>
                </form>
              </>
            )}
          </Box>
        </>
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
}
