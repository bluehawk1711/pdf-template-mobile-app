/**
 * K.L LAB — Template 1 renderer.
 * Structured InvoiceData → 9-page pharmaceutical brochure PDF.
 *
 * Page 1: portrait cover — orange-red swooshes, globe, KL LAB band
 * Pages 2–8: landscape product info — left branding + right info
 * Page 9: portrait closing — Thank You Doctor, KL LAB contact
 *
 * Palette extracted pixel-by-pixel from reference PDF.
 * Images are placeholders — user will provide actual assets.
 */

import { InvoiceData } from '../../invoice/types';

/* ── Palette (from reference pixel analysis) ──────────────────────────── */
const INK = '#1A1A1A';
const MUTED = '#6B7280';

/* ── Helpers ──────────────────────────────────────────────────────────── */
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ════════════════════════════════════════════════════════════════════════
   PAGE 1 — COVER (portrait A4: 794 × 1123)
   ════════════════════════════════════════════════════════════════════════ */
const coverPage = (): string => `
<div class="page" style="width:794px;height:1123px;background:#fff;position:relative;overflow:hidden;">

  <!-- IMAGE PLACEHOLDER: globe + medicine (circular, upper-left) -->
  <div class="ph" id="COVER_GLOBE"
       style="width:170px;height:170px;border-radius:50%;top:250px;left:70px;
              background:linear-gradient(135deg,#e0edfe 0%,#b8dff5 100%);
              border:3px solid rgba(255,255,255,0.85);box-shadow:0 4px 20px rgba(0,0,0,0.12);">
    <span class="ph-t">COVER_GLOBE<br/><small>170×170</small></span>
  </div>

  <!-- IMAGE PLACEHOLDER: scattered pills (center-right) -->
  <div class="ph" id="COVER_PILLS"
       style="width:400px;height:300px;top:300px;right:30px;border-radius:12px;
              background:#f5f5f5;">
    <span class="ph-t">COVER_PILLS<br/><small>~400×300</small></span>
  </div>

  <!-- Orange-red swooshes (SVG) — match reference: heavy top-left diagonal -->
  <svg style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;pointer-events:none"
       viewBox="0 0 794 1123" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g1" x1="0" y1="0" x2="0.7" y2="1">
        <stop offset="0%" stop-color="#e84b38"/>
        <stop offset="100%" stop-color="#b22a1e"/>
      </linearGradient>
    </defs>
    <!-- Primary swoosh: thick diagonal from top-left -->
    <path d="M0,0 L420,0 C380,70 310,190 250,330 C190,470 130,590 70,700 C35,760 10,800 0,830Z" fill="url(#g1)" opacity="0.93"/>
    <!-- Secondary lighter swoosh -->
    <path d="M0,0 L350,0 C320,55 270,160 220,270 C170,380 110,500 55,620 C25,680 5,720 0,740 L0,680 C50,620 110,510 170,400 C240,280 310,160 380,80Z" fill="#e8734a" opacity="0.42"/>
    <!-- Lower-right swoosh extension -->
    <path d="M794,340 C720,380 620,460 520,560 C420,660 320,760 220,850 C160,910 100,950 0,990 L0,1050 C100,1010 200,970 300,910 C420,830 540,730 640,630 C720,550 780,470 794,410Z" fill="#e84b38" opacity="0.87"/>
    <!-- Bottom accent -->
    <path d="M0,1040 C150,1020 350,1000 550,1020 C650,1030 794,1040 794,1040 L794,1123 L0,1123Z" fill="#b22a1e" opacity="0.55"/>
  </svg>

  <!-- Tagline — italic serif, positioned top-right of globe -->
  <div style="position:absolute;top:85px;left:260px;z-index:10;
              font-family:Georgia,'Times New Roman',serif;font-style:italic;
              font-size:20px;font-weight:600;color:#e84b38;line-height:1.55;
              text-shadow:0 1px 6px rgba(255,255,255,0.8);">
    The Superior Piece<br/>In Your Hands...
  </div>

  <!-- Bottom red band -->
  <div style="position:absolute;bottom:0;left:0;right:0;height:100px;z-index:20;
              display:flex;align-items:center;overflow:hidden;">
    <div style="position:absolute;inset:0;
                background:linear-gradient(90deg,#b22a1e 0%,#e84b38 35%,#e8734a 70%,#e84b38 100%);"></div>
    <span style="position:relative;z-index:1;padding-left:50px;font-size:34px;font-weight:800;
                 color:#fff;letter-spacing:6px;text-shadow:0 2px 8px rgba(0,0,0,0.25);">KL LAB</span>
  </div>
</div>`;

/* ════════════════════════════════════════════════════════════════════════
   LANDSCAPE PRODUCT PAGES (1123 × 794)
   ════════════════════════════════════════════════════════════════════════ */
type Pg = {
  id: string;
  /* Left half */
  tagline: string;
  taglineSize?: string;
  taglineTop?: string;
  taglineLeft?: string;
  taglineWidth?: string;
  taglineColor?: string;
  taglineFont?: string;
  taglineStyle?: string;
  bottomTag?: string;
  bottomTagSize?: string;
  bottomTagTop?: string;
  /* Image placeholder */
  imgW?: string;
  imgH?: string;
  imgTop?: string;
  imgLeft?: string;
  imgRound?: string;
  imgBg?: string;
  /* Right half */
  rx?: boolean;
  name: string;
  nameColor?: string;
  nameSize?: string;
  nameTop?: string;
  comp?: string;
  compSize?: string;
  compTop?: string;
  /* Indications */
  inds?: Array<{ l: string; c: string }>;
  indsTop?: string;
  /* Details */
  det?: string[];
  detTop?: string;
  detSize?: string;
  /* Footer */
  foot?: string;
  /* Swoosh colors */
  t1?: string; t2?: string; b1?: string; b2?: string;
};

const landscapePage = (p: Pg): string => {
  const t1 = p.t1 || '#fe4775';
  const t2 = p.t2 || '#f9a0b5';
  const b1 = p.b1 || '#e84b38';
  const b2 = p.b2 || '#e8734a';

  const inds = (p.inds || []).map(i =>
    `<span style="display:inline-block;padding:4px 12px;border-radius:4px;background:${i.c};color:#fff;font-size:10px;font-weight:600;letter-spacing:0.3px;">${esc(i.l)}</span>`
  ).join('');

  const det = (p.det || []).map(d => `<li style="margin-bottom:4px;">${esc(d)}</li>`).join('');

  return `
<div class="page" style="width:1123px;height:794px;background:#fff;position:relative;overflow:hidden;display:flex;">

  <!-- IMAGE PLACEHOLDER: product image (circular, left half) -->
  <div class="ph" id="${p.id}_IMG"
       style="width:${p.imgW || '260px'};height:${p.imgH || '320px'};top:${p.imgTop || '200px'};left:${p.imgLeft || '95px'};
              border-radius:${p.imgRound || '50%'};background:${p.imgBg || 'linear-gradient(135deg,#e0edfe,#b8dff5)'};
              border:3px solid rgba(255,255,255,0.85);box-shadow:0 4px 20px rgba(0,0,0,0.1);z-index:6;">
    <span class="ph-t">${p.id}_IMG</span>
  </div>

  <!-- ── Left half: branding ────────────────────── -->
  <div style="width:450px;height:100%;position:relative;flex-shrink:0;overflow:hidden;">

    <!-- Top swooshes -->
    <svg style="position:absolute;top:0;left:0;width:100%;height:220px;z-index:1" viewBox="0 0 450 220" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0,0 L320,0 C280,40 220,100 170,155 C120,210 60,230 0,250Z" fill="${t1}" opacity="0.92"/>
      <path d="M0,0 L260,0 C230,30 180,90 140,140 C100,190 50,215 0,235 L0,205 C50,185 100,155 145,115 C195,70 245,35 310,12Z" fill="${t2}" opacity="0.45"/>
    </svg>

    <!-- Tagline -->
    <div style="position:absolute;top:${p.taglineTop || '130px'};left:${p.taglineLeft || '30px'};right:30px;z-index:5;
                font-family:${p.taglineFont || "Georgia,'Times New Roman',serif"};
                ${p.taglineStyle || 'font-style:italic;'}font-size:${p.taglineSize || '20px'};font-weight:600;
                color:${p.taglineColor || INK};line-height:1.45;white-space:pre-line;">
      ${esc(p.tagline)}
    </div>

    <!-- Bottom swooshes -->
    <svg style="position:absolute;bottom:0;left:0;width:100%;height:220px;z-index:1" viewBox="0 0 450 220" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M450,220 L140,220 C190,180 270,120 340,80 C390,50 430,25 450,0Z" fill="${b1}" opacity="0.87"/>
      <path d="M450,220 L190,220 C240,190 310,140 370,95 C410,60 440,30 450,5 L450,35 C440,65 410,95 365,130 C305,175 235,200 185,220Z" fill="${b2}" opacity="0.42"/>
    </svg>

    <!-- Bottom tagline -->
    ${p.bottomTag ? `<div style="position:absolute;bottom:28px;left:25px;right:25px;z-index:5;
                font-family:Georgia,'Times New Roman',serif;font-style:italic;
                font-size:${p.bottomTagSize || '17px'};font-weight:600;color:${INK};
                line-height:1.4;text-align:center;white-space:pre-line;">${esc(p.bottomTag)}</div>` : ''}
  </div>

  <!-- ── Right half: product info ───────────────── -->
  <div style="flex:1;padding:28px 32px;position:relative;display:flex;flex-direction:column;gap:8px;">

    ${p.rx ? `<div style="font-family:'Times New Roman',serif;font-size:13px;color:${MUTED};margin-bottom:0;">Rx</div>` : ''}

    <div style="font-weight:800;font-size:${p.nameSize || '38px'};color:${p.nameColor || INK};
                line-height:1.1;letter-spacing:-0.5px;top:${p.nameTop || '0'};">${esc(p.name)}</div>

    ${p.comp ? `<div style="font-size:${p.compSize || '10.5px'};color:#444;line-height:1.65;white-space:pre-line;margin-top:${p.compTop || '6px'};">${esc(p.comp)}</div>` : ''}

    ${inds ? `<div style="margin-top:${p.indsTop || '10px'};">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${MUTED};margin-bottom:6px;">Indication:</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;">${inds}</div>
    </div>` : ''}

    ${det ? `<div style="margin-top:${p.detTop || '10px'};font-size:${p.detSize || '11px'};color:#333;line-height:1.6;">
      <ul style="list-style:disc;padding-left:18px;margin:0;">${det}</ul>
    </div>` : ''}

    ${p.foot ? `<div style="position:absolute;bottom:12px;right:18px;font-size:8px;color:#999;">${esc(p.foot)}</div>` : ''}
  </div>
</div>`;
};

/* ── Page data ────────────────────────────────────────────────────────── */
const pages: Pg[] = [
  /* ── Page 2: Qutocal ─────────────────────────────────────────────── */
  {
    id: 'QUTOCAL',
    tagline: 'In the Management of\nOsteoporosis with\nDiabetes and Hypertension...',
    taglineSize: '19px',
    taglineTop: '130px',
    bottomTag: 'For Complete Wellness of Bone',
    bottomTagSize: '16px',
    imgW: '250px', imgH: '300px', imgTop: '210px', imgLeft: '100px',
    name: 'Qutocal\u00AE',
    nameColor: '#8B1A4A',
    nameSize: '46px',
    comp: 'Calcium Carbonate 1250 mg + Calcitriol 0.25 mcg +\nVitamin K2-7 45 mcg + Omega-3-Fatty Acids 200 mg +\nMagnesium 50 mg + L-Methylfolate 1 mg + Zinc 7.5 mg\nSoftgel Capsules',
    compSize: '10px',
    inds: [
      { l: 'Osteoporosis', c: '#fe4775' },
      { l: 'Osteopenia', c: '#fe4775' },
      { l: 'Senile Osteoporosis', c: '#fe4775' },
    ],
    det: [
      'Calcium Carbonate',
      'Calcium is essential for the body. It is essential for normal functioning of nerves, cells, bone, and muscles.',
      'Most important nutrient in reducing risk of osteoporosis.',
      'Omega-3-Fatty Acids',
      'Complete DHA Vitamins',
      'Methylcobalamin',
      'Combination of folate and vitamin B12 to reduce calcification by 52% and cardiovascular death risk by 48%.',
      'L-Methyl Folate',
      'Reduces risk of neural tube defects.',
    ],
    foot: 'Manufactured in India by: Alkem Laboratories Ltd.',
    t1: '#fe4775', t2: '#f9a0b5', b1: '#e84b38', b2: '#e8734a',
  },
  /* ── Page 3: Qutocal-XT ──────────────────────────────────────────── */
  {
    id: 'QUTOCAL_XT',
    tagline: 'In pregnancy &\nLactation...',
    taglineSize: '21px',
    taglineTop: '130px',
    bottomTag: 'Good for Mom &\nGood for Child...',
    bottomTagSize: '17px',
    imgW: '250px', imgH: '300px', imgTop: '200px', imgLeft: '100px',
    name: 'Qutocal-XT\u00AE',
    nameColor: '#8B1A4A',
    nameSize: '42px',
    comp: 'Calcium Carbonate 1250 mg + Vitamin D3 2000 IU +\nMethylcobalamin 1500 mcg + L-Methylfolate 1000 mcg +\nPyridoxal-5-Phosphate 20 mg',
    compSize: '10px',
    inds: [
      { l: 'Pregnancy & Lactation', c: '#fe4775' },
      { l: 'Malabsorption Syndromes', c: '#fe4775' },
    ],
    det: [
      'Calcium Carbonate',
      'Calcium is essential for the body.',
      'Vitamin D3',
      'Complete DHA Vitamins',
      'Methylcobalamin',
      'Combination of folate and vitamin B12 to reduce calcification.',
      'L-Methyl Folate',
      'Reduces risk of neural tube defects.',
      'Increases fetal brain growth.',
      'Reduces the risk of proteinuria.',
      'Reduces risk of pre-eclampsia & low birth.',
    ],
    foot: 'Manufactured in India by: Alkem Laboratories Ltd.',
    t1: '#e84b38', t2: '#e8734a', b1: '#e84b38', b2: '#e8734a',
  },
  /* ── Page 4: Qutocal MAX ─────────────────────────────────────────── */
  {
    id: 'QUTOCAL_MAX',
    tagline: 'Recurrent low Back Pain\nwith\nHypertension & Diabetes....\n\n...may lead to\nOsteoporosis',
    taglineSize: '18px',
    taglineTop: '100px',
    bottomTag: 'Tune The Bone',
    bottomTagSize: '20px',
    imgW: '240px', imgH: '290px', imgTop: '220px', imgLeft: '105px',
    name: 'Qutocal MAX',
    nameColor: '#ae1649',
    nameSize: '40px',
    comp: 'Calcitriol 0.25 mcg, Omega-3-Fatty Acids 300 mg,\nMethylcobalamin 1500 mcg, Folic Acid 400 mcg,\nBoron 1.5 mg & Calcium Carbonate 500 mg',
    compSize: '10px',
    det: [
      'Calcitriol is active form of Vitamin D3, enhances the calcium absorption from intestine.',
      'Methylcobalamin reduces the homocysteine level.',
      'Folic acid helps in production of blood in body.',
      'Omega-3-Fatty acids is essential for the development of the brain, nerves and improves the health of heart.',
      'Boron helps in re-mineralization of bones.',
      'Calcium plays a vital role in the body.',
    ],
    foot: 'Manufactured in India by: Alkem Laboratories Ltd.',
    t1: '#ae1649', t2: '#c44878', b1: '#fe2775', b2: '#fc5098',
  },
  /* ── Page 5: MUKOCEF-200 mg ──────────────────────────────────────── */
  {
    id: 'MUKOCEF_200',
    tagline: 'In RTI, UTI & SSTI',
    taglineSize: '24px',
    taglineTop: '140px',
    taglineColor: '#1A1A1A',
    bottomTag: 'Strike-the Right Target',
    bottomTagSize: '18px',
    imgW: '260px', imgH: '310px', imgTop: '200px', imgLeft: '95px',
    imgBg: 'linear-gradient(135deg,#e8e8e8,#d0d0d0)',
    name: 'MUKOCEF-200 mg',
    nameColor: '#ce132e',
    nameSize: '36px',
    comp: 'Cefpodoxime Proxetil 200 mg Tablets',
    compSize: '11px',
    det: [
      'Third generation oral cephalosporin.',
      'Stable to beta-lactamase.',
      'Convenient BID dosage.',
    ],
    inds: [
      { l: 'Acute Sinusitis', c: '#ce132e' },
      { l: 'Acute Community-Acquired Bronchitis', c: '#ce132e' },
      { l: 'Urinary Tract Infections', c: '#ce132e' },
      { l: 'Pharyngitis/Tonsillitis', c: '#ce132e' },
      { l: 'Skin And Soft Tissue Infections', c: '#ce132e' },
      { l: 'Typhoid Fever', c: '#ce132e' },
      { l: 'Gonorrhea', c: '#ce132e' },
    ],
    indsTop: '12px',
    foot: 'Manufactured in India by: Alkem Laboratories Ltd.',
    t1: '#ce132e', t2: '#e8734a', b1: '#2857cb', b2: '#60a5fa',
  },
  /* ── Page 6: MUKOCEF-O ───────────────────────────────────────────── */
  {
    id: 'MUKOCEF_O',
    tagline: 'In Respiratory Tract Infection,\nUrinary Tract Infection\nand Typhoid Fever',
    taglineSize: '17px',
    taglineTop: '120px',
    bottomTag: 'Choose\n"The Winning Combination"',
    bottomTagSize: '16px',
    imgW: '260px', imgH: '310px', imgTop: '200px', imgLeft: '95px',
    imgBg: 'linear-gradient(135deg,#d0d0d0,#b0b0b0)',
    name: 'MUKOCEF-O',
    nameColor: '#ce132e',
    nameSize: '40px',
    comp: 'Cefpodoxime Proxetil 200 mg + Ofloxacin 200 mg Tablets',
    compSize: '10.5px',
    det: [
      'Patient combination of 3rd generation Cephalosporin & 3rd generation fluoroquinolone.',
      'Active against both gram negative and gram positive bacteria.',
      'Better Patient compliance and high safety.',
      'Preferred combination in severe conditions.',
    ],
    foot: 'In RTI, UTI and Typhoid Fever  |  "Sure to Success"',
    t1: '#fe2343', t2: '#f9a0b5', b1: '#fe2343', b2: '#f9a0b5',
  },
  /* ── Page 7: QUTOFLAM-SP ─────────────────────────────────────────── */
  {
    id: 'QUTOFLAM_SP',
    tagline: 'Walk away with painful Inflammatory Conditions Faster...',
    taglineSize: '16px',
    taglineTop: '80px',
    taglineColor: '#fff',
    taglineFont: "'Segoe UI',Roboto,sans-serif",
    taglineStyle: '',
    bottomTag: 'One answer\nfor many questions!',
    bottomTagSize: '18px',
    bottomTagTop: '620px',
    imgW: '280px', imgH: '340px', imgTop: '180px', imgLeft: '85px',
    imgBg: 'linear-gradient(135deg,#3b477b,#505889)',
    name: 'QUTOFLAM-SP',
    nameColor: '#1e3a5f',
    nameSize: '36px',
    comp: 'Aceclofenac 100 mg + PCM 325 mg + Serratiopeptidase 15 mg TABLETS',
    compSize: '10px',
    inds: [
      { l: 'Post Surgery', c: '#1e3a5f' },
      { l: 'Migraine', c: '#1e3a5f' },
      { l: 'Tooth Extraction', c: '#1e3a5f' },
      { l: 'Joint Pain', c: '#1e3a5f' },
    ],
    det: [
      'Serratiopeptidase by 50%.',
      'Encourages faster wound healing.',
      'Potent anti-inflammatory agent.',
      'Entire SP group in India HPLC strength over 95%.',
      'Reduces swelling, pain and stiffness.',
      'Inhibits pro-inflammatory mediators.',
      'Reduces need for rescue medication.',
    ],
    detSize: '10px',
    foot: 'Also Available: QUTOFLAM-P  |  Aceclofenac + Paracetamol TABLETS',
    t1: '#5c5d7c', t2: '#8e8d92', b1: '#fc1331', b2: '#929cda',
  },
  /* ── Page 8: KLRAB-DSR ───────────────────────────────────────────── */
  {
    id: 'KLRAB_DSR',
    tagline: 'When Acidity with Reflux\nBothers your Patients',
    taglineSize: '18px',
    taglineTop: '100px',
    bottomTag: 'The APT Answer to Control',
    bottomTagSize: '17px',
    imgW: '270px', imgH: '320px', imgTop: '190px', imgLeft: '90px',
    imgBg: 'linear-gradient(135deg,#e0edfe,#b8dff5)',
    name: 'KLRAB-DSR',
    nameColor: '#2e7d32',
    nameSize: '36px',
    comp: 'Rabeprazole 20 mg & Domperidone 30 mg CAPSULES',
    compSize: '10.5px',
    det: [
      'Both acid as well stimulated gastric acid secretion.',
      'Acts as a prokinetic agent.',
      'Patients unresponsive to H2 receptor antagonist responds well.',
      'Reduces reflux episodes.',
    ],
    foot: 'For Total Relief From Distressing Symptoms',
    t1: '#5a6666', t2: '#a6aaa9', b1: '#9e9e9e', b2: '#bdbdbd',
  },
];

/* ════════════════════════════════════════════════════════════════════════
   PAGE 9 — CLOSING (portrait A4: 794 × 1123)
   ════════════════════════════════════════════════════════════════════════ */
const closingPage = (): string => `
<div class="page" style="width:794px;height:1123px;background:#fff;position:relative;overflow:hidden;">

  <!-- IMAGE PLACEHOLDER: family photo (upper area) -->
  <div class="ph" id="CLOSING_FAMILY"
       style="width:380px;height:280px;top:60px;left:50%;transform:translateX(-50%);border-radius:12px;
              background:linear-gradient(135deg,#ffc7b6,#f46e62);">
    <span class="ph-t">CLOSING_FAMILY<br/><small>380×280</small></span>
  </div>

  <!-- Gray swooshes top -->
  <svg style="position:absolute;top:0;left:0;width:100%;height:380px;z-index:1;pointer-events:none"
       viewBox="0 0 794 380" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M794,0 C700,20 580,80 480,160 C380,240 280,300 180,340 C120,360 60,370 0,380 L0,320 C60,310 140,280 240,220 C360,150 500,70 660,20Z" fill="#b9afae" opacity="0.5"/>
    <path d="M794,40 C720,55 620,110 520,180 C420,250 320,310 220,350 C160,370 80,380 0,390 L0,340 C80,330 180,290 280,230 C400,160 540,80 700,30Z" fill="#d7d2d0" opacity="0.4"/>
  </svg>

  <!-- Thank You text -->
  <div style="position:absolute;top:400px;left:0;right:0;text-align:center;z-index:10;">
    <div style="font-family:Georgia,'Times New Roman',serif;font-size:40px;font-weight:700;color:#1a1a1a;line-height:1.25;">Thank You Doctor</div>
    <div style="font-family:Georgia,'Times New Roman',serif;font-size:15px;font-style:italic;color:#6b7280;margin-top:12px;line-height:1.5;">For Being my prescription to<br/>Happiness</div>
    <div style="margin-top:14px;font-size:42px;color:#1a1a1a;">&#9786;</div>
  </div>

  <!-- KL LAB -->
  <div style="position:absolute;top:610px;left:0;right:0;text-align:center;z-index:10;">
    <div style="font-size:30px;font-weight:800;color:#e84b38;letter-spacing:4px;">KL LAB</div>
  </div>

  <!-- Contact -->
  <div style="position:absolute;top:700px;left:0;right:0;text-align:center;z-index:10;font-size:11px;color:#6b7280;line-height:1.9;">
    <div>Visit Us:</div>
    <div style="font-weight:700;color:#1a1a1a;">K.L. LAB</div>
    <div>(A Division of Alkem Pharma)</div>
    <div>Saraswati Vihar Block-C, Khoda Colony,<br/>Ghaziabad U.P.-201001</div>
  </div>

  <!-- Red swoosh bottom -->
  <svg style="position:absolute;bottom:0;left:0;width:100%;height:280px;z-index:1;pointer-events:none"
       viewBox="0 0 794 280" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0,280 C100,260 220,220 340,170 C460,120 580,80 700,45 C750,25 794,10 794,10 L794,70 C700,90 580,130 460,180 C340,230 220,260 120,275Z" fill="#e84b38" opacity="0.88"/>
    <path d="M0,280 C80,265 180,230 280,190 C380,150 480,110 580,75 C650,55 730,25 794,5 L794,45 C730,65 650,95 560,130 C450,180 340,220 220,255Z" fill="#e8734a" opacity="0.45"/>
  </svg>
</div>`;

/* ════════════════════════════════════════════════════════════════════════
   MAIN RENDERER
   ════════════════════════════════════════════════════════════════════════ */
export const renderInvoice = (invoice: InvoiceData): string => {
  const { business } = invoice;
  const allPages = [
    coverPage(),
    ...pages.map(landscapePage),
    closingPage(),
  ].join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${esc(business.name)} Brochure</title>
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    color: #1a1a1a; background: #fff;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  .page { page-break-after: always; }
  .page:last-child { page-break-after: auto; }

  /* Placeholders */
  .ph {
    position: absolute; border: 2px dashed #c0c0c0; border-radius: 8px;
    background: #f5f5f5; display: flex; align-items: center; justify-content: center; z-index: 5;
  }
  .ph-t { color: #999; font-size: 11px; text-align: center; line-height: 1.4; user-select: none; }
  .ph-t small { font-size: 9px; color: #bbb; }
</style>
</head>
<body>
${allPages}
</body>
</html>`;
};
