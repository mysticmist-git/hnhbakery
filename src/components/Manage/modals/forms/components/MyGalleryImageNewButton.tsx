import { useSnackbarService } from '@/pages/_app';
import { Add } from '@mui/icons-material';
import { SxProps, Box } from '@mui/system';

export default function MyGalleryImageNewButton({
  sx,
  disabled = false,
  handleUploadGalleryToBrowser,
}: {
  sx?: SxProps;
  disabled: boolean;
  handleUploadGalleryToBrowser: any;
}) {
  //#region Hooks

  const handleSnackbarAlert = useSnackbarService();

  //#endregion

  const handleFileUpload = () => {
    if (disabled) {
      handleSnackbarAlert('error', 'Không thể thêm ảnh ở chế độ xem');
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = handleUploadGalleryToBrowser;
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
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: !disabled ? 'rgba(0, 0, 0, 0.1)' : undefined,
        },
        '&:active': {
          backgroundColor: !disabled ? 'rgba(0, 0, 0, 0.2)' : undefined,
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
