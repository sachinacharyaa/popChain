import { createContext, useContext, useState, ReactNode, FC, useCallback } from 'react'
import { Event } from '../components/EventCard'

// Initial events data
const initialEvents: Event[] = [
  {
    id: '1',
    name: 'Solana Hackathon 2026',
    description: 'Join the biggest Solana hackathon of the year! Build innovative dApps and compete for prizes.',
    date: 'Feb 15-17, 2026',
    location: 'San Francisco, CA',
    organizer: 'Solana Foundation',
    attendees: 847,
    maxAttendees: 1000,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
    category: 'hackathon',
  },
  {
    id: '2',
    name: 'Web3 Developer Workshop',
    description: 'Learn to build decentralized applications from scratch with hands-on coding sessions.',
    date: 'Feb 20, 2026',
    location: 'Online',
    organizer: 'DevDAO',
    attendees: 234,
    maxAttendees: 500,
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop',
    category: 'workshop',
  },
  {
    id: '3',
    name: 'Blockchain Builders Meetup',
    description: 'Monthly gathering of blockchain enthusiasts and developers. Network and share ideas!',
    date: 'Feb 25, 2026',
    location: 'New York, NY',
    organizer: 'NYC Blockchain',
    attendees: 89,
    maxAttendees: 150,
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop',
    category: 'meetup',
  },
  {
    id: '4',
    name: 'SuperTeam Nepal Bootcamp',
    description: 'Web3 In-physical Bootcamp where you can learn from others while building own web3 projects',
    date: 'Mar 5-7, 2026',
    location: 'PKR, NPL',
    organizer: 'SuperteamNPL',
    attendees: 15,
    maxAttendees: 20,
    imageUrl: './superteamnpl.png',
    category: 'bootcamp',
  },
  {
    id: '5',
    name: 'NFT Art Workshop',
    description: 'Create your first NFT artwork. From concept to minting, learn the complete process.',
    date: 'Mar 12, 2026',
    location: 'Los Angeles, CA',
    organizer: 'Digital Art Collective',
    attendees: 67,
    maxAttendees: 100,
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop',
    category: 'workshop',
  },
  {
    id: '6',
    name: 'Solana Validators Meetup',
    description: 'Connect with fellow validators and learn about the latest network improvements.',
    date: 'Mar 18, 2026',
    location: 'Austin, TX',
    organizer: 'Solana Validators DAO',
    attendees: 45,
    maxAttendees: 75,
    imageUrl: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=800&auto=format&fit=crop',
    category: 'meetup',
  },
]

interface EventsContextType {
  events: Event[]
  incrementAttendees: (eventId: string) => void
  recentlyUpdatedEventId: string | null
}

const EventsContext = createContext<EventsContextType | null>(null)

interface Props {
  children: ReactNode
}

export const EventsProvider: FC<Props> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [recentlyUpdatedEventId, setRecentlyUpdatedEventId] = useState<string | null>(null)

  const incrementAttendees = useCallback((eventId: string) => {
    setEvents(prev => prev.map(event => {
      if (event.id === eventId && event.attendees < event.maxAttendees) {
        return { ...event, attendees: event.attendees + 1 }
      }
      return event
    }))
    
    // Set recently updated for animation
    setRecentlyUpdatedEventId(eventId)
    
    // Clear after animation
    setTimeout(() => {
      setRecentlyUpdatedEventId(null)
    }, 2000)
  }, [])

  return (
    <EventsContext.Provider value={{ events, incrementAttendees, recentlyUpdatedEventId }}>
      {children}
    </EventsContext.Provider>
  )
}

export const useEvents = () => {
  const context = useContext(EventsContext)
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider')
  }
  return context
}
