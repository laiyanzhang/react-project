interface dataItem {
  id?: number,
  name: string,
  age: string,
}

interface action {
  type: string,
  item?: dataItem,
  id?: number,
}

export default function tableReducer(draft: Array<dataItem>, action: action) {
  switch(action.type) {
    case 'add': {
      if(action.item) draft.push(action.item)
      break
    }
    case 'edit': {
      if(action.item) {
        const index = draft.findIndex((item: dataItem) => item.id == action.id)
        draft[index] = action.item
      }
      break
    }
    case 'delete': {
      return draft.filter((t: dataItem) => t.id !== action.id)
    }
  }
}