import { SlideProps, Slide } from '@mui/material';
import { memo } from 'react';

const TransitionUp = (props: SlideProps) => {
  return <Slide {...props} direction="up" />;
};

export default memo(TransitionUp);
