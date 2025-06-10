import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ApperIcon name="Search" className="w-24 h-24 text-surface-400 mx-auto mb-6" />
        </motion.div>

        <Text as="h1" className="text-4xl font-heading font-bold text-surface-900 mb-4">
          Page Not Found
        </Text>

        <Text as="p" className="text-surface-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist. Let's get you back on track with your tasks.
        </Text>

        <Button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          icon={ApperIcon}
          iconName="Home"
          iconSize={20}
          iconClassName="mr-2"
        >
          Back to Tasks
        </Button>
      </motion.div>
    </div>
  );
}

export default NotFoundPage;