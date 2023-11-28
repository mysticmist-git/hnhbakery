import { useTheme } from '@emotion/react';
import { AddRounded, CloseRounded } from '@mui/icons-material';
import { Box, Button, IconButton, Stack } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

export type Buoc1Props = {
  imageArray: File[];
  handleImageArrayChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
};

export function Buoc1({
  imageArray,
  handleImageArrayChange,
  removeImage,
}: Buoc1Props) {
  return (
    <>
      <Box
        component={'div'}
        sx={{
          width: '100%',
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          flexWrap={'wrap'}
          sx={{
            mx: -1,
          }}
        >
          {imageArray.map((item, index) => (
            <Box
              component={'div'}
              key={index}
              sx={{
                m: 1,
                width: 248,
                aspectRatio: '1',
              }}
            >
              <Box
                component={'div'}
                sx={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 2,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <Box
                  component={'img'}
                  src={URL.createObjectURL(item)}
                  alt="logo"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: ' all 0.2s ease-in-out',
                    objectPosition: 'center',
                    backgroundColor: 'grey.300',
                    '&:hover': {
                      transform: 'scale(1.2)',
                    },
                  }}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.9)',
                      color: 'white',
                    },
                  }}
                  size="small"
                  onClick={() => {
                    confirm('Bạn muốn xóa ảnh này?') && removeImage(index);
                  }}
                >
                  <CloseRounded
                    fontSize="inherit"
                    sx={{
                      color: 'inherit',
                      pointerEvents: 'none',
                    }}
                  />
                </IconButton>
              </Box>
            </Box>
          ))}
          <Box
            component={'div'}
            sx={{
              m: 1,
              width: 248,
              aspectRatio: '1',
            }}
          >
            <Button
              variant="contained"
              component="label"
              sx={{
                width: '100%',
                height: '100%',
                borderRadius: 2,
                overflow: 'hidden',
                backgroundColor: 'grey.400',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: 'none',
              }}
            >
              <AddRounded
                sx={{
                  pointerEvents: 'none',
                  color: 'white',
                }}
                fontSize="large"
              />
              <input
                accept="image/*"
                hidden
                multiple
                type="file"
                onChange={handleImageArrayChange}
              />
            </Button>
          </Box>
        </Stack>
      </Box>
    </>
  );
}
