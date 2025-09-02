import { motion } from "framer-motion";

function ContenedorForms({children}) {
  return (
    <motion.div 
      className='contenedor'
      initial={{ opacity: 0, y: 500 }} 
      animate={{opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -500 }}
      transition={{ duration: 1}}
    >
      {children}
    </motion.div>
  )
}

export default ContenedorForms