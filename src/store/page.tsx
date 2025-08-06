import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from '@reduxjs/toolkit'
import type { RootState } from './index'

interface item {
  id: number,
  title: string
  content?: string
}

const pageAdapter = createEntityAdapter({
  sortComparer: (a: item, b: item) => a.id - b.id
})

const initialState = pageAdapter.getInitialState({
  status: 'init',
  error: null
})

export const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    pageAddOne: pageAdapter.addOne,
    pageAddMany: pageAdapter.addMany,
    pageUpdate: pageAdapter.updateOne,
    pageUpdateAll: pageAdapter.setAll,
    pageUpdateContent: (state, action) => {
      const {id, title, content} = action.payload
      const page = state.entities[id]
      if(page) {
        page.title = title
        page.content = content
      }
    }
  },
  extraReducers(builder) {
    builder.addCase(pageAsync.fulfilled, (state, action) => {
      pageAdapter.setAll(state, action.payload);
    });
  }
})

interface IncrementAsyncResponse {
  id: number;
  title: string;
}

export const pageAsync = createAsyncThunk<IncrementAsyncResponse[]>(
  'page/fetch',  // 用于作为生成action类型的前缀
  async () => {
    const response: IncrementAsyncResponse[] = await new Promise((res) => {
      setTimeout(() => {
        res([
          {
            id: 1,
            title: '123'
          },
          {
            id: 2,
            title: '234'
          }
        ])
      }, 0)
    });
    return response;
  }
);


export const {
  selectAll: selectAllPage,
  /* selectById: selectPageById, */
  selectIds: selectPageIds
} = pageAdapter.getSelectors((state:RootState) => state.page)

export const selectPageById = createSelector(
  [selectAllPage, (_, id) => id],
  (pageList, id) => pageList.find(item => item.id === id)
)

export const { pageAddOne, pageAddMany, pageUpdate, pageUpdateAll, pageUpdateContent } = pageSlice.actions

export default pageSlice.reducer
