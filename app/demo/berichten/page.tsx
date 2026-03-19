'use client'

import { useState, useEffect, useRef } from 'react'
import { getUser } from '@/lib/auth'
import { UserRole } from '@/lib/types'

interface Message {
  id: string
  van: 'ik' | 'ander'
  tekst: string
  tijd: string
}

interface Conversation {
  id: string
  naam: string
  avatar: string
  onderwerp: string
  vacature?: string
  berichten: Message[]
  ongelezen: number
  roles: UserRole[]
}

const mockConversations: Conversation[] = [
  // Scout conversations
  {
    id: 'conv-1',
    naam: 'HR Afdeling TechCorp',
    avatar: 'TC',
    onderwerp: 'Marketing Manager vacature',
    vacature: 'Marketing Manager',
    ongelezen: 2,
    roles: ['scout'],
    berichten: [
      { id: 'm-1', van: 'ander', tekst: 'Goedemiddag, we hebben uw kandidaat Anna de Jong bekeken. Indrukwekkend profiel!', tijd: '14:30' },
      { id: 'm-2', van: 'ik', tekst: 'Fijn om te horen! Anna is inderdaad een sterke kandidaat met veel ervaring in marketing.', tijd: '14:35' },
      { id: 'm-3', van: 'ander', tekst: 'We willen graag een kennismakingsgesprek inplannen. Is volgende week dinsdag mogelijk?', tijd: '14:42' },
      { id: 'm-4', van: 'ik', tekst: 'Ik check het even met Anna en kom er zo op terug.', tijd: '14:45' },
      { id: 'm-5', van: 'ander', tekst: 'Top, we horen het graag. Het gesprek zou om 10:00 zijn op ons kantoor in Amsterdam.', tijd: '15:01' },
      { id: 'm-6', van: 'ander', tekst: 'Heeft u al iets van Anna gehoord?', tijd: '16:20' },
    ],
  },
  {
    id: 'conv-2',
    naam: 'Kandidaat Lisa J.',
    avatar: 'LJ',
    onderwerp: 'Status update',
    vacature: 'Senior Developer',
    ongelezen: 0,
    roles: ['scout'],
    berichten: [
      { id: 'm-7', van: 'ander', tekst: 'Hi Sophie, hoe staat het met mijn sollicitatie bij GreenLogistics?', tijd: '09:15' },
      { id: 'm-8', van: 'ik', tekst: 'Hi Lisa! De opdrachtgever heeft je profiel bekeken en is enthousiast. Ze willen volgende week een gesprek inplannen.', tijd: '09:30' },
      { id: 'm-9', van: 'ander', tekst: 'Wat goed! Ik ben beschikbaar maandag en woensdag.', tijd: '09:33' },
      { id: 'm-10', van: 'ik', tekst: 'Ik geef het door en laat je zo snel mogelijk weten welke dag het wordt.', tijd: '09:40' },
    ],
  },
  // Opdrachtgever conversations
  {
    id: 'conv-3',
    naam: 'Scout Jan de Vries',
    avatar: 'JV',
    onderwerp: 'Voorgestelde kandidaten',
    vacature: 'Marketing Manager',
    ongelezen: 1,
    roles: ['opdrachtgever'],
    berichten: [
      { id: 'm-11', van: 'ander', tekst: 'Goedemorgen! Ik heb twee sterke kandidaten gevonden voor de Marketing Manager positie.', tijd: '10:00' },
      { id: 'm-12', van: 'ik', tekst: 'Goedemorgen Jan. Dat klinkt goed, ik bekijk ze vandaag.', tijd: '10:15' },
      { id: 'm-13', van: 'ander', tekst: 'Prima! De eerste kandidaat heeft een M-Score van 87%, echt een uitstekende match.', tijd: '10:18' },
      { id: 'm-14', van: 'ander', tekst: 'Heeft u al kans gehad om de profielen te bekijken?', tijd: '14:00' },
    ],
  },
  // Kandidaat conversations
  {
    id: 'conv-4',
    naam: 'Mijn Scout - Jan de Vries',
    avatar: 'JV',
    onderwerp: 'Vacature update',
    vacature: 'Marketing Manager',
    ongelezen: 1,
    roles: ['kandidaat'],
    berichten: [
      { id: 'm-15', van: 'ander', tekst: 'Hi Anna! Goed nieuws - de opdrachtgever wil je graag uitnodigen voor een gesprek.', tijd: '11:00' },
      { id: 'm-16', van: 'ik', tekst: 'Wat leuk! Wanneer zou dat zijn?', tijd: '11:05' },
      { id: 'm-17', van: 'ander', tekst: 'Volgende week dinsdag om 10:00 bij het kantoor in Amsterdam. Past dat?', tijd: '11:10' },
      { id: 'm-18', van: 'ik', tekst: 'Ja, dat past perfect. Ik zet het in mijn agenda!', tijd: '11:12' },
      { id: 'm-19', van: 'ander', tekst: 'Nog een tip: bereid je voor op vragen over je ervaring met campagnemanagement. Succes!', tijd: '11:15' },
    ],
  },
]

export default function BerichtenPage() {
  const [activeConvId, setActiveConvId] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [showList, setShowList] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const user = getUser()
    if (user) {
      setUserRole(user.role)
    }
  }, [])

  const conversations = mockConversations.filter((c) => userRole && c.roles.includes(userRole))

  // Select first conversation by default
  useEffect(() => {
    if (conversations.length > 0 && !activeConvId) {
      setActiveConvId(conversations[0].id)
    }
  }, [conversations, activeConvId])

  const activeConv = conversations.find((c) => c.id === activeConvId)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConv?.berichten.length])

  const handleSend = () => {
    if (!newMessage.trim()) return
    // In a real app this would send the message; for demo just clear input
    setNewMessage('')
  }

  const handleConvClick = (id: string) => {
    setActiveConvId(id)
    setShowList(false)
  }

  if (!userRole) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-ink-muted animate-pulse">Laden...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-ink">Berichten</h1>
        <p className="text-ink-light mt-1">Communiceer met scouts, opdrachtgevers en kandidaten</p>
      </div>

      <div className="bg-white rounded-2xl border border-surface-border overflow-hidden" style={{ height: 'calc(100vh - 240px)', minHeight: '500px' }}>
        <div className="flex h-full">
          {/* Left panel: conversation list */}
          <div className={`w-full md:w-80 border-r border-surface-border flex flex-col ${!showList ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-surface-border">
              <input
                type="text"
                placeholder="Zoek in berichten..."
                className="w-full bg-surface-muted border border-surface-border rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-cyan/50"
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-ink-muted text-sm">Geen berichten</div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => handleConvClick(conv.id)}
                    className={`w-full text-left p-4 border-b border-surface-border hover:bg-surface-muted/50 transition-colors ${
                      activeConvId === conv.id ? 'bg-purple/5 border-l-2 border-l-purple' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-purple">{conv.avatar}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-ink text-sm truncate">{conv.naam}</span>
                          <span className="text-xs text-ink-muted flex-shrink-0">
                            {conv.berichten[conv.berichten.length - 1]?.tijd}
                          </span>
                        </div>
                        <div className="text-xs text-ink-light mt-0.5 truncate">{conv.onderwerp}</div>
                        <div className="text-xs text-ink-muted mt-0.5 truncate">
                          {conv.berichten[conv.berichten.length - 1]?.tekst}
                        </div>
                      </div>
                      {conv.ongelezen > 0 && (
                        <span className="bg-cyan text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                          {conv.ongelezen}
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right panel: active conversation */}
          <div className={`flex-1 flex flex-col ${showList ? 'hidden md:flex' : 'flex'}`}>
            {activeConv ? (
              <>
                {/* Conversation header */}
                <div className="p-4 border-b border-surface-border flex items-center gap-3">
                  <button
                    onClick={() => setShowList(true)}
                    className="md:hidden text-ink-light hover:text-ink transition-colors"
                  >
                    &#8592;
                  </button>
                  <div className="w-9 h-9 rounded-full bg-purple/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-purple">{activeConv.avatar}</span>
                  </div>
                  <div>
                    <div className="font-medium text-ink text-sm">{activeConv.naam}</div>
                    <div className="text-xs text-ink-muted">{activeConv.onderwerp}</div>
                  </div>
                  {activeConv.vacature && (
                    <span className="ml-auto text-xs bg-purple/10 text-purple px-2 py-0.5 rounded-full">
                      {activeConv.vacature}
                    </span>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {activeConv.berichten.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.van === 'ik' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                          msg.van === 'ik'
                            ? 'bg-purple text-white rounded-br-md'
                            : 'bg-surface-muted text-ink rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm">{msg.tekst}</p>
                        <p className={`text-xs mt-1 ${msg.van === 'ik' ? 'text-white/60' : 'text-ink-muted'}`}>
                          {msg.tijd}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-surface-border">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type een bericht..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      className="flex-1 bg-surface-muted border border-surface-border rounded-lg px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-cyan/50"
                    />
                    <button
                      onClick={handleSend}
                      className="px-4 py-2.5 bg-purple text-white text-sm font-medium rounded-lg hover:bg-purple-dark transition-colors"
                    >
                      Verstuur
                    </button>
                  </div>
                  <p className="text-xs text-ink-muted mt-2">
                    Berichten zijn altijd gekoppeld aan een vacature of kandidaat
                  </p>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-ink-muted text-sm">
                Selecteer een gesprek om te beginnen
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
