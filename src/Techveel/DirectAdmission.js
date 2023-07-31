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
  FormHelperText,
  IconButton,
  useMediaQuery,
  Grid,
} from '@mui/material';
import styled from '@emotion/styled';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
// import { useMediaQuery } from '@mui/material';

const useStyles = styled((theme) => ({
  fileInput: {
    display: 'none',
  },
  chooseFileButton: {
    marginRight: theme.spacing(2),
    // width:"500px",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

const steps = ['Basic Information', 'Education Details', 'Documents', 'Complete Application'];

export default function DirectAdmission() {
  const isVertical = useMediaQuery('(max-width: 600px)'); // Change the breakpoint as needed
  // const [orientation, setOrientation] = React.useState(isVertical ? 'vertical' : 'horizontal');

  React.useEffect(() => {
    setOrientation(isVertical ? 'vertical' : 'horizontal');
  }, [isVertical]);

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [contactNumber, setContactNumber] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [educationLevel, setEducationLevel] = React.useState('');
  const [degree, setDegree] = React.useState('');
  const [collegeName, setCollegeName] = React.useState('');
  const [preferredMode, setPreferredMode] = React.useState('');
  const [preferredDays, setPreferredDays] = React.useState([]);
  const [preferredTimings, setPreferredTimings] = React.useState('');
  const [prefCourseCategory, setPrefCourseCategory] = React.useState('');
  const [prefTechnology, setPrefTechnology] = React.useState('');
  // Residential address details
  const [address1, setAddress1] = React.useState('');
  const [address2, setAddress2] = React.useState('');
  const [city, setCity] = React.useState('');
  const [state, setState] = React.useState('');
  const [pinCode, setPinCode] = React.useState('');
  const [country, setCountry] = React.useState('');

  const [fatherName, setFatherName] = React.useState('');
  // const [city, setCity] = React.useState('');
  const [dob, setDob] = React.useState('');

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
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [discount, setDiscount] = React.useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    console.log(selectedFile);
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
      address1,
      address2,
      city,
      state,
      pinCode,
      country,
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
    <>
      <Box sx={{ width: '100%' }}>
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
          Direct Admission
        </Typography>
        <Stepper activeStep={activeStep} orientation={orientation}>
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
                    />
                    <TextField
                      size="small"
                      fullWidth
                      label="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Stack>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} my={1}>
                    <TextField
                      size="small"
                      fullWidth
                      label="Father Name"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      // error={!nameRegex.test(fatherName)}
                      // helperText={!nameRegex.test(fatherName) && 'Invalid Name'}
                    />
                    <TextField
                      size="small"
                      fullWidth
                      type="date"
                      label="Date of Birth"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      // error={!nameRegex.test(dob)}
                      // helperText={!nameRegex.test(dob) && 'Invalid last name'}
                      InputLabelProps={{
                        shrink: true,
                      }}
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

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} my={1}>
                    <TextField
                      size="small"
                      fullWidth
                      label="Contact Number"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                    />
                    <TextField
                      size="small"
                      fullWidth
                      label="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Stack>
                  <Stack direction={'row'} spacing={3} m={1}>
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

                  <Typography variant="h6" color="#0288d1">
                    Address:
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} my={1}>
                    <TextField
                      size="small"
                      fullWidth
                      type="text"
                      label="Address Line 1"
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                    />
                    <TextField
                      size="small"
                      fullWidth
                      type="text"
                      label="Address Line 2"
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                    />
                  </Stack>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} my={1}>
                    <Autocomplete
                      size="small"
                      fullWidth
                      options={['Chennai', 'Madurai', 'Pune', 'Salem']}
                      renderInput={(params) => <TextField {...params} label="City" />}
                      value={city}
                      onChange={(e, newValue) => setCity(newValue)}
                    />

                    <Autocomplete
                      size="small"
                      fullWidth
                      options={['Tamil Nadu', 'Kerala', 'Maharastra', 'Andhra']}
                      renderInput={(params) => <TextField {...params} label="State/Province" />}
                      value={state}
                      onChange={(e, newValue) => setState(newValue)}
                    />
                    <TextField
                      size="small"
                      fullWidth
                      type="number"
                      label="Zip/postalCode"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
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
                          // error={!marksRegex.test(sslcMarks)}
                          // helperText={!marksRegex.test(sslcMarks) && 'Invalid marks'}
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
                          // error={!marksRegex.test(hscMarks)}
                          // helperText={!marksRegex.test(hscMarks) && 'Invalid marks'}
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
                          // error={!marksRegex.test(ugMarks)}
                          // helperText={!marksRegex.test(ugMarks) && 'Invalid marks'}
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
                          // error={!marksRegex.test(pgMarks)}
                          // helperText={!marksRegex.test(pgMarks) && 'Invalid marks'}
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
                    Upload Documents:
                  </Typography>
                  <Stack direction={'column'} spacing={2} my={1}>
                    <FormLabel>Photo:</FormLabel>
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
                        <Box fullWidth>
                          <label htmlFor="fileInput">
                            <Button
                              fullWidth
                              component="span"
                              className={classes.chooseFileButton}
                              variant="outlined"
                              size="small"
                              startIcon={<AttachFileIcon />}
                            >
                              Choose File
                            </Button>
                            <input
                              accept="image/*"
                              className={classes.fileInput}
                              id="fileInput"
                              type="file"
                              onChange={handleFileChange}
                              style={{ display: 'none' }}
                            />
                          </label>
                        </Box>
                        <Typography textTransform={'capitalize'} variant="body1" color="inherit">
                          {selectedFile ? selectedFile.name : 'No file chosen'}
                        </Typography>
                      </Stack>
                      {selectedFile && (
                        <Button
                          variant="contained"
                          startIcon={<CloudUploadIcon />}
                          size="small"
                          onClick={handleUpload}
                          disabled={!selectedFile}
                        >
                          Upload
                        </Button>
                      )}
                    </Stack>

                    <FormLabel>Aadhaar Card:</FormLabel>
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
                        <Box fullWidth>
                          <label htmlFor="fileInput">
                            <Button
                              fullWidth
                              component="span"
                              className={classes.chooseFileButton}
                              variant="outlined"
                              size="small"
                              startIcon={<AttachFileIcon />}
                            >
                              Choose File
                            </Button>
                            <input
                              accept="image/*"
                              className={classes.fileInput}
                              id="fileInput"
                              type="file"
                              onChange={handleFileChange}
                              style={{ display: 'none' }}
                            />
                          </label>
                        </Box>
                        <Typography textTransform={'capitalize'} variant="body1" color="inherit">
                          {selectedFile ? selectedFile.name : 'No file chosen'}
                        </Typography>
                      </Stack>
                      {selectedFile && (
                        <Button
                          variant="contained"
                          startIcon={<CloudUploadIcon />}
                          size="small"
                          onClick={handleUpload}
                          disabled={!selectedFile}
                        >
                          Upload
                        </Button>
                      )}
                    </Stack>

                    <FormLabel>Pan Card:</FormLabel>
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
                        <Box fullWidth>
                          <label htmlFor="fileInput">
                            <Button
                              fullWidth
                              component="span"
                              className={classes.chooseFileButton}
                              variant="outlined"
                              size="small"
                              startIcon={<AttachFileIcon />}
                            >
                              Choose File
                            </Button>
                            <input
                              accept="image/*"
                              className={classes.fileInput}
                              id="fileInput"
                              type="file"
                              onChange={handleFileChange}
                              style={{ display: 'none' }}
                            />
                          </label>
                        </Box>
                        <Typography textTransform={'capitalize'} variant="body1" color="inherit">
                          {selectedFile ? selectedFile.name : 'No file chosen'}
                        </Typography>
                      </Stack>
                      {selectedFile && (
                        <Button
                          variant="contained"
                          startIcon={<CloudUploadIcon />}
                          size="small"
                          onClick={handleUpload}
                          disabled={!selectedFile}
                        >
                          Upload
                        </Button>
                      )}
                    </Stack>

                    <FormLabel>Colleg ID:</FormLabel>
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
                        <Box fullWidth>
                          <label htmlFor="fileInput">
                            <Button
                              fullWidth
                              component="span"
                              className={classes.chooseFileButton}
                              variant="outlined"
                              size="small"
                              startIcon={<AttachFileIcon />}
                            >
                              Choose File
                            </Button>
                            <input
                              accept="image/*"
                              className={classes.fileInput}
                              id="fileInput"
                              type="file"
                              onChange={handleFileChange}
                              style={{ display: 'none' }}
                            />
                          </label>
                        </Box>
                        <Typography textTransform={'capitalize'} variant="body1" color="inherit">
                          {selectedFile ? selectedFile.name : 'No file chosen'}
                        </Typography>
                      </Stack>
                      {selectedFile && (
                        <Button
                          variant="contained"
                          startIcon={<CloudUploadIcon />}
                          size="small"
                          onClick={handleUpload}
                          disabled={!selectedFile}
                        >
                          Upload
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                </Box>
              </>
            )}
            {activeStep === 3 && (
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
                      renderInput={(params) => <TextField {...params} label="Preferred Course Category" />}
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

                  {prefTechnology !== '' && (
                    <Grid container rowSpacing={1} my={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                      <Grid item xs={12} md={6}>
                        <Stack
                          direction={"row"}
                          justifyContent={'space-evenly'}
                          alignItems={'center'}
                          spacing={3}
                          my={1}
                        >
                          <Typography fullWidth variant="h6" color="#00695c">
                            Course Fee : 25000 INR
                          </Typography>
                          <Typography fullWidth variant="h6" color={'#00695c'}>
                            Course Duration: 1 Month
                          </Typography>
                        </Stack>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Discount in INR(if applicable):"
                          value={discount}
                          onChange={(e) => setDiscount(e.target.value)}
                          // error={industry.trim() === ''}
                          // helperText={industry.trim() === '' && 'Industry field is required'}
                        />
                      </Grid>
                    </Grid>
                  )}

                  {/* {prefTechnology !== '' && (
                    <Stack
                      direction={{ md: 'row', xs: 'column' }}
                      justifyContent={'space-evenly'}
                      alignItems={'center'}
                      spacing={3}
                      my={1}
                    >
                      <Typography fullWidth variant="h6" color="#00695c">
                        Course Fee : 25000 INR
                      </Typography>
                      <Typography fullWidth variant="h6" color={'#00695c'}>
                        Course Duration: 1 Month
                      </Typography>

                      <TextField
                        fullWidth
                        size="small"
                        label="Discount in INR(if applicable):"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        // error={industry.trim() === ''}
                        // helperText={industry.trim() === '' && 'Industry field is required'}
                      />
                    // </Stack>
                  )} */}
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
                        />
                        <TextField
                          fullWidth
                          size="small"
                          label="Company Name"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
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
                      label="Refereed By Name"
                      value={refereedByName}
                      onChange={(e) => setRefereedByName(e.target.value)}
                    />
                    <TextField
                      required
                      fullWidth
                      size="small"
                      label="Refereed By Contact"
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
  );
}
