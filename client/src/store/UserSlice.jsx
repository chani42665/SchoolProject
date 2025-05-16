import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialValue = {
    user:null,
    status: "idle", // idle | loading | succeeded | failed
    error: null
}

// Thunk for creating a user
export const createUser = createAsyncThunk(
    'user/createUser',
    async (userData, { rejectWithValue }) => {
        try {
            console.log('Sending login request:', userData);
            const response = await axios.post('http://localhost:8080/login/', {
                email: userData.email,
                password: userData.password
            });
            localStorage.setItem("token", response.data.token);
            console.log('Login response:', response.data);
            const { token, ...newData } = response.data // לוג לתשובה
            return newData;
        } catch (error) {
            console.error('Login error:', error.response?.data || 'Unknown error'); // לוג לשגיאה
            return rejectWithValue(error.response?.data || 'שגיאה כללית');
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState: initialValue,
    reducers: {
        logoutUser: (state) => {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            state.user = null;
            state.status = 'idle';
            state.error = null;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.status = 'succeeded';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.user = action.payload.user; // שמירה של כל פרטי המשתמש
                state.status = 'succeeded';
                localStorage.setItem("user", JSON.stringify(action.payload.user));

            })
            .addCase(createUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const { logoutUser ,setUser } = userSlice.actions;
export default userSlice.reducer;