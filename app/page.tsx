"use client"
import { Tab } from "@headlessui/react"
import React, { Fragment, useEffect, useState } from "react"
import Chat from "@/app/components/chat"
import ChatList from "@/app/components/chat-list"
import { useChatStore } from "@/app/store/chat"

export default function Page() {
  const currentTopic = useChatStore(state => state.currentSession().topic)
  const [topic, setTopic] = useState("加载中 ...")
  useEffect(() => {
    setTopic(currentTopic)
  }, [currentTopic])

  const [selectedIndex, setSelectedIndex] = useState(0)

  function selectChat(callback: () => void) {
    if (selectedIndex === 0) {
      callback()
      return
    }
    setSelectedIndex(0)
    setTimeout(callback)
  }

  return (
    <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
      <Tab.List className="card font-medium text-sm text-gray-600 flex justify-between items-center gap-3 p-2 relative">
        <ChatList selectChat={selectChat}/>
        <Tab className="btn-tab truncate">
          {topic}
        </Tab>
        <Tab className="btn-tab shrink-0">设置</Tab>
      </Tab.List>
      <Tab.Panels as={Fragment}>
        <Tab.Panel className="grow-flex-col">
          <Chat/>
        </Tab.Panel>
        <Tab.Panel className="grow-flex-col card justify-center items-center font-medium text-lg">
          设置界面
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  )
}