import React from 'react';
import { useUnits } from '@/shared/providers/UnitsProvider';
import styles from './UnitToggle.module.scss';

interface UnitToggleProps {
  className?: string;
}

const UnitToggle: React.FC<UnitToggleProps> = ({ className = '' }) => {
  const { units, toggleUnits } = useUnits();

  return (
    <button 
      className={`${styles.unitsToggle} ${className}`} 
      onClick={toggleUnits}
    >
      {units}
    </button>
  );
};

export default UnitToggle;