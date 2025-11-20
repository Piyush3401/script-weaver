import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Comprehensive word-level dictionary (checked first)
const wordDictionary: { [key: string]: string } = {
  // Common greetings
  'hello': 'हैलो', 'hi': 'हाय', 'hey': 'हे',
  'namaste': 'नमस्ते', 'namaskar': 'नमस्कार',
  'welcome': 'स्वागत', 'swagat': 'स्वागत',
  
  // Pronouns and common words
  'i': 'मैं', 'me': 'मुझे', 'my': 'मेरा', 'mine': 'मेरा',
  'you': 'तुम', 'your': 'तुम्हारा', 'yours': 'तुम्हारा',
  'he': 'वह', 'she': 'वह', 'it': 'यह',
  'we': 'हम', 'they': 'वे',
  'this': 'यह', 'that': 'वह',
  'is': 'है', 'am': 'हूँ', 'are': 'हो', 'was': 'था', 'were': 'थे',
  
  // Question words
  'what': 'क्या', 'kya': 'क्या',
  'where': 'कहाँ', 'kahan': 'कहाँ', 'kaha': 'कहाँ',
  'when': 'कब', 'kab': 'कब',
  'why': 'क्यों', 'kyon': 'क्यों', 'kyu': 'क्यों', 'kyun': 'क्यों',
  'how': 'कैसे', 'kaise': 'कैसे', 'kese': 'कैसे',
  'who': 'कौन', 'kaun': 'कौन', 'kon': 'कौन',
  
  // Common verbs
  'do': 'करो', 'does': 'करता', 'did': 'किया',
  'go': 'जाओ', 'come': 'आओ', 'aao': 'आओ',
  'eat': 'खाओ', 'drink': 'पियो',
  
  // Common nouns
  'name': 'नाम', 'naam': 'नाम',
  'friend': 'दोस्त', 'dost': 'दोस्त',
  'home': 'घर', 'ghar': 'घर',
  'water': 'पानी', 'paani': 'पानी', 'pani': 'पानी',
  'food': 'खाना', 'khana': 'खाना',
  'time': 'समय', 'samay': 'समय',
  'day': 'दिन', 'din': 'दिन',
  'night': 'रात', 'raat': 'रात', 'rat': 'रात',
  'morning': 'सुबह', 'subah': 'सुबह',
  'evening': 'शाम', 'shaam': 'शाम', 'sham': 'शाम',
  'month': 'महीना', 'mahina': 'महीना',
  'year': 'साल', 'saal': 'साल', 'sal': 'साल',
  
  // Family
  'mother': 'माँ', 'maa': 'माँ',
  'father': 'पिता', 'papa': 'पापा', 'pita': 'पिता',
  'brother': 'भाई', 'bhai': 'भाई',
  'sister': 'बहन', 'behen': 'बहन', 'bahen': 'बहन',
  'son': 'बेटा', 'beta': 'बेटा',
  'daughter': 'बेटी', 'beti': 'बेटी',
  
  // Adjectives
  'good': 'अच्छा', 'acha': 'अच्छा', 'achha': 'अच्छा', 'accha': 'अच्छा',
  'bad': 'बुरा', 'bura': 'बुरा',
  'big': 'बड़ा', 'bada': 'बड़ा', 'bara': 'बड़ा',
  'small': 'छोटा', 'chota': 'छोटा', 'chhota': 'छोटा',
  'new': 'नया', 'naya': 'नया',
  'old': 'पुराना', 'purana': 'पुराना',
  
  // Common expressions
  'yes': 'हाँ', 'haan': 'हाँ', 'han': 'हाँ',
  'no': 'नहीं', 'nahi': 'नहीं', 'nahin': 'नहीं', 'nai': 'नहीं',
  'ok': 'ठीक', 'okay': 'ठीक', 'theek': 'ठीक', 'thik': 'ठीक',
  'please': 'कृपया', 'kripya': 'कृपया',
  'thankyou': 'धन्यवाद', 'thanks': 'धन्यवाद', 'dhanyavad': 'धन्यवाद', 'dhanyavaad': 'धन्यवाद',
  'sorry': 'माफ़ करो', 'maaf': 'माफ़',
  'love': 'प्यार', 'pyar': 'प्यार', 'pyaar': 'प्यार',
  
  // Quantities
  'very': 'बहुत', 'bahut': 'बहुत', 'bohot': 'बहुत',
  'much': 'बहुत', 'many': 'बहुत',
  'little': 'थोड़ा', 'thoda': 'थोड़ा', 'thora': 'थोड़ा',
  'some': 'कुछ', 'kuch': 'कुछ',
  'all': 'सब', 'sab': 'सब',
  
  // Time
  'today': 'आज', 'aaj': 'आज',
  'tomorrow': 'कल', 'kal': 'कल',
  'yesterday': 'कल', 
  'now': 'अभी', 'abhi': 'अभी',
  
  // Countries
  'india': 'भारत', 'bharat': 'भारत',
  'pakistan': 'पाकिस्तान',
  'america': 'अमेरिका',
  
  // Pronouns (Hinglish)
  'mera': 'मेरा', 'meri': 'मेरी', 'mere': 'मेरे',
  'tera': 'तेरा', 'teri': 'तेरी', 'tere': 'तेरे',
  'uska': 'उसका', 'uski': 'उसकी', 'uske': 'उसके',
  'humara': 'हमारा', 'humari': 'हमारी',
  'tumhara': 'तुम्हारा', 'tumhari': 'तुम्हारी',
  'aap': 'आप', 'aapka': 'आपका', 'aapki': 'आपकी',
  
  // Verbs (Hinglish)
  'hai': 'है', 'hain': 'हैं', 'hu': 'हूँ', 'hun': 'हूँ',
  'ho': 'हो', 'tha': 'था', 'thi': 'थी', 'the': 'थे',
  'kar': 'कर', 'karo': 'करो', 'karna': 'करना',
  'ja': 'जा', 'jao': 'जाओ', 'jana': 'जाना',
};

// Vowel characters and their Devanagari equivalents
const vowelMap: { [key: string]: string } = {
  'a': 'अ', 'aa': 'आ', 'i': 'इ', 'ii': 'ई', 'ee': 'ई',
  'u': 'उ', 'uu': 'ऊ', 'oo': 'ऊ',
  'e': 'ए', 'ai': 'ऐ', 'ay': 'ऐ',
  'o': 'ओ', 'au': 'औ', 'ow': 'औ',
  'ri': 'ऋ', 'ru': 'रु',
};

// Vowel matras (when following consonants)
const matraMap: { [key: string]: string } = {
  'aa': 'ा', 'i': 'ि', 'ii': 'ी', 'ee': 'ी',
  'u': 'ु', 'uu': 'ू', 'oo': 'ू',
  'e': 'े', 'ai': 'ै', 'ay': 'ै',
  'o': 'ो', 'au': 'ौ', 'ow': 'ौ',
  'ri': 'ृ',
};

// Consonant mappings
const consonantMap: { [key: string]: string } = {
  // Velars
  'k': 'क', 'kh': 'ख', 'g': 'ग', 'gh': 'घ', 'ng': 'ङ',
  // Palatals
  'ch': 'च', 'chh': 'छ', 'j': 'ज', 'jh': 'झ', 'ny': 'ञ',
  // Retroflexes
  'tt': 'ट', 'tth': 'ठ', 'dd': 'ड', 'ddh': 'ढ', 'nn': 'ण',
  // Dentals
  't': 'त', 'th': 'थ', 'd': 'द', 'dh': 'ध', 'n': 'न',
  // Labials
  'p': 'प', 'ph': 'फ', 'f': 'फ', 'b': 'ब', 'bh': 'भ', 'm': 'म',
  // Semi-vowels
  'y': 'य', 'r': 'र', 'l': 'ल', 'v': 'व', 'w': 'व',
  // Sibilants
  'sh': 'श', 'shh': 'ष', 's': 'स', 'z': 'ज़',
  // Aspirate
  'h': 'ह',
};

function transliterateWord(word: string): string {
  const lowerWord = word.toLowerCase();
  
  // First check if entire word is in dictionary
  if (wordDictionary[lowerWord]) {
    return wordDictionary[lowerWord];
  }
  
  let result = '';
  let i = 0;
  
  while (i < lowerWord.length) {
    let matched = false;
    
    // Try to match consonant clusters (longer patterns first)
    for (let len = 4; len >= 2; len--) {
      const substr = lowerWord.substring(i, i + len);
      
      // Check for consonant + vowel combinations
      if (len >= 2) {
        for (let cLen = len - 1; cLen >= 1; cLen--) {
          const consonantPart = substr.substring(0, cLen);
          const vowelPart = substr.substring(cLen);
          
          if (consonantMap[consonantPart] && (matraMap[vowelPart] || vowelPart === 'a')) {
            result += consonantMap[consonantPart];
            if (vowelPart !== 'a' && matraMap[vowelPart]) {
              result += matraMap[vowelPart];
            }
            i += len;
            matched = true;
            break;
          }
        }
      }
      
      if (matched) break;
      
      // Check for pure consonant
      if (consonantMap[substr]) {
        result += consonantMap[substr] + '्'; // Add halant
        i += len;
        matched = true;
        break;
      }
      
      // Check for pure vowel
      if (vowelMap[substr]) {
        result += vowelMap[substr];
        i += len;
        matched = true;
        break;
      }
    }
    
    // Single character fallback
    if (!matched) {
      const char = lowerWord[i];
      
      if (consonantMap[char]) {
        // Check if next character is a vowel
        const nextChar = lowerWord[i + 1];
        if (nextChar && (matraMap[nextChar] || nextChar === 'a')) {
          result += consonantMap[char];
          if (nextChar !== 'a' && matraMap[nextChar]) {
            result += matraMap[nextChar];
          }
          i += 2;
        } else {
          result += consonantMap[char] + '्';
          i++;
        }
      } else if (vowelMap[char]) {
        result += vowelMap[char];
        i++;
      } else {
        // Keep unknown characters as-is
        result += char;
        i++;
      }
    }
  }
  
  return result;
}

function transliterateText(text: string): string {
  if (!text || text.trim().length === 0) {
    return '';
  }
  
  // Split into words while preserving punctuation and spaces
  const tokens = text.split(/(\s+|[.,!?;:'"(){}[\]])/);
  
  return tokens.map(token => {
    // Preserve whitespace and punctuation
    if (/^\s+$/.test(token) || /^[.,!?;:'"(){}[\]]$/.test(token)) {
      return token;
    }
    
    return transliterateWord(token);
  }).join('');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    
    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Transliterating text:', text);
    
    const transliteratedText = transliterateText(text);
    
    console.log('Result:', transliteratedText);

    return new Response(
      JSON.stringify({ transliteratedText }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in transliterate function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
