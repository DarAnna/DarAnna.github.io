import { getImagePath } from './importPhotos';

export interface Photo {
  id: string;
  src: string;
  title: string;
  description: string;
  year?: string;
}

// Define photos array with the images we have
export const photos: Photo[] = [
  {
    id: 'photo1',
    src: getImagePath('photoshoot_group_with_grandma.JPG'),
    title: 'Family Photoshoot',
    description: 'The whole family together with grandma',
  },
  {
    id: 'photo2',
    src: getImagePath('photoshoot_at_the_table.JPG'),
    title: 'Around the Table',
    description: 'Family moment at the dinner table',
  },
  {
    id: 'photo3',
    src: getImagePath('in_front_of_school.JPG'),
    title: 'School Days',
    description: 'In front of the school building',
  },
  {
    id: 'photo4',
    src: getImagePath('with_me_theather.heic'),
    title: 'Theater Visit',
    description: 'At the theater together',
  },
  {
    id: 'photo5',
    src: getImagePath('entire_family_cousins_rome.jpg'),
    title: 'Rome Family Trip',
    description: 'The extended family in Rome',
  },
  {
    id: 'photo6',
    src: getImagePath('with_kids_egypt.jpg'),
    title: 'Egyptian Adventure',
    description: 'Family trip to Egypt',
  },
  {
    id: 'photo7',
    src: getImagePath('photoshoot_with_kids_on_steps.JPG'),
    title: 'Steps Photoshoot',
    description: 'With the kids on the steps',
  },
  {
    id: 'photo8',
    src: getImagePath('photoshoot_kids_dad_on_the_phone_as_always.JPG'),
    title: 'Dad on the Phone',
    description: 'Classic moment - dad on the phone during family photos',
  },
  {
    id: 'photo9',
    src: getImagePath('photoshoot_with_daughters.JPG'),
    title: 'With Daughters',
    description: 'Dad with his daughters',
  },
  {
    id: 'photo10',
    src: getImagePath('photoshoot_all_jumping_except_brother.JPG'),
    title: 'Jump!',
    description: 'Everyone jumping (except brother)',
  },
  {
    id: 'photo11',
    src: getImagePath('photoshoot_the_two_of_us.JPG'),
    title: 'The Two of Us',
    description: 'Special father-child moment',
  },
  {
    id: 'photo12',
    src: getImagePath('me_filming_him_for_work.jpg'),
    title: 'Filming Dad',
    description: 'Helping dad with work recording',
  },
  {
    id: 'photo13',
    src: getImagePath('at_my_brothers_graduation.JPG'),
    title: 'Graduation Day',
    description: 'At brother\'s graduation ceremony',
    year: '2019'
  },
  {
    id: 'photo14',
    src: getImagePath('old_my_brothers_first_grade.jpg'),
    title: 'First Grade',
    description: 'Brother\'s first day of school',
    year: '2010'
  },
  {
    id: 'photo15',
    src: getImagePath('my_19_birthday_with_siblings.JPG'),
    title: '19th Birthday',
    description: 'Celebrating with siblings',
    year: '2020'
  },
  {
    id: 'photo16',
    src: getImagePath('old_school_photo.JPG'),
    title: 'Old School Photo',
    description: 'Classic school picture from years ago',
    year: '2005'
  },
  {
    id: 'photo17',
    src: getImagePath('school_photo.jpg'),
    title: 'School Portrait',
    description: 'Recent school photo',
    year: '2018'
  },
  {
    id: 'photo18',
    src: getImagePath('funnt_selfie_with_bunny_ears.JPG'),
    title: 'Bunny Ears',
    description: 'Funny selfie with bunny ears filter',
  },
  {
    id: 'photo19',
    src: getImagePath('old_easter_church_with_grandma.JPG'),
    title: 'Easter at Church',
    description: 'Easter celebration at church with grandma',
    year: '2008'
  },
  {
    id: 'photo20',
    src: getImagePath('my_graduation.JPG'),
    title: 'Graduation Day',
    description: 'At my graduation ceremony',
    year: '2022'
  }
];

// Function to get puzzle piece photos
export const getPuzzlePieces = (count: number = 9): Photo[] => {
  // Select specific photos that would work well for puzzle
  const puzzlePhotoIds = ['photo1', 'photo7', 'photo9', 'photo11'];
  const puzzlePhotos = photos.filter(photo => puzzlePhotoIds.includes(photo.id));
  
  // Return first photo if nothing matches
  return puzzlePhotos.length > 0 ? [puzzlePhotos[0]] : [photos[0]];
};

// Function to get family journey photos
export const getFamilyJourneyPhotos = (): Photo[] => {
  // Select photos that show the journey through years
  return photos.filter(photo => photo.year !== undefined)
    .sort((a, b) => (a.year && b.year ? parseInt(a.year) - parseInt(b.year) : 0));
};

// Function to get card photos - select a nice subset for the card
export const getCardPhotos = (): Photo[] => {
  const cardPhotoIds = ['photo1', 'photo5', 'photo6', 'photo9', 'photo10', 'photo20'];
  return photos.filter(photo => cardPhotoIds.includes(photo.id));
}; 