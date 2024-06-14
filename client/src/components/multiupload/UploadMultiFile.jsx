// src/components/UploadMultiFile.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton, List, ListItem, ListItemText, Typography, ListItemSecondaryAction } from '@mui/material';
import { AttachFile, Delete } from '@mui/icons-material';

const UploadMultiFile = ({ showList, setFieldValue, files, error }) => {
  const handleFileChange = (event) => {
    const fileArray = Array.from(event.target.files);
    setFieldValue('images', [...files, ...fileArray]);
  };

  const handleDeleteFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFieldValue('images', newFiles);
  };

  return (
    <Box>
      <input accept="image/*" style={{ display: 'none' }} id="raised-button-file" multiple type="file" onChange={handleFileChange} />
      <label htmlFor="raised-button-file">
        <IconButton color="primary" component="span">
          <AttachFile />
        </IconButton>
        <Typography variant="body2" color="textSecondary">
          Upload Files
        </Typography>
      </label>

      {showList && (
        <List>
          {files.map((file, index) => (
            <ListItem key={index}>
              <ListItemText primary={file.name} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteFile(index)}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      {error && <Typography color="error">At least one image is required</Typography>}
    </Box>
  );
};

UploadMultiFile.propTypes = {
  showList: PropTypes.bool.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  files: PropTypes.array.isRequired,
  error: PropTypes.bool
};

export default UploadMultiFile;
