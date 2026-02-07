import React, { useRef } from 'react';
import {
  animate,
  motion,
  MotionValue,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import { User } from '../App';
import { PROFILE_AVATARS } from '../utils/profileUtils';
import './MembersGallery.css';

interface MembersGalleryProps {
  members: User[];
  currentUserId: string;
}

const MembersGallery: React.FC<MembersGalleryProps> = ({ members, currentUserId }) => {
  const ref = useRef<HTMLUListElement>(null);
  const { scrollXProgress } = useScroll({ container: ref });
  const maskImage = useScrollOverflowMask(scrollXProgress);

  return (
    <div className="members-gallery-container">
      <h3 className="gallery-title">Group Members</h3>
      
      <svg className="scroll-progress" width="80" height="80" viewBox="0 0 100 100">
        <circle 
          cx="50" 
          cy="50" 
          r="30" 
          pathLength={1}
          className="progress-bg" 
        />
        <motion.circle
          cx="50"
          cy="50"
          r="30"
          pathLength={1}
          className="progress-indicator"
          style={{ pathLength: scrollXProgress }}
        />
      </svg>

      <motion.ul 
        ref={ref} 
        className="members-scroll-list" 
        style={{ 
          maskImage,
          WebkitMaskImage: maskImage,
        }}
      >
        {members.map((member, index) => {
          const avatarIndex = member.avatarIndex !== undefined ? member.avatarIndex : index % 9;
          const avatar = PROFILE_AVATARS[avatarIndex];
          const background = `linear-gradient(135deg, hsl(${avatar.hueA}, 100%, 50%), hsl(${avatar.hueB}, 100%, 50%))`;
          const isCurrentUser = member.id === currentUserId;

          return (
            <li key={member.id} className="member-scroll-card" style={{ background }}>
              <div className="card-content">
                <img 
                  src={avatar.image} 
                  alt={avatar.name}
                  className="member-card-image"
                />
                <div className="member-card-info">
                  <h4>{member.username}</h4>
                  <p className="member-role">{avatar.name}</p>
                  {isCurrentUser && <span className="current-user-badge">You</span>}
                </div>
              </div>
            </li>
          );
        })}
      </motion.ul>
    </div>
  );
};

const left = `0%`;
const right = `100%`;
const leftInset = `20%`;
const rightInset = `80%`;
const transparent = `#0000`;
const opaque = `#000`;

function useScrollOverflowMask(scrollXProgress: MotionValue<number>) {
  const maskImage = useMotionValue(
    `linear-gradient(90deg, ${opaque}, ${opaque} ${left}, ${opaque} ${rightInset}, ${transparent})`
  );

  useMotionValueEvent(scrollXProgress, "change", (value) => {
    if (value === 0) {
      animate(
        maskImage,
        `linear-gradient(90deg, ${opaque}, ${opaque} ${left}, ${opaque} ${rightInset}, ${transparent})`
      );
    } else if (value === 1) {
      animate(
        maskImage,
        `linear-gradient(90deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${right}, ${opaque})`
      );
    } else if (
      scrollXProgress.getPrevious() === 0 ||
      scrollXProgress.getPrevious() === 1
    ) {
      animate(
        maskImage,
        `linear-gradient(90deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${rightInset}, ${transparent})`
      );
    }
  });

  return maskImage;
}

export default MembersGallery;
