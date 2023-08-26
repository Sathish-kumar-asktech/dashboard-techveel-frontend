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
} from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import DirectAdmission from './DirectAdmission';
import axios from '../axios';
import AdmissionForm from './AdmissionDirect';
// import AdmissionForm from './Admission';

const steps = ['Basic Information', 'Education Details', 'Other Preferences'];

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

export default function Enquiry() {
  const { id } = useParams();
  console.log('from url', id);
  const [tokent, settokent] = React.useState(
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudGxpc3QiOlt7IlVzZXJJRCI6IjEiLCJMb2dpbkNvZGUiOiIwMSIsIkxvZ2luTmFtZSI6IkFkbWluIiwiRW1haWxJZCI6ImFkbWluQGdtYWlsLmNvbSIsIlVzZXJUeXBlIjoiQURNSU4ifV0sImlhdCI6MTYzODM1NDczMX0.ZW6zEHIXTxfT-QWEzS6-GuY7bRupf2Jc_tp4fXIRabQ'
  );
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [formType, setFormType] = React.useState('enquiry');

  // form fields variables & states
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [fatherName, setFatherName] = React.useState('');
  const [city, setCity] = React.useState('');
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
  const [areYouReferred, setAreYouReferred] = useState('');

  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  const calculateMaxDate = () => {
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() - 18);
    return currentDate.toISOString().split('T')[0];
  };

  const [cityData, setcityData] = React.useState([]);
  const [collegeData, setCollegeData] = React.useState([]);
  const [degreeData, setDegreeData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [filteredCourseData, setFilteredCourseData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  // alert messages on operations
  const [alertType, setAlertType] = useState('success'); // 'success' or 'error'
  const [openAlert, setopenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [openLoader, setOpenLoader] = useState(false);

  const handleCloseAlert = () => {
    setopenAlert(false);
  };

  const resetFields = () => {
    setFirstName('');
    setLastName('');
    setFatherName('');
    setCity(null);
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

    // other preferences step
    preferredMode: false,
    preferredDays: false,
    preferredTimings: false,
    prefCourseCategory: false,
    prefTechnology: false,
    working: false,
    companyName: false,
    industry: false,
    refereedByName: false,
    refereedByContact: false,
    areYouReferred: false,
  });
  const navigate = useNavigate();

  // API Integration
  React.useEffect(() => {
    getCities();
    getCollege();
    getDegrees();
    getCategories();
    getCourses();
  }, []);

  // get all Cities Request
  const getCities = async () => {
    try {
      const res = await axios.instance.get('/GetAllCity', {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      });
      setcityData(res.data);
      // console.log('cityData:', cityData);
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
      // console.log(res.data);
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
      // console.log(res.data);
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

  useEffect(() => {
    const getOneData = async (id) => {
      setOpenLoader(true);
      try {
        const res = await axios.instance.get(`GetOneEnquiry/${id}`, {
          headers: { Authorization: tokent, 'Content-Type': 'application/json' },
        });
        const data = res.data;
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
          if (!ReferenceContactNumber) {
            setAreYouReferred('n');
          } else {
            setAreYouReferred('y');
          }
          setRefereedByName(ReferenceBy);
          setRefereedByContact(ReferenceContactNumber);
          // Set other properties using their respective set functions
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
    if (id) {
      getOneData(id);
    }
  }, [id, cityData, collegeData, courseData, categoryData, degreeData]);

  // post Request to Add new record
  const addNewEnquiry = (Enquirydata) => {
    // setOpenLoader(true); // Set loader to true initially
    axios.instance
      .post('/InsertEnquiry', Enquirydata, {
        headers: { Authorization: tokent, 'Content-Type': 'application/json' },
      })
      .then((res) => {
        if (res.data && res.data.length > 0 && res.data[0].EnquiryId !== undefined) {
          setAlertType('success');
          setAlertMessage('New Enquiry Done, Successfully!');
          setopenAlert(true);  
          resetFields();
          // Wait for a short delay for the user to see the success message
          setTimeout(() => {
            setopenAlert(false); // Hide the alert
            setOpenLoader(false); // Set loader to false
            navigate('/dashboard/manage_enquiry'); // Redirect
          }, 2000);           
        } else if (
          res.data ===
          'Error 50001, severity 16, state 3 was raised, but no message with that error number was found in sys.messages. If error is larger than 50000, make sure the user-defined message is added using sp_addmessage.'
        ) {
          setAlertType('warning');
          setAlertMessage('Phone or email are already in use. Please provide new information.');
          setopenAlert(true);
        } else {
          setAlertType('error');
          setAlertMessage("Oops! Can't add this data...");
          setopenAlert(true);
        }
        setOpenLoader(false);
      })
      .catch((error) => {
        console.error('Error adding new Enquiry:', error);
        setAlertType('error');
        setAlertMessage('Failed to add the new Enquiry.');
        setOpenLoader(false); // Set loader to false in case of error
      });
  };

  // const addNewEnquiry = async (Enquirydata) => {
  //   // setOpenLoader(true);
  //   try {
  //     const res = await axios.instance.post('/InsertEnquiry', Enquirydata, {
  //       headers: { Authorization: tokent, 'Content-Type': 'application/json' },
  //     });
  //     if (res.data && res.data.length > 0 && res.data[0].EnquiryId !== undefined) {
  //       setAlertType('success');
  //       setAlertMessage('New Enquiry Done, Successfully!');
  //       setopenAlert(true);
  //       setOpenLoader(false);
  //       setTimeout(() => {
  //         navigate('/dashboard/manage_enquiry'); // Redirect to the desired path
  //       }, 4000);
  //     } else if (
  //       res.data ===
  //       'Error 50001, severity 16, state 3 was raised, but no message with that error number was found in sys.messages. If error is larger than 50000, make sure the user-defined message is added using sp_addmessage.'
  //     ) {
  //       setAlertType('warning');
  //       setAlertMessage('Phone or email are already in use. Please provide new information.');
  //       setopenAlert(true);
  //       setOpenLoader(false);
  //     } else {
  //       setAlertType('error');
  //       setAlertMessage("Oops! Can't add this data...");
  //       setopenAlert(true);
  //       setOpenLoader(false);
  //     }
  //   } catch (error) {
  //     console.error('Error adding new Enquiry:', error);
  //     setAlertType('error');
  //     setAlertMessage('Failed to add the new Enquiry.');
  //     setOpenLoader(false);
  //     setopenAlert(true);
  //   }
  // };

  // put Request to edit record
 
  const UpdateEnquiry = async (id, Enquirydata) => {
    setOpenLoader(true);
    try {
      await axios.instance
        .put(`/UpdateEnquiry/${id}`, Enquirydata, {
          headers: { Authorization: tokent, 'Content-Type': 'application/json' },
        })
        .then((res) => {
          if (res.data === '') {
            setopenAlert(true);
            setAlertType('success');
            setAlertMessage('Enquiry Details Updated, Successfully!');
            setOpenLoader(false);
            setTimeout(() => {
              navigate('/dashboard/manage_enquiry'); // Redirect to the desired path
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
      console.error('Error updating Enquiry Details:', error);
      setAlertType('error');
      setAlertMessage('Failed to update the Enquiry Details.');
      setopenAlert(true);
    }
  };

  // Custom validation regex patterns
  const nameRegex = /^[A-Za-z\s]+$/;
  const contactRegex = /^\d{10}$/;
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  const marksRegex = /^(100(\.00?)?|\d{0,2}(\.\d{1,2})?)$/;

  // Updated form validation functions
  const validateBasicInfo = () => {
    const currentDate = new Date();
    const dobDate = new Date(dob);
    const age = currentDate.getFullYear() - dobDate.getFullYear();

    const errors = {
      firstName: !nameRegex.test(firstName),
      lastName: !nameRegex.test(lastName),
      fatherName: !nameRegex.test(fatherName),
      city: !city,
      dob: dob.trim() === '',
      gender: gender.trim() === '',
      educationLevel: educationLevel.trim() === '',
      contactNumber: !contactRegex.test(contactNumber),
      email: !emailRegex.test(email),
      ageBelow18: age < 18,
    };
    setFieldErrors((prevFieldErrors) => ({ ...prevFieldErrors, ...errors }));
    // console.log(errors);
    return !Object.values(errors).some(Boolean);
  };

  const validateEducationDetails = () => {
    const errors = {
      degree: !degree,
      collegeName: !collegeName,
      sslcYear: !sslcYear,
      hscYear: !hscYear,
      ugYear: !ugYear,
      // degree: degree.DegreeName.trim() === '',
      // collegeName: collegeName.CollegeName.trim() === '',
      // sslcYear: sslcYear.trim() === '',
      // hscYear: hscYear.trim() === '',
      // ugYear: ugYear.trim() === '',
      sslcMarks: !sslcMarks,
      hscMarks: !hscMarks,
      ugMarks: !ugMarks,
      pgYear: educationLevel === 'pg' ? !pgYear : false,
      pgMarks: educationLevel === 'pg' ? !pgMarks : false,
    };
    setFieldErrors((prevFieldErrors) => ({ ...prevFieldErrors, ...errors }));
    // console.log(errors);
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
      industry: working === 'y' && industry.trim() === '',
      companyName: working === 'y' && companyName.trim() === '',
      areYouReferred: areYouReferred.trim() === '',
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
    // console.log(degree, collegeName, sslcMarks, hscMarks, ugMarks, pgMarks);

    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    if (activeStep === 0 && !validateBasicInfo()) {
      // Show validation errors for Basic Information step
      return;
    }

    if (activeStep === 1 && !validateEducationDetails()) {
      // Show validation errors for Education Details step
      return;
    }

    if (activeStep === 2 && !validateOthers()) {
      // Show validation errors for Others step
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

  const handleFormSubmit = () => {
    setOpenLoader(true);
    if (activeStep === 2 && !validateOthers()) {
      // Show validation errors for Others step
      return;
    }
    const Enquirydata = {
      FirstName: firstName,
      LastName: lastName,
      FatherName: fatherName,
      Dob: dob,
      PhoneNumber: contactNumber,
      Email: email,
      Gender: gender,
      GraduationType: educationLevel,
      CityId: city.CityId,
      DegreeId: degree.DegreeId,
      CollegeId: collegeName.CollegeId,
      PerferenceMode: preferredMode,
      PerferenceDay: preferredDays,
      PerferenceTiming: preferredTimings,
      CourseId: prefCourseCategory.CourseCategoryId,
      CourseTechnologyId: prefTechnology.CourseId,
      SslcPer: sslcMarks,
      SslcPassedout: sslcYear,
      HscPer: hscMarks,
      HscPassedout: hscYear,
      UGPer: ugMarks,
      UGPassedOut: ugYear,
      PGPer: pgMarks.length !== 0 ? pgMarks : 0,
      PGPassedOut: !pgYear ? 'N/A' : pgYear,
      WorkingStatus: working,
      WorkingIndustry: industry,
      WorkingCompany: companyName,
      ReferenceBy: refereedByName,
      ReferenceContactNumber: refereedByContact,
      [!id ? 'CreatedBy' : 'Modifyby']: 86,
      // (!id ? CreatedBy : Modifyby) : 86,
    };

    console.log('Submitted Data', Enquirydata, 'ID: ', id);
    if (!id) {
      addNewEnquiry(Enquirydata);
    } else {
      UpdateEnquiry(id, Enquirydata);
    }
  };
  const [orientation, setOrientation] = React.useState(() => {
    return window.innerWidth <= 760 ? 'vertical' : 'horizontal';
  });

  React.useEffect(() => {
    function handleResize() {
      // Update orientation when the window is resized
      setOrientation(window.innerWidth <= 760 ? 'vertical' : 'horizontal');
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
            <Link to="/dashboard/manage_enquiry">
              <Button variant="outlined" color="info" startIcon={<KeyboardBackspaceIcon />}>
                Back
              </Button>
            </Link>
          </Box>
          <Box>
            <FormControl size="small" fullWidth component="fieldset">
              <RadioGroup row value={formType} onChange={(e) => setFormType(e.target.value)}>
                <FormControlLabel value="enquiry" control={<Radio />} label="Enquiry" />
                <FormControlLabel value="direct" control={<Radio />} label="Direct Application" />
              </RadioGroup>
            </FormControl>
          </Box>
        </Stack>
        {formType === 'enquiry' ? (
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
              Student Enquiry
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

                            <FormControl size="small" fullWidth component="fieldset" required>
                              <Autocomplete
                                size="small"
                                fullWidth
                                options={cityData}
                                getOptionLabel={(city) => (city ? city.CityName : '')}
                                isOptionEqualToValue={
                                  ((option, value) => option?.CityId === value?.CityId) ?? undefined
                                }
                                renderInput={(params) => <TextField {...params} label="City" />}
                                value={city}
                                onChange={(e, newValue) => {
                                  setCity(newValue);
                                  setFieldErrors((prevFieldErrors) => ({
                                    ...prevFieldErrors,
                                    city: !newValue,
                                  }));
                                  console.log('selected city:', newValue);
                                }}
                              />
                              {fieldErrors.city && (
                                <Typography variant="caption" color="error" sx={{ m: 0.5, px: 1.5 }}>
                                  Please select the city
                                </Typography>
                              )}
                            </FormControl>
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
                          </Stack>

                          <Stack direction={{ md: 'row', xs: 'column' }} spacing={3} my={1}>
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
                                  const coursesInSelectedState = courseData.filter(
                                    (crs) => crs.CourseCategoryId === newValue.CourseCategoryId
                                  );
                                  setFilteredCourseData(coursesInSelectedState);
                                  setPrefTechnology('');
                                  setFieldErrors((prevFieldErrors) => ({
                                    ...prevFieldErrors,
                                    prefCourseCategory: !newValue,
                                  }));
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
                                  setFieldErrors((prevFieldErrors) => ({
                                    ...prevFieldErrors,
                                    prefTechnology: !newValue,
                                  }));
                                }}
                              />
                              {fieldErrors.prefTechnology && (
                                <Typography variant="caption" color="error" sx={{ m: 0.5, px: 1.5 }}>
                                  Select preferred technology
                                </Typography>
                              )}
                            </FormControl>
                          </Stack>

                          {/* <FormControl size="small" fullWidth component="fieldset">
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
                          </FormControl> */}

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
                          {/* <Typography variant="h6" color="#0288d1">
                            Reference Details(optional):
                          </Typography>

                          <Stack direction={{ md: 'row', xs: 'column' }} spacing={3} my={1}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Referred By Name"
                              value={refereedByName}
                              onChange={(e) => setRefereedByName(e.target.value)}
                            />
                            <TextField
                              type="number"
                              fullWidth
                              size="small"
                              label="Referred By Contact Number"
                              value={refereedByContact}
                              onChange={(e) => setRefereedByContact(e.target.value)}
                            />
                          </Stack> */}
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
                        <Button onClick={handleFormSubmit}>Submit</Button>
                      ) : (
                        <Button onClick={handleNext}>Next</Button>
                      )}
                    </Box>
                  </form>
                </>
              )}
            </Box>
          </>
        ) : (
          <>
            <AdmissionForm />
          </>
        )}
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
