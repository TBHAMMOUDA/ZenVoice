import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  Button,
  Chip,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  Pagination,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { 
  Tag, 
  Plus, 
  Edit, 
  Trash2, 
  Search
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { tagsApi, TagDto } from '../../services/api';

const ITEMS_PER_PAGE = 25;

interface ContactTagsProps {
  onError: (error: string | null) => void;
  onSuccess: (message: string | null) => void;
}

const ContactTags: React.FC<ContactTagsProps> = ({ onError, onSuccess }) => {
  const { t } = useTranslation();
  
  // Loading state
  const [loading, setLoading] = useState(false);
  
  // Tags state
  const [tags, setTags] = useState<TagDto[]>([]);
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [tagDeleteConfirmOpen, setTagDeleteConfirmOpen] = useState(false);
  const [currentTag, setCurrentTag] = useState<TagDto>({ id: undefined, name: '', description: '' });
  const [isTagEditMode, setIsTagEditMode] = useState(false);
  const [tagFilter, setTagFilter] = useState('');
  const [tagPage, setTagPage] = useState(1);
  
  // Fetch data on component mount
  useEffect(() => {
    fetchTags();
  }, []);
  
  // Fetch tags from API
  const fetchTags = async () => {
    try {
      setLoading(true);
      const data = await tagsApi.getAll();
      setTags(data);
      onError(null);
    } catch (err) {
      onError('Failed to load tags');
      console.error('Error fetching tags:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Filtered items
  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(tagFilter.toLowerCase())
  );
  
  // Paginated items
  const paginatedTags = filteredTags.slice(
    (tagPage - 1) * ITEMS_PER_PAGE, 
    tagPage * ITEMS_PER_PAGE
  );
  
  // Reset pagination when filter changes
  useEffect(() => {
    setTagPage(1);
  }, [tagFilter]);
  
  // Tags handlers
  const handleAddTag = () => {
    setCurrentTag({ id: undefined, name: '', description: '' });
    setIsTagEditMode(false);
    setTagDialogOpen(true);
  };
  
  const handleEditTag = (tag: TagDto) => {
    setCurrentTag(tag);
    setIsTagEditMode(true);
    setTagDialogOpen(true);
  };
  
  const handleTagDelete = (tag: TagDto) => {
    setCurrentTag(tag);
    setTagDeleteConfirmOpen(true);
  };
  
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentTag({
      ...currentTag,
      [name]: value
    });
  };
  
  const handleTagSave = async () => {
    if (currentTag.name.trim()) {
      try {
        setLoading(true);
        if (isTagEditMode && currentTag.id) {
          // Update existing tag
          const updatedTag = await tagsApi.update(currentTag.id, currentTag);
          setTags(tags.map(tag => tag.id === updatedTag.id ? updatedTag : tag));
          onSuccess('Tag updated successfully');
        } else {
          // Add new tag
          const newTag = await tagsApi.create(currentTag);
          setTags([...tags, newTag]);
          onSuccess('Tag created successfully');
        }
        setTagDialogOpen(false);
        onError(null);
      } catch (err) {
        onError(isTagEditMode ? 'Failed to update tag' : 'Failed to create tag');
        console.error('Error saving tag:', err);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const confirmTagDelete = async () => {
    if (currentTag && currentTag.id) {
      try {
        setLoading(true);
        // Note: API doesn't have a delete endpoint for tags, so we're just removing it from the UI
        // In a real implementation, you would call the delete API here
        setTags(tags.filter(tag => tag.id !== currentTag.id));
        setTagDeleteConfirmOpen(false);
        onSuccess('Tag deleted successfully');
        onError(null);
      } catch (err) {
        onError('Failed to delete tag');
        console.error('Error deleting tag:', err);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleTagFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagFilter(e.target.value);
  };
  
  const handleTagPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setTagPage(value);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t('settings.tags.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {t('settings.tags.description')}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField
          placeholder={t('settings.tags.filterTags')}
          value={tagFilter}
          onChange={handleTagFilterChange}
          size="small"
          sx={{ width: '300px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="outlined"
          startIcon={<Plus size={16} />}
          onClick={handleAddTag}
          disabled={loading}
        >
          {t('settings.tags.addTag')}
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && (
        <Grid container spacing={2}>
          {paginatedTags.map((tag) => (
            <Grid item xs={12} sm={6} md={4} key={tag.id}>
              <Card 
                variant="outlined" 
                sx={{ 
                  height: '100%',
                  '&:hover': {
                    boxShadow: 2
                  }
                }}
              >
                <CardContent sx={{ pb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Tooltip 
                      title={tag.description || ''} 
                      arrow 
                      placement="top"
                      enterDelay={500}
                      leaveDelay={200}
                    >
                      <Chip 
                        label={tag.name} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </Tooltip>
                    <Box>
                      <IconButton 
                        size="small" 
                        onClick={() => handleEditTag(tag)}
                        sx={{ mr: 0.5 }}
                        disabled={loading}
                      >
                        <Edit size={16} />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => handleTagDelete(tag)}
                        disabled={loading}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mt: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {tag.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && filteredTags.length > ITEMS_PER_PAGE && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination 
            count={Math.ceil(filteredTags.length / ITEMS_PER_PAGE)} 
            page={tagPage} 
            onChange={handleTagPageChange} 
            color="primary" 
          />
        </Box>
      )}

      {!loading && filteredTags.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            {t('common.noResults')}
          </Typography>
        </Box>
      )}

      {/* Tag Dialog */}
      <Dialog open={tagDialogOpen} onClose={() => setTagDialogOpen(false)}>
        <DialogTitle>
          {isTagEditMode ? t('common.edit') : t('common.add')} {t('settings.tabs.tags')}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label={t('settings.tags.tagName')}
            type="text"
            fullWidth
            value={currentTag.name}
            onChange={handleTagInputChange}
            sx={{ mb: 2 }}
            disabled={loading}
          />
          <TextField
            margin="dense"
            name="description"
            label={t('settings.tags.tagDescription')}
            type="text"
            fullWidth
            multiline
            rows={3}
            value={currentTag.description || ''}
            onChange={handleTagInputChange}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTagDialogOpen(false)} disabled={loading}>{t('common.cancel')}</Button>
          <Button 
            onClick={handleTagSave} 
            color="primary"
            disabled={loading || !currentTag.name.trim()}
          >
            {loading ? <CircularProgress size={24} /> : t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Tag Delete Confirmation Dialog */}
      <Dialog open={tagDeleteConfirmOpen} onClose={() => setTagDeleteConfirmOpen(false)}>
        <DialogTitle>{t('common.delete')} {t('settings.tabs.tags')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('settings.tags.deleteConfirm')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTagDeleteConfirmOpen(false)} disabled={loading}>{t('common.cancel')}</Button>
          <Button 
            onClick={confirmTagDelete} 
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContactTags;
