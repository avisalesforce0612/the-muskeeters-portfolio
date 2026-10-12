export const siteConfig = {
  name: 'The Musketeers',
  location: 'Gurugram · Delhi NCR, India',
  logoUrl: `${import.meta.env.BASE_URL}the-musketeers-logo.png`,
  driveFolderId: import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID?.trim() || '1ywljKfN_T7o9HOm5SlyVmgADyIJkgD6A',
  bookingEmail: 'ohthosemusketeers@gmail.com',
  whatsappNumber: '918172852397',
  instagramUrl: 'https://www.instagram.com/wearemuskeeters/',
  youtubeUrl: '',
};

// Add verified public video/embed URLs only; empty URLs render as non-interactive placeholders.
export const showreel = [
  { title: 'A night, live', category: 'Live performance', videoUrl: '' },
  { title: 'Up close', category: 'Acoustic session', videoUrl: '' },
  { title: 'Sing it back', category: 'Audience moments', videoUrl: '' },
];
