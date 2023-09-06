import React, { useEffect, useRef, useState } from "react"
import ChatMsg from "@/app/components/chat-msg"
import { Message } from "ai"
import { useChatStore } from "@/app/store/chat"

function ChatBody({ isLoading, messages, reload, deleteMsg, openEditDialog }: {
  isLoading: boolean,
  messages: Message[],
  reload: () => void,
  deleteMsg: (index: number) => void,
  openEditDialog: (index: number, msg: string) => void,
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(false)
  const currentIndex = useChatStore(state => state.currentIndex)

  useEffect(() => {
    setAutoScroll(isLoading)
  }, [isLoading])

  useEffect(() => {
    if (!autoScroll) {
      return
    }
    scrollTo()
  })

  useEffect(() => {
    scrollTo()
  }, [currentIndex])

  function scrollTo() {
    requestAnimationFrame(() => {
      if (!scrollRef.current || scrollRef.current.scrollHeight === scrollRef.current.clientHeight + scrollRef.current.scrollTop) {
        return
      }
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight)
    })
  }

  function onScroll(e: HTMLDivElement) {
    if (!isLoading) {
      return
    }
    const hitBottom = e.scrollTop + e.clientHeight >= e.scrollHeight - 15
    if (hitBottom === autoScroll) {
      return
    }
    setAutoScroll(hitBottom)
  }

  return (
    <div ref={scrollRef} className="grow p-4 text-gray-700 overflow-y-auto" onScroll={(e) => onScroll(e.currentTarget)}>
      {messages.map((value, index) => {
        const isLast = index === messages.length - 1
        return <ChatMsg key={value.id} index={index} msg={value}
                        deleteMsg={!isLoading ? deleteMsg : undefined}
                        editMsg={!isLoading ? openEditDialog : undefined}
                        reload={!isLoading && isLast ? reload : undefined}/>
      })}
    </div>
  )
}

export default ChatBody