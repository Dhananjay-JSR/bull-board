import React, { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Button } from '../Button/Button';
import { InputField } from '../Form/InputField/InputField';
import { Modal } from '../Modal/Modal';
import s from './RetryPartialModal.module.css';
import type { JobRetryStatus } from '@bull-board/api/typings/app';

interface RetryPartialModalProps {
  open: boolean;
  onClose: () => void;
  onRetry: (count: number) => Promise<void>;
  queueName: string;
  status: JobRetryStatus;
  maxJobs: number;
}

export const RetryPartialModal: React.FC<RetryPartialModalProps> = ({
  open,
  onClose,
  onRetry,
  queueName,
  status,
  maxJobs,
}: RetryPartialModalProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = Object.fromEntries(
      Array.from(form.elements)
        .filter((input: any) => input.name)
        .map((input: any) => [input.name, input.value])
    );

    const count = parseInt(formData.count) || 1;

    if (count <= 0) {
      toast.error(t('QUEUE.ACTIONS.RETRY_PARTIAL.INVALID_COUNT'));
      return;
    }

    setLoading(true);

    try {
      await onRetry(count);
      toast.success(t('QUEUE.ACTIONS.RETRY_PARTIAL.SUCCESS', { count }));
      onClose();
    } catch (error) {
      toast.error(t('QUEUE.ACTIONS.RETRY_PARTIAL.ERROR'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Modal 
      open={open} 
      onClose={handleClose} 
      title={t('QUEUE.ACTIONS.RETRY_PARTIAL.TITLE')}
      width="small"
      actionButton={
        <Button type="submit" theme="primary" form="retry-partial-form" disabled={loading}>
          {loading ? t('QUEUE.ACTIONS.RETRY_PARTIAL.RETRYING') : t('QUEUE.ACTIONS.RETRY_PARTIAL.RETRY')}
        </Button>
      }
    >
      <form id="retry-partial-form" onSubmit={handleSubmit} className={s.formContent}>
        <InputField
          label={t('QUEUE.ACTIONS.RETRY_PARTIAL.COUNT_LABEL')}
          id="count"
          name="count"
          type="number"
          min="1"
          defaultValue="1"
          disabled={loading}
        />
        <div className={s.description}>
          {t('QUEUE.ACTIONS.RETRY_PARTIAL.DESCRIPTION', { 
            status: status, 
            max: maxJobs,
            queue: queueName
          })}
        </div>
      </form>
    </Modal>
  );
};