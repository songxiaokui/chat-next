import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { Message, nanoid } from "ai"
import { AutoTopicLength, DEFAULT_TOPIC, StoreKey } from "@/app/constants"

interface ChatSession {
  id: string;
  topic: string;
  messages: Message[];
}

function createEmptySession(): ChatSession {
  return {
    id: nanoid(),
    topic: DEFAULT_TOPIC,
    messages: [],
  }
}

interface ChatStore {
  sessions: ChatSession[];
  currentIndex: number;

  selectSession(index: number): void

  currentSession(): ChatSession

  newSession(): void

  deleteSession(index: number): void

  deleteOtherSession(): void

  updateTopic(index: number, topic: string): void

  saveMessage(list: Message[]): void

  editMessage(index: number, msg: string): void

  autoTopic(newTopic: () => void): void

  updateCurrentTopic(topic: string): void
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      sessions: [createEmptySession()],
      currentIndex: 0,

      selectSession(index: number) {
        if (index === get().currentIndex) {
          return
        }
        set({ currentIndex: index })
      },

      currentSession() {
        return get().sessions[get().currentIndex]
      },

      newSession() {
        const sessions = get().sessions
        sessions.push(createEmptySession())
        const currentIndex = sessions.length - 1
        set({ sessions, currentIndex })
      },

      deleteSession(index: number) {
        const sessions = get().sessions
        sessions.splice(index, 1)
        let currentIndex = get().currentIndex
        if (sessions.length === 0) {
          sessions.push(createEmptySession())
        } else if (index === currentIndex) {
          currentIndex = Math.max(0, Math.min(index, sessions.length - 1))
        } else if (index < currentIndex) {
          currentIndex--
        }
        set({ sessions, currentIndex })
      },

      deleteOtherSession() {
        set({ sessions: [get().sessions[get().currentIndex]], currentIndex: 0 })
      },

      updateTopic(index: number, topic: string) {
        const sessions = get().sessions
        sessions[index].topic = topic
        set({ sessions })
      },

      saveMessage(list: Message[]) {
        get().currentSession().messages = list
        set({ sessions: get().sessions })
      },

      editMessage(index: number, msg: string) {
        const currentSession = get().currentSession()
        const message = currentSession.messages[index]
        currentSession.messages[index] = { ...message, content: msg }
        set({ sessions: get().sessions })
      },

      autoTopic(newTopic: () => void) {
        const currentSession = get().currentSession()
        if (currentSession.topic !== DEFAULT_TOPIC || currentSession.messages.length < AutoTopicLength) {
          return
        }
        newTopic()
      },

      updateCurrentTopic(topic: string) {
        if (!topic) {
          return
        }
        get().currentSession().topic = topic
        set({ sessions: get().sessions })
      },
    }),
    {
      name: StoreKey.Chat,
      version: 1.0,
      storage: createJSONStorage(
        () => localStorage,
        {
          reviver: (key, value) => {
            if (key == "createdAt") {
              return new Date(value as string)
            }
            return value
          },
        },
      ),
    },
  ),
)

export const useChatID = create<string>(() => nanoid())