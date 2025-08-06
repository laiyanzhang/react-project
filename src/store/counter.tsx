import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
    status: 'init'
  },
  reducers: {
    increment: state => {
      // Redux Toolkit 允许我们在 reducers 写 "可变" 逻辑。它
      // 并不是真正的改变状态值，因为它使用了 Immer 库
      // 可以检测到“草稿状态“ 的变化并且基于这些变化生产全新的
      // 不可变的状态
      state.value += 1
    },
    decrement: state => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(incrementAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(incrementAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.value += action.payload.data;
      })
      .addCase(incrementAsync.rejected, (state, action) => {
        state.status = 'failed'
        console.log(action.error.message)
      });
  },
})

interface IncrementAsyncResponse {
  data: number;
  message: string;
}

export const incrementAsync = createAsyncThunk<IncrementAsyncResponse, number>(
  'counter/fetchCount',  // 用于作为生成action类型的前缀
  async (amount) => {
    const response: IncrementAsyncResponse = await new Promise((res, rej) => {
      setTimeout(() => {
        if(amount > 3) {
          res({
            data: amount,
            message: 'success'
          })
        }
        else rej()
      }, 0)
    });
    return response;
  }
);

// 每个 case reducer 函数会生成对应的 Action creators
export const { increment, decrement, incrementByAmount } = counterSlice.actions

export default counterSlice.reducer