import React, { useCallback, useMemo } from "react"
import clsx from "clsx"
import { Message } from "ai"
import Markdown from "@/app/components/markdown"
import { ChatGPT, Copy, Delete, Edit, Loading } from "@/app/components/svg"
import { copyToClipboard } from "@/app/utils"

function ChatMsg({ index, msg, reload, deleteMsg, editMsg }: {
  index: number,
  msg: Message,
  reload: (() => void) | undefined,
  deleteMsg: ((index: number) => void) | undefined,
  editMsg: ((index: number, msg: string) => void) | undefined
}) {
  const right = useMemo(() => msg.role === "user", [msg.role])
  const copyClick = useCallback(() => copyToClipboard(msg.content), [msg.content])
  const deleteClick = useCallback(() => deleteMsg?.(index), [deleteMsg, index])
  const editClick = useCallback(() => editMsg?.(index, msg.content), [editMsg, index, msg.content])

  return (
    <div className={clsx(
      "pb-5 flex",
      right ? "justify-end" : "justify-start",
    )}>
      <div className={clsx(
        "chat-msg flex flex-col relative",
        right ? "items-end" : "items-start",
        "gap-2 max-w-full sm:max-w-2xl min-w-[116px]",
      )}>
        <div className={clsx("px-0.5 flex items-end gap-2 w-full", right && "flex-row-reverse")}>
          <ChatAvatar right={right}/>
          {!right && <div className="flex-1"/>}
          {reload &&
            <ChatAction onClick={reload}>
              <Loading className="w-4 h-4"/>
            </ChatAction>
          }
          {editMsg &&
            <ChatAction onClick={editClick}>
              <Edit/>
            </ChatAction>
          }
          {deleteMsg &&
            <ChatAction onClick={deleteClick}>
              <Delete/>
            </ChatAction>
          }
          <ChatAction onClick={copyClick}>
            <Copy/>
          </ChatAction>
        </div>
        <div className={clsx(
          "rounded-md border p-2 max-w-full",
          right ? "bg-sky-100 border-sky-200" : "bg-gray-100",
        )}>
          <Markdown content={msg.content}/>
        </div>
        <CreatedAt time={msg.createdAt}/>
      </div>
    </div>
  )
}

export default React.memo(ChatMsg)

const ChatAvatar = React.memo(function ChatAvatar({ right }: {
  right: boolean
}) {
  return (
    <div className={clsx(
      "flex justify-center items-center",
      "bg-gray-100 h-8 w-8 rounded-lg text-lg border border-dashed",
      right ? "border-sky-200" : "border-gray-300",
    )}>
      {right ? "🥳" : <ChatGPT/>}
    </div>
  )
})

const CreatedAt = React.memo(function CreatedAt({ time }: {
  time: Date | undefined
}) {
  if (!time) {
    return
  }
  return (
    <span className="absolute -bottom-4 w-[116px] self-end text-gray-300 text-xs">
      {time.toLocaleString()}
    </span>
  )
})

const ChatAction = React.memo(function ChatAction({ onClick, children }: {
  onClick: () => void,
  children: any
}) {
  return (
    <button onClick={onClick} className="btn-icon-border chat-action">
      {children}
    </button>
  )
})
