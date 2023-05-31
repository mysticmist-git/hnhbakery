import React from 'react';
import { motion } from 'framer-motion';

//#endregion
export default function BottomSlideInDiv(props: any) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 100 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.2 },
      }}
    >
      {props.children}
    </motion.div>
  );
}
