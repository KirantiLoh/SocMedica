import { useEffect, useState } from 'react'

const useEmojis = () => {
  
    const [emojis, setEmojis] = useState<{[s: string]: string}>({});

    const getEmojis = async () => {
        const res = await fetch("https://api.github.com/emojis");
        const data = await res.json();
        setEmojis(data);
    }

    useEffect(() => {
        getEmojis();
    }, []);

    return emojis

}

export default useEmojis