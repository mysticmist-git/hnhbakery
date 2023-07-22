import { useEffect, useState } from 'react';

function useNumberCounter(
  init: number,
  min: number,
  max: number
): [
  value: number,
  setValue: React.Dispatch<React.SetStateAction<number>>,
  decreaseValue: () => void,
  increaseValue: () => void
] {
  const [value, setValue] = useState(Math.min(init, max));
  function handleAddClick() {
    if (value < max) {
      const newValue = value + 1;
      setValue(newValue);
    }
  }

  function handleMinusClick() {
    if (value > min) {
      const newValue = value - 1;
      setValue(newValue);
    }
  }

  useEffect(() => {
    if (max < value) {
      setValue(() => max);
    }
  }, [max, value]);

  return [value, setValue, handleAddClick, handleMinusClick];
}

export default useNumberCounter;
