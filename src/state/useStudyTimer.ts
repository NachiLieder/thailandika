import { useEffect, useRef } from 'react';
import { useAppState } from './AppStateContext';

/**
 * סופר את הזמן שהמשתמשת שוהה במסך לימוד או חידון,
 * ורושם אותו בסיום – כדי להציג "דקות לימוד היום" אמיתיות.
 */
export function useStudyTimer() {
  const { recordStudyTime } = useAppState();
  const startedAt = useRef(Date.now());

  useEffect(() => {
    const start = startedAt.current;
    return () => {
      const seconds = (Date.now() - start) / 1000;
      // מתעלמים משהייה זניחה או ארוכה בצורה לא סבירה (מסך שנשאר פתוח)
      if (seconds >= 3 && seconds <= 3600) recordStudyTime(seconds);
    };
  }, [recordStudyTime]);
}
