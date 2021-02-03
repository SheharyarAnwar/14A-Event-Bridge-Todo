import { InitOptions, User } from "netlify-identity-widget"

export interface NetlifyWidget {
  init(opts?: InitOptions): void
  open(tabName?: "signup" | "login"): void
  close(): void
  currentUser(): User | null
  on(event: "init", cb: (user: User | null) => void): void
  on(event: "login", cb: (user: User) => void): void
  on(event: "logout" | "open" | "close", cb: () => void): void
  on(event: "error", cb: (err: Error) => void): void
  off(event: "init", cb?: (user: User | null) => void): void
  off(event: "login", cb?: (user: User) => void): void
  off(event: "logout" | "open" | "close", cb?: () => void): void
  off(event: "error", cb?: (err: Error) => void): void
  logout(): Promise<void> | undefined
  setLocale(locale: string): void
  refresh(force?: boolean): Promise<string>
}
