import {
  Autocomplete,
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Stack,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import logo from '../../assets/defaultAva.jpg';
import { AddRounded, CloseRounded } from '@mui/icons-material';
import CakeOccasion from '@/models/cakeOccasion';
import { getCakeOccasions } from '@/lib/DAO/cakeOccasionDAO';
import Size from '@/models/size';
import { getSizes } from '@/lib/DAO/sizeDAO';
import { Buoc1, Buoc1Props } from './Buoc1';
import { Buoc2 } from './Buoc2';
import BookingItem from '@/models/bookingItem';

type UploadStepperComponentProps = {
  bookingItem: BookingItem;
  buoc1Props: Buoc1Props;
  handleBookingItemChange: (key: keyof BookingItem, value: any) => void;
};

function UploadStepperComponent({
  bookingItem,
  buoc1Props,
  handleBookingItemChange,
}: UploadStepperComponentProps) {
  const theme = useTheme();

  const uploadImageStepper = [
    {
      label: 'Upload hình ảnh ',
      content: (
        <>
          <Buoc1 {...buoc1Props} />
        </>
      ),
    },
    {
      label: 'Thông tin bánh',
      content: (
        <>
          <Buoc2
            bookingItem={bookingItem}
            handleBookingItemChange={handleBookingItemChange}
          />
        </>
      ),
    },
    {
      label: 'Tiến hành đặt bánh',
      content: <></>,
    },
  ];

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <>
      <Box
        component={'div'}
        sx={{
          width: '100%',
          p: 4,
          backgroundColor: 'white',
          borderRadius: 4,
          border: 3,
          borderColor: theme.palette.secondary.main,
        }}
      >
        <Stepper activeStep={activeStep} orientation="vertical">
          {uploadImageStepper.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                icon={
                  <Box
                    component={'div'}
                    sx={{
                      bgcolor:
                        activeStep === index
                          ? 'secondary.main'
                          : 'primary.main',
                      color: activeStep === index ? 'white' : 'black',
                      borderRadius: '50%',
                      height: '26px',
                      aspectRatio: '1',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {index + 1}
                  </Box>
                }
              >
                <Typography variant="body2">{step.label}</Typography>
              </StepLabel>
              <StepContent>
                {step.content}
                <Box component={'div'}>
                  <div>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === uploadImageStepper.length - 1
                        ? 'Thông tin giao hàng'
                        : 'Tiếp tục'}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                      variant="contained"
                    >
                      Trở lại
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === uploadImageStepper.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>All steps completed - you&apos;re finished</Typography>
            <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
              Reset
            </Button>
          </Paper>
        )}
      </Box>
    </>
  );
}

export default UploadStepperComponent;
