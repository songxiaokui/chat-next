import React, { MouseEventHandler, useCallback, useMemo } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { CodeProps } from "react-markdown/lib/ast-to-react"
import clsx from "clsx"
import { Clipboard } from "@/app/components/svg"
import { copyToClipboard } from "@/app/utils"

function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{ code: Code }}
      remarkPlugins={[remarkGfm]}
      className={clsx(
        "prose prose-sm max-w-none",
        "prose-pre:bg-white prose-pre:p-0 prose-pre:m-0",
        "prose-code:bg-gray-200 prose-code:font-normal prose-code:py-0.5 prose-code:rounded",
      )}>
      {content}
    </ReactMarkdown>
  )
}

export default React.memo(Markdown)

const Code = React.memo(function Code({ node, inline, className, children, ...props }: CodeProps) {
  const lang = useMemo(() => (/language-(\w+)/.exec(className || "") || [""])[1], [className])
  const content = useMemo(() => String(children).replace(/\n$/, ""), [children])
  const copyClick = useCallback(() => copyToClipboard(content), [content])
  return !inline ? (
    <div className="relative min-h-[42px] code">
      <CopyBtn click={copyClick}/>
      <SyntaxHighlighter
        {...props}
        style={oneLight}
        customStyle={{ margin: "0", paddingRight: "1em" }}
        language={lang}
        PreTag="div"
      >{content}</SyntaxHighlighter>
    </div>
  ) : (
    <code {...props} className={className}>
      {children}
    </code>
  )
})

const CopyBtn = React.memo(function CopyBtn({ click }: {
  click: MouseEventHandler<HTMLButtonElement>,
}) {
  return (
    <button onClick={click} className={clsx(
      "absolute right-2 top-2.5",
      "bg-gray-50 bg-opacity-80",
      "copy-action btn-icon",
    )}>
      <Clipboard/>
    </button>
  )
})