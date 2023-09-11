export enum StoreKey {
  Chat = "chat-next-store",
  Config = "chat-next-config"
}

export const DEFAULT_TOPIC = "新的聊天"
export const PROMPT_TOPIC = "总结本次聊天内容的主题，限制10个字以内，不要解释、不要标点、不要语气词、不要多余文本，如果没有主题，请直接返回“闲聊”"
export const AutoTopicLength = 4