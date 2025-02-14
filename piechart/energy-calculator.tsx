import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const EnergyCalculator = () => {
  // State management
  const [sleepTime, setSleepTime] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [sleepHours, setSleepHours] = useState(0);
  const [selectedFeeling, setSelectedFeeling] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState(new Set());
  const [sections, setSections] = useState({
    work: true,
    physical: true,
    social: true,
    gentle: true,
    creative: true,
    recovery: true,
    entertainment: true
  });
  const [energyScore, setEnergyScore] = useState(null);
  const [affirmation, setAffirmation] = useState('');

  // Affirmations array
  const AFFIRMATIONS = [
    "Every breath brings me peaceful energy ✨",
    "I honor my body's natural rhythms 🌙",
    "I choose activities that nourish my soul 🌿",
    "My energy flows where my intention goes 💫",
    "I am in tune with my body's needs 🧘‍♀️",
    "Each day is a fresh start 🌅",
    "I listen to my body with compassion 💗"
  ];

  // Morning feelings with research-based scores
  const WAKE_FEELINGS = [
    { emoji: '✨', text: 'Refreshed', score: 35 },
    { emoji: '😊', text: 'Okay', score: 25 },
    { emoji: '😴', text: 'Still Tired', score: 12 },
    { emoji: '😫', text: 'Exhausted', score: 5 }
  ];

  // Activities with METs-based scoring
  const ACTIVITIES = {
    work: {
      title: 'Work & Study',
      icon: '💼',
      items: {
        'Full Work Day': -18,
        'Work from Home': -14,
        'Study Session': -15,
        'Screen Time 4h+': -12,
        'Exam/Deadline': -20,
        'Project Planning': -12
      }
    },
    physical: {
      title: 'Physical Activities',
      icon: '💪',
      items: {
        'Gym Workout': -16,
        'Running': -18,
        'Swimming': -15,
        'Cycling': -14,
        'Sports Game': -16,
        'Dance Class': -12
      }
    },
    social: {
      title: 'Family & Social',
      icon: '👥',
      items: {
        'Family Time': -8,
        'Kids Activities': -12,
        'Social Gathering': -10,
        'Party/Event': -15,
        'Meeting New People': -12,
        'Deep Conversations': -10
      }
    },
    gentle: {
      title: 'Gentle Movement',
      icon: '🚶‍♀️',
      items: {
        'Light Walk': 5,
        'Yoga': 8,
        'Nature Walk': 10,
        'Gardening': -5,
        'Light Housework': -5,
        'Home Organizing': -8
      }
    },
    creative: {
      title: 'Creative & Hobbies',
      icon: '🎨',
      items: {
        'Art/Drawing': -5,
        'Music Practice': -8,
        'Writing': -8,
        'Photography': -6,
        'Crafting': -7,
        'Cooking': -6
      }
    },
    recovery: {
      title: 'Recovery & Self-Care',
      icon: '🧘',
      items: {
        'Meditation': 15,
        'Reading': 8,
        'Relaxing Bath': 12,
        'Massage': 15,
        'Mindful Break': 10,
        'Rest Day': 20
      }
    },
    entertainment: {
      title: 'Entertainment',
      icon: '🎮',
      items: {
        'Gaming': -8,
        'Movie/TV': 5,
        'Music Listening': 8,
        'Event Attending': -10,
        'Theater/Show': -6,
        'Museum Visit': -8
      }
    }
  };

  useEffect(() => {
    setAffirmation(AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]);
  }, []);

  const toggleSection = (section) => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const calculateSleepHours = () => {
    if (!sleepTime || !wakeTime) return;
    
    let sleep = new Date(`2024-01-01 ${sleepTime}`);
    let wake = new Date(`2024-01-01 ${wakeTime}`);
    
    if (wake < sleep) {
      wake.setDate(wake.getDate() + 1);
    }
    
    const hours = (wake - sleep) / (1000 * 60 * 60);
    setSleepHours(Math.round(hours * 10) / 10);
  };

  useEffect(() => {
    if (sleepTime && wakeTime) {
      calculateSleepHours();
    }
  }, [sleepTime, wakeTime]);

  const calculateEnergyScore = () => {
    let score = 0;
    
    // Sleep score (40% weight)
    if (sleepHours >= 8) score += 40;
    else if (sleepHours >= 7) score += 35;
    else if (sleepHours >= 6) score += 25;
    else if (sleepHours >= 5) score += 15;
    else score += 5;

    // Morning feeling score (30% weight)
    if (selectedFeeling !== null) {
      score += WAKE_FEELINGS[selectedFeeling].score;
    }

    // Activities impact (30% weight)
    let activityLoad = 0;
    selectedActivities.forEach(activity => {
      for (const category of Object.values(ACTIVITIES)) {
        if (activity in category.items) {
          activityLoad += category.items[activity];
          break;
        }
      }
    });

    // Apply cognitive load factor
    if (selectedActivities.size > 2) {
      activityLoad *= (1 + (selectedActivities.size - 2) * 0.2);
    }

    activityLoad = Math.max(-20, Math.min(20, activityLoad));
    score += activityLoad;

    // Final score adjustment
    score = Math.max(0, Math.min(100, Math.round(score)));
    setEnergyScore(score);
  };

  useEffect(() => {
    calculateEnergyScore();
  }, [sleepHours, selectedFeeling, selectedActivities]);

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Header with Moon Phases */}
      <div className="text-center mb-8">
        <svg viewBox="0 0 800 200" className="w-full max-w-md mx-auto mb-6">
          <g fill="#967259">
            <circle cx="100" cy="50" r="30" />
            <circle cx="115" cy="50" r="30" fill="#FFF" />
            <circle cx="250" cy="50" r="30" />
            <circle cx="265" cy="50" r="30" fill="#FFF" />
            <circle cx="400" cy="50" r="30" />
            <circle cx="550" cy="50" r="30" />
            <circle cx="535" cy="50" r="30" fill="#FFF" />
            <circle cx="700" cy="50" r="30" />
            <circle cx="685" cy="50" r="30" fill="#FFF" />
          </g>
          <text x="400" y="150" textAnchor="middle" fontFamily="serif" fontSize="48" fill="#967259">
            tide.
          </text>
        </svg>
        
        <h2 className="text-xl font-medium text-[#967259] mb-2">Energy Forecast</h2>
        <p className="text-[#967259] italic px-6">{affirmation}</p>
      </div>

      {/* Sleep Section */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Sleep Details</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-amber-700">
                <span>🌙 Bedtime</span>
              </label>
              <input
                type="time"
                value={sleepTime}
                onChange={(e) => setSleepTime(e.target.value)}
                className="w-full p-2 rounded border focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-amber-700">
                <span>☀️ Wake time</span>
              </label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full p-2 rounded border focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
          
          {sleepHours > 0 && (
            <div className="text-center font-medium">
              <span className="text-2xl text-amber-600">{sleepHours}</span>
              <span className="text-amber-600 ml-2">hours of sleep</span>
            </div>
          )}
        </div>
      </div>

      {/* Morning Feeling Section */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h3 className="text-lg font-medium text-gray-700 mb-4">How do you feel this morning?</h3>
        <div className="grid grid-cols-2 gap-3">
          {WAKE_FEELINGS.map((feeling, index) => (
            <button
              key={index}
              onClick={() => setSelectedFeeling(index)}
              className={`p-3 rounded-lg border text-left transition-all ${
                selectedFeeling === index 
                  ? 'bg-amber-50 border-amber-500 text-amber-700' 
                  : 'hover:bg-gray-50'
              }`}
            >
              {feeling.emoji} {feeling.text}
            </button>
          ))}
        </div>
      </div>

      {/* Activities Section */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Today's Activities</h3>
        
        {Object.entries(ACTIVITIES).map(([key, section]) => (
          <div key={key} className="mb-6 last:mb-0">
            <button
              onClick={() => toggleSection(key)}
              className="w-full flex justify-between items-center text-md font-medium text-[#967259] mb-2"
            >
              <span>{section.icon} {section.title}</span>
              {sections[key] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            
            {sections[key] && (
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(section.items).map(([activity, score]) => (
                  <button
                    key={activity}
                    onClick={() => {
                      const newSelected = new Set(selectedActivities);
                      if (newSelected.has(activity)) {
                        newSelected.delete(activity);
                      } else {
                        newSelected.add(activity);
                      }
                      setSelectedActivities(newSelected);
                    }}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      selectedActivities.has(activity)
                        ? 'bg-amber-50 border-amber-500 text-amber-700'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Energy Score Display */}
      {energyScore !== null && (
        <div className="bg-white rounded-lg p-6 shadow text-center">
          <h3 className="text-xl font-medium text-amber-900 mb-4">Today's Energy Forecast</h3>
          <div className="text-5xl font-bold text-amber-600 mb-4">
            {energyScore}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                energyScore > 70 ? 'bg-green-500' :
                energyScore > 40 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${energyScore}%` }}
            />
          </div>
          <p className="text-amber-700">
            {energyScore > 70 ? '✨ Great energy levels today!' :
             energyScore > 40 ? '🌟 Moderate energy - pace yourself' :
             '🌙 Take it easy today and focus on self-care'}
          </p>
        </div>
      )}

      {/* Energy Boost Options - Always visible */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h3 className="text-lg font-medium text-amber-800 mb-3">
          Energy Boost Options
          <span className="text-sm font-normal ml-2">Select what appeals to you</span>
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            '🛁 Warm Bath/Jacuzzi',
            '🌲 Nature Walk',
            '📔 Journaling',
            '🧘‍♀️ Gentle Yoga',
            '🫖 Calming Tea',
            '🎵 Calming Music'
          ].map(activity => (
            <button
              key={activity}
              className="p-3 rounded-lg border text-left hover:bg-amber-50 
                       hover:border-amber-500 transition-all"
            >
              {activity}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnergyCalculator;