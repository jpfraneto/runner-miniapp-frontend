import React from "react";
import classNames from "clsx";

interface BrandListItem {
  name: string;
  photoUrl: string;
  score: number;
  position: number;
  variation: "up" | "down" | "equal" | "hide";
  onClick: () => void;
}

// StyleSheet
import styles from "./BrandListItem.module.scss";

// Components
import Typography from "../Typography";

export const BrandListItem: React.FC<BrandListItem> = ({
  name,
  photoUrl,
  position,
  score,
  onClick,
}) => {
  /**
   * Renders the variation icon based on the provided variation type.
   * @param {BrandCardProps['variation']} variation - The variation type ('equal', 'up', 'down').
   * @returns {JSX.Element} The rendered variation icon.
   */

  return (
    <button onClick={onClick} className={styles.layout}>
      <Typography size={14} lineHeight={14} className={styles.position}>
        {position}
      </Typography>
      <div className={styles.row}>
        <img className={styles.img} src={photoUrl} width={32} height={32} />
        <Typography size={14} lineHeight={18}>
          {name}
        </Typography>
      </div>
      <div className={classNames(styles.row, styles.score)}>
        <Typography size={14} lineHeight={14}>
          {score}
        </Typography>
      </div>
    </button>
  );
};
