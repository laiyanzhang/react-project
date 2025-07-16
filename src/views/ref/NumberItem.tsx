interface MyInputRef {
  focus: () => void
}

interface NumberItemProps {
  index: number;
  children?: React.ReactNode;
  ref?: React.Ref<MyInputRef>;
}

const NumberItem = ({children, index, ref}: NumberItemProps) => {
  const itemRef = useRef<HTMLInputElement>(null)
  const focus = () => {
    console.log('focus', index)
  }
  if (typeof ref === "function") {
    ref({ focus: focus });
  } else if (ref) {
    ref.current = { focus: focus };
  }
  const handleClick = () => {
    console.log('click', index)
  }
  return (
    <div ref={itemRef} onClick={handleClick}>{children}</div>
  )
}

export default NumberItem