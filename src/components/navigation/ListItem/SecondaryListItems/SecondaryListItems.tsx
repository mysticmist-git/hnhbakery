import AssignmentIcon from '@mui/icons-material/Assignment';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import { useRouter } from 'next/router';
import React, { memo } from 'react';

//#region Constants

const PATH = '/manager/';

//#endregion

//#region Functions

function isActive(route: string) {
  const router = useRouter();
  return router.pathname === `${PATH}${route}`;
}

//#endregion

const SecondaryListItems = () => {
  return (
    <React.Fragment>
      <ListSubheader component="div" inset>
        Báo cáo đã lưu
      </ListSubheader>
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText
          sx={{ color: (theme) => theme.palette.text.secondary }}
          primary="Tháng này"
        />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText
          sx={{ color: (theme) => theme.palette.text.secondary }}
          primary="Quý trước"
        />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText
          sx={{ color: (theme) => theme.palette.text.secondary }}
          primary="Year-end sale"
        />
      </ListItemButton>
    </React.Fragment>
  );
};

export default memo(SecondaryListItems);
