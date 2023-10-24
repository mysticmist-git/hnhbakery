import defaultAva from '@/assets/defaultAva.jpg';
import { CustomIconButton } from '@/components/buttons';
import { storage } from '@/firebase/config';
import { UserObject } from '@/lib/models';
import User from '@/models/user';
import { CameraAlt } from '@mui/icons-material';
import { Box, useTheme } from '@mui/material';
import { alpha } from '@mui/system';
import { ref } from 'firebase/storage';
import { url } from 'inspector';
import Image from 'next/image';
import { ChangeEventHandler, useRef, useState } from 'react';
import { useDownloadURL } from 'react-firebase-hooks/storage';

function ProfileAvatar({
  image,
  onUploadImage,
  onUpdateUserData,
}: {
  image: string;
  onUploadImage: ChangeEventHandler<HTMLInputElement>;
  onUpdateUserData?: (field: keyof User, value: User[keyof User]) => void;
}) {
  const theme = useTheme();

  const [url, urlLoading, urlError] = useDownloadURL(
    image ? ref(storage, image) : null
  );

  const [avtHover, setAvtHover] = useState(false);
  const inputfileRef = useRef<HTMLInputElement>(null);

  return (
    <Box
      sx={{
        width: '100%',
        aspectRatio: 1,
        overflow: 'hidden',
        borderRadius: '50%',
        position: 'relative',
        border: 3,
        borderColor: theme.palette.secondary.main,
      }}
      onMouseEnter={() => setAvtHover(true)}
      onMouseLeave={() => setAvtHover(false)}
    >
      <Box
        component={Image}
        src={url ?? defaultAva.src}
        fill
        sx={{
          objectFit: 'cover',
        }}
        alt="user-photoURL"
      />
      {avtHover && (
        <CustomIconButton
          sx={{
            position: 'absolute',
            top: '50%',
            width: '100%',
            aspectRatio: 1,
            left: '50%',
            transform: 'translate(-50%,-50%)',
            backgroundColor: alpha(theme.palette.common.black, 0.5),
            color: theme.palette.common.white,
            '&:hover': {
              backgroundColor: alpha(theme.palette.common.black, 0.5),
            },
          }}
          onClick={() => inputfileRef.current && inputfileRef.current.click()}
        >
          <CameraAlt />
          <input
            ref={inputfileRef}
            accept="image/*"
            type="file"
            hidden
            onChange={onUploadImage}
          />
        </CustomIconButton>
      )}
    </Box>
  );
}

export default ProfileAvatar;
