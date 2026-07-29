import { db } from "../database.js";
import { items, categories } from "../schemas/schema.js";

export const data = [
  // -- IV Supplies --
  { itemName: "IV Saline Bag 500mL", description: "Sterile 0.9% sodium chloride IV solution, 500mL", remainingAmount: 240, categoryName: "IV Supplies" },
  { itemName: "IV Saline Bag 1000mL", description: "Sterile 0.9% sodium chloride IV solution, 1000mL", remainingAmount: 180, categoryName: "IV Supplies" },
  { itemName: "IV Tubing Set", description: "Standard IV administration set with drip chamber", remainingAmount: 320, categoryName: "IV Supplies" },
  { itemName: "Peripheral IV Catheter 22G", description: "22-gauge peripheral IV catheter with safety mechanism", remainingAmount: 500, categoryName: "IV Supplies" },
  { itemName: "Peripheral IV Catheter 18G", description: "18-gauge peripheral IV catheter for rapid fluid resuscitation", remainingAmount: 350, categoryName: "IV Supplies" },
  { itemName: "Peripheral IV Catheter 24G", description: "24-gauge peripheral IV catheter for pediatric patients", remainingAmount: 200, categoryName: "IV Supplies" },
  { itemName: "Central Line Kit", description: "Central venous catheter insertion kit with triple lumen", remainingAmount: 15, categoryName: "IV Supplies" },
  { itemName: "IV Extension Set", description: "30-inch IV extension tubing with T-connector", remainingAmount: 400, categoryName: "IV Supplies" },
  { itemName: "IV Start Kit", description: "Complete IV start kit with swab, tape, tourniquet, and dressing", remainingAmount: 600, categoryName: "IV Supplies" },
  { itemName: "Heparin Lock Flush 10mL", description: "10mL pre-filled heparin lock flush syringe", remainingAmount: 275, categoryName: "IV Supplies" },
  // -- Wound Care --
  { itemName: "Sterile Gauze Pads 4x4", description: "Sterile 4x4 inch gauze pads, pack of 100", remainingAmount: 85, categoryName: "Wound Care" },
  { itemName: "Adhesive Bandages Assorted", description: "Assorted sizes of adhesive bandages, box of 200", remainingAmount: 150, categoryName: "Wound Care" },
  { itemName: "Medical Tape 2 inch", description: "Hypoallergenic medical tape, 2 inch width, 10 yard roll", remainingAmount: 60, categoryName: "Wound Care" },
  { itemName: "Non-Stick Pads 3x4", description: "Sterile non-stick wound pads, 3x4 inches, box of 50", remainingAmount: 95, categoryName: "Wound Care" },
  { itemName: "Hydrocolloid Dressing", description: "Hydrocolloid wound dressing for pressure ulcers, 4x4 inch", remainingAmount: 40, categoryName: "Wound Care" },
  { itemName: "Elastic Bandage 4 inch", description: "Compression elastic bandage, 4 inch by 5 yards", remainingAmount: 70, categoryName: "Wound Care" },
  { itemName: "Wound Cleanser Spray", description: "Sterile wound cleanser spray, 8oz", remainingAmount: 55, categoryName: "Wound Care" },
  { itemName: "Surgical Sponges", description: "Sterile surgical laparotomy sponges, pack of 10", remainingAmount: 120, categoryName: "Wound Care" },
  { itemName: "Alginate Dressing", description: "Calcium alginate wound dressing for heavy exudate", remainingAmount: 35, categoryName: "Wound Care" },
  { itemName: "Foam Dressing 3x3", description: "Adhesive foam dressing for moderate exudate wounds", remainingAmount: 50, categoryName: "Wound Care" },
  // -- Surgical Instruments --
  { itemName: "Scalpel Blade #10", description: "Sterile surgical scalpel blade size #10, box of 50", remainingAmount: 40, categoryName: "Surgical Instruments" },
  { itemName: "Tissue Forceps", description: "Straight tissue forceps with teeth, 6 inch", remainingAmount: 25, categoryName: "Surgical Instruments" },
  { itemName: "Surgical Scissors", description: "Sharp/sharp operating scissors, 5.5 inch", remainingAmount: 30, categoryName: "Surgical Instruments" },
  { itemName: "Scalpel Blade #15", description: "Sterile surgical scalpel blade size #15, box of 50", remainingAmount: 55, categoryName: "Surgical Instruments" },
  { itemName: "Scalpel Handle #4", description: "Reusable scalpel handle, size #4, stainless steel", remainingAmount: 20, categoryName: "Surgical Instruments" },
  { itemName: "Hemostatic Forceps", description: "Curved hemostatic forceps, 6 inch, Kelly pattern", remainingAmount: 35, categoryName: "Surgical Instruments" },
  { itemName: "Needle Holder", description: "Mayo-Hegar needle holder, 6 inch, tungsten carbide jaws", remainingAmount: 18, categoryName: "Surgical Instruments" },
  { itemName: "Retractor Set", description: "Basic surgical retractor set with 4 pieces", remainingAmount: 10, categoryName: "Surgical Instruments" },
  { itemName: "Suture Kit", description: "Disposable suture removal kit with scissors and forceps", remainingAmount: 200, categoryName: "Surgical Instruments" },
  { itemName: "Electrocautery Pen", description: "Disposable electrocautery pen with fine tip", remainingAmount: 45, categoryName: "Surgical Instruments" },
  // -- Personal Protective Equipment --
  { itemName: "Nitrile Gloves - Large", description: "Powder-free nitrile examination gloves, large, box of 100", remainingAmount: 200, categoryName: "Personal Protective Equipment" },
  { itemName: "Nitrile Gloves - Medium", description: "Powder-free nitrile examination gloves, medium, box of 100", remainingAmount: 180, categoryName: "Personal Protective Equipment" },
  { itemName: "Surgical Face Masks", description: "Level 3 surgical face masks, box of 50", remainingAmount: 300, categoryName: "Personal Protective Equipment" },
  { itemName: "N95 Respirator Masks", description: "N95 particulate respirator masks, individually wrapped", remainingAmount: 120, categoryName: "Personal Protective Equipment" },
  { itemName: "Nitrile Gloves - Small", description: "Powder-free nitrile examination gloves, small, box of 100", remainingAmount: 150, categoryName: "Personal Protective Equipment" },
  { itemName: "Nitrile Gloves - X-Large", description: "Powder-free nitrile examination gloves, x-large, box of 100", remainingAmount: 90, categoryName: "Personal Protective Equipment" },
  { itemName: "Isolation Gown", description: "Disposable isolation gown with thumb loops, box of 25", remainingAmount: 75, categoryName: "Personal Protective Equipment" },
  { itemName: "Face Shield", description: "Full-face disposable face shield with anti-fog coating", remainingAmount: 110, categoryName: "Personal Protective Equipment" },
  { itemName: "Surgical Cap Bouffant", description: "Disposable bouffant surgical caps, pack of 100", remainingAmount: 250, categoryName: "Personal Protective Equipment" },
  { itemName: "Shoe Covers", description: "Disposable shoe covers, non-skid, pack of 100", remainingAmount: 300, categoryName: "Personal Protective Equipment" },
  // -- Medications --
  { itemName: "Acetaminophen 500mg", description: "Acetaminophen tablets 500mg, bottle of 100", remainingAmount: 75, categoryName: "Medications" },
  { itemName: "Amoxicillin 250mg", description: "Amoxicillin capsules 250mg, bottle of 30", remainingAmount: 90, categoryName: "Medications" },
  { itemName: "Ibuprofen 400mg", description: "Ibuprofen tablets 400mg, bottle of 50", remainingAmount: 60, categoryName: "Medications" },
  { itemName: "Lorazepam 2mg", description: "Lorazepam tablets 2mg, bottle of 30", remainingAmount: 40, categoryName: "Medications" },
  { itemName: "Omeprazole 20mg", description: "Omeprazole delayed-release capsules 20mg, bottle of 30", remainingAmount: 55, categoryName: "Medications" },
  { itemName: "Metformin 500mg", description: "Metformin hydrochloride tablets 500mg, bottle of 60", remainingAmount: 70, categoryName: "Medications" },
  { itemName: "Lisinopril 10mg", description: "Lisinopril tablets 10mg, bottle of 30", remainingAmount: 45, categoryName: "Medications" },
  { itemName: "Atorvastatin 20mg", description: "Atorvastatin calcium tablets 20mg, bottle of 30", remainingAmount: 50, categoryName: "Medications" },
  { itemName: "Epinephrine Auto-Injector", description: "Epinephrine auto-injector 0.3mg, single pack", remainingAmount: 25, categoryName: "Medications" },
  { itemName: "Salbutamol Inhaler", description: "Salbutamol sulfate inhalation aerosol, 200 doses", remainingAmount: 35, categoryName: "Medications" },
  // -- Diagnostic Equipment --
  { itemName: "Digital Thermometer", description: "Digital oral/rectal thermometer with flexible tip", remainingAmount: 45, categoryName: "Diagnostic Equipment" },
  { itemName: "Blood Pressure Cuff - Adult", description: "Adult-sized manual blood pressure cuff with gauge", remainingAmount: 20, categoryName: "Diagnostic Equipment" },
  { itemName: "Stethoscope", description: "Dual-head stethoscope with non-chill rim", remainingAmount: 15, categoryName: "Diagnostic Equipment" },
  { itemName: "Pulse Oximeter", description: "Fingertip pulse oximeter with OLED display", remainingAmount: 30, categoryName: "Diagnostic Equipment" },
  { itemName: "Otoscope Set", description: "Otoscope with 4 specula sizes and rechargeable handle", remainingAmount: 12, categoryName: "Diagnostic Equipment" },
  { itemName: "Ophthalmoscope", description: "Halogen ophthalmoscope with 5 aperture settings", remainingAmount: 8, categoryName: "Diagnostic Equipment" },
  { itemName: "ECG Electrodes", description: "Disposable ECG electrodes, radiolucent, pack of 100", remainingAmount: 150, categoryName: "Diagnostic Equipment" },
  { itemName: "Laryngoscope Handle", description: "Stainless steel laryngoscope handle, standard size", remainingAmount: 10, categoryName: "Diagnostic Equipment" },
  { itemName: "Laryngoscope Blade Mac 3", description: "Macintosh laryngoscope blade size 3, reusable", remainingAmount: 14, categoryName: "Diagnostic Equipment" },
  { itemName: "Reflex Hammer", description: "Taylor percussion reflex hammer with rubber head", remainingAmount: 22, categoryName: "Diagnostic Equipment" },
  // -- Respiratory --
  { itemName: "Oxygen Mask - Adult", description: "Adult non-rebreather oxygen mask with tubing", remainingAmount: 55, categoryName: "Respiratory" },
  { itemName: "Nebulizer Kit", description: "Compressor nebulizer with mouthpiece and tubing", remainingAmount: 12, categoryName: "Respiratory" },
  { itemName: "Oxygen Nasal Cannula", description: "Adult nasal cannula with 7ft tubing, pack of 10", remainingAmount: 100, categoryName: "Respiratory" },
  { itemName: "BVM Resuscitator - Adult", description: "Adult bag-valve-mask resuscitator with reservoir bag", remainingAmount: 18, categoryName: "Respiratory" },
  { itemName: "CPAP Mask", description: "Full-face CPAP mask with silicone cushion", remainingAmount: 8, categoryName: "Respiratory" },
  { itemName: "Oxygen Tubing 10ft", description: "Oxygen supply tubing, 10 feet, with connectors", remainingAmount: 80, categoryName: "Respiratory" },
  { itemName: "Suction Catheter 14FR", description: "Flexible suction catheter, 14 French, sterile", remainingAmount: 65, categoryName: "Respiratory" },
  { itemName: "Peak Flow Meter", description: "Handheld peak expiratory flow meter with indicator", remainingAmount: 25, categoryName: "Respiratory" },
  { itemName: "Tracheostomy Tube 6.0", description: "Shiley tracheostomy tube size 6.0 with inner cannula", remainingAmount: 10, categoryName: "Respiratory" },
  { itemName: "Aerosol Mask - Pediatric", description: "Pediatric aerosol delivery mask with anti-rebreathing valve", remainingAmount: 30, categoryName: "Respiratory" },
  // -- Emergency --
  { itemName: "Defibrillator Pads - Adult", description: "Adult multifunction defibrillator electrode pads, pair", remainingAmount: 8, categoryName: "Emergency" },
  { itemName: "Tourniquet - Combat Application", description: "Combat application tourniquet (CAT) with windlass", remainingAmount: 35, categoryName: "Emergency" },
  { itemName: "First Aid Kit - Large", description: "Large wall-mountable first aid kit, 200-piece", remainingAmount: 10, categoryName: "Emergency" },
  { itemName: "Cervical Collar - Adult", description: "Adjustable rigid cervical collar, adult universal size", remainingAmount: 20, categoryName: "Emergency" },
  { itemName: "Backboard Full Size", description: "Full-size spinal immobilization backboard with straps", remainingAmount: 5, categoryName: "Emergency" },
  { itemName: "SAM Splint 36 inch", description: "Moldable aluminum SAM splint, 36 inch length", remainingAmount: 40, categoryName: "Emergency" },
  { itemName: "Burn Dressing 4x4", description: "Sterile burn dressing with hydro-gel, 4x4 inch", remainingAmount: 30, categoryName: "Emergency" },
  { itemName: "Emergency Blanket", description: "Mylar emergency thermal blanket, 52x84 inches", remainingAmount: 60, categoryName: "Emergency" },
  { itemName: "Handheld Suction Unit", description: "Portable handheld suction unit with collection canister", remainingAmount: 7, categoryName: "Emergency" },
  { itemName: "Triangular Bandage", description: "Cotton triangular bandage for slings and splints, 40x40x56 inch", remainingAmount: 85, categoryName: "Emergency" },
  // -- Laboratory --
  { itemName: "Vacutainer Tube Red Top", description: "BD Vacutainer serum tube, 5mL, red top, box of 100", remainingAmount: 200, categoryName: "Laboratory" },
  { itemName: "Vacutainer Tube Lavender Top", description: "BD Vacutainer EDTA tube, 3mL, lavender top, box of 100", remainingAmount: 180, categoryName: "Laboratory" },
  { itemName: "Vacutainer Tube Blue Top", description: "BD Vacutainer citrate tube, 2.7mL, blue top, box of 100", remainingAmount: 120, categoryName: "Laboratory" },
  { itemName: "Urine Collection Cup", description: "Sterile urine collection cup with cap, 100mL", remainingAmount: 300, categoryName: "Laboratory" },
  { itemName: "Microscope Slide", description: "Pre-cleaned microscope slides, frosted end, box of 72", remainingAmount: 250, categoryName: "Laboratory" },
  { itemName: "Cover Slips", description: "Glass cover slips, 22x22mm, box of 100", remainingAmount: 150, categoryName: "Laboratory" },
  { itemName: "Blood Culture Bottle Set", description: "Aerobic/anaerobic blood culture bottle set, adult", remainingAmount: 60, categoryName: "Laboratory" },
  { itemName: "Test Tube Rack", description: "Polypropylene test tube rack, 50-place, 13mm holes", remainingAmount: 25, categoryName: "Laboratory" },
  { itemName: "Disposable Pipette 5mL", description: "Sterile disposable serological pipette, 5mL, pack of 50", remainingAmount: 100, categoryName: "Laboratory" },
  { itemName: "Specimen Transport Bag", description: "Biohazard specimen transport bag with outer pouch, pack of 100", remainingAmount: 350, categoryName: "Laboratory" },
  // -- Radiology --
  { itemName: "X-Ray Film 14x17", description: "Medical X-ray film, 14x17 inches, box of 100", remainingAmount: 30, categoryName: "Radiology" },
  { itemName: "Barium Sulfate Suspension", description: "Barium sulfate contrast suspension for upper GI studies, 450mL", remainingAmount: 20, categoryName: "Radiology" },
  { itemName: "CT Contrast Injector Set", description: "CT power injector disposable set with triple connector", remainingAmount: 45, categoryName: "Radiology" },
  { itemName: "X-Ray Lead Apron", description: "Lead protective apron, 0.5mm Pb equivalent, full wrap", remainingAmount: 8, categoryName: "Radiology" },
  { itemName: "MRI Ear Plugs", description: "Disposable MRI-compatible ear plugs, box of 50 pairs", remainingAmount: 100, categoryName: "Radiology" },
  { itemName: "Ultrasound Gel 250mL", description: "Sterile ultrasound transmission gel, 250mL bottle", remainingAmount: 60, categoryName: "Radiology" },
  { itemName: "Cassette X-Ray 10x12", description: "CR X-ray imaging cassette, 10x12 inches", remainingAmount: 12, categoryName: "Radiology" },
  { itemName: "Lead Thyroid Shield", description: "Lead thyroid protection shield, 0.5mm Pb, adjustable", remainingAmount: 10, categoryName: "Radiology" },
  // -- Orthopedics --
  { itemName: "Fiberglass Cast 2 inch", description: "Fiberglass casting tape, 2 inch x 4 yards, roll", remainingAmount: 40, categoryName: "Orthopedics" },
  { itemName: "Fiberglass Cast 4 inch", description: "Fiberglass casting tape, 4 inch x 4 yards, roll", remainingAmount: 35, categoryName: "Orthopedics" },
  { itemName: "Wrist Splint", description: "Adjustable wrist splint with aluminum stay, universal size", remainingAmount: 15, categoryName: "Orthopedics" },
  { itemName: "Knee Immobilizer", description: "Adjustable knee immobilizer brace with foam lining", remainingAmount: 12, categoryName: "Orthopedics" },
  { itemName: "Ankle Brace", description: "Lace-up ankle brace with stirrups for instability", remainingAmount: 18, categoryName: "Orthopedics" },
  { itemName: "Cast Padding Roll 4 inch", description: "Cotton cast padding roll, 4 inch x 5 yards", remainingAmount: 55, categoryName: "Orthopedics" },
  { itemName: "Walking Boot Cam Walker", description: "Adjustable walking boot for foot and ankle immobilization", remainingAmount: 8, categoryName: "Orthopedics" },
  // -- Ophthalmology --
  { itemName: "Eye Shield", description: "Clear plastic eye shield, adult size, sterile", remainingAmount: 50, categoryName: "Ophthalmology" },
  { itemName: "Artificial Tears 15mL", description: "Lubricating artificial tears eye drops, preservative-free, 15mL", remainingAmount: 80, categoryName: "Ophthalmology" },
  { itemName: "Ophthalmic Exam Kit", description: "Disposable ophthalmic examination kit with speculum and forceps", remainingAmount: 120, categoryName: "Ophthalmology" },
  { itemName: "Eye Patch", description: "Sterile adhesive eye patch for post-surgery protection", remainingAmount: 65, categoryName: "Ophthalmology" },
  { itemName: "Fluorescein Strips", description: "Fluorescein sodium ophthalmic strips, box of 100", remainingAmount: 30, categoryName: "Ophthalmology" },
  // -- Gastroenterology --
  { itemName: "Biopsy Forceps - Flexible", description: "Flexible endoscopic biopsy forceps, 2.4mm cup size", remainingAmount: 15, categoryName: "Gastroenterology" },
  { itemName: "Polypectomy Snare", description: "Polypectomy snare 15mm loop, braided wire, reusable handle", remainingAmount: 10, categoryName: "Gastroenterology" },
  { itemName: "Endoscopic Spray Catheter", description: "Single-use endoscopic spray catheter for hemostasis", remainingAmount: 20, categoryName: "Gastroenterology" },
  { itemName: "Colonoscopy Prep Kit", description: "PEG-based colonoscopy preparation kit with flavor pack", remainingAmount: 40, categoryName: "Gastroenterology" },
  { itemName: "GI Biopsy Container", description: "Specimen container with formalin for GI biopsies, pack of 50", remainingAmount: 100, categoryName: "Gastroenterology" },
  // -- Urology --
  { itemName: "Foley Catheter 16FR", description: "Silicone Foley catheter, 16 French, 5mL balloon, sterile", remainingAmount: 80, categoryName: "Urology" },
  { itemName: "Foley Catheter 18FR", description: "Silicone Foley catheter, 18 French, 5mL balloon, sterile", remainingAmount: 60, categoryName: "Urology" },
  { itemName: "Urine Collection Bag 2L", description: "Drainable urine collection bag with anti-reflux valve, 2L", remainingAmount: 90, categoryName: "Urology" },
  { itemName: "Intermittent Catheter 14FR", description: "Straight intermittent catheter, 14 French, sterile, pack of 30", remainingAmount: 40, categoryName: "Urology" },
  { itemName: "Urostomy Pouch", description: "Drainable urostomy pouch with convex barrier, 10 inch", remainingAmount: 25, categoryName: "Urology" },
  // -- Anesthesiology --
  { itemName: "ET Tube 7.0mm", description: "Endotracheal tube, 7.0mm ID, with cuff and pilot balloon", remainingAmount: 35, categoryName: "Anesthesiology" },
  { itemName: "ET Tube 8.0mm", description: "Endotracheal tube, 8.0mm ID, with cuff and pilot balloon", remainingAmount: 30, categoryName: "Anesthesiology" },
  { itemName: "Laryngeal Mask Airway #4", description: "Laryngeal mask airway, size 4, reusable silicone", remainingAmount: 12, categoryName: "Anesthesiology" },
  { itemName: "Anesthesia Circuit", description: "Standard 22mm anesthesia breathing circuit with Y-piece", remainingAmount: 25, categoryName: "Anesthesiology" },
  { itemName: "CO2 Absorbent Canister", description: "Soda lime CO2 absorbent for anesthesia machines, 4.5lb", remainingAmount: 20, categoryName: "Anesthesiology" },
  // -- Cardiology --
  { itemName: "ECG Electrode 10-Pack", description: "Adult radiolucent ECG monitoring electrodes, pack of 10", remainingAmount: 300, categoryName: "Cardiology" },
  { itemName: "Holter Monitor Battery", description: "Replacement battery for Holter monitor recorders", remainingAmount: 15, categoryName: "Cardiology" },
  { itemName: "ECG Paper 215mm", description: "Thermal ECG recording paper, 215mm x 140mm roll, pack of 10", remainingAmount: 40, categoryName: "Cardiology" },
  { itemName: "AICD Magnet", description: "Donut magnet for deactivating implantable cardioverter-defibrillator", remainingAmount: 6, categoryName: "Cardiology" },
  { itemName: "Blood Pressure Cuff - Pediatric", description: "Pediatric blood pressure cuff with bladder, child size", remainingAmount: 12, categoryName: "Cardiology" },
  // -- Neonatal --
  { itemName: "Neonatal Pulse Oximeter Probe", description: "Neonatal disposable pulse oximeter probe with soft wrap", remainingAmount: 25, categoryName: "Neonatal" },
  { itemName: "Infant Incubator Thermometer", description: "Digital thermometer for infant incubator monitoring", remainingAmount: 10, categoryName: "Neonatal" },
  { itemName: "Premature Diaper Size P1", description: "Premature infant diapers, size P1, pack of 50", remainingAmount: 100, categoryName: "Neonatal" },
  { itemName: "Neonatal Nasal CPAP Prongs", description: "Binasal CPAP prongs for neonates, size medium", remainingAmount: 15, categoryName: "Neonatal" },
  { itemName: "Umbilical Catheter Kit", description: "Umbilical artery/vein catheterization kit, 3.5FR and 5FR", remainingAmount: 8, categoryName: "Neonatal" },
  // -- Dialysis --
  { itemName: "Hemodialyzer F180", description: "High-flux hemodialyzer, polysulfone membrane, 1.8m2", remainingAmount: 30, categoryName: "Dialysis" },
  { itemName: "Dialysis Blood Tubing Set", description: "Arterial and venous blood tubing set for hemodialysis", remainingAmount: 35, categoryName: "Dialysis" },
  { itemName: "Fistula Needle 16G", description: "Fistula needle 16 gauge with winged set, box of 50", remainingAmount: 60, categoryName: "Dialysis" },
  { itemName: "Dialysis Concentrate Acid", description: "Acid concentrate for hemodialysis, 5L container", remainingAmount: 20, categoryName: "Dialysis" },
  { itemName: "PD Catheter Kit", description: "Peritoneal dialysis catheter insertion kit with Tenckhoff catheter", remainingAmount: 5, categoryName: "Dialysis" },
  // -- Infection Control --
  { itemName: "Alcohol Swab 70%", description: "Sterile 70% isopropyl alcohol prep swab, box of 200", remainingAmount: 500, categoryName: "Infection Control" },
  { itemName: "Chlorhexidine Solution 500mL", description: "Chlorhexidine gluconate antiseptic solution 2%, 500mL", remainingAmount: 45, categoryName: "Infection Control" },
  { itemName: "Hand Sanitizer Gel 1L", description: "Antibacterial hand sanitizer gel 70% alcohol, 1L pump bottle", remainingAmount: 60, categoryName: "Infection Control" },
  { itemName: "Sterilization Pouch 7x10", description: "Self-sealing sterilization pouch for steam autoclave, 7x10 inch, pack of 200", remainingAmount: 150, categoryName: "Infection Control" },
  { itemName: "Bleach Wipes", description: "EPA-registered bleach disinfectant wipes, canister of 75", remainingAmount: 80, categoryName: "Infection Control" },
  // -- Nutrition --
  { itemName: "Feeding Tube 16FR", description: "Polyurethane nasogastric feeding tube, 16 French, 36 inch", remainingAmount: 30, categoryName: "Nutrition" },
  { itemName: "Enteral Feeding Set", description: "Enteral gravity feeding set with 500mL bag and tubing", remainingAmount: 55, categoryName: "Nutrition" },
  { itemName: "Protein Supplement 500g", description: "Whey protein powder supplement for malnourished patients, 500g", remainingAmount: 20, categoryName: "Nutrition" },
  { itemName: "PEG Tube Replacement Kit", description: "Percutaneous endoscopic gastrostomy tube replacement kit, 20FR", remainingAmount: 8, categoryName: "Nutrition" },
  { itemName: "Oral Nutrition Shake", description: "Ready-to-drink oral nutritional supplement, vanilla, 8oz, pack of 24", remainingAmount: 45, categoryName: "Nutrition" },
];

export async function seed() {
  const catRows = await db.select({ name: categories.categoryName, id: categories.categoryId }).from(categories);
  const catMap = new Map(catRows.map((r) => [r.name, r.id]));
  const existing = await db.select({ name: items.itemName }).from(items);
  const existingNames = new Set(existing.map((r) => r.name));
  const toInsert = data.filter((d) => !existingNames.has(d.itemName)).map((d) => ({ itemName: d.itemName, description: d.description, remainingAmount: d.remainingAmount, categoryId: catMap.get(d.categoryName) })).filter((d) => d.categoryId != null);
  if (toInsert.length === 0) { console.log(`  ∼ items: all ${data.length} already exist`); return []; }
  const inserted = await db.insert(items).values(toInsert).returning();
  console.log(`  ✓ items: ${inserted.length} inserted (${data.length - inserted.length} already existed)`);
  return inserted;
}

const isMain = process.argv[1]?.includes("seed-items");
if (isMain) { seed().then(() => process.exit(0)).catch((err) => { console.error("❌ seed-items failed:", err); process.exit(1); }); }
