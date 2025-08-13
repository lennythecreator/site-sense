import { createSlice } from "@reduxjs/toolkit";

interface SavedReportState{
    reports: Record<string,any>;

}

const initialState: SavedReportState = {
    reports: {},
}

const savedReportSlice = createSlice({
    name: 'savedReports',
    initialState,
    reducers:{
        addReport: (state, action)=>{
            const { reportId, reportData } = action.payload;
            state.reports[reportId] = reportData;
            console.log('Report added:', reportId, reportData);
        },
    }
})

export const { addReport } = savedReportSlice.actions;
export default savedReportSlice.reducer;