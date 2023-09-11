"use client"
import { Tab } from "@headlessui/react"
import React, { Fragment, useEffect, useState } from "react"
import Chat from "@/app/components/chat"
import ChatList from "@/app/components/chat-list"
import { useChatStore } from "@/app/store/chat"
import dynamic from "next/dynamic"
import { Loading } from "@/app/components/svg"

const Settings = dynamic(() => import("@/app/components/settings"), {
  loading: () => (
    <div className="flex justify-center pt-4">
      <Loading className="w-8 h-8 animate-spin text-gray-500"/>
    </div>
  ),
})

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
        <Tab.Panel className="grow-flex-col">
          <Settings/>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  )
}