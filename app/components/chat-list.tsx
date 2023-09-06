import React, { Fragment, useCallback, useState } from "react"
import { Menu, Transition } from "@headlessui/react"
import { Create, Delete, Edit, List } from "@/app/components/svg"
import clsx from "clsx"
import { useChatID, useChatStore } from "@/app/store/chat"
import toast from "react-hot-toast"
import { useChat } from "ai/react"
import TopicDialog from "@/app/components/topic-dialog"

function ChatList({ selectChat }: {
  selectChat: (cb: () => void) => void
}) {
  const { isLoading } = useChat({ id: useChatID() })

  function checkLoading() {
    if (isLoading) {
      toast.error("稍等，正在加载！")
      return true
    }
    return false
  }

  const [sessions, currentIndex, selectSession, deleteSession, updateTopic, newSession, deleteOtherSession] = useChatStore(state =>
    [state.sessions, state.currentIndex, state.selectSession, state.deleteSession, state.updateTopic, state.newSession, state.deleteOtherSession])

  function onSelect(index: number) {
    if (index !== currentIndex && checkLoading()) {
      return
    }
    selectChat(() => selectSession(index))
  }

  function onDelete(index: number): boolean {
    if (index === currentIndex && checkLoading()) {
      return false
    }
    toast.success(`${sessions[index].topic} 已删除`)
    selectChat(() => deleteSession(index))
    return sessions.length === 1
  }

  function onEdit(index: number) {
    setTopicIndex(index)
    setIsOpen(true)
  }

  function onDeleteOther(): boolean {
    if (sessions.length === 1) {
      return false
    }
    toast.success("已删除其他聊天")
    selectChat(deleteOtherSession)
    return true
  }

  function onCreate() {
    if (checkLoading()) {
      return
    }
    selectChat(newSession)
  }

  const [isOpen, setIsOpen] = useState(false)
  const [topicIndex, setTopicIndex] = useState(0)

  const onEditTopic = useCallback((topic: string) => {
    setTopicIndex(0)
    setIsOpen(false)
    if (sessions[topicIndex].topic === topic) {
      return
    }
    updateTopic(topicIndex, topic)
    toast.success("聊天标题修改成功")
  }, [topicIndex])

  return (
    <Menu>
      {({ close }) => (
        <>
          <TopicDialog isOpen={isOpen} topicIndex={topicIndex} editTopic={onEditTopic}/>
          <Menu.Button className="btn-menu">
            <List/>
          </Menu.Button>
          <Transition as={Fragment}
                      enter="transition ease-out"
                      enterFrom="opacity-0 scale-90"
                      enterTo="opacity-100 scale-100"
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-90">
            <Menu.Items className={clsx(
              "bg-gray-100 rounded border shadow",
              "absolute top-[52px] left-0",
              "flex flex-col gap-1 p-2 z-10",
              "font-normal",
            )}>
              <div className="flex justify-between p-2">
                <button className="btn-icon flex gap-1" onClick={() => {
                  onCreate()
                  close()
                }}>
                  <Create/>创建新的
                </button>
                <button className="btn-icon flex gap-1" onClick={() => onDeleteOther() && close()}>
                  <Delete className="h-5 w-5"/>清除其他
                </button>
              </div>
              <div className="overflow-y-auto max-h-[32rem] flex flex-col gap-1">
                {sessions.map((value, index) => {
                  return (
                    <Menu.Item as="div" key={value.id} onClick={() => onSelect(index)} className={clsx(
                      "flex gap-1 p-2",
                      "bg-gray-50 ui-active:bg-sky-100 rounded border",
                    )}>
                <span className={clsx(
                  "rounded p-1 truncate max-w-[12rem] sm:max-w-md",
                  currentIndex === index && "underline underline-offset-4 decoration-2 decoration-sky-400 font-medium",
                )}>{value.topic}</span>
                      <span
                        className="font-normal text-xs text-gray-400 self-end shrink-0">{value.messages.length}条对话</span>
                      <span className="flex-1 min-w-[15px]"/>
                      <button className="btn-icon w-7 h-7 flex-center" onClick={(e) => {
                        e.preventDefault()
                        onEdit(index)
                        close()
                      }}>
                        <Edit className="h-5 w-5"/>
                      </button>
                      <button className="btn-icon w-7 h-7 flex-center" onClick={(e) => {
                        e.preventDefault()
                        onDelete(index) && close()
                      }}>
                        <Delete className="w-5 h-5"/>
                      </button>
                    </Menu.Item>
                  )
                })}
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}

export default ChatList