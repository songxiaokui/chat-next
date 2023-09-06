import React, { ChangeEventHandler } from "react"
import Textarea from "@/app/components/textarea"
import { Loading, Send } from "@/app/components/svg"
import clsx from "clsx"

function ChatInput({ isLoading, input, handleInputChange, handleSubmit }: {
  isLoading: boolean,
  input: string,
  handleInputChange: ChangeEventHandler<HTMLTextAreaElement>
  handleSubmit: ChangeEventHandler<HTMLFormElement>
}) {
  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Enter" || e.nativeEvent.isComposing || e.shiftKey) {
      return
    }
    e.preventDefault()
    if (isLoading) {
      return
    }
    e.currentTarget.form?.requestSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="p-3 relative border-t-2 border-sky-300">
      {/*<div className="h-6 mb-2 flex gap-3 text-gray-500">*/}
      {/*</div>*/}
      <Textarea placeholder="问点什么吧！" className="!pr-12 text-sm" value={input} autoFocus={true}
                onChange={handleInputChange} onKeyDown={onKeyDown}/>
      <SendButton isLoading={isLoading}/>
    </form>
  )
}

export default ChatInput

const SendButton = React.memo(function SendButton({ isLoading }: { isLoading: boolean }) {
  return (
    <button type="submit" disabled={isLoading} className={clsx(
      "absolute right-5 bottom-5 btn",
      isLoading && "!bg-gray-400",
    )}>
      {isLoading ? <Loading/> : <Send/>}
    </button>
  )
})
