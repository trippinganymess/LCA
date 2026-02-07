// Import all profile images
import Alabaster from '../assets/Users/Alabaster.png';
import Cipher from '../assets/Users/Cipher.png';
import Cobalt from '../assets/Users/Cobalt.png';
import Crimson from '../assets/Users/Crimson.png';
import Ember from '../assets/Users/Ember.png';
import Gilded from '../assets/Users/Gilded.png';
import Mess from '../assets/Users/Mess.png';
import Neon from '../assets/Users/Neon.png';
import Paradox from '../assets/Users/Paradox.png';

export interface ProfileAvatar {
  name: string;
  image: string;
  hueA: number;
  hueB: number;
}

export const PROFILE_AVATARS: ProfileAvatar[] = [
  { name: 'Alabaster', image: Alabaster, hueA: 0, hueB: 30 },
  { name: 'Cipher', image: Cipher, hueA: 40, hueB: 70 },
  { name: 'Cobalt', image: Cobalt, hueA: 200, hueB: 230 },
  { name: 'Crimson', image: Crimson, hueA: 340, hueB: 10 },
  { name: 'Ember', image: Ember, hueA: 20, hueB: 50 },
  { name: 'Gilded', image: Gilded, hueA: 40, hueB: 60 },
  { name: 'Mess', image: Mess, hueA: 280, hueB: 310 },
  { name: 'Neon', image: Neon, hueA: 150, hueB: 180 },
  { name: 'Paradox', image: Paradox, hueA: 260, hueB: 290 },
];

/**
 * Assigns a profile avatar index to a user based on their position in the group
 * @param memberIndex - The index of the member in the group (0-9)
 * @returns The avatar index (0-8, cycling if more than 9 members)
 */
export const getAvatarIndexForMember = (memberIndex: number): number => {
  return memberIndex % PROFILE_AVATARS.length;
};

/**
 * Gets the profile avatar for a user by their ID within a group
 * @param userId - The user's ID
 * @param groupMembers - Array of member IDs in order they joined
 * @returns ProfileAvatar object
 */
export const getProfileAvatar = (userId: string, groupMembers: string[]): ProfileAvatar => {
  const memberIndex = groupMembers.indexOf(userId);
  const avatarIndex = getAvatarIndexForMember(memberIndex >= 0 ? memberIndex : 0);
  return PROFILE_AVATARS[avatarIndex];
};
