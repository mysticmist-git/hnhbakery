import React from 'react';
import { motion } from 'framer-motion';

//#endregion
export default function FadeDiv(props: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{
        opacity: 1,
        transition: { duration: 0.5 },
      }}
    >
      {props.children}
    </motion.div>
  );
}
