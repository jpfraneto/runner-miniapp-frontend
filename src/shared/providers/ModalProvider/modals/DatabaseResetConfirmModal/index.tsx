// Dependencies
import React from 'react';

// Types
import { BaseModalProps, DatabaseResetConfirmModalData } from '../../types';

// StyleSheet
import styles from './DatabaseResetConfirmModal.module.scss';

// Components
import BaseModal from '../../components/BaseModal';
import Typography from '@/components/Typography';
import Button from '@/components/Button';

export const DatabaseResetConfirmModal: React.FC<BaseModalProps<DatabaseResetConfirmModalData>> = ({ 
  title, 
  message, 
  onConfirm, 
  handleClose 
}) => {
  return (
    <div className={styles.layout}>
      <BaseModal>
        <div className={styles.container}>
          <Typography variant={'druk'} weight={'text-wide'} size={16} lineHeight={18}>
            {title}
          </Typography>
          <Typography variant={'geist'} size={14} lineHeight={18} className={styles.message}>
            {message}
          </Typography>

          <div className={styles.actions}>
            <Button variant={'underline'} caption={'Cancel'} onClick={handleClose} />
            <Button variant={'primary'} caption={'Reset Database'} onClick={onConfirm} />
          </div>
        </div>
      </BaseModal>
    </div>
  );
};