import { FC } from 'react'
import { Calendar, MapPin, Users, Award } from 'lucide-react'
import { MintButton } from './MintButton'

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
  category: 'workshop' | 'hackathon' | 'meetup' | 'conference'
}

interface Props {
  event: Event
}

const categoryColors = {
  workshop: 'from-blue-500 to-cyan-500',
  hackathon: 'from-solana-purple to-pink-500',
  meetup: 'from-solana-green to-emerald-500',
  conference: 'from-orange-500 to-amber-500',
}

const categoryLabels = {
  workshop: 'Workshop',
  hackathon: 'Hackathon',
  meetup: 'Meetup',
  conference: 'Conference',
}

export const EventCard: FC<Props> = ({ event }) => {
  return (
    <div className="glass-card overflow-hidden group hover:border-white/20 transition-all duration-300">
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
            <Users className="w-4 h-4 text-solana-purple" />
            <span>{event.attendees} / {event.maxAttendees} attendees</span>
          </div>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <Award className="w-4 h-4 text-solana-green" />
            <span>By {event.organizer}</span>
          </div>
        </div>

        {/* Mint Button */}
        <MintButton event={event} />
      </div>
    </div>
  )
}
