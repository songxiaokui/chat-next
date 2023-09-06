import React, { Fragment, useEffect, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import toast from "react-hot-toast"
import { Check } from "@/app/components/svg"
import Textarea from "@/app/components/textarea"

const TEXTAREA_ROWS = 6

function EditDialog({ isOpen, msg, editMsg }: {
  isOpen: boolean,
  msg: string,
  editMsg: (msg: string) => void
}) {
  const [inputValue, setInputValue] = useState(msg)
  useEffect(() => {
    inputValue !== msg && setInputValue(msg)
  }, [msg])

  function onEditClick() {
    const newMsg = inputValue.trim()
    if (!newMsg) {
      toast.error("请输点东西呀！")
      return
    }
    editMsg(newMsg)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Enter" || e.nativeEvent.isComposing || e.shiftKey) {
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
          <Dialog.Panel className="card dialog-panel w-full max-w-3xl mx-auto flex flex-col">
            <Dialog.Title className="dialog-title">编辑消息</Dialog.Title>
            <span className="bg-gray-200 h-[1px] mt-3 mb-8"/>
            <div className="flex flex-col gap-5 text-sm w-full">
              <Textarea value={inputValue} onKeyDown={onKeyDown} minRows={TEXTAREA_ROWS} maxRows={TEXTAREA_ROWS}
                        onChange={(e) => setInputValue(e.currentTarget.value)}/>
              <button className="btn w-fit self-end" onClick={onEditClick}>
                <Check/>
              </button>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}

export default React.memo(EditDialog)