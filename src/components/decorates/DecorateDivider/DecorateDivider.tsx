import bg10 from '@/assets/Decorate/bg10.png';
import bg11 from '@/assets/Decorate/bg11.png';
import bg2 from '@/assets/Decorate/bg2.png';
import bg3 from '@/assets/Decorate/bg3.png';
import bg4 from '@/assets/Decorate/bg4.png';
import bg8 from '@/assets/Decorate/bg8.png';
import { Box } from '@mui/material';
import React from 'react';

export default function SolidDownWhite(props: any) {
  return (
    <>
      <Box
        component={'div'}
        sx={{
          ...props.sx,
          height: '80px',
          backgroundImage: `url(${bg3.src})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          zIndex: 1,
        }}
      ></Box>
    </>
  );
}
export function SolidUpWhite(props: any) {
  return (
    <>
      <Box
        component={'div'}
        sx={{
          ...props.sx,
          height: '80px',
          backgroundImage: `url(${bg4.src})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          zIndex: 1,
        }}
      ></Box>
    </>
  );
}

export function DashUpWhite(props: any) {
  return (
    <>
      <Box
        component={'div'}
        sx={{
          ...props.sx,
          height: '80px',
          backgroundImage: `url(${bg8.src})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          zIndex: 1,
        }}
      ></Box>
    </>
  );
}

export function DashDownWhite(props: any) {
  return (
    <>
      <Box
        component={'div'}
        sx={{
          ...props.sx,
          height: '80px',
          backgroundImage: `url(${bg11.src})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          zIndex: 1,
        }}
      ></Box>
    </>
  );
}
