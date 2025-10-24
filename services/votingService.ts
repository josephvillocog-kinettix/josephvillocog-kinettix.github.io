import { Candidate, Poll } from '../types';

const POLL_STORAGE_KEY = 'poll-app-data';

let activePoll: Poll | null = null;
let pollPromise: Promise<Poll | null> | null = null;

const toProperCase = (str: string): string => {
  return str
    .trim()
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const loadPollFromStorage = (): Poll | null => {
  try {
    const storedData = sessionStorage.getItem(POLL_STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData) as Poll;
    }
    return null;
  } catch (error) {
    console.error('Error loading poll from sessionStorage:', error);
    return null;
  }
};

const savePollToStorage = (poll: Poll): void => {
  try {
    sessionStorage.setItem(POLL_STORAGE_KEY, JSON.stringify(poll));
  } catch (error) {
    console.error('Error saving poll to sessionStorage:', error);
  }
};

const initialize = (): Promise<Poll | null> => {
  if (!pollPromise) {
    pollPromise = new Promise((resolve) => {
      activePoll = loadPollFromStorage();
      resolve(activePoll);
    });
  }
  return pollPromise;
};

// Initialize on module load
initialize();

// --- SVG Generation and AI Helpers ---

/**
 * A simple heuristic to guess gender from a first name.
 * This is a fun, non-critical feature and not guaranteed to be accurate.
 */
const guessGender = (firstName: string): 'male' | 'female' => {
  const name = firstName.toLowerCase();
  // Common female name endings in English
  const femaleEndings = ['a', 'e', 'i', 'y', 'la', 'na', 'ie', 'ah', 'et', 'ia'];
  // Some exceptions where names ending in 'a' or 'e' are typically male
  const maleExceptions = ['joshua', 'dave', 'mike', 'pete'];

  if (maleExceptions.includes(name)) {
    return 'male';
  }
  if (femaleEndings.some(ending => name.endsWith(ending))) {
    return 'female';
  }
  return 'male'; // Default
};

const generateSnowmanSVG = (gender: 'male' | 'female'): string => {
  const maleAccessory = `<path d="M40 35 h20 v-10 h-20 z" fill="#333" /><path d="M35 25 h30 v-5 h-30 z" fill="#333" />`;
  const femaleAccessory = `<path d="M75 25 q -5 -10 0 -10 q 5 0 0 10" fill="red" /><path d="M70 20 q 5 -10 0 -10 q -5 0 0 10" fill="red" /><circle cx="72.5" cy="20" r="2" fill="white"/>`;

  return `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#7dd3fc" />
      <circle cx="50" cy="75" r="25" fill="white" stroke="#ccc" stroke-width="1"/>
      <circle cx="50" cy="40" r="20" fill="white" stroke="#ccc" stroke-width="1"/>
      <circle cx="42" cy="38" r="2" fill="black"/>
      <circle cx="58" cy="38" r="2" fill="black"/>
      <polygon points="50,42 55,45 50,48" fill="orange"/>
      <circle cx="45" cy="48" r="1" fill="black"/>
      <circle cx="50" cy="50" r="1" fill="black"/>
      <circle cx="55" cy="48" r="1" fill="black"/>
      ${gender === 'male' ? maleAccessory : femaleAccessory}
    </svg>
  `;
};

const generateElfSVG = (gender: 'male' | 'female'): string => {
  const femaleAccessory = `<path d="M35 45 q 5 -5 5 0" stroke="black" stroke-width="1" fill="none" /><path d="M65 45 q -5 -5 -5 0" stroke="black" stroke-width="1" fill="none" />`;

  return `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#059669" />
      <path d="M50 10 L20 40 L80 40 Z" fill="#16a34a"/>
      <path d="M20 40 C 20 60, 30 90, 50 90 C 70 90, 80 60, 80 40" fill="#fde68a" />
      <path d="M20 40 L10 35 L22 45 Z" fill="#fde68a" />
      <path d="M80 40 L90 35 L78 45 Z" fill="#fde68a" />
      <circle cx="50" cy="10" r="8" fill="#ef4444" />
      <circle cx="40" cy="50" r="3" fill="black"/>
      <circle cx="60" cy="50" r="3" fill="black"/>
      <path d="M45 65 q 5 5 10 0" stroke="black" stroke-width="2" fill="none"/>
      ${gender === 'female' ? femaleAccessory : ''}
    </svg>
  `;
};

const generateReindeerSVG = (gender: 'male' | 'female'): string => {
  const maleAccessory = `<rect x="35" y="80" width="30" height="8" fill="#16a34a" /><rect x="38" y="88" width="24" height="8" fill="#ef4444" />`;
  const femaleAccessory = `<circle cx="80" cy="30" r="5" fill="red" /><path d="M78 25 l 4 -4" stroke="#15803d" stroke-width="2" /><path d="M82 25 l 4 -4" stroke="#15803d" stroke-width="2" />`;
  
  return `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
       <rect width="100" height="100" fill="#0c4a6e" />
       <path d="M20,40 C10,20 30,10 40,20" stroke="#6b462a" stroke-width="8" fill="none" stroke-linecap="round"/>
       <path d="M80,40 C90,20 70,10 60,20" stroke="#6b462a" stroke-width="8" fill="none" stroke-linecap="round"/>
       <ellipse cx="50" cy="65" rx="30" ry="35" fill="#a16207"/>
       <circle cx="50" cy="60" r="10" fill="#dc2626"/>
       <circle cx="35" cy="50" r="5" fill="white"/>
       <circle cx="65" cy="50" r="5" fill="white"/>
       <circle cx="36" cy="51" r="3" fill="black"/>
       <circle cx="64" cy="51" r="3" fill="black"/>
       ${gender === 'male' ? maleAccessory : femaleAccessory}
    </svg>
  `;
};

const getCharacterImage = (name: string, index: number): string => {
    const firstName = name.split(' ')[0] || name;
    const gender = guessGender(firstName);
    const characterTypes = [generateElfSVG, generateSnowmanSVG, generateReindeerSVG];
    const SvgGenerator = characterTypes[index % characterTypes.length];
    const svgString = SvgGenerator(gender);
    return `data:image/svg+xml;base64,${btoa(svgString)}`;
};


// --- Exported Functions ---

export const getActivePoll = async (): Promise<Poll | null> => {
  await initialize();
  return new Promise((resolve) => {
    setTimeout(() => {
        resolve(activePoll);
    }, 100);
  });
};

export const createPoll = async (title: string, candidateNames: string[]): Promise<Poll> => {
    const newPoll: Poll = {
        title,
        candidates: candidateNames.map((name, index) => {
            const properName = toProperCase(name);
            return {
                id: `${Date.now()}-${index}`,
                name: properName,
                imageUrl: getCharacterImage(properName, index),
                votes: 0,
            };
        }),
    };
    
    activePoll = newPoll;
    savePollToStorage(activePoll);
    
    // Reset all user voting statuses
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('user-has-voted-')) {
            localStorage.removeItem(key);
        }
    });

    // Reset the promise to force re-initialization on next data request
    pollPromise = null;
    initialize();

    return new Promise(resolve => setTimeout(() => resolve(newPoll), 100));
};

export const getCandidates = async (): Promise<Candidate[]> => {
  await initialize();
  return activePoll ? [...activePoll.candidates] : [];
};

export const submitVote = async (candidateId: string): Promise<void> => {
  await initialize();
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!activePoll) {
        return reject(new Error('No active poll.'));
      }

      const candidateIndex = activePoll.candidates.findIndex((c) => c.id === candidateId);

      if (candidateIndex > -1) {
        const updatedCandidates = activePoll.candidates.map((candidate, index) => {
            if (index === candidateIndex) {
                return { ...candidate, votes: candidate.votes + 1 };
            }
            return candidate;
        });

        activePoll = { ...activePoll, candidates: updatedCandidates };
        
        savePollToStorage(activePoll);
        resolve();
      } else {
        reject(new Error('Candidate not found'));
      }
    }, 300);
  });
};

export const getResults = async (): Promise<Candidate[]> => {
  await initialize();
  if (!activePoll) {
      return [];
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      const sortedCandidates = [...activePoll.candidates].sort((a, b) => b.votes - a.votes);
      resolve(sortedCandidates);
    }, 100);
  });
};
