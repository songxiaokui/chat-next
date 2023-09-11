import { create } from "zustand"
import { persist } from "zustand/middleware"
import { StoreKey } from "@/app/constants"

const defaultConfig = {
  apiConfig: {
    apiKey: "",
  },
}

type Config = (typeof defaultConfig) & {
  Update(fn: (c: Config) => void): void
}

export type ApiConfig = typeof defaultConfig.apiConfig

export const useConfig = create<Config>()(
  persist(
    (set, get) => ({
      ...defaultConfig,

      Update(fn: (c: Config) => void) {
        const config = get()
        fn(config)
        set(config)
      },
    }),
    {
      name: StoreKey.Config,
      version: 1.0,
    },
  ),
)