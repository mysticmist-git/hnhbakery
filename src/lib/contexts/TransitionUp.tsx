import { SlideProps, Slide } from '@mui/material';

export default function TransitionUp(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}
