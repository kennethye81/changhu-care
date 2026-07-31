import { useCallback, useState } from 'react';

const UPLOAD_STAGES = [
  'Encrypting...',
  'Uploading to cloud...',
  'Verifying...',
  'ND review...',
  'Sync complete',
] as const;

export function useEliteUploadSubmit(onComplete: () => void) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = useCallback(() => {
    if (uploading || done) return;
    setUploading(true);
    setUploadProgress(0);
    let p = 0;
    const iv = setInterval(() => {
      p += 2 + Math.floor(Math.random() * 7);
      if (p >= 100) {
        p = 100;
        clearInterval(iv);
      }
      setUploadProgress(p);
      setUploadStage(UPLOAD_STAGES[Math.min(Math.floor(p / 20), 4)]);
      if (p >= 100) {
        setTimeout(() => {
          setUploading(false);
          setDone(true);
          setTimeout(onComplete, 800);
        }, 400);
      }
    }, 150);
  }, [uploading, done, onComplete]);

  return { uploading, uploadProgress, uploadStage, done, handleSubmit };
}
