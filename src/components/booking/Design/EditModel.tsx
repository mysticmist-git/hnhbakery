import { storage } from '@/firebase/config';
import { getCakeTextures } from '@/lib/DAO/cakeTextureDAO';
import CakeTexture from '@/models/cakeTexture';
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
import React, { useContext, useEffect, useMemo, useState } from 'react';
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

  if (!array[editIndex]) {
    return <></>;
  }
  const { children, textures, rotation, ghim } = array[editIndex];

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

      <Stack
        direction="column"
        sx={{
          width: '100%',
          height: '100%',
          overflow: 'auto',
          pb: 4,
          '&::-webkit-scrollbar': { display: 'none' },
        }}
        gap={0}
      >
        {editIndex != 0 &&
          rotation &&
          ghim !== undefined &&
          handleChangeContext && (
            <CustomAccodion label="Thông số">
              <Stack direction="column" sx={{ width: '100%' }} gap={1}>
                <Box component={'div'} sx={{ width: '100%' }}>
                  <Typography variant="caption">Độ lớn</Typography>
                  <CustomSliderScale />
                </Box>

                <Box component={'div'} sx={{ width: '100%' }}>
                  <Typography variant="caption">Ghim</Typography>
                  <CustomSliderGhim />
                </Box>

                <Box component={'div'} sx={{ width: '100%' }}>
                  <Typography variant="caption">Xoay ngang</Typography>
                  <CustomSliderRotation i={2} />
                </Box>

                <Box component={'div'} sx={{ width: '100%' }}>
                  <Typography variant="caption">Xoay dọc</Typography>
                  <CustomSliderRotation i={0} />
                </Box>

                <Box component={'div'} sx={{ width: '100%' }}>
                  <Typography variant="caption">Xoay trục</Typography>
                  <CustomSliderRotation i={1} />
                </Box>
              </Stack>
            </CustomAccodion>
          )}

        {children && handleChangeContext && textures && children.length > 0 && (
          <CustomAccodion label="Lớp phủ">
            <Stack direction="column" sx={{ width: '100%', py: 1 }} gap={2}>
              {children.map((label, i) => {
                if (editIndex == 0) {
                  if (label.includes('Default')) {
                    const displayLabel = label.split('_')[1];
                    return (
                      <FormControl fullWidth key={i}>
                        <InputLabel size="small" color="secondary">
                          {displayLabel}
                        </InputLabel>
                        <CustomSelect i={i} label={displayLabel} />
                      </FormControl>
                    );
                  }
                } else {
                  const displayLabel = label.includes('Default')
                    ? label.split('_')[1]
                    : label;
                  return (
                    <FormControl fullWidth key={i}>
                      <InputLabel size="small" color="secondary">
                        {displayLabel}
                      </InputLabel>
                      <CustomSelect i={i} label={displayLabel} />
                    </FormControl>
                  );
                }
              })}
            </Stack>
          </CustomAccodion>
        )}
      </Stack>
    </>
  );
}

export default EditModel;

function CustomSliderGhim() {
  const { editIndex, array, handleChangeContext } = useContext(Model3DContext);

  if (!array[editIndex]) {
    return <></>;
  }
  const { ghim, box3 } = array[editIndex];

  if (ghim == undefined || box3 == undefined) {
    return <></>;
  }
  const [data, setData] = useState(Math.round(ghim * 100));
  const height = useMemo(() => box3.max.y - box3.min.y, [box3]);
  useEffect(() => {
    setData(Math.round(ghim * 100));
  }, [ghim]);

  return (
    <>
      <Slider
        value={data}
        onChange={(e, newValue) => {
          setData(newValue as number);

          if (handleChangeContext && editIndex !== -1) {
            handleChangeContext(
              'array',
              {
                ...array[editIndex],
                ghim: (newValue as number) / 100,
              },
              editIndex
            );
          }
        }}
        valueLabelDisplay="auto"
        step={Math.round((height * 100) / (3 * 5))}
        marks
        min={0}
        max={Math.round((height * 100) / 3)}
        size="small"
        color="secondary"
      />
    </>
  );
}

function CustomSliderScale() {
  const { editIndex, array, handleChangeContext } = useContext(Model3DContext);
  if (!array[editIndex]) {
    return <></>;
  }
  const { scale } = array[editIndex];
  if (!scale) {
    return <></>;
  }
  const [data, setData] = useState(scale);

  useEffect(() => {
    setData(scale);
  }, [scale]);

  return (
    <>
      <Slider
        value={data}
        onChange={(e, newValue) => {
          setData(newValue as number);

          if (handleChangeContext && editIndex !== -1) {
            handleChangeContext(
              'array',
              {
                ...array[editIndex],
                scale: newValue as number,
              },
              editIndex
            );
          }
        }}
        valueLabelDisplay="auto"
        step={1 / 10}
        marks
        min={0.5}
        max={1.5}
        size="small"
        color="secondary"
      />
    </>
  );
}

function CustomSliderRotation({ i }: { i: number }) {
  const { editIndex, array, handleChangeContext } = useContext(Model3DContext);
  if (!array[editIndex]) {
    return <></>;
  }
  const { rotation } = array[editIndex];
  if (!rotation) {
    return <></>;
  }
  const [data, setData] = useState(Math.round(rotation[i] * (180 / Math.PI)));

  useEffect(() => {
    setData(Math.round(rotation[i] * (180 / Math.PI)));
  }, [rotation, i]);

  return (
    <>
      <Slider
        value={data}
        onChange={(e, newValue) => {
          setData(newValue as number);

          if (handleChangeContext && editIndex !== -1) {
            const r = [...rotation];
            r[i] = (newValue as number) / (180 / Math.PI);
            handleChangeContext(
              'array',
              {
                ...array[editIndex],
                rotation: r,
              },
              editIndex
            );
          }
        }}
        valueLabelDisplay="auto"
        step={15}
        marks
        min={-180}
        max={180}
        size="small"
        color="secondary"
      />
    </>
  );
}

function CustomSelect({ label, i }: { i: number; label: string }) {
  const { array, editIndex, handleChangeContext, textureData } =
    useContext(Model3DContext);
  if (!array[editIndex]) {
    return <></>;
  }
  const { textures } = array[editIndex];
  if (!textures || !textureData) {
    return null;
  }

  const [value, setValue] = useState(textures[i]?.path ?? '');

  useEffect(() => {
    setValue(textures[i]?.path ?? '');
  }, [i, textures]);

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
          const tt = textureData.find(
            (texture) => texture.image === e.target.value
          );

          newTextures[i] = {
            name: tt?.name ?? '',
            path: tt?.image ?? '',
          };

          const newValue = {
            ...array[editIndex],
            textures: newTextures,
          };
          handleChangeContext &&
            handleChangeContext('array', newValue, editIndex);
        }}
      >
        {textureData.map((texture, i) => (
          <MenuItem key={i} value={texture.image}>
            <CustomMenuItem name={texture.name} path={texture.image} />
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
