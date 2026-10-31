/**
 * Love Bug - How Well Do You Know Me? 🥹
 * Exactly 60 romantic questions divided into 5 progressive stages (12 levels per stage).
 * One partner answers about themselves, the other guesses. Score only when guess matches!
 */

export const knowMeQuestions = [
  // --- STAGE 1: PLAYFUL (Levels 1 - 12) ---
  {
    level: 1, stage: 1, stageName: 'Playful',
    text: 'When I am stressed after a long day, what makes me feel better fastest?',
    options: [
      { key: 'A', text: '🍕 Eating my favourite food' },
      { key: 'B', text: '📱 Talking to you' },
      { key: 'C', text: '😴 Taking a long nap' },
      { key: 'D', text: '🎵 Listening to music' },
    ],
  },
  {
    level: 2, stage: 1, stageName: 'Playful',
    text: 'What is my biggest food weakness?',
    options: [
      { key: 'A', text: '🍕 Pizza and burgers' },
      { key: 'B', text: '🍫 Chocolates and sweets' },
      { key: 'C', text: '🌶️ Spicy street food' },
      { key: 'D', text: '🍜 Noodles and pasta' },
    ],
  },
  {
    level: 3, stage: 1, stageName: 'Playful',
    text: 'What do I usually do when I get bored?',
    options: [
      { key: 'A', text: '📱 Scroll Instagram' },
      { key: 'B', text: '🎬 Watch movies or reels' },
      { key: 'C', text: '🎮 Play games' },
      { key: 'D', text: '💬 Text you' },
    ],
  },
  {
    level: 4, stage: 1, stageName: 'Playful',
    text: 'What is my favourite kind of weekend?',
    options: [
      { key: 'A', text: '🏠 Staying home and relaxing' },
      { key: 'B', text: '🛍️ Going shopping' },
      { key: 'C', text: '🌄 Going on a small trip' },
      { key: 'D', text: '🍿 Watching movies and eating snacks' },
    ],
  },
  {
    level: 5, stage: 1, stageName: 'Playful',
    text: 'What is my most common reaction when I get a surprise?',
    options: [
      { key: 'A', text: '😍 I get super excited' },
      { key: 'B', text: '🙈 I feel shy' },
      { key: 'C', text: '😂 I start laughing' },
      { key: 'D', text: '🥹 I get emotional' },
    ],
  },
  {
    level: 6, stage: 1, stageName: 'Playful',
    text: 'What kind of weather do I enjoy the most?',
    options: [
      { key: 'A', text: '🌧️ Rainy weather' },
      { key: 'B', text: '❄️ Cold winter days' },
      { key: 'C', text: '☀️ Sunny mornings' },
      { key: 'D', text: '🌥️ Cloudy and peaceful days' },
    ],
  },
  {
    level: 7, stage: 1, stageName: 'Playful',
    text: 'What am I most likely to spend money on?',
    options: [
      { key: 'A', text: '👗 Clothes and accessories' },
      { key: 'B', text: '🍔 Food and drinks' },
      { key: 'C', text: '🎁 Gifts for loved ones' },
      { key: 'D', text: '🛍️ Cute things I don\'t really need' },
    ],
  },
  {
    level: 8, stage: 1, stageName: 'Playful',
    text: 'What is my biggest weakness when shopping?',
    options: [
      { key: 'A', text: '👟 Shoes' },
      { key: 'B', text: '👗 Clothes' },
      { key: 'C', text: '💄 Beauty products' },
      { key: 'D', text: '🧸 Cute little things' },
    ],
  },
  {
    level: 9, stage: 1, stageName: 'Playful',
    text: 'What do I usually do when I am really happy?',
    options: [
      { key: 'A', text: '😁 Smile nonstop' },
      { key: 'B', text: '🗣️ Talk a lot' },
      { key: 'C', text: '💃 Dance or sing' },
      { key: 'D', text: '💌 Share the news with you first' },
    ],
  },
  {
    level: 10, stage: 1, stageName: 'Playful',
    text: 'What would I choose for a fun date?',
    options: [
      { key: 'A', text: '🎳 Bowling or arcade games' },
      { key: 'B', text: '🍦 Ice cream and a walk' },
      { key: 'C', text: '🎬 A movie date' },
      { key: 'D', text: '🌃 A long drive' },
    ],
  },
  {
    level: 11, stage: 1, stageName: 'Playful',
    text: 'What is my biggest pet peeve?',
    options: [
      { key: 'A', text: '⏰ People being late' },
      { key: 'B', text: '🙄 Being ignored' },
      { key: 'C', text: '🧹 Messy surroundings' },
      { key: 'D', text: '🤥 People telling lies' },
    ],
  },
  {
    level: 12, stage: 1, stageName: 'Playful',
    text: 'If I could eat only one type of food for a week, what would I choose?',
    options: [
      { key: 'A', text: '🍕 Fast food' },
      { key: 'B', text: '🍛 Homemade Indian food' },
      { key: 'C', text: '🍝 Italian food' },
      { key: 'D', text: '🍰 Desserts and sweets' },
    ],
  },

  // --- STAGE 2: COZY (Levels 13 - 24) ---
  {
    level: 13, stage: 2, stageName: 'Cozy',
    text: 'What is the first thing I usually do after waking up?',
    options: [
      { key: 'A', text: '📱 Check my phone' },
      { key: 'B', text: '😴 Sleep for five more minutes' },
      { key: 'C', text: '🚿 Get ready for the day' },
      { key: 'D', text: '☕ Have tea or coffee' },
    ],
  },
  {
    level: 14, stage: 2, stageName: 'Cozy',
    text: 'What helps me fall asleep faster?',
    options: [
      { key: 'A', text: '🎵 Listening to soft music' },
      { key: 'B', text: '📱 Scrolling on my phone' },
      { key: 'C', text: '💬 Talking to you' },
      { key: 'D', text: '🛌 Sleeping in a quiet room' },
    ],
  },
  {
    level: 15, stage: 2, stageName: 'Cozy',
    text: 'When I feel low, what kind of comfort do I prefer?',
    options: [
      { key: 'A', text: '🫂 A warm hug' },
      { key: 'B', text: '💬 Someone listening to me' },
      { key: 'C', text: '🥰 Sweet words and reassurance' },
      { key: 'D', text: '🌷 Some peaceful alone time' },
    ],
  },
  {
    level: 16, stage: 2, stageName: 'Cozy',
    text: 'What is my favourite way to spend a lazy morning?',
    options: [
      { key: 'A', text: '🛌 Staying in bed' },
      { key: 'B', text: '☕ Drinking chai or coffee' },
      { key: 'C', text: '🎬 Watching something' },
      { key: 'D', text: '🍳 Making breakfast' },
    ],
  },
  {
    level: 17, stage: 2, stageName: 'Cozy',
    text: 'What makes me feel most relaxed at home?',
    options: [
      { key: 'A', text: '🎵 Listening to music' },
      { key: 'B', text: '📺 Watching my favourite show' },
      { key: 'C', text: '🧸 Sitting comfortably with you' },
      { key: 'D', text: '📖 Reading a book' },
    ],
  },
  {
    level: 18, stage: 2, stageName: 'Cozy',
    text: 'What would I prefer after a tiring day?',
    options: [
      { key: 'A', text: '🫂 A long cuddle' },
      { key: 'B', text: '🍲 My favourite homemade food' },
      { key: 'C', text: '💌 A sweet message from you' },
      { key: 'D', text: '😴 A peaceful nap' },
    ],
  },
  {
    level: 19, stage: 2, stageName: 'Cozy',
    text: 'What is my favourite bedtime habit?',
    options: [
      { key: 'A', text: '💬 Talking about the day' },
      { key: 'B', text: '📱 Scrolling before sleeping' },
      { key: 'C', text: '🎧 Listening to music' },
      { key: 'D', text: '🌙 Saying goodnight and sleeping' },
    ],
  },
  {
    level: 20, stage: 2, stageName: 'Cozy',
    text: 'When I am upset, what do I usually do first?',
    options: [
      { key: 'A', text: '🤐 Become quiet' },
      { key: 'B', text: '😢 Get emotional' },
      { key: 'C', text: '😤 Become irritated' },
      { key: 'D', text: '💬 Talk about what happened' },
    ],
  },
  {
    level: 21, stage: 2, stageName: 'Cozy',
    text: 'What kind of surprise would make me happiest at home?',
    options: [
      { key: 'A', text: '🍕 My favourite food' },
      { key: 'B', text: '🌹 Flowers and chocolates' },
      { key: 'C', text: '🎁 A thoughtful little gift' },
      { key: 'D', text: '🥰 You planning a cosy date' },
    ],
  },
  {
    level: 22, stage: 2, stageName: 'Cozy',
    text: 'What is my favourite way to spend time with you?',
    options: [
      { key: 'A', text: '🎬 Watching movies together' },
      { key: 'B', text: '🍳 Cooking together' },
      { key: 'C', text: '💬 Talking for hours' },
      { key: 'D', text: '🫂 Cuddling and relaxing' },
    ],
  },
  {
    level: 23, stage: 2, stageName: 'Cozy',
    text: 'What do I usually need when I have a bad day?',
    options: [
      { key: 'A', text: '❤️ Reassuring words' },
      { key: 'B', text: '🤝 Your support and help' },
      { key: 'C', text: '🫂 A little affection' },
      { key: 'D', text: '🌿 Time to myself' },
    ],
  },
  {
    level: 24, stage: 2, stageName: 'Cozy',
    text: 'What would make a rainy evening perfect for me?',
    options: [
      { key: 'A', text: '☕ Chai and pakoras' },
      { key: 'B', text: '🎬 A movie and a blanket' },
      { key: 'C', text: '🌧️ A romantic walk in the rain' },
      { key: 'D', text: '💬 A long conversation with you' },
    ],
  },

  // --- STAGE 3: CLOSER (Levels 25 - 36) ---
  {
    level: 25, stage: 3, stageName: 'Closer',
    text: 'What was my first impression of you?',
    options: [
      { key: 'A', text: '😍 You looked really cute' },
      { key: 'B', text: '😊 You seemed very sweet' },
      { key: 'C', text: '🤭 You seemed interesting' },
      { key: 'D', text: '🙈 I felt shy around you' },
    ],
  },
  {
    level: 26, stage: 3, stageName: 'Closer',
    text: 'What makes me blush the most?',
    options: [
      { key: 'A', text: '😘 A sweet kiss' },
      { key: 'B', text: '👀 Long eye contact' },
      { key: 'C', text: '💗 Romantic compliments' },
      { key: 'D', text: '🫂 Unexpected hugs' },
    ],
  },
  {
    level: 27, stage: 3, stageName: 'Closer',
    text: 'What is my favourite way to receive love?',
    options: [
      { key: 'A', text: '💌 Sweet words and compliments' },
      { key: 'B', text: '⏳ Quality time together' },
      { key: 'C', text: '🎁 Thoughtful gifts' },
      { key: 'D', text: '🫂 Hugs and affection' },
    ],
  },
  {
    level: 28, stage: 3, stageName: 'Closer',
    text: 'What do I find most attractive in you?',
    options: [
      { key: 'A', text: '😊 Your smile' },
      { key: 'B', text: '❤️ Your caring nature' },
      { key: 'C', text: '😂 Your sense of humour' },
      { key: 'D', text: '👀 Your eyes' },
    ],
  },
  {
    level: 29, stage: 3, stageName: 'Closer',
    text: 'What romantic gesture would make me happiest?',
    options: [
      { key: 'A', text: '🌹 Receiving flowers' },
      { key: 'B', text: '💌 Getting a handwritten love letter' },
      { key: 'C', text: '🍽️ A surprise dinner date' },
      { key: 'D', text: '🎶 A song dedicated to me' },
    ],
  },
  {
    level: 30, stage: 3, stageName: 'Closer',
    text: 'What is my favourite way to show you love?',
    options: [
      { key: 'A', text: '🥰 Giving you compliments' },
      { key: 'B', text: '🍳 Doing little things for you' },
      { key: 'C', text: '💬 Checking on you throughout the day' },
      { key: 'D', text: '🎁 Surprising you with gifts' },
    ],
  },
  {
    level: 31, stage: 3, stageName: 'Closer',
    text: 'What kind of date feels most romantic to me?',
    options: [
      { key: 'A', text: '🕯️ Candlelight dinner' },
      { key: 'B', text: '🌌 A quiet night under the stars' },
      { key: 'C', text: '🌊 A peaceful beach date' },
      { key: 'D', text: '🌸 A cute café date' },
    ],
  },
  {
    level: 32, stage: 3, stageName: 'Closer',
    text: 'What do I love hearing from you the most?',
    options: [
      { key: 'A', text: '❤️ "I love you."' },
      { key: 'B', text: '🥹 "I am proud of you."' },
      { key: 'C', text: '😘 "I miss you."' },
      { key: 'D', text: '💗 "You are special to me."' },
    ],
  },
  {
    level: 33, stage: 3, stageName: 'Closer',
    text: 'What makes me feel most special in our relationship?',
    options: [
      { key: 'A', text: '🥰 When you remember small details about me' },
      { key: 'B', text: '💌 When you send unexpected sweet messages' },
      { key: 'C', text: '🫂 When you make time for me' },
      { key: 'D', text: '🌷 When you surprise me' },
    ],
  },
  {
    level: 34, stage: 3, stageName: 'Closer',
    text: 'What romantic memory of ours do I love the most?',
    options: [
      { key: 'A', text: '💞 Our first meeting' },
      { key: 'B', text: '💬 Our first long conversation' },
      { key: 'C', text: '🌹 Our first romantic date' },
      { key: 'D', text: '🥹 The first time we expressed our feelings' },
    ],
  },
  {
    level: 35, stage: 3, stageName: 'Closer',
    text: 'What would I choose for a perfect romantic evening?',
    options: [
      { key: 'A', text: '🌃 A peaceful night drive' },
      { key: 'B', text: '🍽️ A dinner date' },
      { key: 'C', text: '🎬 A movie night with cuddles' },
      { key: 'D', text: '🌙 Talking under the stars' },
    ],
  },
  {
    level: 36, stage: 3, stageName: 'Closer',
    text: 'What makes me feel butterflies in my stomach?',
    options: [
      { key: 'A', text: '🙈 When you look at me lovingly' },
      { key: 'B', text: '💌 When you send unexpected romantic messages' },
      { key: 'C', text: '🥰 When you hold my hand' },
      { key: 'D', text: '😘 When you give me a sweet kiss' },
    ],
  },

  // --- STAGE 4: DEEP (Levels 37 - 48) ---
  {
    level: 37, stage: 4, stageName: 'Deep',
    text: 'What is my biggest emotional need in a relationship?',
    options: [
      { key: 'A', text: '❤️ Feeling loved and appreciated' },
      { key: 'B', text: '🔐 Feeling secure and trusted' },
      { key: 'C', text: '💬 Being understood' },
      { key: 'D', text: '⏳ Getting enough quality time' },
    ],
  },
  {
    level: 38, stage: 4, stageName: 'Deep',
    text: 'What hurts my feelings the most?',
    options: [
      { key: 'A', text: '💔 Being ignored' },
      { key: 'B', text: '🤥 Being lied to' },
      { key: 'C', text: '😔 Feeling unimportant' },
      { key: 'D', text: '🗣️ Being spoken to rudely' },
    ],
  },
  {
    level: 39, stage: 4, stageName: 'Deep',
    text: 'What makes me feel safest with you?',
    options: [
      { key: 'A', text: '🤝 Your honesty' },
      { key: 'B', text: '🫂 Your emotional support' },
      { key: 'C', text: '💗 Your patience and understanding' },
      { key: 'D', text: '🔐 Your loyalty' },
    ],
  },
  {
    level: 40, stage: 4, stageName: 'Deep',
    text: 'When I have a problem, what do I expect from you?',
    options: [
      { key: 'A', text: '👂 Listen without judging me' },
      { key: 'B', text: '💡 Help me find a solution' },
      { key: 'C', text: '❤️ Reassure me that I am not alone' },
      { key: 'D', text: '🫂 Just stay beside me' },
    ],
  },
  {
    level: 41, stage: 4, stageName: 'Deep',
    text: 'What am I most afraid of in a relationship?',
    options: [
      { key: 'A', text: '💔 Losing someone I love' },
      { key: 'B', text: '🤐 Not being understood' },
      { key: 'C', text: '🔐 Losing trust' },
      { key: 'D', text: '🌧️ Growing apart over time' },
    ],
  },
  {
    level: 42, stage: 4, stageName: 'Deep',
    text: 'What makes me feel truly appreciated?',
    options: [
      { key: 'A', text: '🌷 Noticing my small efforts' },
      { key: 'B', text: '💌 Saying thank you' },
      { key: 'C', text: '🥰 Recognising my achievements' },
      { key: 'D', text: '❤️ Showing love through actions' },
    ],
  },
  {
    level: 43, stage: 4, stageName: 'Deep',
    text: 'What is most important to me during an argument?',
    options: [
      { key: 'A', text: '💬 Being heard properly' },
      { key: 'B', text: '🤝 Finding a solution together' },
      { key: 'C', text: '🫂 Feeling loved even when we disagree' },
      { key: 'D', text: '🙏 Getting a sincere apology' },
    ],
  },
  {
    level: 44, stage: 4, stageName: 'Deep',
    text: 'What quality do I value most in a partner?',
    options: [
      { key: 'A', text: '❤️ Loyalty' },
      { key: 'B', text: '😊 Kindness' },
      { key: 'C', text: '🤝 Honesty' },
      { key: 'D', text: '🌱 Emotional maturity' },
    ],
  },
  {
    level: 45, stage: 4, stageName: 'Deep',
    text: 'What makes me feel understood without saying anything?',
    options: [
      { key: 'A', text: '👀 You noticing my mood' },
      { key: 'B', text: '🫂 You giving me a hug' },
      { key: 'C', text: '💗 You knowing when I need space' },
      { key: 'D', text: '🥰 You remembering what matters to me' },
    ],
  },
  {
    level: 46, stage: 4, stageName: 'Deep',
    text: 'What do I need most when I doubt myself?',
    options: [
      { key: 'A', text: '💪 Someone who believes in me' },
      { key: 'B', text: '❤️ A reminder of my strengths' },
      { key: 'C', text: '🫂 Someone who stays beside me' },
      { key: 'D', text: '🌷 Gentle words and encouragement' },
    ],
  },
  {
    level: 47, stage: 4, stageName: 'Deep',
    text: 'What does a healthy relationship mean to me?',
    options: [
      { key: 'A', text: '🔐 Trust and honesty' },
      { key: 'B', text: '🌱 Growing together' },
      { key: 'C', text: '💬 Open communication' },
      { key: 'D', text: '❤️ Love, respect and understanding' },
    ],
  },
  {
    level: 48, stage: 4, stageName: 'Deep',
    text: 'What would make me proud of our relationship?',
    options: [
      { key: 'A', text: '🥰 How much we understand each other' },
      { key: 'B', text: '🤝 How we handle difficult times together' },
      { key: 'C', text: '🌱 How we help each other grow' },
      { key: 'D', text: '❤️ How we never stop choosing each other' },
    ],
  },

  // --- STAGE 5: HEART-TO-HEART (Levels 49 - 60) ---
  {
    level: 49, stage: 5, stageName: 'Heart-to-heart',
    text: 'What is my biggest dream for our future?',
    options: [
      { key: 'A', text: '🏡 Building a happy home together' },
      { key: 'B', text: '✈️ Travelling the world together' },
      { key: 'C', text: '💼 Building successful careers together' },
      { key: 'D', text: '❤️ Having a peaceful and loving life' },
    ],
  },
  {
    level: 50, stage: 5, stageName: 'Heart-to-heart',
    text: 'Where would I love to travel with you?',
    options: [
      { key: 'A', text: '🏔️ Beautiful mountains' },
      { key: 'B', text: '🏝️ A peaceful beach' },
      { key: 'C', text: '🌆 A beautiful foreign city' },
      { key: 'D', text: '🌿 A quiet place close to nature' },
    ],
  },
  {
    level: 51, stage: 5, stageName: 'Heart-to-heart',
    text: 'What kind of life do I imagine with you?',
    options: [
      { key: 'A', text: '🏡 A cosy home and simple happiness' },
      { key: 'B', text: '🌍 A life full of adventures' },
      { key: 'C', text: '💼 A life full of growth and success' },
      { key: 'D', text: '💗 A balance of everything' },
    ],
  },
  {
    level: 52, stage: 5, stageName: 'Heart-to-heart',
    text: 'What would I love us to do every year?',
    options: [
      { key: 'A', text: '✈️ Take a trip together' },
      { key: 'B', text: '📸 Create a photo album of our memories' },
      { key: 'C', text: '💌 Write letters to each other' },
      { key: 'D', text: '🎉 Celebrate our special moments' },
    ],
  },
  {
    level: 53, stage: 5, stageName: 'Heart-to-heart',
    text: 'What matters most to me in a lifelong partner?',
    options: [
      { key: 'A', text: '❤️ Someone who never stops loving me' },
      { key: 'B', text: '🤝 Someone who supports my dreams' },
      { key: 'C', text: '🌱 Someone who grows with me' },
      { key: 'D', text: '🫂 Someone who makes me feel at home' },
    ],
  },
  {
    level: 54, stage: 5, stageName: 'Heart-to-heart',
    text: 'What would I love to do when we grow old?',
    options: [
      { key: 'A', text: '👵👴 Sit together and share old stories' },
      { key: 'B', text: '🌍 Travel to places we always dreamed of' },
      { key: 'C', text: '🌅 Enjoy peaceful mornings together' },
      { key: 'D', text: '😂 Laugh about our silly memories' },
    ],
  },
  {
    level: 55, stage: 5, stageName: 'Heart-to-heart',
    text: 'What is my biggest hope for our relationship?',
    options: [
      { key: 'A', text: '💗 Never losing our friendship' },
      { key: 'B', text: '🔐 Always keeping our trust strong' },
      { key: 'C', text: '🌱 Growing better together' },
      { key: 'D', text: '🥰 Keeping the romance alive' },
    ],
  },
  {
    level: 56, stage: 5, stageName: 'Heart-to-heart',
    text: 'What would make our future home special to me?',
    options: [
      { key: 'A', text: '🪴 A peaceful and beautiful space' },
      { key: 'B', text: '🍳 A kitchen full of happy food memories' },
      { key: 'C', text: '📸 Photos of our favourite moments' },
      { key: 'D', text: '🏡 A place filled with love and laughter' },
    ],
  },
  {
    level: 57, stage: 5, stageName: 'Heart-to-heart',
    text: 'What would I want us to achieve together?',
    options: [
      { key: 'A', text: '💰 Financial stability' },
      { key: 'B', text: '✈️ Travelling to our dream destinations' },
      { key: 'C', text: '🏡 Building our dream home' },
      { key: 'D', text: '🌱 Supporting each other\'s personal dreams' },
    ],
  },
  {
    level: 58, stage: 5, stageName: 'Heart-to-heart',
    text: 'What does true love mean to me?',
    options: [
      { key: 'A', text: '❤️ Choosing each other every day' },
      { key: 'B', text: '🤝 Staying together through difficult times' },
      { key: 'C', text: '🫶 Understanding and accepting each other' },
      { key: 'D', text: '🌷 Helping each other become better people' },
    ],
  },
  {
    level: 59, stage: 5, stageName: 'Heart-to-heart',
    text: 'What promise would mean the most to me?',
    options: [
      { key: 'A', text: '💗 "I will always make time for you."' },
      { key: 'B', text: '🤝 "I will support your dreams."' },
      { key: 'C', text: '🔐 "I will always be honest with you."' },
      { key: 'D', text: '🥹 "I will keep choosing you, every day."' },
    ],
  },
  {
    level: 60, stage: 5, stageName: 'Heart-to-heart',
    text: 'If I could describe my dream love story, what would it be?',
    options: [
      { key: 'A', text: '📖 A simple love story that lasts forever' },
      { key: 'B', text: '✨ A beautiful adventure with my favourite person' },
      { key: 'C', text: '🏡 A peaceful life filled with little happy moments' },
      { key: 'D', text: '❤️ A love that grows stronger with every passing year' },
    ],
  },
];
