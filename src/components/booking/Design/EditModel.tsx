import { storage } from '@/firebase/config';
import { Model3DContext, Model3DPropsType } from '@/pages/booking';
import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import { getDownloadURL, ref } from 'firebase/storage';
import React, { useContext, useEffect, useState } from 'react';
const texturesData = [
  {
    name: 'Dâu',
    path: 'https://firebasestorage.googleapis.com/v0/b/hnhbakery-83cdd.appspot.com/o/cakeTextures%2Fstrawberry.png?alt=media&token=4595f126-25a7-4a9c-a6de-a5b55b67593f',
  },
  {
    name: 'Vani',
    path: 'https://firebasestorage.googleapis.com/v0/b/hnhbakery-83cdd.appspot.com/o/cakeTextures%2Fvani.png?alt=media&token=12ff1884-9366-4113-b8cb-a19af6607808',
  },
];
function EditModel() {
  const { array, editIndex, handleChangeContext } = useContext(Model3DContext);
  if (editIndex === -1) {
    return (
      <>
        <Box
          component={'div'}
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="body1"
            sx={{ textAlign: 'center', color: 'grey.500' }}
          >
            Chưa chọn mô hình
          </Typography>
        </Box>
      </>
    );
  }
  const { children, textures } = array[editIndex];

  return (
    <>
      <Typography
        variant="body1"
        sx={{
          fontWeight: 'bold',
          width: '100%',
          backgroundColor: 'secondary.main',
          color: 'common.white',
          textAlign: 'center',
          px: 2,
          py: 0.5,
        }}
      >
        Điều chỉnh
      </Typography>
      <Stack direction="column" sx={{ width: '100%' }} gap={0}>
        <CustomAccodion label="Thông số">
          <Stack direction="column" sx={{ width: '100%' }} gap={1}>
            <Box component={'div'} sx={{ width: '100%' }}>
              <Typography variant="caption">Xoay ngang</Typography>
              <Slider
                defaultValue={0}
                valueLabelDisplay="auto"
                step={15}
                marks
                min={-180}
                max={180}
                size="small"
                color="secondary"
              />
            </Box>

            <Box component={'div'} sx={{ width: '100%' }}>
              <Typography variant="caption">Xoay dọc</Typography>
              <Slider
                defaultValue={0}
                valueLabelDisplay="auto"
                step={15}
                marks
                min={-180}
                max={180}
                size="small"
                color="secondary"
              />
            </Box>

            <Box component={'div'} sx={{ width: '100%' }}>
              <Typography variant="caption">Xoay trục</Typography>
              <Slider
                defaultValue={0}
                valueLabelDisplay="auto"
                step={15}
                marks
                min={-180}
                max={180}
                size="small"
                color="secondary"
              />
            </Box>
          </Stack>
        </CustomAccodion>

        {children && handleChangeContext && textures && children.length > 0 && (
          <CustomAccodion label="Lớp phủ">
            <Stack direction="column" sx={{ width: '100%' }} gap={1}>
              {children.map((label, i) => {
                return (
                  <FormControl fullWidth key={i}>
                    <InputLabel size="small" color="secondary">
                      {label}
                    </InputLabel>
                    <CustomSelect i={i} label={label} />
                  </FormControl>
                );
              })}
            </Stack>
          </CustomAccodion>
        )}
      </Stack>
    </>
  );
}

export default EditModel;

function CustomSelect({ label, i }: { i: number; label: string }) {
  const { array, editIndex, handleChangeContext } = useContext(Model3DContext);
  const { textures } = array[editIndex];
  if (!textures) {
    return null;
  }

  const [value, setValue] = useState(textures[i]?.path ?? '');
  console.log(value);

  return (
    <>
      <Select
        label={label}
        color="secondary"
        size="small"
        value={value}
        onChange={(e: any) => {
          setValue(e.target.value);

          let newTextures = [...textures];
          const tt = texturesData.find(
            (texture) => texture.path === e.target.value
          );
          console.log(tt);

          newTextures[i] = {
            name: tt?.name ?? '',
            path: tt?.path ?? '',
          };

          const newValue = {
            ...array[editIndex],
            textures: newTextures,
          };
          handleChangeContext &&
            handleChangeContext('array', newValue, editIndex);
        }}
      >
        {texturesData.map((texture, i) => (
          <MenuItem key={i} value={texture.path}>
            <CustomMenuItem {...texture} />
          </MenuItem>
        ))}
      </Select>
    </>
  );
}

function CustomMenuItem({ name, path }: { name: string; path: string }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <>
      <Box
        component={'div'}
        sx={{
          width: '96%',
          height: '48px',
          position: 'relative',
          borderRadius: 3,
          my: 0.5,
          overflow: 'hidden',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Box
          component={'img'}
          src={path}
          alt="texture"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            transition: 'all 0.2s ease',
            transform: hovered ? 'scale(1.3)' : 'scale(1)',
          }}
        />

        <Box
          component={'div'}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            transition: 'all 0.2s ease',
            opacity: hovered ? 1 : 0,
          }}
        >
          <Typography
            variant="caption"
            fontWeight={'bold'}
            sx={{ color: 'common.white' }}
          >
            {name}
          </Typography>
        </Box>
      </Box>
    </>
  );
}

function CustomAccodion({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Accordion
      sx={{
        width: '100%',
        boxShadow: 'none',
        borderBottom: 1,
        borderColor: 'grey.400',
        borderRadius: 0,
      }}
      square
      disableGutters
    >
      <AccordionSummary
        sx={{
          backgroundColor: 'grey.300',
        }}
        expandIcon={<ExpandMore fontSize="small" />}
      >
        <Typography variant="body2">{label}</Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}
