import { motion } from 'framer-motion';

export default function DraggableWrapper({ children }) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.08}
      whileDrag={{
        scale: 1.04,
        cursor: 'grabbing',
      }}
      initial={{
        x: 0,
        y: 0,
      }}
      style={{
        position: 'fixed',
        right: 16,
        bottom: 24,
        zIndex: 1000,
        maxWidth: 'calc(100vw - 32px)',
        touchAction: 'none',
      }}
    >
      {children}
    </motion.div>
  );
}