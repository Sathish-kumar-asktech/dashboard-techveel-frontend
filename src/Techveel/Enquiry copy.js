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
} from '@mui/material';

const steps = ['Basic Information', 'Education Details', 'Others'];

export default function Enquiry() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
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
    };
    console.log(formData);
  };

  return (
    <Container>
      <Box sx={{ width: '100%' }}>
        <Stepper activeStep={activeStep}>
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
                      renderInput={(params) => <TextField {...params} label="Qualification Degree/Stream" />}
                      value={degree}
                      onChange={(e, newValue) => setDegree(newValue)}
                    />
                  </Stack>
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
                </Box>
              </>
            )}
            {activeStep === 1 && (
              <>
                <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', pt: 2 }}>
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
                    />
                    <FormControl size="small" fullWidth>
                      <InputLabel>Completed Year</InputLabel>
                      <Select value={sslcYear} onChange={(e) => setSSLCYear(e.target.value)}>
                        <MenuItem value="2010">2010</MenuItem>
                        <MenuItem value="2011">2011</MenuItem>
                        <MenuItem value="2012">2012</MenuItem>
                        {/* Add more years here */}
                      </Select>
                    </FormControl>
                  </Stack>

                  <Typography variant="h6" color="#0288d1">
                    HSC:
                  </Typography>
                  <Stack direction={{ md: 'row', xs: 'column' }} spacing={3} my={1}>
                    <TextField
                      size="small"
                      fullWidth
                      label="Marks in Percentage"
                      value={hscMarks}
                      onChange={(e) => setHSCMarks(e.target.value)}
                    />
                    <FormControl size="small" fullWidth>
                      <InputLabel>Completed Year</InputLabel>
                      <Select value={hscYear} onChange={(e) => setHSCYear(e.target.value)}>
                        <MenuItem value="2012">2012</MenuItem>
                        <MenuItem value="2013">2013</MenuItem>
                        <MenuItem value="2014">2014</MenuItem>
                        {/* Add more years here */}
                      </Select>
                    </FormControl>
                  </Stack>
                  <>
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
                      />
                      <FormControl size="small" fullWidth>
                        <InputLabel>Completed Year</InputLabel>
                        <Select value={ugYear} onChange={(e) => setUGYear(e.target.value)}>
                          <MenuItem value="2016">2016</MenuItem>
                          <MenuItem value="2017">2017</MenuItem>
                          <MenuItem value="2018">2018</MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>
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
                      />
                      <FormControl size="small" fullWidth>
                        <InputLabel>Completed Year</InputLabel>
                        <Select value={pgYear} onChange={(e) => setPGYear(e.target.value)}>
                          <MenuItem value="2016">2016</MenuItem>
                          <MenuItem value="2017">2017</MenuItem>
                          <MenuItem value="2018">2018</MenuItem>
                          {/* Add more years here */}
                        </Select>
                      </FormControl>
                    </Stack>
                  </>
                  {/* )} */}
                </Box>
              </>
            )}
            {activeStep === 2 && (
              <>
                <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', pt: 2 }}>
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
    </Container>
  );
}
