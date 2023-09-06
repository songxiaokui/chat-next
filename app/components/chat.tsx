import React, { useCallback, useEffect, useState } from "react"
import ChatBody from "@/app/components/chat-body"
import ChatInput from "@/app/components/chat-input"
import { useChat } from "ai/react"
import toast from "react-hot-toast"
import { useChatID, useChatStore } from "@/app/store/chat"
import EditDialog from "@/app/components/edit-dialog"
import { PROMPT_TOPIC } from "@/app/constants"
import { trimTopic } from "@/app/utils"

function Chat() {
  const [storedMessage, saveMessage, editMessage, autoTopic, updateCurrentTopic] = useChatStore(state =>
    [state.currentSession().messages, state.saveMessage, state.editMessage, state.autoTopic, state.updateCurrentTopic])

  const { isLoading, messages, setMessages, input, setInput, handleInputChange, handleSubmit, reload } = useChat({
    id: useChatID(),
    onError(err) {
      toast.error(err.message)
      input && setInput(input)
    },
  })

  const { append, setMessages: setAutoTopic } = useChat({
    onFinish(msg) {
      updateCurrentTopic(trimTopic(msg.content))
    },
  })

  useEffect(() => {
    if (messages === storedMessage) {
      return
    }
    setMessages(storedMessage)
  }, [storedMessage])

  useEffect(() => {
    if (isLoading || messages.length === 0 || messages === storedMessage) {
      return
    }
    saveMessage(messages)
    autoTopic(() => {
      setAutoTopic(messages)
      append({ role: "user", content: PROMPT_TOPIC })
    })
  }, [isLoading])

  const deleteMsg = useCallback(
    (index: number) => {
      const copy = [...messages]
      copy.splice(index, 1)
      setMessages(copy)
      saveMessage(copy)
      toast.success("消息已删除")
    }, [messages])

  const [editState, setEditState] = useState({ isOpen: false, msg: "", index: 0 })

  const openEditDialog = useCallback(
    (index: number, msg: string) => {
      setEditState({ isOpen: true, msg, index })
    }, [])

  const editMsg = useCallback((msg: string) => {
    setEditState({ ...editState, isOpen: false })
    if (editState.msg === msg) {
      return
    }
    editMessage(editState.index, msg)
    toast.success("消息编辑成功")
  }, [editState])


  return (
    <div className="card grow-flex-col h-0">
      <ChatBody isLoading={isLoading} messages={messages} reload={reload} deleteMsg={deleteMsg}
                openEditDialog={openEditDialog}/>
      <ChatInput isLoading={isLoading} input={input} handleInputChange={handleInputChange} handleSubmit={handleSubmit}/>
      <EditDialog isOpen={editState.isOpen} msg={editState.msg} editMsg={editMsg}/>
    </div>
  )
}

export default Chat