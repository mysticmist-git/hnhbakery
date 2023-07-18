import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';

interface FeedbackDialogProps {
  open: boolean;
  onClose: (rating: number, comment: string) => void;
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({ open, onClose }) => {
  // Declare state variables for 'rating' and 'comment'
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  // Handle value changes
  const handleRatingChange: (
    event: React.SyntheticEvent,
    value: number | null
  ) => void = (event, value) => setRating(value ?? 0);
  const handleCommentChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => setComment(event.target.value);

  // Handle dialog closing
  const handleClose = async () => {
    // Call onClose prop
    onClose && (await onClose(rating, comment));

    // Reset state
    setRating(0);
    setComment('');
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Send Feedback</DialogTitle>
      <DialogContent>
        <Rating
          name="feedback-rating"
          value={rating}
          onChange={handleRatingChange}
        />
        <TextField
          name="feedback-comment"
          label="Comment"
          value={comment}
          onChange={handleCommentChange}
          fullWidth
          multiline
          rows={4}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleClose}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackDialog;
