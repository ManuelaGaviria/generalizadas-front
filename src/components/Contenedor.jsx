import { motion } from "framer-motion";

function Contenedor({ children, animate }) {
  return (
    <motion.div 
      className='contenedor'
      initial={{ opacity: 0, y: 500 }} 
      animate={animate ? { opacity: 1, y: 0 } : { opacity: 0, y: 500 }} // Animar solo si animate es verdadero
      exit={{ opacity: 0, y: -500 }}
      transition={{ duration: 1}}
    >
      {children}
    </motion.div>
  );
}

export default Contenedor;