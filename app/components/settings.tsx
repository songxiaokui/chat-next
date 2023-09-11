import React, { useState } from "react"
import { useConfig } from "@/app/store/config"

function Settings() {
  const [openAIApiKey, update] = useConfig(state => [state.apiConfig.apiKey, state.Update])

  const [apiKey, setApiKey] = useState(openAIApiKey)

  function onApiKeyChange(value: string) {
    setApiKey(value)
    update(c => c.apiConfig.apiKey = value)
  }

  return (
    <div className="grow-flex-col text-gray-700">
      <div className="card p-3">
        <div className="flex items-center justify-between gap-4">
          <label className="font-medium">API Key</label>
          <input className="input grow max-w-lg" value={apiKey}
                 onChange={(e) => onApiKeyChange(e.currentTarget.value.trim())}/>
        </div>
      </div>
    </div>
  )
}

export default Settings