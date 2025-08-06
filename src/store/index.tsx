import { configureStore } from '@reduxjs/toolkit'
import counter from './counter'
import page from './page'

const store = configureStore({
  reducer: {
    counter,
    page
  },
  devTools: true
});

// 从 store 本身推断出 `RootState` 和 `AppDispatch` 类型
export type RootState = ReturnType<typeof store.getState>
export default store;