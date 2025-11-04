import { createSlice} from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";
import type { SpeakerData, SpeakerState } from "../types";

const initialState: SpeakerState = {
  speakers: [],
};

const speakerSlice = createSlice({
    name: "speaker",
    initialState,
    reducers: {
        setSpeakers: (state, action: PayloadAction<SpeakerData[]>) => {
            state.speakers = action.payload;
        },
       
    }
});

export const { setSpeakers } = speakerSlice.actions;
export default speakerSlice.reducer;