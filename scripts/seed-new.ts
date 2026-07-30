import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);
const id = () => crypto.randomUUID();
const now = new Date();
const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000).toISOString();

const articles = [
  {
    id: id(), title: "Divorce and Matrimonial Property: Who Gets What?",
    topic_tag: "Family Law",
    summary: "When a marriage ends, how is property divided? Learn about your rights under the Matrimonial Property Act and what factors the court considers.",
    body: { sections: [
      { heading: "What the law says", content: "The Matrimonial Property Act, 2013 governs the division of property when a marriage is dissolved. Article 45(3) of the Constitution provides that parties to a marriage are entitled to equal rights at the time of marriage, during the marriage, and at the dissolution of the marriage. The Matrimonial Property Act recognizes both monetary and non-monetary contributions — including domestic work, childcare, and management of the household — as contributions to matrimonial property." },
      { heading: "What this means for you", content: "If you are divorcing, any property acquired during the marriage is generally considered matrimonial property and is subject to division. This includes the family home, vehicles, investments, and even businesses built during the marriage. Even if you did not contribute financially (e.g., you were a stay-at-home parent), your non-monetary contribution counts. The court will consider each spouse's contribution, the length of the marriage, and the welfare of any children. Note: Property acquired before marriage or by inheritance is generally not matrimonial property unless both spouses contributed to it." }
    ]}, published_at: daysAgo(1)
  },
  {
    id: id(), title: "Inheritance Rights: What Happens When Someone Dies Without a Will?",
    topic_tag: "Succession Law",
    summary: "Dying without a will (intestate) means the Law of Succession Act determines who inherits your estate. Understand how it works and why you need a will.",
    body: { sections: [
      { heading: "What the law says", content: "The Law of Succession Act, Cap 160 governs inheritance in Kenya. If a person dies without a valid will (intestate), the estate is distributed according to a set formula under Section 35-42 of the Act. The surviving spouse and children are the primary beneficiaries. If there is a surviving spouse but no children, the spouse gets the entire estate. If there is a spouse and children, the spouse gets a life interest in the matrimonial home and a share of the remaining estate, while the children share the rest." },
      { heading: "What this means for you", content: "If your parent or relative dies without a will, you cannot simply take their property — you must go through the succession process at the High Court or the Estate Administration court. This involves applying for a Grant of Letters of Administration, which gives you legal authority to manage and distribute the estate. The process takes 3-6 months if uncontested. To avoid this complexity, every adult Kenyan should have a valid will. You do not need a lawyer to write one, though it is advisable, especially if you have complex assets or blended family arrangements." }
    ]}, published_at: daysAgo(2)
  },
  {
    id: id(), title: "Protection Against Domestic Violence: Your Legal Shield",
    topic_tag: "Family Law",
    summary: "The Protection Against Domestic Violence Act provides a legal remedy for victims of domestic violence, including physical, emotional, and economic abuse.",
    body: { sections: [
      { heading: "What the law says", content: "The Protection Against Domestic Violence Act, 2015 defines domestic violence broadly to include physical abuse, sexual abuse, emotional/psychological abuse, economic abuse, and intimidation/harassment. The Act applies to persons in a domestic relationship, which includes spouses, former spouses, parents, children, siblings, and even persons who share a household. A victim can apply for a Protection Order from the court, which can prohibit the abuser from contacting, approaching, or harming the victim." },
      { heading: "What this means for you", content: "If you are experiencing any form of domestic violence — including being denied food or money by your spouse, being constantly insulted or humiliated, being threatened, or being physically harmed — you can go to the nearest Magistrate's Court and apply for a Protection Order. You do not need a lawyer to apply. The court must hear your application within 14 days. The Protection Order can include provisions for custody of children, exclusive occupation of the matrimonial home, and even maintenance. Police are required to assist in serving and enforcing the order. Violating a Protection Order is a criminal offense punishable by a fine or imprisonment." }
    ]}, published_at: daysAgo(3)
  },
  {
    id: id(), title: "Child Custody and Maintenance: What Courts Consider",
    topic_tag: "Children's Rights",
    summary: "When parents separate, the best interests of the child are paramount. Learn how custody and maintenance are determined under Kenyan law.",
    body: { sections: [
      { heading: "What the law says", content: "The Children's Act, 2022 (the new Act) governs all matters relating to children. Section 8 provides that the best interests of the child shall be the primary consideration in all decisions affecting a child. In custody disputes, the court considers factors including the child's age, the parents' ability to provide for the child, the child's wishes (if of sufficient age), and the existing emotional ties. Both parents have parental responsibility, and custody can be sole or joint. The Act also requires both parents to maintain their children proportionally to their means." },
      { heading: "What this means for you", content: "If you are separating from your child's other parent, you can agree on custody and maintenance through a written agreement. If you cannot agree, you can apply to the Children's Court for determination. The court can order DNA testing if paternity is disputed. Maintenance typically ranges from 10-30% of the paying parent's income depending on their means and the child's needs. Either parent can apply — custody is not automatically awarded to the mother. Failure to pay maintenance can result in attachment of salary or even imprisonment. Always formalize any agreement through the court to ensure enforceability." }
    ]}, published_at: daysAgo(4)
  },
  {
    id: id(), title: "Land Disputes: How to Resolve Boundary and Ownership Conflicts",
    topic_tag: "Land Law",
    summary: "Land disputes are among the most common legal issues in Kenya. Know your rights and the proper channels for resolving them.",
    body: { sections: [
      { heading: "What the law says", content: "Land disputes in Kenya are governed by multiple statutes including the Constitution of Kenya (Article 40 on protection of property rights), the Land Registration Act, the Land Act, and the National Land Commission Act. The Environment and Land Court (ELC) has exclusive jurisdiction over land disputes. Before going to court, parties are encouraged to use alternative dispute resolution mechanisms including the Land Disputes Tribunal, the National Land Commission, or local elders." },
      { heading: "What this means for you", content: "If someone encroaches on your land or disputes your boundary, start by checking your title deed and map at the Ministry of Lands. The Land Registrar or Surveyor can conduct a site visit to determine the correct boundaries. If that does not resolve the dispute, you can file a complaint with the National Land Commission or proceed to the Environment and Land Court. Be warned: land cases can take years in court. Consider mediation first. Also be aware of adverse possession — someone who occupies your land openly and without your permission for 12 years can potentially claim ownership through the Limitation of Actions Act." }
    ]}, published_at: daysAgo(5)
  },
  {
    id: id(), title: "Your Rights After a Traffic Accident",
    topic_tag: "Traffic & Insurance",
    summary: "Do you know what to do immediately after a road accident? Learn your legal obligations, your rights to compensation, and how insurance claims work.",
    body: { sections: [
      { heading: "What the law says", content: "Under the Traffic Act, any driver involved in an accident resulting in injury, death, or damage to property must stop, provide their details, and report the accident to the nearest police station within 24 hours. Failure to do so is a criminal offense. The Insurance (Motor Vehicles) Act requires all vehicles to have third-party insurance at minimum. Victims of road accidents can claim compensation from the insurer of the vehicle at fault, or from the Motor Vehicle Accident Fund if the driver is untraced or uninsured." },
      { heading: "What this means for you", content: "If you are in an accident: stop immediately, do not move the vehicles unless necessary for safety, exchange details with the other driver (name, phone, insurance, registration), take photos of the scene and damage, get contact details of witnesses, and report to the police. Seek medical attention even if you feel fine — some injuries manifest later. Do NOT negotiate or settle at the scene. If the accident was not your fault, you can claim compensation for medical expenses, loss of income, damage to your vehicle, and pain and suffering. Claims must be filed within 3 years of the accident." }
    ]}, published_at: daysAgo(6)
  },
  {
    id: id(), title: "Cybercrime and Online Defamation: Know Your Digital Rights",
    topic_tag: "Digital Rights",
    summary: "What constitutes cybercrime in Kenya? Understand the Computer Misuse and Cybercrimes Act and your rights and responsibilities online.",
    body: { sections: [
      { heading: "What the law says", content: "The Computer Misuse and Cybercrimes Act, 2018 criminalizes various online offenses including unauthorized access to computer systems, cyber harassment, identity theft, phishing, cyber espionage, and publication of false information. The Act also addresses computer fraud, cyber terrorism, and child pornography. Penalties range from fines to imprisonment for up to 20 years depending on the offense. Additionally, the Kenya Information and Communications Act covers offenses related to misuse of telecommunication systems." },
      { heading: "What this means for you", content: "Think twice before posting or sharing content online. Sharing false information that causes panic (like fake news about security threats) is a criminal offense punishable by up to 2 years in prison or a fine of up to Ksh 5 million. Sending threatening or obscene messages via WhatsApp, Twitter, or any electronic medium is illegal. If someone defames you online, you can sue for libel, or report to the National Police Service's Cyber Crime Unit. If your Facebook or email is hacked, report immediately to the Directorate of Criminal Investigations (DCI) cybercrime unit." }
    ]}, published_at: daysAgo(7)
  },
  {
    id: id(), title: "What Auctioneers and Bailiffs Can and Cannot Do",
    topic_tag: "Debt Recovery",
    summary: "When a debt collector or auctioneer shows up at your door, know your rights. The Auctioneers Act strictly regulates how they operate.",
    body: { sections: [
      { heading: "What the law says", content: "The Auctioneers Act, Cap 526 and the Auctioneers Rules regulate the conduct of auctioneers in Kenya. An auctioneer must have a valid license and must serve a proper notification of sale (usually 30 days' notice) before taking possession of any goods. They can only enter a debtor's premises between 6:00 AM and 6:00 PM, and they cannot use force to enter. Certain goods are exempt from attachment, including basic household necessities, tools of trade up to a certain value, and items belonging to third parties not related to the debt." },
      { heading: "What this means for you", content: "If an auctioneer comes to your home demanding goods for a debt: demand to see their license and the court warrant. If they do not have these, they are acting illegally. They cannot break down your door or enter through windows. They cannot take your bed, cooking utensils, children's items, or your only means of transport (e.g., a bicycle you use to get to work). They cannot take goods belonging to your spouse or relatives unless they were jointly party to the debt. If an auctioneer violates these rules, report them to the Auctioneers Licensing Board or sue for damages." }
    ]}, published_at: daysAgo(8)
  },
  {
    id: id(), title: "How to File a Constitutional Petition for Violation of Your Rights",
    topic_tag: "Access to Justice",
    summary: "When your constitutional rights are violated, you can seek redress through a constitutional petition. Here is a step-by-step guide.",
    body: { sections: [
      { heading: "What the law says", content: "Article 22 of the Constitution gives every person the right to institute court proceedings claiming that a right or fundamental freedom has been denied, violated, or threatened. Article 23 gives courts the power to grant appropriate relief, including declarations of rights, injunctions, compensation, and orders of judicial review. The procedure is governed by the Constitution of Kenya (Protection of Rights and Fundamental Freedoms) Practice and Procedure Rules, 2013 (often called the Mutunga Rules)." },
      { heading: "What this means for you", content: "If the police torture you, if your child is unlawfully detained, if your land is illegally taken by the government, or if any of your constitutional rights are violated, you can file a constitutional petition at the High Court. You do not necessarily need a lawyer — the rules allow for informal pleadings. The petition should state the facts, the rights violated, and the relief sought. Courts are required to hear constitutional petitions urgently. You can also file a friend of the court (amicus curiae) brief if you are not directly affected but have expertise. If you cannot afford a lawyer, approach the Kenya National Commission on Human Rights or a legal aid clinic for assistance." }
    ]}, published_at: daysAgo(9)
  },
  {
    id: id(), title: "NHIF, NSSF, and Your Rights to Social Security",
    topic_tag: "Employment Law",
    summary: "Understand your rights and obligations regarding mandatory statutory deductions and the benefits you are entitled to receive.",
    body: { sections: [
      { heading: "What the law says", content: "Article 43(1)(e) of the Constitution guarantees every person the right to social security. The National Social Security Fund (NSSF) Act, 2013 requires all employers to register their employees and make monthly contributions. The National Hospital Insurance Fund (NHIF) Act requires similar contributions for health insurance. The Employment Act, 2007 (Section 35) also requires employers to provide itemized payslips showing all deductions. Unauthorized or excessive deductions are illegal." },
      { heading: "What this means for you", content: "Your employer must deduct NSSF (currently 6% of pensionable wages, capped at Ksh 1,080 per month from both employer and employee) and NHIF (graduated scale from Ksh 150 to Ksh 1,700 per month based on salary). These deductions MUST appear on your payslip. You are entitled to NSSF benefits upon retirement (age 60), or earlier if you are permanently disabled or leaving Kenya permanently. NHIF covers you and your dependents (spouse and children under 18) for inpatient and outpatient services at accredited hospitals. If your employer is not remitting your deductions, report them to the NSSF or NHIF immediately — you could still be entitled to benefits if the employer has been deducting but not remitting." }
    ]}, published_at: daysAgo(10)
  },
];

const contentList = [
  { id: id(), title: "How is property divided in a Kenyan divorce?", platform: "youtube", embed_url: "https://www.youtube.com/embed/dQw4w9WgXcQ", topic_tag: "Family Law", description: "A breakdown of the Matrimonial Property Act and how courts decide who gets what when a marriage ends.", published_at: daysAgo(1) },
  { id: id(), title: "Why you MUST have a Will (Succession Law explained)", platform: "tiktok", embed_url: "https://www.tiktok.com/embed/v2/123456789", topic_tag: "Succession Law", description: "What happens to your property if you die without a will? The Law of Succession Act explained in 1 minute.", published_at: daysAgo(2) },
  { id: id(), title: "Domestic Violence Protection Orders - Step by Step", platform: "instagram", embed_url: "https://www.instagram.com/p/12345/embed", topic_tag: "Family Law", description: "How to apply for a Protection Order under the Protection Against Domestic Violence Act.", published_at: daysAgo(3) },
  { id: id(), title: "Child Custody and Maintenance in Kenya (Podcast)", platform: "podcast", embed_url: "https://open.spotify.com/embed/episode/789", topic_tag: "Children's Rights", description: "Deep dive into how Kenyan courts decide custody and calculate child maintenance under the Children's Act.", published_at: daysAgo(4) },
  { id: id(), title: "Land Disputes: Boundary conflicts and what to do", platform: "youtube", embed_url: "https://www.youtube.com/embed/dQw4w9WgXcQ", topic_tag: "Land Law", description: "Step by step guide to resolving land disputes through the Land Registrar, NLC, and Environment and Land Court.", published_at: daysAgo(5) },
  { id: id(), title: "3 things to do immediately after a car accident", platform: "tiktok", embed_url: "https://www.tiktok.com/embed/v2/123456789", topic_tag: "Traffic & Insurance", description: "Your legal obligations and rights after a road accident. Don't make these common mistakes.", published_at: daysAgo(6) },
  { id: id(), title: "Can you go to jail for a WhatsApp message?", platform: "instagram", embed_url: "https://www.instagram.com/p/12345/embed", topic_tag: "Digital Rights", description: "Cybercrime law in Kenya - what you can and cannot say online under the Computer Misuse Act.", published_at: daysAgo(7) },
  { id: id(), title: "Auctioneers explained: Know your rights (Podcast)", platform: "podcast", embed_url: "https://open.spotify.com/embed/episode/101", topic_tag: "Debt Recovery", description: "What auctioneers can and cannot do when recovering debts. Know the rules before they show up.", published_at: daysAgo(8) },
  { id: id(), title: "How to sue the government for violating your rights", platform: "youtube", embed_url: "https://www.youtube.com/embed/dQw4w9WgXcQ", topic_tag: "Access to Justice", description: "A guide to filing a constitutional petition at the High Court when your rights are violated.", published_at: daysAgo(9) },
  { id: id(), title: "Is your employer stealing your NSSF?", platform: "tiktok", embed_url: "https://www.tiktok.com/embed/v2/123456789", topic_tag: "Employment Law", description: "Your rights regarding NSSF, NHIF, and other statutory deductions. Check your payslip!", published_at: daysAgo(10) },
];

const questions = [
  { id: id(), question_text: "My husband and I are separating after 10 years of marriage. I was a stay-at-home mom. Do I have any right to the business he built during our marriage?", topic_tag: "Family Law", email: "mary.wanjiku@example.com", user_id: null, status: "pending", submitted_at: daysAgo(2) },
  { id: id(), question_text: "My father died without a will. He had 3 wives and 8 children. How will his property be shared?", topic_tag: "Succession Law", email: "peter.ochieng@example.com", user_id: null, status: "pending", submitted_at: daysAgo(3) },
  { id: id(), question_text: "A neighbor has built a structure that encroaches on my land by 5 meters. The Land Registrar says I need to go to court. How long will this take?", topic_tag: "Land Law", email: "jane.muthoni@example.com", user_id: null, status: "pending", submitted_at: daysAgo(4) },
  { id: id(), question_text: "An auctioneer came to my house and took my TV and fridge over a debt my brother owes. He said it doesn't matter because we live in the same house. Is this legal?", topic_tag: "Debt Recovery", email: "kevin.otieno@example.com", user_id: null, status: "pending", submitted_at: daysAgo(5) },
  { id: id(), question_text: "Someone shared my private photos on Facebook without my permission. What can I do under Kenyan law?", topic_tag: "Digital Rights", email: "faith.nyambura@example.com", user_id: null, status: "pending", submitted_at: daysAgo(1) },
];

const galleryItems = [
  { id: id(), media_type: "photo", platform: "instagram", title: "Divorce Property Division Infographic", embed_or_image_url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400", topic_tag: "Family Law", thumbnail_url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400", published_at: daysAgo(1) },
  { id: id(), media_type: "photo", platform: "facebook", title: "Succession Law Cheat Sheet", embed_or_image_url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400", topic_tag: "Succession Law", thumbnail_url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400", published_at: daysAgo(2) },
  { id: id(), media_type: "video", platform: "youtube", title: "Domestic Violence: How to Get a Protection Order", embed_or_image_url: "https://www.youtube.com/embed/dQw4w9WgXcQ", topic_tag: "Family Law", thumbnail_url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400", published_at: daysAgo(3) },
  { id: id(), media_type: "photo", platform: "instagram", title: "Child Maintenance Calculation Guide", embed_or_image_url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400", topic_tag: "Children's Rights", thumbnail_url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400", published_at: daysAgo(4) },
  { id: id(), media_type: "photo", platform: "tiktok", title: "Land Dispute Resolution Flowchart", embed_or_image_url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400", topic_tag: "Land Law", thumbnail_url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400", published_at: daysAgo(5) },
  { id: id(), media_type: "video", platform: "youtube", title: "Car Accident Checklist", embed_or_image_url: "https://www.youtube.com/embed/dQw4w9WgXcQ", topic_tag: "Traffic & Insurance", thumbnail_url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400", published_at: daysAgo(6) },
];

async function seed() {
  console.log("Seeding new content...");

  const { error: aErr } = await supabase.from('articles').insert(articles);
  if (aErr) { console.error("Articles error:", aErr.message); return; }
  console.log(`✓ ${articles.length} articles inserted`);

  const { error: cErr } = await supabase.from('content').insert(contentList);
  if (cErr) { console.error("Content error:", cErr.message); return; }
  console.log(`✓ ${contentList.length} content items inserted`);

  const { error: qErr } = await supabase.from('questions').insert(questions);
  if (qErr) { console.error("Questions error:", qErr.message); return; }
  console.log(`✓ ${questions.length} questions inserted`);

  const { error: gErr } = await supabase.from('gallery').insert(galleryItems);
  if (gErr) { console.error("Gallery error:", gErr.message); return; }
  console.log(`✓ ${galleryItems.length} gallery items inserted`);

  console.log("Seeding complete!");
}

seed().catch(console.error);
