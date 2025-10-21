import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Panel = ({ isOpen, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
        
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          ></div>

        
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg z-50 p-6"
          >
         
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Panel</h2>
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>
            </div>
            <div>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Panel;