import styles from './ref.module.less'
import NumberItem from './NumberItem'

const list = [1,2,3,4,5]

const Ref = () => {
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [pauseTime, setPauseTime] = useState(0)
  const [status, setStatus] = useState('end')
  const intervalRef = useRef(null as any)
  const itemRefs = useRef(null as any)
  const [show, setShow] = useState(false)
  const itemRef = useRef(null as any)

  const buttonText = useMemo(() => {
    if(status === 'end') return '开始'
    if(status === 'start') return '暂停'
    if(status === 'pause') return '继续'
  }, [status])
  let secondsPassed = 0
  if (startTime != null && endTime != null) {
    secondsPassed = (endTime - startTime) / 1000
  }
  const handleClick = () => {
    if(status === 'end') {
      setStatus('start')
      setStartTime(Date.now())
      clearInterval(intervalRef.current)
      intervalRef.current = setInterval(() => setEndTime(Date.now()), 10)
    }
    else if(status === 'start') {
      setStatus('pause')
      setPauseTime(Date.now())
      clearInterval(intervalRef.current)
    }
    else if(status === 'pause') {
      setStatus('start')
      setStartTime(Date.now() - (pauseTime - startTime))
      intervalRef.current = setInterval(() => setEndTime(Date.now()), 10)
    }
  }

  itemRefs.current = new Map()
  const handleCtrl = () => {
    const item = itemRefs.current.get(2)
    item.focus()
  }
  
  return (
    <div className={styles.refPage}>
      <div>
        <div className={styles.title}>时间器</div>
        <div className={styles.operation}>
          <Button onClick={handleClick}>{buttonText}</Button>
        </div>
        <div className={styles.time}>已经过去{ secondsPassed.toFixed(1) }秒</div>
      </div>
      <div>
        <div className={styles.title}>管理子元素</div>
        <div className={styles.operation}>
          <Button onClick={handleCtrl}>子元素</Button>
          <Button onClick={() => itemRef.current.remove()}>移除</Button>
          <Button onClick={() => setShow(!show)}>切换</Button>
        </div>
        { show && <div ref={itemRef}>123</div> }
        <div>
          {
            list.map((i: number) => (
              <NumberItem
                index={i}
                key={i}
                ref={
                  (node: HTMLElement | null) => {
                    if (node) {
                      itemRefs.current.set(i, node)
                    }
                    return () => {
                      itemRefs.current.delete(i)
                    }
                  }
                }
              >
                <div>第{i}</div>
              </NumberItem>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Ref