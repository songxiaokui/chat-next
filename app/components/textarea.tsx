import React, { ChangeEventHandler, KeyboardEventHandler } from "react"
import clsx from "clsx"
import TextareaAutosize from "react-textarea-autosize"

function Textarea({
                    className, placeholder, value, onChange, onKeyDown, autoFocus,
                    minRows = 3, maxRows = 10, rows = minRows,
                  }: {
  className?: string,
  placeholder?: string,
  value?: string,
  onChange?: ChangeEventHandler<HTMLTextAreaElement>,
  onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement>,
  autoFocus?: boolean,

  rows?: number,
  minRows?: number,
  maxRows?: number,
}) {
  if (rows !== minRows) {
    rows = Math.min(Math.max(rows, minRows), maxRows)
  }
  return (
    <TextareaAutosize cacheMeasurements={true} rows={rows} minRows={minRows} maxRows={maxRows} className={clsx(
      "w-full resize-none",
      "input block",
      className,
    )} placeholder={placeholder} value={value} autoFocus={autoFocus} onChange={onChange} onKeyDown={onKeyDown}/>
  )
}

export default React.memo(Textarea)