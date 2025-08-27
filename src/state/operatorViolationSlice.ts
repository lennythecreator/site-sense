import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedViolation: null,
};

const operatorViolationSlice = createSlice({
  name: 'operator-violation',
  initialState,
  reducers: {
    selectViolation(state, action) {
      state.selectedViolation = action.payload;
    },
  },
});

export const { selectViolation } = operatorViolationSlice.actions;
export default operatorViolationSlice.reducer;