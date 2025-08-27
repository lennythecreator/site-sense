import {configureStore} from '@reduxjs/toolkit';
import savedReportReducer from './savedreports/savedReportSlice.ts';
import operatorViolationReducer from './operatorViolationSlice.ts';
export const store = configureStore({
    reducer:{
        savedReports: savedReportReducer,
        operatorViolation: operatorViolationReducer, 
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;