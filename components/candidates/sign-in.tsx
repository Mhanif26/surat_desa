"use client"

import * as React from "react"
import { ArrowLeft, CircleAlert, Eye, EyeOff, KeyRound, Mail, MailCheck } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export type Provider = { id: string; label: string; icon?: React.ReactNode }

export const SIGN_IN_LABELS = {
  title: "Sign in",
  email: "Email",
  password: "Password",
  show: "Show password",
  hide: "Hide password",
  forgot: "Forgot password?",
  submit: "Sign in",
  submitting: "Signing in…",
  continue: "Continue",
  sendLink: "Email me a sign-in link",
  sending: "Sending…",
  usePassword: "Use a password instead",
  orEmail: "or with email",
  back: "Back",
  sentTitle: "Check your email",
  sentBody: (email: string) => `We sent a sign-in link to ${email}. It works for 15 minutes.`,
  resend: "Send again",
  resendIn: (s: number) => `Send again in ${s}s`,
  wrongEmail: "Use a different email",
  invalidEmail: "Enter an email address like name@example.com.",
  noAccount: "New here?",
  signUp: "Create an account",
}

type Handlers = {
  /** Throw an Error with a message people can act on (“Wrong email or password.”) to show it. */
  onPassword?: (creds: { email: string; password: string }) => Promise<void>
  onMagicLink?: (email: string) => Promise<void>
  onProvider?: (id: string) => void
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Candidate: sign in.
 * password    A · providers, then email + password on one screen   (Campsite, Square)
 * email-first B · email, then choose a link or a password          (Slite, Coda)
 * magic-link  C · providers + email link only, no password          (Peec AI)
 * All variants: real autocomplete values, pending buttons, server errors in a notice,
 * a “check your email” screen with a resend cooldown.
 */
export function SignIn({
  variant,
  providers = [],
  forgotHref = "#forgot",
  signUpHref,
  resendCooldown = 30,
  labels: labelsProp,
  ...handlers
}: Handlers & {
  variant: "password" | "email-first" | "magic-link"
  providers?: Provider[]
  forgotHref?: string
  signUpHref?: string
  resendCooldown?: number
  labels?: Partial<typeof SIGN_IN_LABELS>
}) {
  const labels = { ...SIGN_IN_LABELS, ...labelsProp }
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [step, setStep] = React.useState<"start" | "password" | "sent">("start")
  const [busy, setBusy] = React.useState<"" | "password" | "link">("")
  const [error, setError] = React.useState("")
  const [emailError, setEmailError] = React.useState("")
  const [cooldown, setCooldown] = React.useState(0)
  const ids = { email: React.useId(), password: React.useId(), emailErr: React.useId() }

  React.useEffect(() => {
    if (!cooldown) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const checkEmail = () => {
    const bad = !EMAIL.test(email.trim())
    setEmailError(bad ? labels.invalidEmail : "")
    return !bad
  }

  async function attempt(kind: "password" | "link", fn: () => Promise<void>, after?: () => void) {
    setError("")
    setBusy(kind)
    try {
      await fn()
      after?.()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy("")
    }
  }

  const sendLink = () =>
    handlers.onMagicLink &&
    attempt("link", () => handlers.onMagicLink!(email.trim()), () => {
      setStep("sent")
      setCooldown(resendCooldown)
    })

  if (step === "sent") {
    return (
      <div className="flex flex-col gap-4">
        <MailCheck className="size-8 text-status-success-text" aria-hidden="true" />
        <div role="status">
          <h3 className="text-2xl font-semibold text-heading">{labels.sentTitle}</h3>
          <p className="mt-1 text-muted-foreground">{labels.sentBody(email.trim())}</p>
        </div>
        {error && <ErrorNotice message={error} />}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" disabled={cooldown > 0} pending={busy === "link"} pendingLabel={labels.sending} onClick={sendLink}>
            {cooldown > 0 ? labels.resendIn(cooldown) : labels.resend}
          </Button>
          <Button variant="link" onClick={() => setStep("start")}>{labels.wrongEmail}</Button>
        </div>
      </div>
    )
  }

  const providerButtons = providers.length > 0 && (
    <>
      <div className="flex flex-col gap-2">
        {providers.map((p) => (
          <Button key={p.id} type="button" variant="outline" className="w-full" onClick={() => handlers.onProvider?.(p.id)}>
            {p.icon} {p.label}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground" aria-hidden="true">
        <span className="h-px flex-1 bg-hairline" /> {labels.orEmail} <span className="h-px flex-1 bg-hairline" />
      </div>
    </>
  )

  const emailField = (
    <div className="flex flex-col gap-2">
      <Label htmlFor={ids.email}>{labels.email}</Label>
      {emailError && (
        <p id={ids.emailErr} aria-live="polite" className="flex items-start gap-1.5 text-xs font-semibold text-status-error-text">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {emailError}
        </p>
      )}
      <Input
        id={ids.email}
        type="email"
        name="email"
        autoComplete="username"
        inputMode="email"
        autoCapitalize="none"
        spellCheck={false}
        value={email}
        readOnly={step === "password"}
        aria-invalid={emailError ? true : undefined}
        aria-describedby={emailError ? ids.emailErr : undefined}
        onChange={(e) => {
          setEmail(e.target.value)
          if (emailError) setEmailError(EMAIL.test(e.target.value.trim()) ? "" : labels.invalidEmail)
        }}
        onBlur={() => email && checkEmail()}
      />
    </div>
  )

  const passwordField = (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <Label htmlFor={ids.password}>{labels.password}</Label>
        <a href={forgotHref} className="text-sm font-semibold text-primary underline underline-offset-4">{labels.forgot}</a>
      </div>
      <PasswordInput id={ids.password} value={password} onChange={setPassword} labels={labels} autoFocus={variant === "email-first"} />
    </div>
  )

  const footer = signUpHref && (
    <p className="text-sm text-muted-foreground">
      {labels.noAccount} <a href={signUpHref} className="font-semibold text-primary underline underline-offset-4">{labels.signUp}</a>
    </p>
  )

  return (
    <form
      noValidate
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault()
        if (!checkEmail()) return
        if (variant === "magic-link") return sendLink()
        if (variant === "email-first" && step === "start") return setStep("password")
        if (handlers.onPassword) attempt("password", () => handlers.onPassword!({ email: email.trim(), password }))
      }}
    >
      <h3 className="text-2xl font-semibold text-heading">{labels.title}</h3>
      {error && <ErrorNotice message={error} />}
      {step === "start" && providerButtons}
      {emailField}

      {variant === "password" && passwordField}
      {variant === "password" && (
        <Button type="submit" className="w-full" pending={busy === "password"} pendingLabel={labels.submitting}>{labels.submit}</Button>
      )}

      {variant === "email-first" && step === "start" && (
        <div className="flex flex-col gap-2">
          <Button type="submit" className="w-full">
            <KeyRound aria-hidden="true" /> {labels.continue}
          </Button>
          {handlers.onMagicLink && (
            <Button type="button" variant="outline" className="w-full" pending={busy === "link"} pendingLabel={labels.sending} onClick={() => checkEmail() && sendLink()}>
              <Mail aria-hidden="true" /> {labels.sendLink}
            </Button>
          )}
        </div>
      )}
      {variant === "email-first" && step === "password" && (
        <>
          {passwordField}
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setStep("start")}>
              <ArrowLeft aria-hidden="true" /> {labels.back}
            </Button>
            <Button type="submit" className="flex-1" pending={busy === "password"} pendingLabel={labels.submitting}>{labels.submit}</Button>
          </div>
        </>
      )}

      {variant === "magic-link" && (
        <Button type="submit" className="w-full" pending={busy === "link"} pendingLabel={labels.sending}>
          <Mail aria-hidden="true" /> {labels.sendLink}
        </Button>
      )}
      {footer}
    </form>
  )
}

function ErrorNotice({ message }: { message: string }) {
  return (
    <Alert variant="error">
      <CircleAlert aria-hidden="true" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}

/** Password input with a show/hide toggle; shared with the password-field candidate. */
export function PasswordInput({
  id,
  value,
  onChange,
  labels,
  autoComplete = "current-password",
  autoFocus,
  name = "password",
  describedBy,
  invalid,
}: {
  id: string
  value: string
  onChange: (v: string) => void
  labels: { show: string; hide: string }
  autoComplete?: "current-password" | "new-password"
  autoFocus?: boolean
  name?: string
  describedBy?: string
  invalid?: boolean
}) {
  const [visible, setVisible] = React.useState(false)
  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        autoCapitalize="none"
        spellCheck={false}
        autoFocus={autoFocus}
        value={value}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        onChange={(e) => onChange(e.target.value)}
        className="pr-14"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? labels.hide : labels.show}
        aria-pressed={visible}
        aria-controls={id}
        className="absolute top-1/2 right-1 grid size-11 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:text-heading focus-visible:outline-2 focus-visible:outline-ring"
      >
        {visible ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
      </button>
    </div>
  )
}
