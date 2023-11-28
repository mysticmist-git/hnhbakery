import { storage } from '@/firebase/config';
import { getCakeTextures } from '@/lib/DAO/cakeTextureDAO';
import CakeTexture from '@/models/cakeTexture';
import { Model3DContext, Model3DPropsType } from '@/pages/booking';
import {
  CheckBoxRounded,
  DisabledByDefaultRounded,
  ExpandMore,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Font_List } from './Utils';
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
  const { children, textures, rotation, ghim, isText, isShow } =
    array[editIndex];

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
      {isShow && (
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
          {editIndex != 0 && isText && handleChangeContext && (
            <CustomAccodion label="Văn bản">
              <Stack direction="column" sx={{ width: '100%', py: 1 }} gap={2}>
                <FormControl fullWidth>
                  <InputLabel size="small" color="secondary">
                    Font chữ
                  </InputLabel>
                  <CustomSelectFontChu label={'Font chữ'} />
                </FormControl>

                <FormControl fullWidth>
                  <CustomTextFieldNoiDung label={'Nội dung'} />
                </FormControl>
              </Stack>
            </CustomAccodion>
          )}

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

          {children &&
            children.length > 0 &&
            handleChangeContext &&
            textures &&
            textures.length > 0 && (
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
                            <CustomSelectLopPhu i={i} label={displayLabel} />
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
                          <CustomSelectLopPhu i={i} label={displayLabel} />
                        </FormControl>
                      );
                    }
                  })}
                </Stack>
              </CustomAccodion>
            )}
        </Stack>
      )}
    </>
  );
}

export default EditModel;

function CustomSliderGhim() {
  const { editIndex, array, handleChangeContext } = useContext(Model3DContext);

  if (!array || !array[editIndex] || !array[0] || array.length < 2) {
    return <></>;
  }
  const { ghim, box3, planeId } = array[editIndex];
  const { box3: box3Span } = array[0];

  if (
    ghim == undefined ||
    box3 == undefined ||
    box3Span == undefined ||
    planeId == undefined
  ) {
    return <></>;
  }
  const [data, setData] = useState(Math.round(ghim * 100));

  const height = useMemo(() => {
    if (!box3 || !box3Span) {
      return 0;
    }
    let objHeight = 0;
    let spanHeight = 0;
    if (planeId.id == 0 || planeId.id == 1) {
      objHeight = box3.max.z - box3.min.z;
      spanHeight = box3Span.max.z - box3Span.min.z;
      return Math.min(objHeight, spanHeight);
    } else if (planeId.id == 2) {
      objHeight = box3.max.y - box3.min.y;
      spanHeight = box3Span.max.y - box3Span.min.y;
    } else if (planeId.id == 4 || planeId.id == 5) {
      objHeight = box3.max.x - box3.min.x;
      spanHeight = box3Span.max.x - box3Span.min.x;
    }
    console.log(objHeight, spanHeight);

    return Math.min(objHeight, spanHeight);
  }, [box3, box3Span]);

  const pow_ten_zeroAmount = useMemo(() => {
    const numberString = height.toString();
    let count = 2;
    for (let i = numberString.indexOf('.') + 1; i < numberString.length; i++) {
      if (numberString[i] !== '0') {
        break;
      } else if (numberString[i] === '0') {
        count++;
      }
    }
    return Math.pow(10, count);
  }, [height]);

  const sliderValue = useMemo(() => {
    return {
      max: Math.round((height * pow_ten_zeroAmount * 1) / 2),
      step: Math.round((height * pow_ten_zeroAmount * 1) / (2 * 10)),
      min: 0 - Math.round((height * pow_ten_zeroAmount * 1) / (2 * 10)) * 5,
    };
  }, [height, pow_ten_zeroAmount]);

  useEffect(() => {
    setData(ghim * pow_ten_zeroAmount);
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
                ghim: (newValue as number) / pow_ten_zeroAmount,
              },
              editIndex
            );
          }
        }}
        valueLabelDisplay="auto"
        step={sliderValue.step}
        marks
        min={sliderValue.min}
        max={sliderValue.max}
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

function CustomSelectLopPhu({ label, i }: { i: number; label: string }) {
  const { array, editIndex, handleChangeContext, textureData } =
    useContext(Model3DContext);
  if (!array[editIndex]) {
    return <></>;
  }
  const { textures } = array[editIndex];
  if (!textures || !textureData || textures[i] == undefined) {
    return null;
  }

  const [value, setValue] = useState(textures[i].path);

  useEffect(() => {
    setValue(textures[i].path);
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
            <CustomMenuItemLopPhu name={texture.name} path={texture.image} />
          </MenuItem>
        ))}
      </Select>
    </>
  );
}

function CustomSelectFontChu({ label }: { label: string }) {
  const { array, editIndex, handleChangeContext, textureData } =
    useContext(Model3DContext);
  if (!array[editIndex]) {
    return <></>;
  }
  const { path } = array[editIndex];
  if (path == undefined) {
    return <></>;
  }

  const [value, setValue] = useState(path);
  useEffect(() => {
    setValue(path);
  }, [path]);

  return (
    <>
      <Select
        label={label}
        color="secondary"
        size="small"
        value={value}
        onChange={(e: any) => {
          setValue(e.target.value);
          const newValue = {
            ...array[editIndex],
            path: e.target.value,
          };
          handleChangeContext &&
            handleChangeContext('array', newValue, editIndex);
        }}
      >
        {Font_List.map((font, i) => (
          <MenuItem key={i} value={font}>
            <CustomMenuItemFontChu name={font} path={font} />
          </MenuItem>
        ))}
      </Select>
    </>
  );
}

function CustomTextFieldNoiDung({ label }: { label: string }) {
  const { array, editIndex, handleChangeContext, textureData } =
    useContext(Model3DContext);
  if (!array[editIndex]) {
    return <></>;
  }
  const { children, path } = array[editIndex];
  if (children == undefined || children[0] === undefined) {
    return <></>;
  }

  const [value, setValue] = useState(children[0]);
  useEffect(() => {
    setValue(children[0]);
  }, [children[0]]);

  return (
    <>
      <TextField
        label={label}
        color="secondary"
        size="small"
        multiline
        rows={3}
        value={value}
        onChange={(e: any) => {
          setValue(e.target.value);
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {value != children[0] && (
                <Box
                  component={'div'}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <IconButton
                    size="small"
                    color="secondary"
                    onClick={() => {
                      setValue(children[0]);
                    }}
                  >
                    <DisabledByDefaultRounded fontSize="inherit" />
                  </IconButton>

                  <IconButton
                    size="small"
                    color="success"
                    onClick={() => {
                      const newValue = {
                        ...array[editIndex],
                        children: [value],
                      };
                      handleChangeContext &&
                        handleChangeContext('array', newValue, editIndex);
                    }}
                  >
                    <CheckBoxRounded fontSize="inherit" />
                  </IconButton>
                </Box>
              )}
            </InputAdornment>
          ),
          sx: {
            fontFamily: path,
            fontSize: 'body2.fontSize',
          },
        }}
      />
    </>
  );
}

function CustomMenuItemLopPhu({ name, path }: { name: string; path: string }) {
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

function CustomMenuItemFontChu({ name, path }: { name: string; path: string }) {
  return (
    <>
      <Box
        component={'div'}
        sx={{
          width: '100%',
          position: 'relative',
          my: 0.5,
          overflow: 'hidden',
        }}
      >
        <Typography
          variant="body1"
          textAlign={'center'}
          sx={{
            width: '100%',
            height: '100%',
            fontFamily: path,
          }}
        >
          {name.replace(/([A-Z])/g, ' $1')}
        </Typography>
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
