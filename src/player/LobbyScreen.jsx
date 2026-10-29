import { AnimatePresence, motion } from 'framer-motion'
import { Check, LoaderCircle, LogOut, Send, UserPlus, X } from 'lucide-react'
import Avatar from '../components/Avatar.jsx'
import ModeGuide from '../components/ModeGuide.jsx'
import { Label } from '../components/ui.jsx'
import { ErrorLine } from './JoinScreens.jsx'
import { pop } from '../lib/motion.js'
import { useLang } from '../lib/i18n.jsx'

function Dots() {
  return (
    <span className="inline-flex gap-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.span key={i} className="size-1.5 rounded-full bg-current" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} />
      ))}
    </span>
  )
}

/** The waiting room: how to play, your team, and everyone else to team up with. */
export default function LobbyScreen({ game }) {
  const { t } = useLang()
  const { room, me, uid, groups, myGroup, maxTeam, invites } = game

  if (!room?.meta || !me) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <LoaderCircle className="size-10 animate-spin" aria-label={t('common.loading')} />
      </div>
    )
  }

  const teamUp = maxTeam > 1
  const myMembers = myGroup?.members ?? [me]
  const myTeamFull = myMembers.length >= maxTeam
  const sentTo = (otherUid) => Boolean(room.invites?.[otherUid]?.[uid])
  const others = groups.filter((g) => g.teamId !== me.teamId)
  const settingUp = room.state?.phase !== 'lobby'

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 pt-2 pb-40">
      <p className="inline-flex items-center gap-3 self-start rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-water">
        {settingUp ? t('wait.starting') : t('wait.title')}
        <Dots />
      </p>

      {teamUp && (
        <section className="mt-6 rounded-[2.25rem] bg-paper p-5 ring-2 ring-inset ring-ink/10" aria-labelledby="my-team">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="my-team" className="display text-xl">
              {myMembers.length > 1 ? t('team.mine') : t('team.solo')}
            </h2>
            <span className="text-sm font-semibold tabular text-ink-2">
              {myMembers.length}/{maxTeam}
            </span>
          </div>
          <ul className="mt-4 flex flex-wrap gap-4">
            {myMembers.map((m) => (
              <motion.li key={m.uid} layout initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={pop} className="flex flex-col items-center gap-1">
                <Avatar name={m.name} avatar={m.avatar} className="size-16" />
                <span className="max-w-[9ch] truncate text-sm font-semibold">{m.uid === uid ? t('team.you') : m.name}</span>
              </motion.li>
            ))}
            {Array.from({ length: Math.max(0, Math.min(maxTeam, 6) - myMembers.length) }, (_, i) => (
              <li key={`slot-${i}`} className="flex flex-col items-center gap-1">
                <span className="grid size-16 place-items-center rounded-full border-2 border-dashed border-ink/20 text-ink-2/60">
                  <UserPlus className="size-5" aria-hidden="true" />
                </span>
                <span className="text-sm text-transparent">.</span>
              </li>
            ))}
          </ul>
          {myMembers.length > 1 && (
            <button type="button" onClick={game.leaveTeam} className="mt-4 inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold ring-2 ring-inset ring-ink/15 hover:bg-ink/5">
              <LogOut className="size-4" aria-hidden="true" />
              {t('team.leave')}
            </button>
          )}
        </section>
      )}

      {teamUp && (
        <section className="mt-8" aria-labelledby="others">
          <h2 id="others" className="display text-xl">
            {t('team.others')}
          </h2>
          <p className="mt-1 text-sm text-ink-2">{myTeamFull ? t('team.fullHint') : t('team.tapHint')}</p>
          {others.length === 0 ? (
            <p className="mt-4 text-base text-ink-2">{t('team.nobody')}</p>
          ) : (
            <ul className="mt-4 grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4">
              {others.flatMap((g) =>
                g.members.map((m) => {
                  const invited = sentTo(m.uid)
                  return (
                    <li key={m.uid}>
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.92 }}
                        transition={pop}
                        disabled={myTeamFull || invited}
                        onClick={() => game.invite(m.uid)}
                        className="group flex w-full flex-col items-center gap-1 disabled:cursor-default"
                        aria-label={invited ? t('team.invitedA', { name: m.name }) : t('team.inviteA', { name: m.name })}
                      >
                        <span className="relative">
                          <Avatar name={m.name} avatar={m.avatar} className="size-16" dim={m.online === false} />
                          <span className={`absolute -right-1 -bottom-1 grid size-7 place-items-center rounded-full ${invited ? 'bg-land' : 'bg-ink text-water'} ${myTeamFull && !invited ? 'opacity-30' : ''}`}>
                            {invited ? <Check className="size-3.5" strokeWidth={3} aria-hidden="true" /> : <UserPlus className="size-3.5" aria-hidden="true" />}
                          </span>
                        </span>
                        <span className="max-w-full truncate text-sm font-semibold">{m.name}</span>
                        {g.members.length > 1 && <span className="text-xs text-ink-2">{t('team.inTeamOf', { n: g.members.length })}</span>}
                        {invited && <span className="text-xs font-semibold text-ink-2">{t('team.invited')}</span>}
                      </motion.button>
                    </li>
                  )
                }),
              )}
            </ul>
          )}
        </section>
      )}

      <ErrorLine code={game.error === 'teamFull' ? 'teamFull' : null} />

      <div className="mt-10 border-t-2 border-ink pt-6">
        <ModeGuide mode={room.meta.mode} duration={room.meta.duration} compact />
        <p className="mt-6 text-sm text-ink-2">{t('wait.teams', { n: groups.length })}</p>
      </div>

      {/* Incoming invitations */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex flex-col gap-2 px-3 pb-3">
        <AnimatePresence>
          {invites.map((inv) => {
            const from = room.players?.[inv.fromUid]
            if (!from) return null
            const size = groups.find((g) => g.teamId === from.teamId)?.members.length ?? 1
            return (
              <motion.div
                key={inv.fromUid}
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 80, opacity: 0 }}
                transition={pop}
                role="alertdialog"
                aria-label={t('team.inviteFrom', { name: from.name })}
                className="mx-auto flex w-full max-w-xl items-center gap-3 rounded-[2rem] bg-ink p-3 pl-4 text-water"
              >
                <Avatar name={from.name} avatar={from.avatar} className="size-12" textClass="text-sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug font-semibold">{t('team.inviteFrom', { name: from.name })}</p>
                  <p className="text-xs text-water/70">
                    <Label className="text-water/70">{t('team.size', { n: size, max: maxTeam })}</Label>
                  </p>
                </div>
                <button type="button" onClick={() => game.decline(inv)} className="grid size-11 place-items-center rounded-full bg-water/15" aria-label={t('team.decline')}>
                  <X className="size-5" aria-hidden="true" />
                </button>
                <button type="button" onClick={() => game.accept(inv)} className="inline-flex h-11 items-center gap-2 rounded-full bg-land px-4 text-sm font-semibold text-ink">
                  <Send className="size-4" aria-hidden="true" />
                  {t('team.accept')}
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
