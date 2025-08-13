import {configureStore} from '@reduxjs/toolkit';
import savedReportReducer from './savedreports/savedReportSlice.ts';

export const store = configureStore({
    reducer:{
        savedReports: savedReportReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;