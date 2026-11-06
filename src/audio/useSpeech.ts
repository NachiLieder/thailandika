import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import * as Speech from 'expo-speech';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { RECORDED_AUDIO, hasRecording } from './audioAssets';

export type SpeakState = 'idle' | 'loading' | 'playing' | 'error';

let thaiVoiceId: string | undefined;
let thaiVoiceChecked = false;
let thaiVoiceAvailable = false;

/** בדיקה חד-פעמית אם קיים קול תאילנדי במכשיר */
export async function ensureThaiVoice(): Promise<boolean> {
  if (thaiVoiceChecked) return thaiVoiceAvailable;
  thaiVoiceChecked = true;
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    const thai = voices.find((v) => (v.language || '').toLowerCase().startsWith('th'));
    if (thai) {
      thaiVoiceId = thai.identifier;
      thaiVoiceAvailable = true;
    } else {
      // ב-iOS הקול התאילנדי לא תמיד מופיע ברשימה אך ההקראה בכל זאת עובדת
      thaiVoiceAvailable = Platform.OS === 'ios';
    }
  } catch {
    thaiVoiceAvailable = Platform.OS === 'ios';
  }
  return thaiVoiceAvailable;
}

let activePlayer: AudioPlayer | null = null;

function stopRecorded() {
  if (activePlayer) {
    try {
      activePlayer.remove();
    } catch {
      /* noop */
    }
    activePlayer = null;
  }
}

/** עוצר כל שמע פעיל – נקרא גם במעבר בין מסכים */
export function stopAllAudio() {
  try {
    Speech.stop();
  } catch {
    /* noop */
  }
  stopRecorded();
}

type Options = {
  enabled: boolean;
  rate: number;
};

export function useSpeech({ enabled, rate }: Options) {
  const [state, setState] = useState<SpeakState>('idle');
  const [supported, setSupported] = useState<boolean | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    void setAudioModeAsync({ playsInSilentMode: true }).catch(() => undefined);
    void ensureThaiVoice().then((ok) => {
      if (mounted.current) setSupported(ok);
    });
    return () => {
      mounted.current = false;
      stopAllAudio();
    };
  }, []);

  const speak = useCallback(
    async (text: string, itemId?: string | null) => {
      if (!enabled) return;
      stopAllAudio();
      setState('loading');

      // 1. הקלטה מקורית, אם קיימת
      if (hasRecording(itemId)) {
        try {
          const player = createAudioPlayer(RECORDED_AUDIO[itemId as string]);
          activePlayer = player;
          player.play();
          setState('playing');
          const done = () => {
            if (mounted.current) setState('idle');
            stopRecorded();
          };
          setTimeout(done, Math.max(1200, (player.duration || 1.5) * 1000 + 200));
          return;
        } catch {
          stopRecorded();
        }
      }

      // 2. מנוע ההקראה של המכשיר
      const ok = await ensureThaiVoice();
      if (!ok) {
        if (mounted.current) {
          setSupported(false);
          setState('error');
        }
        return;
      }
      try {
        Speech.speak(text, {
          language: 'th-TH',
          voice: thaiVoiceId,
          rate,
          pitch: 1.0,
          onStart: () => {
            if (mounted.current) setState('playing');
          },
          onDone: () => {
            if (mounted.current) setState('idle');
          },
          onStopped: () => {
            if (mounted.current) setState('idle');
          },
          onError: () => {
            if (mounted.current) setState('error');
          },
        });
      } catch {
        if (mounted.current) setState('error');
      }
    },
    [enabled, rate],
  );

  const reset = useCallback(() => setState('idle'), []);

  return { speak, state, supported, reset, stop: stopAllAudio };
}
