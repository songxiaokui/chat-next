import toast from "react-hot-toast"

export function copyToClipboard(content: string) {
  navigator.clipboard.writeText(content)
           .then(() => toast.success("已拷贝至剪贴板"))
           .catch((e) => toast.error(`出错啦: ${e.message}`))
}

export function trimTopic(topic: string) {
  return topic.replace(/[，。！？”“"、,.!?]*$/, "")
}