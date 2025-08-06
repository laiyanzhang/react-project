import type { RootState } from '../../store/index'
import { decrement, increment, incrementByAmount, incrementAsync } from '@/store/counter'
import { pageAsync, selectAllPage, pageAddOne, pageUpdate, selectPageById, pageUpdateAll, pageUpdateContent } from '@/store/page'
import styles from './redux.module.less'

interface item {
  id: number,
  title: string
  content?: string
}

const Redux = () => {
  const count = useSelector((state: RootState) => state.counter.value)
  const targetPage : item = useSelector(state => selectPageById(state, 3))
  const pageList : Array<item> = useSelector(selectAllPage)
  const status = useSelector((state: RootState) => {
    const status = state.counter.status
    if(status == 'succeeded') return '成功'
    else if(status == 'loading') return '加载中'
    else if(status == 'failed') return '失败'
    else return '初始化'
  })
  const dispatch = useDispatch()

  const handleIncrement = () => {
    dispatch(increment())
  }
  const handleDecrement = () => {
    dispatch(decrement())
  }
  const handleAmount = () => {
    dispatch(incrementByAmount(3))
  }
  const handleSuccessSync = () => {
    dispatch(incrementAsync(4))
  }
  const handleErrorSync = () => {
    dispatch(incrementAsync(2))
  }
  const handleComponentSync = async () => {
    try {
      const res = await dispatch(incrementAsync(4)).unwrap()
      console.log(res)
    }
    catch (err) {
      console.log(err)
    }
  }

  const handleGetPage = () => {
    dispatch(pageAsync())
  }
  const handleAddOne = () => {
    const currentId = pageList[pageList.length - 1].id
    dispatch(pageAddOne({
      id: currentId + 1,
      title: String(currentId + 1) + String(currentId + 2) + String(currentId + 3)
    }))
  }
  const handleUpdateCurrent = () => {
    const currentId = pageList[pageList.length - 1].id
    dispatch(pageUpdate({
      id: currentId,
      changes: {
        id: currentId + 1,
        title: String(currentId + 1) + String(currentId + 2) + String(currentId + 3)
      }
    }))
  }
  const handleUpdateAll = () => {
    dispatch(pageUpdateAll([
      {
        id: 2,
        title: '234'
      },
      {
        id: 3,
        title: 345
      }
    ]))
  }

  const handleUpdateContent = () => {
    dispatch(pageUpdateContent({
      id: 3,
      title: '345',
      content: 'test'
    }))
  }

  return (
    <div className={styles.redux_page}>
      <div>
        <div>计数器</div>
        <div className={styles.operation}>
          <Button onClick={handleIncrement}>增加1</Button>
          <Button onClick={handleDecrement}>减少1</Button>
          <Button onClick={handleAmount}>增加3</Button>
          <Button onClick={handleSuccessSync}>成功异步增加4</Button>
          <Button onClick={handleErrorSync}>失败异步增加2</Button>
          <Button onClick={handleComponentSync}>组件内部处理异步</Button>
        </div>
        <div>{ count }</div>
        <div>当前状态：{ status }</div>
      </div>
      <div>
        <div>文章</div>
        <div className={styles.operation}>
          <Button onClick={handleGetPage}>获取文章列表</Button>
          <Button onClick={handleAddOne}>增加1篇文章</Button>
          <Button onClick={handleUpdateCurrent}>更新最近的1篇文章</Button>
          <Button onClick={handleUpdateAll}>更新全部文章</Button>
          <Button onClick={handleUpdateContent}>更新第3篇文章内容</Button>
        </div>
        <div>
          <div>第3篇文章</div>
          {
            targetPage ? (
              <div key={targetPage.id} className={styles.item}>
                <div>id: {targetPage.id}</div>
                <div>title: {targetPage.title}</div>
              </div>
            ) : null
          }
        </div>
        <div>全部文章</div>
        {
          pageList.map(item => (
            <div key={item.id} className={styles.item}>
              <div>id: {item.id}</div>
              <div>title: {item.title}</div>
              <div>content: {item.content}</div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Redux