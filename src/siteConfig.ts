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

// Keep live clips on YouTube so they play reliably without requiring Google Drive access.
export const showreel = [
  { title: 'Performance 1', category: 'Live performance', videoUrl: 'https://www.youtube.com/embed/Qin5iFOtgAw?autoplay=1&rel=0' },
  { title: 'Performance 2', category: 'Live performance', videoUrl: 'https://www.youtube.com/embed/khVHboHpxLg?autoplay=1&rel=0' },
  { title: 'Hawaayein - The Musketeers', category: 'Live performance', videoUrl: 'https://www.youtube.com/embed/CSjxY1BfEC8?autoplay=1&rel=0' },
];
