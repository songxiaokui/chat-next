import React, { Fragment, useEffect, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import toast from "react-hot-toast"
import { Check } from "@/app/components/svg"
import { useChatStore } from "@/app/store/chat"

const MAX_LENGTH = 30

function TopicDialog({ isOpen, topicIndex, editTopic }: {
  isOpen: boolean,
  topicIndex: number,
  editTopic: (t: string) => void
}) {

  const topic = useChatStore(state => state.sessions[topicIndex].topic)
  const [inputValue, setInputValue] = useState(topic)
  useEffect(() => {
    inputValue !== topic && setInputValue(topic)
  }, [topic])

  function onEditClick() {
    const topic = inputValue.trim()
    if (!topic) {
      toast.error("请输点东西呀！")
      return
    }
    editTopic(topic)
  }

  function onInputChange(value: string) {
    if (value.length > MAX_LENGTH) {
      setInputValue(value.substring(0, MAX_LENGTH))
      return
    }
    setInputValue(value)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter" || e.nativeEvent.isComposing) {
      return
    }
    e.preventDefault()
    onEditClick()
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog onClose={() => undefined} as="div" className="dialog">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0 scale-90"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-90"
        >
          <Dialog.Panel className="card dialog-panel w-fit mx-auto flex flex-col">
            <div className="flex justify-between">
              <Dialog.Title className="dialog-title">编辑聊天标题</Dialog.Title>
              <span className="text-xs self-end text-gray-400">最长{MAX_LENGTH}个字符</span>
            </div>
            <span className="bg-gray-200 h-[1px] mt-3 mb-5"/>
            <div className="flex gap-3 text-sm py-1">
              <input className="input w-64 sm:w-96" value={inputValue} onKeyDown={onKeyDown}
                     onChange={(e) => onInputChange(e.currentTarget.value)}/>
              <div className="flex items-center">
                <button className="btn" onClick={onEditClick}>
                  <Check/>
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}

export default React.memo(TopicDialog)