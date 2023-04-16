import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { auth } from '@/firebase/config';

interface Props {
  photoURL: string | null;
}

export default function NavbarAvatar(props: Props) {
  const { photoURL } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenManagement = () => {
    router.push('/manager/manage');
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/auth');
  };

  return (
    <>
      <Avatar src={photoURL as string | undefined} onClick={handleClick} />
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleOpenManagement}>Quản lý</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
}
