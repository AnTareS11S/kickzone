import { motion } from 'framer-motion';
import { Separator } from './ui/separator';
import BackButton from './BackButton';

const PageHeader = ({
  title,
  description,
  className = '',
  sideText,
  isBack = true,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`space-y-6 ${className}`}
    >
      {isBack && (
        <motion.button
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
          className='flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors'
        >
          <BackButton />
        </motion.button>
      )}

      <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4'>
        <motion.div
          className='space-y-2'
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className='text-heading4-medium font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
            {title}
          </h1>
          {description && (
            <p className='text-sm text-muted-foreground max-w-md'>
              {description}
            </p>
          )}
        </motion.div>

        {sideText && (
          <motion.div
            className='flex items-center space-x-4'
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {sideText}
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        style={{ transformOrigin: 'left' }}
      >
        <Separator className='bg-gradient-to-r from-foreground/20 via-foreground/40 to-foreground/20' />
      </motion.div>
    </motion.div>
  );
};

export default PageHeader;
