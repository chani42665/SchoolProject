import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialValue = {
    email: "",
    password: "",
    status: "idle", // idle | loading | succeeded | failed
    error: null
}

// Thunk for creating a user
export const createUser = createAsyncThunk(
    'user/createUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post('https://localhost:8080/login/', {
                email: userData.email,
                password: userData.password
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'שגיאה כללית');
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState: initialValue,
    reducers: {
        logoutUser: (state) => {
            state.email = '';
            state.password = '';
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.email = action.payload.email;
                state.password = action.payload.password;
                state.status = 'succeeded';
            })
            .addCase(createUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;