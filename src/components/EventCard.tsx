import { FC, useEffect, useState } from 'react'
import { Calendar, MapPin, Users, Award, TrendingUp } from 'lucide-react'
import { MintButton } from './MintButton'
import { useEvents } from '../contexts/EventsContext'

export interface Event {
  id: string
  name: string
  description: string
  date: string
  location: string
  organizer: string
  attendees: number
  maxAttendees: number
  imageUrl: string
  category: 'workshop' | 'hackathon' | 'meetup' | 'conference' | 'bootcamp'
}

interface Props {
  event: Event
}

const categoryColors = {
  workshop: 'from-blue-500 to-cyan-500',
  hackathon: 'from-solana-purple to-pink-500',
  meetup: 'from-solana-green to-emerald-500',
  conference: 'from-orange-500 to-amber-500',
  bootcamp: 'from-red-500 to-orange-500',
}

const categoryLabels = {
  workshop: 'Workshop',
  hackathon: 'Hackathon',
  meetup: 'Meetup',
  conference: 'Conference',
  bootcamp: 'Bootcamp',
}

export const EventCard: FC<Props> = ({ event: initialEvent }) => {
  const { events, recentlyUpdatedEventId } = useEvents()
  const event = events.find(e => e.id === initialEvent.id) || initialEvent
  
  const [showAnimation, setShowAnimation] = useState(false)
  const [displayCount, setDisplayCount] = useState(event.attendees)
  
  // Animate counter when attendees increase
  useEffect(() => {
    if (recentlyUpdatedEventId === event.id) {
      setShowAnimation(true)
      
      // Animate the number counting up
      const startCount = displayCount
      const endCount = event.attendees
      const duration = 500
      const startTime = Date.now()
      
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3)
        const currentCount = Math.round(startCount + (endCount - startCount) * easeOut)
        
        setDisplayCount(currentCount)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      
      requestAnimationFrame(animate)
      
      // Remove animation class after delay
      setTimeout(() => setShowAnimation(false), 2000)
    }
  }, [recentlyUpdatedEventId, event.id, event.attendees])

  // Sync display count when event changes
  useEffect(() => {
    if (recentlyUpdatedEventId !== event.id) {
      setDisplayCount(event.attendees)
    }
  }, [event.attendees, recentlyUpdatedEventId, event.id])

  return (
    <div className={`glass-card overflow-hidden group hover:border-white/20 transition-all duration-300 relative ${showAnimation ? 'ring-2 ring-solana-green/50' : ''}`}>
      {/* Success Animation Overlay */}
      {showAnimation && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Confetti particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-confetti"
                style={{
                  left: `${10 + (i * 7)}%`,
                  backgroundColor: i % 3 === 0 ? '#9945FF' : i % 3 === 1 ? '#14F195' : '#FFE66D',
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
          
          {/* +1 floating badge */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float-up">
            <div className="flex items-center gap-1 px-4 py-2 bg-solana-green text-solana-dark font-bold rounded-full shadow-lg shadow-solana-green/50">
              <TrendingUp className="w-5 h-5" />
              <span>+1 Participant!</span>
            </div>
          </div>
        </div>
      )}

      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-solana-dark to-transparent" />
        
        {/* Category Badge */}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full bg-gradient-to-r ${categoryColors[event.category]} text-white text-xs font-semibold`}>
          {categoryLabels[event.category]}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-solana-green transition-colors">
          {event.name}
        </h3>
        <p className="text-white/60 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Details */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <Calendar className="w-4 h-4 text-solana-purple" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <MapPin className="w-4 h-4 text-solana-green" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <Users className={`w-4 h-4 ${showAnimation ? 'text-solana-green animate-bounce' : 'text-solana-purple'}`} />
            <span className={`transition-all ${showAnimation ? 'text-solana-green font-semibold scale-110' : ''}`}>
              {displayCount} / {event.maxAttendees} attendees
            </span>
            {showAnimation && (
              <span className="text-solana-green text-xs animate-pulse">● Live</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <Award className="w-4 h-4 text-solana-green" />
            <span>By {event.organizer}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                showAnimation 
                  ? 'bg-solana-green shadow-lg shadow-solana-green/50' 
                  : 'bg-gradient-to-r from-solana-purple to-solana-green'
              }`}
              style={{ width: `${(displayCount / event.maxAttendees) * 100}%` }}
            />
          </div>
          <p className="text-xs text-white/40 mt-1">
            {event.maxAttendees - displayCount} spots remaining
          </p>
        </div>

        {/* Mint Button */}
        <MintButton event={event} />
      </div>
    </div>
  )
}
