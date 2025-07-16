import { MessageContext } from '@contexts/MessageContext';

export default function useMessage() {
  const messageApi = useContext(MessageContext);
  return messageApi || message; // 降级策略（未提供Provider时用静态方法）
}