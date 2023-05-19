import { useTheme } from '@emotion/react';
import { Tabs, Tab } from '@mui/material';
import Link from 'next/link';
import { memo, useContext } from 'react';
import { NavbarContext } from './Navbar';
import React from 'react';
import { TabItem } from '.';

const CustomTab = (props: any) => {
  const theme = useTheme();
  const context = useContext(NavbarContext);
  const [hoveredIndex, setHoveredIndex] = React.useState(-1);

  return (
    <Tabs
      orientation={props.orientation ? props.orientation : 'horizontal'}
      textColor="primary"
      indicatorColor="primary"
      value={context.tabs.value}
      onChange={(e: React.SyntheticEvent, newValue: number) =>
        context.handleSetTabState(newValue)
      }
      centered
    >
      {context.tabs.tabItems.map((item: TabItem, i: number) => (
        <Tab
          component={Link}
          key={i}
          label={item.label}
          href={item.href}
          sx={{
            color: (theme) =>
              i === hoveredIndex
                ? theme.palette.common.white
                : theme.palette.text.secondary,
            '&.Mui-selected': (theme) => ({
              color: theme.palette.common.white,
            }),
          }}
          onMouseEnter={() => {
            setHoveredIndex(() => i);
          }}
          onMouseLeave={() => {
            setHoveredIndex(() => -1);
          }}
        />
      ))}
    </Tabs>
  );
};

export default memo(CustomTab);
