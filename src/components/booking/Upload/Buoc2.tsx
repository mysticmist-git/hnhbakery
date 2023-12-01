import { getCakeBases } from '@/lib/DAO/cakeBaseDAO';
import { getCakeOccasions } from '@/lib/DAO/cakeOccasionDAO';
import { getColors } from '@/lib/DAO/colorDAO';
import { getSizes } from '@/lib/DAO/sizeDAO';
import { getDownloadUrlFromFirebaseStorage } from '@/lib/firestore';
import BookingItem from '@/models/bookingItem';
import CakeBase from '@/models/cakeBase';
import CakeOccasion from '@/models/cakeOccasion';
import Color from '@/models/color';
import Size from '@/models/size';
import { SquareRounded } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

const Buoc2Autocomplete = ({
  label,
  options,
  inputValue,
  setInputValue,
}: {
  label: string;
  options: string[];
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <>
      <Autocomplete
        freeSolo
        disableClearable
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        options={options}
        sx={{ width: '100%' }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            color="secondary"
            InputProps={{
              ...params.InputProps,
              sx: {
                borderRadius: 2,
                fontSize: 'body2.fontSize',
              },
            }}
          />
        )}
      />
    </>
  );
};

const CakeBaseImg = ({ src }: { src: string }) => {
  const [image, setImage] = useState('');
  useEffect(() => {
    async function getImage() {
      if (!src) {
        return;
      }
      setImage(await getDownloadUrlFromFirebaseStorage(src));
    }
    getImage();
  }, [src]);
  return (
    <>
      <Box
        component={'img'}
        loading="lazy"
        src={image}
        alt=""
        sx={{
          width: 100,
          borderRadius: 2,
          objectFit: 'cover',
          objectPosition: 'center',
          aspectRatio: '1/1',
        }}
      />
    </>
  );
};

const ChooseMessageColor = ({
  message,
  handleChangeColor,
}: {
  message: { content: string; color: string };
  handleChangeColor: (color: string) => void;
}) => {
  const [colors, setColors] = useState<Color[]>([]);

  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  const handleListItemClick = (index: number) => {
    setSelectedIndex(index);
  };

  useEffect(() => {
    async function fetchData() {
      const colorsData = await getColors();
      setColors(colorsData);
      if (message.color) {
        setSelectedIndex(
          colorsData.findIndex((color) => color.hex === message.color)
        );
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!colors[selectedIndex]) {
      return;
    }
    handleChangeColor(colors[selectedIndex].hex);
  }, [selectedIndex]);

  return (
    <>
      <Box component={'div'} sx={{ width: '100%' }}>
        <Box
          component={'div'}
          sx={{
            width: '100%',
            direction: 'row',
            display: 'flex',
            gap: 2,
            pt: 2,
          }}
        >
          {colors.map((color, index) => (
            <Button
              variant={'contained'}
              color="secondary"
              key={index}
              size="small"
              onClick={() => handleListItemClick(index)}
              sx={{
                borderRadius: 3,
                border: 3,
                minWidth: 0,
                p: 1,
                borderColor:
                  selectedIndex === index ? 'secondary.main' : 'white',
                backgroundColor: 'white',
                '&:hover': {
                  backgroundColor: 'grey.200',
                },
              }}
            >
              <SquareRounded
                sx={{ color: color.hex, fontSize: 'h2.fontSize' }}
              />
            </Button>
          ))}
        </Box>
      </Box>
    </>
  );
};

export function Buoc2({
  bookingItem,
  handleBookingItemChange,
}: {
  bookingItem: BookingItem;
  handleBookingItemChange: (key: keyof BookingItem, value: any) => void;
}) {
  const [occasions, setOccasions] = useState<CakeOccasion[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [cakeBases, setCakeBases] = useState<CakeBase[]>([]);

  const [inputOccassion, setInputOccasion] = React.useState('');
  const [inputSize, setInputSize] = React.useState('');
  const [inputCakeBaseId, setInputCakeBaseId] = React.useState('');
  const [valueCakeBase, setValueCakeBase] = React.useState<CakeBase | null>(
    null
  );
  const [message, setMessage] = React.useState(bookingItem.message!);
  const handleChangeColor = (color: string) => {
    setMessage((prev) => ({
      ...prev,
      color: color,
    }));
  };

  const [note, setNote] = React.useState('');

  useEffect(() => {
    async function fetchData() {
      setOccasions(await getCakeOccasions());
      setSizes(await getSizes());
      const cakeBases = await getCakeBases();
      setCakeBases(cakeBases);

      setInputOccasion(bookingItem.occasion!);
      setInputSize(bookingItem.size);
      setInputCakeBaseId(bookingItem.cake_base_id);
      setValueCakeBase(
        cakeBases.find((item) => item.id === bookingItem.cake_base_id) ?? null
      );
      setMessage(bookingItem.message!);
      setNote(bookingItem.note!);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (valueCakeBase) {
      setInputCakeBaseId(valueCakeBase.id!);
    }
  }, [valueCakeBase]);

  useEffect(() => {
    handleBookingItemChange('occasion', inputOccassion);
  }, [inputOccassion]);

  useEffect(() => {
    handleBookingItemChange('size', inputSize);
  }, [inputSize]);

  useEffect(() => {
    handleBookingItemChange('cake_base_id', inputCakeBaseId);
  }, [inputCakeBaseId]);

  useEffect(() => {
    handleBookingItemChange('message', message);
  }, [message]);

  useEffect(() => {
    handleBookingItemChange('note', note);
  }, [note]);
  return (
    <>
      <Box
        component={'div'}
        sx={{
          width: '100%',
          pt: 1,
          pb: 4,
        }}
      >
        <Grid
          container
          spacing={3}
          sx={{ width: '100%' }}
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={12}>
            <Divider>
              <Chip
                variant="filled"
                sx={{
                  px: 2,
                  color: 'white',
                  backgroundColor: 'secondary.main',
                }}
                label="Tùy chỉnh"
                size="small"
              />
            </Divider>
          </Grid>

          <Grid item xs={12} md={6}>
            <Buoc2Autocomplete
              label="Nhân dịp"
              options={occasions.map((item) => item.name)}
              inputValue={inputOccassion}
              setInputValue={setInputOccasion}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Buoc2Autocomplete
              label="Kích thước bánh"
              options={sizes.map((item) => item.name.toUpperCase())}
              inputValue={inputSize}
              setInputValue={setInputSize}
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              value={valueCakeBase}
              onChange={(event: any, newValue: CakeBase | null) => {
                setValueCakeBase(newValue);
              }}
              options={cakeBases}
              getOptionLabel={(option) => option.name ?? ''}
              sx={{ width: '100%' }}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  sx={{
                    '& > img': { mr: 2, flexShrink: 0 },
                    position: 'relative',
                  }}
                  {...props}
                >
                  <CakeBaseImg src={option.image} />
                  <Box
                    component={'div'}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography variant="body2">{option.name}</Typography>
                    <Typography variant="caption">
                      {option.description}
                    </Typography>
                  </Box>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Cốt bánh"
                  color="secondary"
                  InputProps={{
                    ...params.InputProps,
                    sx: {
                      borderRadius: 2,
                      fontSize: 'body2.fontSize',
                    },
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider>
              <Chip
                variant="filled"
                sx={{
                  px: 2,
                  color: 'white',
                  backgroundColor: 'secondary.main',
                }}
                label="Văn bản"
                size="small"
              />
            </Divider>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label={'Lời chúc và thông điệp'}
              color="secondary"
              sx={{
                width: '100%',
              }}
              value={message.content}
              onChange={(e) => {
                setMessage((prev) => ({
                  ...prev,
                  content: e.target.value,
                }));
              }}
              InputProps={{
                sx: {
                  borderRadius: 2,
                  fontSize: 'body2.fontSize',
                },
              }}
            />
            <ChooseMessageColor
              message={message}
              handleChangeColor={handleChangeColor}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider>
              <Chip
                variant="filled"
                sx={{
                  px: 2,
                  color: 'white',
                  backgroundColor: 'secondary.main',
                }}
                label="Ghi chú"
                size="small"
              />
            </Divider>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label={'Ghi chú'}
              color="secondary"
              sx={{
                width: '100%',
              }}
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
              }}
              multiline
              rows={4}
              InputProps={{
                sx: {
                  borderRadius: 2,
                  fontSize: 'body2.fontSize',
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
