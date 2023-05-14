import { Add } from '@mui/icons-material';
import { SxProps, Box } from '@mui/system';

export default function MyGalleryImageNewButton({
  sx,
  srcs,
  setSrcs,
}: {
  sx?: SxProps;
  srcs: string[] | null;
  setSrcs: any;
}) {
  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: any) => {
      const files = event.target.files;
      // Add your file upload logic here
      const file = files[0];
      if (!srcs) {
        setSrcs([URL.createObjectURL(file)]);
        return;
      }

      setSrcs([...srcs, URL.createObjectURL(file)]);
    };
    input.click();
  };

  return (
    <Box
      width={172}
      height={240}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'background-color 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
        },
        '&:active': {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
        },
        ...sx,
      }}
      onClick={handleFileUpload}
    >
      <Add
        sx={{
          width: '44px',
          height: '44px',
        }}
      />
    </Box>
  );
}
