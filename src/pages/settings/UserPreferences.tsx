import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';

interface UserPreferencesProps {
  onError: (error: string | null) => void;
  onSuccess: (message: string | null) => void;
}

const UserPreferences: React.FC<UserPreferencesProps> = ({ onError, onSuccess }) => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, useSystemLanguage, setUseSystemLanguage } = useLanguage();

  // Language handlers
  const handleLanguageChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newLang = event.target.value as string;
    changeLanguage(newLang);
    onSuccess('Language settings updated successfully');
  };

  const handleSystemLanguageToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUseSystemLanguage(event.target.checked);
    onSuccess('System language preference updated successfully');
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t('settings.language.title')}
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <FormControlLabel
            control={
              <Switch
                checked={useSystemLanguage}
                onChange={handleSystemLanguageToggle}
                color="primary"
              />
            }
            label={t('settings.language.useSystemLanguage')}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth disabled={useSystemLanguage}>
            <InputLabel id="language-select-label">{t('settings.language.selectLanguage')}</InputLabel>
            <Select
              labelId="language-select-label"
              value={currentLanguage}
              onChange={handleLanguageChange as any}
              label={t('settings.language.selectLanguage')}
            >
              <MenuItem value="en">{t('settings.language.english')}</MenuItem>
              <MenuItem value="fr">{t('settings.language.french')}</MenuItem>
              <MenuItem value="de">{t('settings.language.german')}</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>
      
      <Typography variant="body2" color="text.secondary">
        {useSystemLanguage 
          ? t('settings.language.useSystemLanguageDescription') 
          : t('settings.language.selectLanguageDescription')}
      </Typography>
    </Box>
  );
};

export default UserPreferences;
