import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const generateId = () => crypto.randomUUID();

const seed = async () => {
  console.log("Seeding started...");

  const articlesData = [
    {
      id: generateId(), title: "Your Rights When Arrested by the Police", topic_tag: "Arrest Rights", summary: "Understand what police can and cannot do during an arrest, and your right to remain silent and access legal representation.",
      body: { sections: [
        { heading: "What the law says", content: "Under Article 49 of the Constitution of Kenya, an arrested person has the right to be informed promptly, in language they understand, of the reason for the arrest, the right to remain silent, and the consequences of not remaining silent. You also have the right to communicate with an advocate, and you cannot be compelled to make any confession or admission that could be used in evidence against you." },
        { heading: "What this means for you", content: "If a police officer stops and arrests you, you do not have to answer their questions without your lawyer present. Always ask politely why you are being arrested. Do not resist arrest, but firmly state that you wish to exercise your right to remain silent until you can speak with legal counsel. The police must bring you before a court as soon as reasonably possible, but not later than 24 hours after being arrested." }
      ]}, published_at: new Date().toISOString()
    },
    {
      id: generateId(), title: "Tenant Rights: Protection Against Unlawful Eviction", topic_tag: "Tenant Rights", summary: "Can your landlord lock you out without notice? Learn about the legal procedures landlords must follow before evicting a tenant.",
      body: { sections: [
        { heading: "What the law says", content: "The Rent Restriction Act and general property laws in Kenya protect tenants from arbitrary actions by landlords. A landlord cannot simply lock your door, remove the roof, or cut off your utilities to force you out without following the proper legal process, which usually involves giving formal written notice and obtaining a court order if you refuse to leave." },
        { heading: "What this means for you", content: "If your landlord attempts to evict you without providing adequate notice (usually stated in your lease agreement, often 30 days) or resorts to crude methods like cutting your electricity, they are breaking the law. You can report them to the Rent Restriction Tribunal or seek police assistance to prevent the illegal eviction." }
      ]}, published_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: generateId(), title: "Unfair Dismissal: Your Employment Law Basics", topic_tag: "Employment Law", summary: "Know your rights when facing termination at work. Your employer must have a valid reason and follow fair procedures.",
      body: { sections: [
        { heading: "What the law says", content: "According to the Employment Act, 2007 (Section 45), no employer shall terminate the employment of an employee unfairly. The employer must prove that the reason for the termination is valid and fair and relates to the employee's conduct, capacity, or operational requirements of the business, and that it was done following a fair procedure." },
        { heading: "What this means for you", content: "You cannot be fired simply because your boss woke up on the wrong side of the bed. If you are being dismissed for misconduct or poor performance, you have a right to be heard before the final decision is made. You can bring a union representative or a colleague to this hearing. If you are fired without this process, it may constitute unfair dismissal, allowing you to sue for compensation." }
      ]}, published_at: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: generateId(), title: "Consumer Rights: Returning Defective Goods", topic_tag: "Consumer Rights", summary: "Bought something that doesn't work? Learn about your right to return defective items and get a refund or replacement.",
      body: { sections: [
        { heading: "What the law says", content: "Under Article 46 of the Constitution of Kenya, consumers have the right to goods and services of reasonable quality. Furthermore, the Consumer Protection Act provides that goods must be fit for the purpose for which they are sold. A seller cannot hide behind \"Goods once sold are not returnable\" if the goods were defective at the time of purchase." },
        { heading: "What this means for you", content: "If you buy a phone and it won't turn on, or a piece of furniture that breaks immediately under normal use, you have the right to take it back. Do not let shopkeepers intimidate you with 'no return' policies—those signs are legally void if the product itself is flawed." }
      ]}, published_at: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
      id: generateId(), title: "Police Stops: Searches and Questioning", topic_tag: "Police Stops", summary: "When can the police search you or your vehicle? Know your boundaries during routine traffic stops and street encounters.",
      body: { sections: [
        { heading: "What the law says", content: "Article 31 of the Constitution protects every person's right to privacy, which includes the right not to have their person, home or property searched unreasonably. However, the police have powers to search under specific statutes if they have reasonable suspicion that a crime has been committed or you are carrying illegal items." },
        { heading: "What this means for you", content: "If police stop you on the street or at a checkpoint, they can ask for identification. For a physical search of your pockets, bag, or car trunk, they generally need reasonable grounds to suspect you have something unlawful. Always remain calm and cooperative, but you can politely ask, \"Officer, what are you looking for?\" Women have the right to insist that they be searched only by female officers." }
      ]}, published_at: new Date(Date.now() - 4 * 86400000).toISOString()
    },
    {
      id: generateId(), title: "Access to Justice: Small Claims Court", topic_tag: "Access to Justice", summary: "Someone owes you money but the amount is too small for expensive lawyers? Use the Small Claims Court.",
      body: { sections: [
        { heading: "What the law says", content: "The Small Claims Court Act established courts designed to resolve civil disputes involving claims of up to Ksh 1,000,000 quickly and affordably. The process is simplified so that ordinary citizens can represent themselves without needing to hire an advocate." },
        { heading: "What this means for you", content: "If a friend borrows Ksh 50,000 and refuses to pay, or a mechanic ruins your car and the damage is Ksh 150,000, you don't need a high-priced lawyer. You can file a claim at the Small Claims Court. The fees are low, the procedure is informal, and matters are usually resolved within 60 days." }
      ]}, published_at: new Date(Date.now() - 5 * 86400000).toISOString()
    },
    {
      id: generateId(), title: "Rights in Detention: Bail and Bond", topic_tag: "Rights in Detention", summary: "Understanding the difference between cash bail and bond, and your constitutional right to be released pending trial.",
      body: { sections: [
        { heading: "What the law says", content: "Under Article 49(1)(h) of the Constitution, an arrested person has the right to be released on bond or bail, on reasonable conditions, pending a charge or trial, unless there are compelling reasons not to be released." },
        { heading: "What this means for you", content: "Being arrested does not mean you are automatically locked up until the case ends. You are presumed innocent. Cash bail is money you pay to secure your release, which is refunded if you attend all court dates. A bond is a pledge (often backed by property or a surety) that you will appear. The police or court must grant this unless you are a flight risk or a danger to others. You have a right to demand reasonable bail terms." }
      ]}, published_at: new Date(Date.now() - 6 * 86400000).toISOString()
    },
    {
      id: generateId(), title: "Limits on Rights: When Can the State Interfere?", topic_tag: "Limits on Rights", summary: "Constitutional rights are not absolute. Learn the circumstances under which the government can legally limit your freedoms.",
      body: { sections: [
        { heading: "What the law says", content: "Article 24 of the Constitution states that a right or fundamental freedom shall not be limited except by law, and only to the extent that the limitation is reasonable and justifiable in an open and democratic society based on human dignity, equality and freedom." },
        { heading: "What this means for you", content: "While you have the right to freedom of expression, you cannot use it to spread hate speech or incite violence. While you have freedom of assembly, the police can require prior notification for public protests to ensure public order and safety. Your rights stop where another person's rights begin, or where public safety and national security are genuinely at risk." }
      ]}, published_at: new Date(Date.now() - 7 * 86400000).toISOString()
    },
    {
      id: generateId(), title: "Maternity and Paternity Leave", topic_tag: "Employment Law", summary: "Understand your rights as a new parent in the workplace.",
      body: { sections: [
        { heading: "What the law says", content: "The Employment Act, 2007 (Section 29) guarantees female employees a minimum of three months (90 days) maternity leave with full pay, and male employees are entitled to two weeks (14 days) paternity leave with full pay." },
        { heading: "What this means for you", content: "You cannot be fired or demoted for getting pregnant. When you return from maternity leave, you have the right to resume your previous position or a reasonably suitable alternative position on terms that are no less favorable. Furthermore, taking maternity or paternity leave does not forfeit your annual leave days." }
      ]}, published_at: new Date(Date.now() - 8 * 86400000).toISOString()
    },
    {
      id: generateId(), title: "Data Protection: Who Has Your Info?", topic_tag: "Consumer Rights", summary: "How the law protects your personal information from being misused by companies and institutions.",
      body: { sections: [
        { heading: "What the law says", content: "Article 31 of the Constitution guarantees the right to privacy, which is operationalized by the Data Protection Act. It dictates that personal data must be collected for explicit, specified, and legitimate purposes and not further processed in a manner incompatible with those purposes." },
        { heading: "What this means for you", content: "When a supermarket asks for your phone number, or an app wants access to your contacts, they must explain why they need it. You have the right to know what data a company holds about you, the right to ask them to correct inaccurate data, and the right to have your data deleted if they no longer have a legitimate reason to keep it." }
      ]}, published_at: new Date(Date.now() - 9 * 86400000).toISOString()
    }
  ];

  const contentData = [
    { id: generateId(), title: "Can police search your phone?", type: "video", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", embed_url: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Quick breakdown of Article 31 and digital privacy during police stops.", topic_tag: "Police Stops", platform: "youtube", published_at: new Date().toISOString() },
    { id: generateId(), title: "My landlord padlocked my house!", type: "video", url: "https://www.tiktok.com/@knowyourrightske/video/123456789", embed_url: "https://www.tiktok.com/embed/v2/123456789", description: "What to do when your landlord tries to illegally evict you without notice.", topic_tag: "Tenant Rights", platform: "tiktok", published_at: new Date(Date.now() - 86400000).toISOString() },
    { id: generateId(), title: "Unfair Dismissal deep dive (Podcast)", type: "podcast", url: "https://open.spotify.com/episode/123", embed_url: "https://open.spotify.com/embed/episode/123", description: "We discuss a real case of a worker fired for taking sick leave and how the Employment Act applies.", topic_tag: "Employment Law", platform: "podcast", published_at: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: generateId(), title: "Cash Bail vs. Bond: What's the difference?", type: "video", url: "https://www.instagram.com/p/12345/", embed_url: "https://www.instagram.com/p/12345/embed", description: "Explaining the different ways you can be released pending a trial.", topic_tag: "Rights in Detention", platform: "instagram", published_at: new Date(Date.now() - 3 * 86400000).toISOString() },
    { id: generateId(), title: "Filing a case at the Small Claims Court", type: "video", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", embed_url: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Step-by-step guide on how to sue for debts under 1 million shillings without a lawyer.", topic_tag: "Access to Justice", platform: "youtube", published_at: new Date(Date.now() - 4 * 86400000).toISOString() },
    { id: generateId(), title: "Your rights when arrested - The First 24 Hours", type: "podcast", url: "https://open.spotify.com/episode/456", embed_url: "https://open.spotify.com/embed/episode/456", description: "A detailed breakdown of Article 49 of the Constitution.", topic_tag: "Arrest Rights", platform: "podcast", published_at: new Date(Date.now() - 5 * 86400000).toISOString() }
  ];

  const questionsData = [
    { id: generateId(), question_text: "My boss says I must work on public holidays with no extra pay. Is this legal?", topic_tag: "Employment Law", email: "jane.doe@example.com", status: "answered", answer_link: "https://open.spotify.com/episode/123", submitted_at: new Date(Date.now() - 10 * 86400000).toISOString() },
    { id: generateId(), question_text: "I bought a TV from a shop downtown and it stopped working after 2 days. They say 'Goods once sold are not returnable'. Can I get my money back?", topic_tag: "Consumer Rights", email: "john.smith@example.com", status: "answered", answer_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", submitted_at: new Date(Date.now() - 5 * 86400000).toISOString() },
    { id: generateId(), question_text: "Can a traffic police officer enter my car and take the keys if I commit a minor traffic offense?", topic_tag: "Police Stops", email: "driver.ken@example.com", status: "pending", answer_link: null, submitted_at: new Date().toISOString() }
  ];

  try {
    const { error: aErr } = await supabase.from('articles').insert(articlesData);
    if (aErr) throw aErr;
    
    const { error: cErr } = await supabase.from('content').insert(contentData);
    if (cErr) throw cErr;
    
    const { error: qErr } = await supabase.from('questions').insert(questionsData);
    if (qErr) throw qErr;

    console.log("Seeding successful!");
  } catch (error) {
    console.error("Error seeding:", error);
  }
};

seed();
