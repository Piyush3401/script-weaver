import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Comprehensive transliteration mapping for English/Hinglish to Devanagari
const transliterationMap: { [key: string]: string } = {
  // Common Hinglish words and phrases (checked first for better context)
  'namaste': 'नमस्ते', 'namaskar': 'नमस्कार', 'namaskara': 'नमस्कार',
  'dhanyavaad': 'धन्यवाद', 'dhanyavad': 'धन्यवाद', 'shukriya': 'शुक्रिया',
  'bharat': 'भारत', 'india': 'भारत', 'hindustan': 'हिंदुस्तान',
  'swagat': 'स्वागत', 'welcome': 'स्वागत',
  'kripya': 'कृपया', 'kripaya': 'कृपया', 'please': 'कृपया',
  'haan': 'हाँ', 'yes': 'हाँ',
  'nahi': 'नहीं', 'nahin': 'नहीं', 'nai': 'नहीं', 'no': 'नहीं',
  'theek': 'ठीक', 'thik': 'ठीक', 'ok': 'ठीक', 'okay': 'ठीक',
  'aapka': 'आपका', 'aapki': 'आपकी', 'aap': 'आप', 'you': 'आप',
  'mera': 'मेरा', 'meri': 'मेरी', 'mai': 'मैं', 'main': 'मैं',
  'kya': 'क्या', 'what': 'क्या',
  'kaise': 'कैसे', 'kese': 'कैसे', 'how': 'कैसे',
  'kahan': 'कहाँ', 'kaha': 'कहाँ', 'where': 'कहाँ',
  'kab': 'कब', 'when': 'कब',
  'kyun': 'क्यों', 'kyu': 'क्यों', 'kyon': 'क्यों', 'why': 'क्यों',
  'kaun': 'कौन', 'kon': 'कौन', 'who': 'कौन',
  'acha': 'अच्छा', 'achha': 'अच्छा', 'accha': 'अच्छा', 'good': 'अच्छा',
  'bahut': 'बहुत', 'bohot': 'बहुत', 'bahot': 'बहुत', 'very': 'बहुत', 'much': 'बहुत',
  'thoda': 'थोड़ा', 'thora': 'थोड़ा', 'little': 'थोड़ा',
  'pyaar': 'प्यार', 'pyar': 'प्यार', 'prem': 'प्रेम', 'love': 'प्यार',
  'dost': 'दोस्त', 'friend': 'दोस्त', 'mitra': 'मित्र',
  'ghar': 'घर', 'home': 'घर',
  'paani': 'पानी', 'pani': 'पानी', 'water': 'पानी',
  'khana': 'खाना', 'khaana': 'खाना', 'food': 'खाना',
  'samay': 'समय', 'samaya': 'समय', 'time': 'समय',
  'kal': 'कल', 'yesterday': 'कल', 'tomorrow': 'कल',
  'aaj': 'आज', 'today': 'आज',
  'abhi': 'अभी', 'now': 'अभी',
  'subah': 'सुबह', 'morning': 'सुबह',
  'shaam': 'शाम', 'sham': 'शाम', 'evening': 'शाम',
  'raat': 'रात', 'rat': 'रात', 'night': 'रात',
  'din': 'दिन', 'day': 'दिन',
  'mahina': 'महीना', 'mahine': 'महीने', 'month': 'महीना',
  'saal': 'साल', 'sal': 'साल', 'year': 'साल',
  'bhai': 'भाई', 'brother': 'भाई',
  'behen': 'बहन', 'bahen': 'बहन', 'sister': 'बहन',
  'maa': 'माँ', 'mother': 'माँ',
  'papa': 'पापा', 'pita': 'पिता', 'father': 'पिता',
  'beta': 'बेटा', 'son': 'बेटा',
  'beti': 'बेटी', 'daughter': 'बेटी',
  'ho': 'हो', 'are': 'हो',
  'hai': 'है', 'hain': 'हैं', 'is': 'है',
  'was': 'था', 'were': 'थे',
  
  // Vowels
  'a': 'अ', 'aa': 'आ', 'aaa': 'आ',
  'i': 'इ', 'ii': 'ई', 'ee': 'ई',
  'u': 'उ', 'uu': 'ऊ', 'oo': 'ऊ',
  'e': 'ए', 'ai': 'ऐ', 
  'o': 'ओ', 'au': 'औ', 'ow': 'औ',
  
  // Consonants with 'a'
  'ka': 'क', 'kha': 'ख', 'ga': 'ग', 'gha': 'घ', 'nga': 'ङ',
  'cha': 'च', 'chha': 'छ', 'ja': 'ज', 'jha': 'झ', 'nya': 'ञ',
  'ta': 'ट', 'tha': 'ठ', 'da': 'ड', 'dha': 'ढ', 'na': 'ण',
  'tta': 'त', 'ttha': 'थ', 'dda': 'द', 'ddha': 'ध', 'nna': 'न',
  'pa': 'प', 'pha': 'फ', 'fa': 'फ', 'ba': 'ब', 'bha': 'भ', 'ma': 'म',
  'ya': 'य', 'ra': 'र', 'la': 'ल', 'va': 'व', 'wa': 'व',
  'sha': 'श', 'shha': 'ष', 'sa': 'स', 'ha': 'ह',
  
  // Single consonants (with halant)
  'k': 'क्', 'kh': 'ख्', 'g': 'ग्', 'gh': 'घ्',
  'ch': 'च्', 'chh': 'छ्', 'j': 'ज्', 'jh': 'झ्',
  't': 'त्', 'th': 'थ्', 'd': 'द्', 'dh': 'ध्',
  'p': 'प्', 'ph': 'फ्', 'f': 'फ्', 'b': 'ब्', 'bh': 'भ्',
  'm': 'म्', 'y': 'य्', 'r': 'र्', 'l': 'ल्',
  'v': 'व्', 'w': 'व्', 'sh': 'श्', 's': 'स्', 'h': 'ह्',
  'n': 'न्',
};

function transliterateWord(word: string): string {
  const lowerWord = word.toLowerCase();
  
  // Check if entire word is in the map
  if (transliterationMap[lowerWord]) {
    return transliterationMap[lowerWord];
  }
  
  let result = '';
  let i = 0;
  
  while (i < lowerWord.length) {
    let matched = false;
    
    // Try to match longest possible sequence (5, 4, 3, 2, 1 characters)
    for (let len = 5; len >= 1; len--) {
      const substring = lowerWord.substring(i, i + len);
      
      if (transliterationMap[substring]) {
        result += transliterationMap[substring];
        i += len;
        matched = true;
        break;
      }
    }
    
    // If no match found, keep the character as is
    if (!matched) {
      result += lowerWord[i];
      i++;
    }
  }
  
  return result;
}

function transliterateText(text: string): string {
  if (!text || text.trim().length === 0) {
    return '';
  }
  
  // Split into words while preserving punctuation and spaces
  const words = text.split(/(\s+|[.,!?;:])/);
  
  return words.map(word => {
    // Preserve whitespace and punctuation
    if (/^\s+$/.test(word) || /^[.,!?;:]$/.test(word)) {
      return word;
    }
    
    return transliterateWord(word);
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
