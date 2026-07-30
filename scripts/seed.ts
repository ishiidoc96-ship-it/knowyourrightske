import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Anon Key in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Seeding Database...');
  
  const contentData = [
    {
      title: 'Know Your Rights When Stopped by Police',
      platform: 'tiktok',
      embed_url: 'https://www.tiktok.com/@example/video/123',
      topic_tag: 'Police Stops',
      description: 'A quick breakdown of what you must answer and what you can refuse when stopped by police.',
    },
    {
      title: 'Can Your Landlord Evict You Without Notice?',
      platform: 'instagram',
      embed_url: 'https://www.instagram.com/p/123/',
      topic_tag: 'Tenant Rights',
      description: 'Understanding the eviction process under Kenyan law.',
    },
    {
      title: 'Unfair Dismissal: What The Employment Act Says',
      platform: 'youtube',
      embed_url: 'https://www.youtube.com/embed/example',
      topic_tag: 'Employment Law',
      description: 'Were you fired unfairly? Heres what the Employment Act provides regarding termination.',
    },
    {
      title: 'Bail vs Bond in Kenya',
      platform: 'podcast',
      embed_url: 'https://open.spotify.com/embed/episode/example',
      topic_tag: 'Arrest Rights',
      description: 'Explaining the difference between bail and bond and your right to apply.',
    },
    {
      title: 'Buying Fake Goods: Consumer Protection',
      platform: 'tiktok',
      embed_url: 'https://www.tiktok.com/@example/video/456',
      topic_tag: 'Consumer Rights',
      description: 'Your rights when a vendor sells you counterfeit or defective goods.',
    },
    {
      title: 'Small Claims Court Simplified',
      platform: 'youtube',
      embed_url: 'https://www.youtube.com/embed/example2',
      topic_tag: 'Access to Justice',
      description: 'How to file a claim under Ksh 1,000,000 without needing a lawyer.',
    }
  ];

  const { data: contentInserts, error: contentError } = await supabase.from('content').insert(contentData).select();
  if (contentError) {
    console.error('Error seeding content:', contentError);
  } else {
    console.log('Inserted', contentInserts.length, 'content rows.');
  }

  const articlesData = [
    {
      title: 'The 24-Hour Rule: What Happens After Arrest',
      topic_tag: 'Arrest Rights',
      summary: 'You cannot be held in police custody indefinitely. The law sets strict timelines for being presented in court.',
      body: JSON.stringify({
        sections: [
          {
            heading: "What the law says",
            content: "Under Article 49(1)(f) of the Constitution of Kenya, an arrested person has the right to be brought before a court as soon as reasonably possible, but not later than twenty-four hours after being arrested."
          },
          {
            heading: "What this means for you",
            content: "If you are arrested, the police must charge you in court within 24 hours (excluding weekends and public holidays). If they fail to do so, they are holding you unlawfully, and your lawyers can demand your release or file for habeas corpus."
          }
        ]
      }),
      related_content_id: contentInserts ? contentInserts[3].id : null,
    },
    {
      title: 'Tenant Rights: The Eviction Notice Period',
      topic_tag: 'Tenant Rights',
      summary: 'Landlords cannot just wake up and lock you out. There are legal steps they must follow.',
      body: JSON.stringify({
        sections: [
          {
            heading: "What the law says",
            content: "The Rent Restriction Act and the Landlord and Tenant (Shops, Hotels and Catering Establishments) Act govern evictions. Generally, a landlord must give reasonable notice, usually one to three months depending on the tenancy agreement, before terminating a lease."
          },
          {
            heading: "What this means for you",
            content: "A landlord cannot arbitrarily change padlocks or confiscate your goods without a court order or following the proper distress for rent procedures. If threatened with illegal eviction, you can seek orders from the Rent Restriction Tribunal."
          }
        ]
      }),
      related_content_id: contentInserts ? contentInserts[1].id : null,
    },
    {
      title: 'Defective Products and Consumer Rights',
      topic_tag: 'Consumer Rights',
      summary: 'Bought something that doesn\'t work? You have a right to a remedy.',
      body: JSON.stringify({
        sections: [
          {
            heading: "What the law says",
            content: "Article 46 of the Constitution gives consumers the right to goods and services of reasonable quality. The Consumer Protection Act, 2012 further protects against unfair practices, providing remedies for defective products."
          },
          {
            heading: "What this means for you",
            content: "If you purchase an item that turns out to be defective, you have a right to demand a repair, replacement, or refund. Do not accept 'goods once sold are not returnable' signs if the goods are genuinely defective."
          }
        ]
      }),
      related_content_id: contentInserts ? contentInserts[4].id : null,
    }
  ];

  const { data: articleInserts, error: articleError } = await supabase.from('articles').insert(articlesData).select();
  if (articleError) {
    console.error('Error seeding articles:', articleError);
  } else {
    console.log('Inserted', articleInserts.length, 'article rows.');
  }

  const questionsData = [
    {
      question_text: 'Can police search my car without a warrant?',
      topic_tag: 'Police Stops',
      status: 'answered',
      answer_link: 'https://example.com/answer/1',
      email: null
    },
    {
      question_text: 'My boss fired me via WhatsApp. Is this legal?',
      topic_tag: 'Employment Law',
      status: 'pending',
      answer_link: null,
      email: 'user@example.com'
    },
    {
      question_text: 'Can a landlord increase rent anytime?',
      topic_tag: 'Tenant Rights',
      status: 'answered',
      answer_link: 'https://example.com/answer/2',
      email: null
    }
  ];

  const { data: questionInserts, error: questionError } = await supabase.from('questions').insert(questionsData).select();
  if (questionError) {
    console.error('Error seeding questions:', questionError);
  } else {
    console.log('Inserted', questionInserts.length, 'question rows.');
  }
  const galleryData = [
    {
      media_type: 'video',
      platform: 'tiktok',
      title: 'TikTok Legal Tip: Police Checks',
      embed_or_image_url: 'https://www.tiktok.com/@example/video/789',
      topic_tag: 'Police Stops',
      thumbnail_url: 'https://images.unsplash.com/photo-1598502391696-293cb2bdc0e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    },
    {
      media_type: 'photo',
      platform: 'instagram',
      title: 'Infographic: Know Your Rights At Work',
      embed_or_image_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      topic_tag: 'Employment Law',
      thumbnail_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    },
    {
      media_type: 'video',
      platform: 'youtube',
      title: 'Full Guide: Small Claims Court',
      embed_or_image_url: 'https://www.youtube.com/embed/example3',
      topic_tag: 'Access to Justice',
      thumbnail_url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    },
    {
      media_type: 'photo',
      platform: 'facebook',
      title: 'Community Q&A Summary',
      embed_or_image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      topic_tag: 'General Rights',
      thumbnail_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    }
  ];

  const { data: galleryInserts, error: galleryError } = await supabase.from('gallery').insert(galleryData).select();
  if (galleryError) {
    console.error('Error seeding gallery:', galleryError);
  } else {
    console.log('Inserted', galleryInserts.length, 'gallery rows.');
  }

}

seed();
