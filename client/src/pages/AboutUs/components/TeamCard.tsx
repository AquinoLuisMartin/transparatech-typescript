import { FC } from 'react';
import styles from '../AboutUs.module.css';

interface TeamCardProps {
  image: string;
  name: string;
  title: string;
  role: string;
  description: string;
}

const TeamCard: FC<TeamCardProps> = ({ image, name, title, role, description }) => {
  return (
    <div className={styles.teamCard}>
      <div className={styles.cardContent}>
        <div className={styles.imageContainer}>
          <img 
            src={image} 
            alt={`${name} - ${title}`}
            className={styles.memberImage}
            onError={(e) => {
              // Fallback to a placeholder if image fails to load
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x150?text=Team+Member';
            }}
          />
        </div>
        
        <div className={styles.memberInfo}>
          <h3 className={styles.memberName}>{name}</h3>
          <h4 className={styles.memberTitle}>{title}</h4>
          <p className={styles.memberRole}>{role}</p>
          <p className={styles.memberDescription}>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;