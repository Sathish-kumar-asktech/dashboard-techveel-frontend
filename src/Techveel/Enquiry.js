import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
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
} from '@mui/material';
import { Link } from 'react-router-dom';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Admission from './Admission';
import DirectAdmission from './DirectAdmission';

const steps = ['Basic Information', 'Education Details', 'Other Preferences'];

export default function Enquiry() {
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
  const [gender, setGender] = React.useState('male');
  const [educationLevel, setEducationLevel] = React.useState('ug');
  const [degree, setDegree] = React.useState('');
  const [collegeName, setCollegeName] = React.useState('');
  const [preferredMode, setPreferredMode] = React.useState('');
  const [preferredDays, setPreferredDays] = React.useState([]);
  const [preferredTimings, setPreferredTimings] = React.useState('');
  const [prefCourseCategory, setPrefCourseCategory] = React.useState('');
  const [prefTechnology, setPrefTechnology] = React.useState('');
  const [preferredLocation, setPreferredLocation] = React.useState('');
  const [sslcMarks, setSSLCMarks] = React.useState('');
  const [sslcYear, setSSLCYear] = React.useState('');
  const [hscMarks, setHSCMarks] = React.useState('');
  const [hscYear, setHSCYear] = React.useState('');
  const [ugMarks, setUGMarks] = React.useState('');
  const [ugYear, setUGYear] = React.useState('');
  const [pgMarks, setPGMarks] = React.useState('');
  const [pgYear, setPGYear] = React.useState('');
  const [working, setWorking] = React.useState('no');
  const [industry, setIndustry] = React.useState('');
  const [companyName, setCompanyName] = React.useState('');
  const [refereedByName, setRefereedByName] = React.useState('');
  const [refereedByContact, setRefereedByContact] = React.useState('');
  const [discount, setDiscount] = React.useState('');

  const isStepOptional = (step) => {
    return step === -1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  // Custom validation regex patterns
  const nameRegex = /^[A-Za-z\s]+$/;
  const contactRegex = /^\d{10}$/;
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  const marksRegex = /^[0-9]+$/;

  const validateBasicInfo = () => {
    return (
      nameRegex.test(firstName) &&
      nameRegex.test(lastName) &&
      contactRegex.test(contactNumber) &&
      emailRegex.test(email)
    );
  };

  const validateEducationDetails = () => {
    return (
      marksRegex.test(sslcMarks) &&
      marksRegex.test(hscMarks) &&
      (educationLevel === 'ug' ? marksRegex.test(ugMarks) : marksRegex.test(ugMarks) && marksRegex.test(pgMarks))
    );
  };

  const validateOthers = () => {
    return working === 'no' || (working === 'yes' && industry.trim() !== '' && companyName.trim() !== '');
  };

  const handleNext = () => {
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
    const formData = {
      firstName,
      lastName,
      contactNumber,
      email,
      gender,
      educationLevel,
      degree,
      collegeName,
      preferredMode,
      preferredDays,
      preferredTimings,
      prefCourseCategory,
      prefTechnology,
      sslcMarks,
      sslcYear,
      hscMarks,
      hscYear,
      ugMarks,
      ugYear,
      pgYear,
      working,
      industry,
      companyName,
      refereedByName,
      refereedByContact,
    };
    console.log(formData);
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
    <Container>
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
            {/* <FormLabel component="legend">Choose</FormLabel> */}
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
                          onChange={(e) => setFirstName(e.target.value)}
                          error={!nameRegex.test(firstName)}
                          helperText={!nameRegex.test(firstName) && 'Invalid first name'}
                        />

                        <TextField
                          size="small"
                          fullWidth
                          label="Last Name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          error={!nameRegex.test(lastName)}
                          helperText={!nameRegex.test(lastName) && 'Invalid last name'}
                        />

                        <TextField
                          size="small"
                          fullWidth
                          label="Father Name"
                          value={fatherName}
                          onChange={(e) => setFatherName(e.target.value)}
                          // error={!nameRegex.test(fatherName)}
                          // helperText={!nameRegex.test(fatherName) && 'Invalid Name'}
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
                          onChange={(e) => setDob(e.target.value)}
                          // error={!nameRegex.test(dob)}
                          // helperText={!nameRegex.test(dob) && 'Invalid last name'}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                        <FormControl size="small" fullWidth component="fieldset">
                          <FormLabel component="legend">Gender</FormLabel>
                          <RadioGroup row value={gender} onChange={(e) => setGender(e.target.value)}>
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                          </RadioGroup>
                        </FormControl>
                        <FormControl size="small" fullWidth component="fieldset">
                          <FormLabel component="legend">UG/PG</FormLabel>
                          <RadioGroup row value={educationLevel} onChange={(e) => setEducationLevel(e.target.value)}>
                            <FormControlLabel value="ug" control={<Radio />} label="UG" />
                            <FormControlLabel value="pg" control={<Radio />} label="PG" />
                          </RadioGroup>
                        </FormControl>
                      </Stack>

                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} my={1}>
                        <TextField
                          size="small"
                          fullWidth
                          label="Contact Number"
                          value={contactNumber}
                          onChange={(e) => setContactNumber(e.target.value)}
                          error={!contactRegex.test(contactNumber)}
                          helperText={!contactRegex.test(contactNumber) && 'Invalid contact number'}
                        />
                        <TextField
                          size="small"
                          fullWidth
                          label="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          error={!emailRegex.test(email)}
                          helperText={!emailRegex.test(email) && 'Invalid email'}
                        />

                        <Autocomplete
                          size="small"
                          fullWidth
                          options={['Chennai', 'Madurai', 'Salem', 'Pune']}
                          renderInput={(params) => <TextField {...params} label="City" />}
                          value={city}
                          onChange={(e, newValue) => setCity(newValue)}
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
                        <TextField
                          size="small"
                          fullWidth
                          label="College Name"
                          value={collegeName}
                          onChange={(e) => setCollegeName(e.target.value)}
                        />
                        <Autocomplete
                          size="small"
                          fullWidth
                          options={['B.Tech', 'M.Tech', 'B.Com', 'M.Com']}
                          renderInput={(params) => <TextField {...params} label="Degree/Stream" />}
                          value={degree}
                          onChange={(e, newValue) => setDegree(newValue)}
                        />
                      </Stack>

                      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={6}>
                          <Typography variant="h6" color="#0288d1">
                            SSLC:
                          </Typography>
                          <Stack direction={{ md: 'row', xs: 'column' }} spacing={3} my={1}>
                            <TextField
                              size="small"
                              fullWidth
                              label="Marks in Percentage"
                              value={sslcMarks}
                              onChange={(e) => setSSLCMarks(e.target.value)}
                              error={!marksRegex.test(sslcMarks)}
                              helperText={!marksRegex.test(sslcMarks) && 'Invalid marks'}
                            />
                            <Autocomplete
                              size="small"
                              fullWidth
                              options={['2010', '2018', '2022', '2023']}
                              renderInput={(params) => <TextField {...params} label="Year of Passed Out " />}
                              value={sslcYear}
                              onChange={(e, newValue) => setSSLCYear(newValue)}
                            />
                          </Stack>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography variant="h6" color="#0288d1">
                            HSC/Diploma:
                          </Typography>
                          <Stack direction={{ md: 'row', xs: 'column' }} spacing={3} my={1}>
                            <TextField
                              size="small"
                              fullWidth
                              label="Marks in Percentage"
                              value={hscMarks}
                              onChange={(e) => setHSCMarks(e.target.value)}
                              error={!marksRegex.test(hscMarks)}
                              helperText={!marksRegex.test(hscMarks) && 'Invalid marks'}
                            />

                            <Autocomplete
                              size="small"
                              fullWidth
                              options={['2010', '2018', '2022', '2023']}
                              renderInput={(params) => <TextField {...params} label="Year of Passed Out" />}
                              value={hscYear}
                              onChange={(e, newValue) => setHSCYear(newValue)}
                            />
                            {/* </Stack> */}
                          </Stack>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography variant="h6" color="#0288d1">
                            UG:
                          </Typography>
                          <Stack direction={{ md: 'row', xs: 'column' }} spacing={3} my={1}>
                            <TextField
                              size="small"
                              fullWidth
                              label="Marks in Percentage"
                              value={ugMarks}
                              onChange={(e) => setUGMarks(e.target.value)}
                              error={!marksRegex.test(ugMarks)}
                              helperText={!marksRegex.test(ugMarks) && 'Invalid marks'}
                            />

                            <Autocomplete
                              size="small"
                              fullWidth
                              options={['2010', '2018', '2022', '2023']}
                              renderInput={(params) => <TextField {...params} label="Year of Passed Out" />}
                              value={ugYear}
                              onChange={(e, newValue) => setUGYear(newValue)}
                            />
                          </Stack>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography variant="h6" color="#0288d1">
                            PG:
                          </Typography>
                          <Stack direction={{ md: 'row', xs: 'column' }} spacing={3} my={1}>
                            <TextField
                              size="small"
                              fullWidth
                              label="Marks in Percentage"
                              value={pgMarks}
                              onChange={(e) => setPGMarks(e.target.value)}
                              error={!marksRegex.test(pgMarks)}
                              helperText={!marksRegex.test(pgMarks) && 'Invalid marks'}
                            />

                            <Autocomplete
                              size="small"
                              fullWidth
                              options={['2010', '2018', '2022', '2023']}
                              renderInput={(params) => <TextField {...params} label="Year of Passed Out" />}
                              value={pgYear}
                              onChange={(e, newValue) => setPGYear(newValue)}
                            />
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
                            onChange={(e) => setPreferredMode(e.target.value)}
                          >
                            <MenuItem value={'online'}>Online</MenuItem>
                            <MenuItem value={'offline'}>Offline</MenuItem>
                          </Select>
                        </FormControl>

                        <FormControl size="small" fullWidth>
                          <InputLabel id="preferredDays">Preferred Days</InputLabel>
                          <Select
                            labelId="preferredDays"
                            id="preferredDays"
                            value={preferredDays}
                            label="Preferred Mode"
                            onChange={(e) => setPreferredDays(e.target.value)}
                          >
                            <MenuItem value={'weekend'}>Weekend</MenuItem>
                            <MenuItem value={'weekdays'}>Weekdays</MenuItem>
                          </Select>
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
                            onChange={(e) => setPreferredTimings(e.target.value)}
                          >
                            <MenuItem value="morning">Morning</MenuItem>
                            <MenuItem value="afternoon">Afternoon</MenuItem>
                            <MenuItem value="evening">Evening</MenuItem>
                          </Select>
                        </FormControl>

                        <Autocomplete
                          size="small"
                          fullWidth
                          options={['Software', 'Testing', 'Networking', 'Design']}
                          renderInput={(params) => <TextField {...params} label="Preferred Course" />}
                          value={prefCourseCategory}
                          onChange={(e, newValue) => setPrefCourseCategory(newValue)}
                        />
                        <Autocomplete
                          size="small"
                          fullWidth
                          options={['Java', 'Fullstack', 'Python', 'AI']}
                          renderInput={(params) => <TextField {...params} label="Preferred Technology" />}
                          value={prefTechnology}
                          onChange={(e, newValue) => setPrefTechnology(newValue)}
                        />
                      </Stack>

                      <FormControl size="small" component="fieldset">
                        <FormLabel component="legend">Working?</FormLabel>
                        <RadioGroup row value={working} onChange={(e) => setWorking(e.target.value)}>
                          <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                          <FormControlLabel value="no" control={<Radio />} label="No" />
                        </RadioGroup>
                      </FormControl>
                      {working === 'yes' && (
                        <>
                          <Stack direction={{ md: 'row', xs: 'column' }} spacing={3} my={1}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Industry"
                              value={industry}
                              onChange={(e) => setIndustry(e.target.value)}
                              error={industry.trim() === ''}
                              helperText={industry.trim() === '' && 'Industry field is required'}
                            />
                            <TextField
                              fullWidth
                              size="small"
                              label="Company Name"
                              value={companyName}
                              onChange={(e) => setCompanyName(e.target.value)}
                              error={companyName.trim() === ''}
                              helperText={companyName.trim() === '' && 'Company name field is required'}
                            />
                          </Stack>
                        </>
                      )}
                      <Typography variant="h6" color="#0288d1">
                        Reference Details:
                      </Typography>

                      <Stack direction={{ md: 'row', xs: 'column' }} spacing={3} my={1}>
                        <TextField
                          fullWidth
                          size="small"
                          required
                          label="Referred By Name"
                          value={refereedByName}
                          onChange={(e) => setRefereedByName(e.target.value)}
                        />
                        <TextField
                          required
                          fullWidth
                          size="small"
                          label="Referred By Contact"
                          value={refereedByContact}
                          onChange={(e) => setRefereedByContact(e.target.value)}
                        />
                      </Stack>
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
              </>
            )}
          </Box>
        </>
      ) : (
        <>
          <DirectAdmission />
        </>
      )}
    </Container>
  );
}
