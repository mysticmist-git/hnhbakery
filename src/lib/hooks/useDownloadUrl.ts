import { storage } from '@/firebase/config';
import { getDownloadURL, ref } from 'firebase/storage';
import { useEffect, useState } from 'react';

const useDownloadUrl = (path: string): string => {
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    getDownloadURL(ref(storage, path))
      .then((url) => setUrl(url))
      .catch((e) => {
        console.log('[useDownloadUrl] Fail to get download Url', e);
        setUrl('');
      });
  }, [path]);

  return url;
};

export default useDownloadUrl;
