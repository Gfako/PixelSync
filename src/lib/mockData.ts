import { Meeting } from '@/types';

export const mockMeetings: Meeting[] = [
  // Past Meetings
  {
    id: '1',
    title: 'George <> maria',
    participants: [
      {
        id: '1',
        name: 'George',
        email: 'george@pixelsync.io',
        company: 'PixelSync',
        title: 'Product Manager'
      },
      {
        id: '2',
        name: 'Maria',
        email: 'maria@company.com',
        company: 'TechCorp',
        title: 'Designer'
      }
    ],
    date: '08/30/2025',
    time: 'Yesterday',
    type: 'Partnership',
    tags: ['Partnerships'],
    status: 'past',
    notes: 'Great discussion about potential partnership opportunities.',
    transcript: 'This is a sample transcript of the meeting between George and Maria. They discussed various aspects of a potential partnership including timeline, deliverables, and mutual benefits. Maria showed interest in our platform and George explained the key features that would be most valuable for their use case.'
  },
  {
    id: '2',
    title: 'George <> Jay',
    participants: [
      {
        id: '1',
        name: 'George',
        email: 'george@pixelsync.io',
        company: 'PixelSync',
        title: 'Product Manager'
      },
      {
        id: '3',
        name: 'Jay',
        email: 'jay@startup.com',
        company: 'StartupCo',
        title: 'CEO'
      }
    ],
    date: '08/22/2025',
    time: '2:00 PM',
    type: 'UI Design',
    tags: ['UI Design'],
    status: 'past',
    transcript: 'Meeting transcript with Jay discussing UI improvements and user experience enhancements. We covered the current pain points in the user journey and brainstormed solutions for better engagement.'
  },

  // Upcoming Meetings
  {
    id: '3',
    title: 'George <> John',
    participants: [
      {
        id: '1',
        name: 'George',
        email: 'george@pixelsync.io',
        company: 'PixelSync',
        title: 'Product Manager'
      },
      {
        id: '4',
        name: 'John',
        email: 'john@enterprise.com',
        company: 'Enterprise Inc',
        title: 'CTO'
      }
    ],
    date: '09/01/2025',
    time: 'Tomorrow',
    type: 'Development',
    tags: ['Development'],
    status: 'upcoming',
    notes: 'Meeting recording and summary available.'
  },
  {
    id: '4',
    title: 'Copywriting of the app',
    participants: [
      {
        id: '1',
        name: 'George',
        email: 'george@pixelsync.io',
        company: 'PixelSync',
        title: 'Product Manager'
      },
      {
        id: '5',
        name: 'Sarah',
        email: 'sarah@copywriter.com',
        company: 'WordCraft',
        title: 'Copywriter'
      }
    ],
    date: '11/10/2025',
    time: 'Nov 10',
    type: 'Marketing',
    tags: ['Marketing'],
    status: 'upcoming',
    notes: 'Reviewing app copy and messaging strategy.'
  },
  {
    id: '5',
    title: 'Implement Apps',
    participants: [
      {
        id: '1',
        name: 'George',
        email: 'george@pixelsync.io',
        company: 'PixelSync',
        title: 'Product Manager'
      },
      {
        id: '6',
        name: 'Alex',
        email: 'alex@devstudio.com',
        company: 'DevStudio',
        title: 'Developer'
      },
      {
        id: '7',
        name: 'Sam',
        email: 'sam@devstudio.com',
        company: 'DevStudio',
        title: 'Developer'
      }
    ],
    date: '12/15/2025',
    time: 'Dec 15',
    type: 'Development',
    tags: ['Development'],
    status: 'upcoming',
    notes: 'Technical implementation discussion for new app features.'
  }
];