import React from 'react';
import { motion } from 'framer-motion';

//#endregion
export default function LeftSlideInDiv(props: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: '-70vw' }}
      animate={{ opacity: 1, x: 0, transition: { duration: 1.5 } }}
    >
      {props.children}
    </motion.div>
  );
}
