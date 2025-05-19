import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  CircularProgress
} from '@mui/material';
import { CompanyDto, CompanyStatus } from '../../services/api';

interface CompanyStatusChangeProps {
  open: boolean;
  onClose: () => void;
  company: CompanyDto | null;
  onSubmit: (status: CompanyStatus) => void;
  loading: boolean;
}

const CompanyStatusChange: React.FC<CompanyStatusChangeProps> = ({
  open,
  onClose,
  company,
  onSubmit,
  loading
}) => {
  const [newStatus, setNewStatus] = React.useState<CompanyStatus | null>(null);

  React.useEffect(() => {
    if (company) {
      const availableStatuses = getAvailableStatusTransitions(company.status);
      if (availableStatuses.length > 0) {
        setNewStatus(availableStatuses[0]);
      }
    }
  }, [company]);

  if (!company) return null;

  // Get available status transitions based on current status
  const getAvailableStatusTransitions = (currentStatus: CompanyStatus): CompanyStatus[] => {
    switch (currentStatus) {
      case CompanyStatus.Pending:
        return [CompanyStatus.Active, CompanyStatus.Inactive];
      case CompanyStatus.Active:
        return [CompanyStatus.Inactive];
      case CompanyStatus.Inactive:
        return [CompanyStatus.Active, CompanyStatus.Archived];
      case CompanyStatus.Archived:
        return [CompanyStatus.Pending];
      default:
        return [];
    }
  };

  const getStatusText = (status: CompanyStatus) => {
    switch (status) {
      case CompanyStatus.Active:
        return 'Active';
      case CompanyStatus.Inactive:
        return 'Inactive';
      case CompanyStatus.Archived:
        return 'Archived';
      case CompanyStatus.Pending:
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewStatus(parseInt(event.target.value) as CompanyStatus);
  };

  const handleSubmit = () => {
    if (newStatus !== null) {
      onSubmit(newStatus);
    }
  };

  const availableStatuses = getAvailableStatusTransitions(company.status);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Change Company Status</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Current status: <strong>{getStatusText(company.status)}</strong>
        </Typography>
        
        {availableStatuses.length === 0 ? (
          <Typography color="error">
            No status transitions available for this company
          </Typography>
        ) : (
          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <RadioGroup
              aria-label="status"
              name="status"
              value={newStatus?.toString()}
              onChange={handleStatusChange}
            >
              {availableStatuses.map(status => (
                <FormControlLabel
                  key={status}
                  value={status.toString()}
                  control={<Radio />}
                  label={getStatusText(status)}
                />
              ))}
            </RadioGroup>
          </FormControl>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          color="primary"
          disabled={newStatus === null || loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Change Status'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompanyStatusChange;
