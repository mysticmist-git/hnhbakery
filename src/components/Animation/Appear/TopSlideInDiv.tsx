import React from 'react';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';

//#endregion
export default function TopSlideInDiv(props: any) {
  return (
    <Box>{props.children}</Box>
    // <motion.div
    //   initial={{ opacity: 0, y: '-70vh' }}
    //   animate={{ opacity: 1, y: 0, transition: { duration: 1.5 } }}
    // >
    //   {props.children}
    // </motion.div>
  );
}
