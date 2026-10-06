import { Language } from '../types';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    appName: 'EB MeterSnap',
    navDashboard: 'Dashboard',
    navSnap: 'Take Meter Photo',
    navBill: 'Bill Estimate',
    navSlabs: 'Slab Cliff Guide',
    navSettings: 'Settings',

    // Top bar & quick controls
    setupWizardBtn: 'Setup Guide',
    largeTextLabel: 'Large Text',
    langSwitchLabel: 'தமிழ்',

    // Scenario Switcher (for quick demo exploration)
    demoScenarioLabel: 'Test Household Cycle State:',
    scenarioSafe: 'Safe (320 Units)',
    scenarioWarning: 'Near Limit (462 Units)',
    scenarioCliff: 'Crossed 500 (510 Units)',

    // Dashboard Hero
    currentCycleHeading: 'Current 2-Month Cycle Consumption',
    unitsUsedLabel: 'Units Used So Far',
    limit500Label: '500-Unit Slab Cliff Limit',
    freeUnitsActive: 'Free Units Active',
    freeUnits200: '200 Units Free (Under 500 Limit)',
    freeUnits100: 'Only 100 Units Free (Crossed 500 Limit)',
    estimatedBillLabel: 'Estimated EB Bill',
    estimatedNote: 'Estimated under TANGEDCO domestic tariff rules',
    baselineReadingLabel: 'Last Official Reading',
    latestReadingLabel: 'Latest Meter Reading',
    daysIntoCycleLabel: 'Cycle Progress',
    dailyAvgLabel: 'Daily Average',
    projectedUnitsLabel: '60-Day Projection',

    // Zone Status Titles & Descriptions
    zoneSafeTitle: 'Safe Zone — 200 Free Units Protected',
    zoneSafeDesc:
      'Your usage is comfortably below 500 units. You receive 200 units free and lower domestic slab rates.',
    zoneWarningTitle: 'Caution — Approaching 500-Unit Slab Cliff',
    zoneWarningDesc:
      'You have crossed 450 units! Crossing 500 units reduces your free quota from 200 to 100 units and triggers a ₹554+ jump.',
    zoneCliffTitle: 'Slab Cliff Crossed — Over 500 Units',
    zoneCliffDesc:
      'Because your usage exceeded 500 units, free units dropped from 200 to 100 and higher slab rates now apply to all blocks.',

    // Primary CTAs
    btnTakePhoto: 'Take Meter Photo',
    btnViewBillDetails: 'View Bill Breakdown',
    btnWhyBillJumps: 'Why 500 Units Matters',
    btnQuickManualAdd: 'Enter Digits Manually',

    // Snap Meter Screen
    snapTitle: 'Camera-Based Meter Reading',
    snapSubtitle:
      'Take a photo of your TANGEDCO digital meter display. Our OCR reads the kWh digits automatically.',
    alignGuideText: 'Align the meter kWh display inside the frame and capture',
    openLiveCamera: 'Open Device Camera',
    stopLiveCamera: 'Close Camera',
    captureFrameBtn: 'Capture Meter Photo',
    uploadPhotoBtn: 'Upload Meter Photo',
    sampleMetersHeading: 'Or Test with Common Chennai TANGEDCO Meter Displays',
    sampleMetersSub:
      'Tap any meter preset below to generate a real meter photo and run Gemini Vision OCR:',
    ocrProcessing: 'Reading meter digits with Gemini Vision OCR...',
    ocrDetectedTitle: 'Detected Meter Reading',
    ocrIsCorrectQuestion: 'Is this meter reading correct?',
    btnYesConfirm: 'Yes, Update Usage',
    btnEditDigits: 'Edit Digits',
    btnRetakePhoto: 'Retake / Pick Another',
    editReadingLabel: 'Enter exact 5 or 6 digit kWh reading (ignore red decimal digit):',
    saveEditedReading: 'Confirm & Save Reading',
    rolloverErrorTitle: 'Reading Lower Than Baseline!',
    rolloverErrorDesc:
      'The entered reading is lower than your last official bill reading. Please verify the digits or update your baseline reading in Settings.',

    // Bill Estimate Screen
    billTitle: 'Detailed EB Bill Estimate & Slab Breakdown',
    billSubtitle:
      'Line-by-line calculation using Tamil Nadu TANGEDCO domestic bi-monthly tariff slabs.',
    whatIfSimulatorTitle: 'Interactive "What-If" Usage Simulator',
    whatIfSimulatorSub:
      'Drag the slider across 500 units to see the exact ₹554 slab cliff jump between 500 and 510 units:',
    resetToActualBtn: 'Reset to My Actual Usage',
    tableColSlab: 'Tariff Slab (Bi-Monthly)',
    tableColUnits: 'Units in Slab',
    tableColRate: 'Rate / Unit',
    tableColAmount: 'Amount (₹)',
    totalEstimatedRow: 'Total Estimated Bill',
    cliffPenaltyCalloutTitle: 'Impact of Crossing 500 Units',
    cliffPenaltyCalloutDesc:
      'Crossing 500 units costs an extra ₹470 immediately because units 101–200 lose their free subsidy (100 units × ₹4.70), plus ₹8.40 for every unit above 500.',
    under500CalloutTitle: 'Savings Protected by Staying ≤ 500 Units',
    under500CalloutDesc:
      'By keeping usage at or below 500 units, your household saves ₹470 in extra free units (200 units free instead of 100).',

    // Visual Slab Explanation Screen
    slabGuideTitle: 'Visual Slab Cliff Explanation: Why 500 Units Changes Everything',
    slabGuideSubtitle:
      'In Tamil Nadu, crossing 500 units in a 2-month cycle triggers two simultaneous changes to your electricity bill.',
    chartComparisonTitle: 'Bill Comparison: Staying at 500 Units vs Crossing 500 Units',
    bar500Label: 'At 500 Units (Safe Limit)',
    barCurrentLabel: 'At Your Comparison Usage',
    cliffDiffLabel: 'Extra Cliff Cost',
    ruleUnder500Title: 'When Usage is 0 to 500 Units',
    ruleUnder500Bullet1: 'First 200 units are 100% FREE (₹0)',
    ruleUnder500Bullet2: 'Units 201–400 charged at ₹4.70 / unit',
    ruleUnder500Bullet3: 'Units 401–500 charged at ₹6.30 / unit (Max bill at 500 units = ₹1,570)',
    ruleOver500Title: 'When Usage Crosses 500 Units (Even 501!)',
    ruleOver500Bullet1: 'Free units drop from 200 down to ONLY 100 units',
    ruleOver500Bullet2: 'Units 101–200 are no longer free — adds an instant ₹470 charge',
    ruleOver500Bullet3: 'Every unit above 500 is billed at ₹8.40+ / unit (510 units = ₹2,124)',
    applianceTipTitle: 'How to Stay Under 500 Units in the Last 10 Days',
    applianceTip1Title: '1.5-Ton Split AC (Saves ~3.6 units / day)',
    applianceTip1Desc:
      'Setting AC temperature to 26°C instead of 20°C and turning it off 2 hours earlier saves ~36 units over 10 days.',
    applianceTip2Title: 'Electric Water Heater / Geyser (Saves ~2.0 units / day)',
    applianceTip2Desc:
      'Switching off the geyser immediately after 15 minutes of heating saves ~20 units over 10 days.',
    applianceTip3Title: 'Washing Machine & Iron Box (Saves ~1.2 units / day)',
    applianceTip3Desc:
      'Running full loads in cold water and batching clothes ironing saves ~12 units over 10 days.',

    // Alerts & Notifications
    alertsBannerNear450:
      'Usage Alert: You have reached {units} units — only {remaining} units left before the 500-unit slab cliff!',
    alertsBannerCrossed500:
      'Slab Alert: You have crossed 500 units ({units} units). Free units dropped from 200 to 100 (+₹{extra} cliff impact).',
    weeklyReminderBanner:
      'Weekly Reminder: Please take a photo of your EB meter today to keep your 2-month cycle tracker accurate.',

    // Settings & Setup
    settingsTitle: 'Household Connection, Language & Alerts',
    connectionSectionTitle: 'Household & Baseline Reading (From Paper EB Card / Bill)',
    labelHouseholdName: 'Connection / Home Name',
    labelServiceNumber: 'TANGEDCO Service Number (Optional)',
    labelBaselineReading: 'Last Official Bill Reading (kWh)',
    labelBaselineDate: 'Date of Last Official Reading',
    btnSaveSettings: 'Save Household Settings',
    settingsSavedToast: 'Settings updated and consumption recalculated.',
    preferencesSectionTitle: 'Accessibility, Language & Notifications',
    toggleLargeTextDesc: 'Increase font size and button legibility for elders',
    toggleAlertsDesc: 'Trigger alerts when usage crosses 450 and 500 units',
    toggleWeeklyReminderDesc: 'Weekly reminder to snap a photo of your home meter',
    btnTestAlert: 'Simulate Weekly Reminder Alert',
    faqSectionTitle: 'Frequently Asked Questions (Help)',
    faq1Q: '1. How do I take an accurate meter photo?',
    faq1A:
      'Stand directly in front of your digital EB meter. Wait until the screen shows the cumulative "kWh" number (usually 5 or 6 digits), align it inside the box, and tap capture.',
    faq2Q: '2. Why does my bill jump by ₹554 for just 10 units above 500?',
    faq2A:
      'Up to 500 units, the government gives 200 free units. Once you cross 500 units, you only get 100 free units—so units 101 to 200 are suddenly billed at ₹4.70/unit (₹470), plus ₹8.40/unit for the 10 extra units (₹84).',
    faq3Q: '3. Where do I find my Last Official Reading?',
    faq3A:
      'Check your TANGEDCO white meter card, SMS from TANGEDCO, or the TANGEDCO portal. Enter the last billed kWh reading and date once per 2-month cycle.',

    // Onboarding Modal
    onboardWelcomeTitle: 'Welcome to EB MeterSnap',
    onboardWelcomeSub: 'Choose your preferred language to track your home electricity usage:',
    onboardSlide1Title: '1. Snap Your Meter Photo',
    onboardSlide1Desc:
      'Take a quick photo of your home EB meter anytime. Our smart camera reads the kWh digits automatically without manual math.',
    onboardSlide2Title: '2. Track the 500-Unit Speedometer',
    onboardSlide2Desc:
      'In Tamil Nadu, crossing 500 units in 2 months causes a ₹554+ bill jump. See clearly how many units you have left.',
    onboardSlide3Title: '3. Timely Alerts Before the Cliff',
    onboardSlide3Desc:
      'Get clear warnings at 450 units so your family can adjust AC or heater usage and protect your 200 free units.',
    onboardSetupTitle: 'Enter Your Last EB Bill Reading',
    onboardCameraNote:
      'Camera Privacy: Your camera is used strictly to read meter digits when you tap Take Meter Photo.',
    btnSkip: 'Skip',
    btnNext: 'Next',
    btnGetStarted: 'Save & Start Tracking',
    readingHistoryTitle: 'Recent Meter Readings Log',
    sourceCamera: 'Camera OCR',
    sourceManual: 'Manual Entry',
  },

  ta: {
    appName: 'EB மீட்டர்ஸ்நாப்',
    navDashboard: 'முகப்பு',
    navSnap: 'மீட்டர் போட்டோ',
    navBill: 'பில் கணிப்பு',
    navSlabs: '500 யூனிட் விளக்கம்',
    navSettings: 'அமைப்புகள்',

    // Top bar & quick controls
    setupWizardBtn: 'ஆரம்ப வழிகாட்டி',
    largeTextLabel: 'பெரிய எழுத்து',
    langSwitchLabel: 'English',

    // Scenario Switcher
    demoScenarioLabel: 'மாதிரி வீட்டு மின் பயன்பாடு:',
    scenarioSafe: 'பாதுகாப்பு (320 யூனிட்)',
    scenarioWarning: 'எச்சரிக்கை (462 யூனிட்)',
    scenarioCliff: '500 தாண்டியது (510 யூனிட்)',

    // Dashboard Hero
    currentCycleHeading: 'நடப்பு 2-மாத சுழற்சி மின் பயன்பாடு',
    unitsUsedLabel: 'இதுவரை பயன்படுத்திய யூனிட்கள்',
    limit500Label: '500 யூனிட் உச்ச வரம்பு',
    freeUnitsActive: 'இலவச யூனிட் நிலை',
    freeUnits200: '200 யூனிட்கள் இலவசம் (500-க்குள் உள்ளதால்)',
    freeUnits100: '100 யூனிட்கள் மட்டுமே இலவசம் (500 தாண்டியதால்)',
    estimatedBillLabel: 'உத்தேச மின் கட்டணம் (EB Bill)',
    estimatedNote: 'தமிழ்நாடு மின்சார வாரிய (TANGEDCO) வீட்டுக் கட்டண விதிகளின்படி',
    baselineReadingLabel: 'கடந்த பில் ரீடிங்',
    latestReadingLabel: 'தற்போதைய மீட்டர் ரீடிங்',
    daysIntoCycleLabel: 'சுழற்சி நாட்கள்',
    dailyAvgLabel: 'தினசரி சராசரி',
    projectedUnitsLabel: '60-நாள் உத்தேசம்',

    // Zone Status Titles & Descriptions
    zoneSafeTitle: 'பாதுகாப்பான நிலை — 200 இலவச யூனிட்கள் உறுதி',
    zoneSafeDesc:
      'உங்கள் மின் பயன்பாடு 500 யூனிட்களுக்குள் உள்ளது. உங்களுக்கு 200 யூனிட்கள் இலவசம் மற்றும் குறைந்த கட்டண விகிதம் பொருந்தும்.',
    zoneWarningTitle: 'கவனம் — 500 யூனிட் வரம்பை நெருங்குகிறீர்கள்!',
    zoneWarningDesc:
      'நீங்கள் 450 யூனிட்களைத் தாண்டிவிட்டீர்கள்! 500 யூனிட்டைத் தாண்டினால் இலவச யூனிட் 200-லிருந்து 100 ஆகக் குறைந்து, பில் ₹554+ உயரும்.',
    zoneCliffTitle: 'எச்சரிக்கை — 500 யூனிட் வரம்பைத் தாண்டிவிட்டது!',
    zoneCliffDesc:
      '500 யூனிட்களைத் தாண்டியதால், இலவச மின்சாரம் 100 யூனிட்டாகக் குறைந்துவிட்டது. கூடுதல் யூனிட்களுக்கு உயர் கட்டணம் கணக்கிடப்படுகிறது.',

    // Primary CTAs
    btnTakePhoto: 'மீட்டர் போட்டோ எடு',
    btnViewBillDetails: 'பில் விவரம் பார்க்க',
    btnWhyBillJumps: '500 யூனிட் கட்டண உயர்வு ஏன்?',
    btnQuickManualAdd: 'எண்களை நேராகப் பதிவிடு',

    // Snap Meter Screen
    snapTitle: 'கேமரா மூலம் மீட்டர் ரீடிங் எடுத்தல்',
    snapSubtitle:
      'உங்கள் வீட்டு மின் மீட்டரை போட்டோ எடுங்கள். எமது செயலி தானாகவே kWh எண்களைப் படித்து யூனிட்களைக் கணக்கிடும்.',
    alignGuideText: 'மீட்டரின் எண்கள் கட்டத்திற்குள் தெரியுமாறு வைத்து போட்டோ எடுக்கவும்',
    openLiveCamera: 'கேமராவைத் திற',
    stopLiveCamera: 'கேமராவை மூடு',
    captureFrameBtn: 'போட்டோ எடு',
    uploadPhotoBtn: 'மீட்டர் போட்டோ பதிவேற்று',
    sampleMetersHeading: 'அல்லது மாதிரி TANGEDCO மீட்டர் படங்களைப் பரிசோதிக்கவும்',
    sampleMetersSub:
      'கீழே உள்ள மாதிரி மீட்டரைத் தேர்வு செய்து Gemini Vision OCR எவ்வாறு எண்களைப் படிக்கிறது எனப் பாருங்கள்:',
    ocrProcessing: 'மீட்டர் எண்களைக் கண்டறிகிறது (OCR)...',
    ocrDetectedTitle: 'கண்டறியப்பட்ட மீட்டர் ரீடிங்',
    ocrIsCorrectQuestion: 'இந்த மீட்டர் எண் சரியாக உள்ளதா?',
    btnYesConfirm: 'ஆம், சேமிக்கவும்',
    btnEditDigits: 'எண்ணைத் திருத்து',
    btnRetakePhoto: 'மீண்டும் போட்டோ எடு',
    editReadingLabel: 'மீட்டரில் உள்ள 5 அல்லது 6 இலக்க kWh எண்ணை உள்ளிடவும்:',
    saveEditedReading: 'உறுதி செய்து சேமி',
    rolloverErrorTitle: 'கடந்த ரீடிங்கை விட குறைவாக உள்ளது!',
    rolloverErrorDesc:
      'நீங்கள் உள்ளிட்ட எண் கடந்த பில் ரீடிங்கை விட குறைவாக உள்ளது. எண்ணைச் சரிபார்க்கவும் அல்லது அமைப்புகளில் கடந்த ரீடிங்கை மாற்றவும்.',

    // Bill Estimate Screen
    billTitle: 'விரிவான மின் கட்டணக் கணிப்பு (Slab Breakdown)',
    billSubtitle:
      'தமிழ்நாடு மின்சார வாரியத்தின் 2-மாத வீட்டுப் பயன்பாட்டு கட்டணப் பிரிவுகளின்படி கணக்கீடு.',
    whatIfSimulatorTitle: 'யூனிட் மாற்றிக் கணிக்கும் கருவி (What-If Simulator)',
    whatIfSimulatorSub:
      'கீழே உள்ள கோட்டை நகர்த்தி 500 யூனிட்டிற்கும் 510 யூனிட்டிற்கும் இடையே ₹554 பில் உயர்வதை நேரடியாகப் பாருங்கள்:',
    resetToActualBtn: 'எனது தற்போதைய யூனிட்டுக்குத் திரும்பு',
    tableColSlab: 'கட்டணப் பிரிவு (யூனிட்கள்)',
    tableColUnits: 'யூனிட்கள்',
    tableColRate: 'யூனிட் விலை',
    tableColAmount: 'தொகை (₹)',
    totalEstimatedRow: 'மொத்த உத்தேச மின் கட்டணம்',
    cliffPenaltyCalloutTitle: '500 யூனிட் தாண்டியதால் ஏற்படும் கூடுதல் செலவு',
    cliffPenaltyCalloutDesc:
      '500 யூனிட்டைத் தாண்டியவுடன் 101–200 யூனிட்களுக்கான இலவச சலுகை ரத்தாகி உடனடியாக ₹470 கூடுகிறது (100 × ₹4.70). மேலும் 500-க்கு மேல் ஒவ்வொரு யூனிட்டும் ₹8.40 ஆகிறது.',
    under500CalloutTitle: '500 யூனிட்டுக்குள் இருப்பதால் கிடைக்கும் சேமிப்பு',
    under500CalloutDesc:
      'உங்கள் பயன்பாடு 500 யூனிட்டுக்குள் இருப்பதால், கூடுதலாக 100 இலவச யூனிட்கள் (₹470 மதிப்பு) உங்களுக்கு முழுமையாகக் கிடைக்கிறது.',

    // Visual Slab Explanation Screen
    slabGuideTitle: 'எளிய விளக்கம்: 500 யூனிட் தாண்டினால் பில் ஏன் திடீரென உயர்கிறது?',
    slabGuideSubtitle:
      'தமிழ்நாட்டில் 2 மாத சுழற்சியில் 500 யூனிட்களைத் தாண்டும்போது இரண்டு முக்கிய மாற்றங்கள் ஒரே நேரத்தில் நடக்கின்றன.',
    chartComparisonTitle: 'கட்டண ஒப்பீடு: 500 யூனிட் vs தற்போதைய பயன்பாடு',
    bar500Label: '500 யூனிட்டில் பில் (பாதுகாப்பு)',
    barCurrentLabel: 'ஒப்பிடும் யூனிட்டில் பில்',
    cliffDiffLabel: 'கூடுதல் கட்டண உயர்வு',
    ruleUnder500Title: '0 முதல் 500 யூனிட்டுக்குள் இருந்தால்',
    ruleUnder500Bullet1: 'முதல் 200 யூனிட்கள் முற்றிலும் இலவசம் (₹0)',
    ruleUnder500Bullet2: '201–400 யூனிட்களுக்கு தலா ₹4.70 மட்டுமே',
    ruleUnder500Bullet3: '401–500 யூனிட்களுக்கு தலா ₹6.30 (500 யூனிட் பில் = ₹1,570)',
    ruleOver500Title: '500 யூனிட்டைத் தாண்டினால் (501 வந்தால் கூட!)',
    ruleOver500Bullet1: 'இலவச மின்சாரம் 200-லிருந்து 100 யூனிட்டாகக் குறைக்கப்படும்',
    ruleOver500Bullet2: '101–200 யூனிட்டுக்கு உடனடியாக ₹470 கட்டணம் சேர்க்கப்படும்',
    ruleOver500Bullet3: '500-க்கு மேல் உள்ள யூனிட்டுக்கு ₹8.40+ வசூலிக்கப்படும் (510 யூனிட் = ₹2,124)',
    applianceTipTitle: 'கடைசி 10 நாட்களில் 500-க்குள் கட்டுப்படுத்த எளிய வழிகள்',
    applianceTip1Title: 'ஏசி (AC) பயன்பாடு (நாளொன்றுக்கு ~3.6 யூனிட் சேமிப்பு)',
    applianceTip1Desc:
      'ஏசியை 26°C-ல் வைப்பதும், தினமும் 2 மணி நேரம் முன்னதாக அணைப்பதும் 10 நாட்களில் 36 யூனிட்களை மிச்சப்படுத்தும்.',
    applianceTip2Title: 'வாட்டர் ஹீட்டர் / கீசர் (நாளொன்றுக்கு ~2.0 யூனிட் சேமிப்பு)',
    applianceTip2Desc:
      'குளிக்கும் முன் 15 நிமிடம் மட்டுமே கீசரை ஆன் செய்து உடனே அணைத்தால் 10 நாட்களில் 20 யூனிட் சேமிக்கலாம்.',
    applianceTip3Title: 'வாஷிங் மெஷின் & அயர்ன் பாக்ஸ் (~1.2 யூனிட் சேமிப்பு)',
    applianceTip3Desc:
      'துணிகளை மொத்தமாக ஒரே நேரத்தில் துவைப்பதும் அயர்ன் செய்வதும் 10 நாட்களில் 12 யூனிட்களைக் குறைக்கும்.',

    // Alerts & Notifications
    alertsBannerNear450:
      'முக்கிய எச்சரிக்கை: நீங்கள் {units} யூனிட்களை எட்டிவிட்டீர்கள் — 500 யூனிட் வரம்பிற்கு இன்னும் {remaining} யூனிட்களே உள்ளன!',
    alertsBannerCrossed500:
      'கட்டண உயர்வு எச்சரிக்கை: நீங்கள் 500 யூனிட்களைத் தாண்டிவிட்டீர்கள் ({units} யூனிட்). இலவச யூனிட் 100 ஆகக் குறைந்தது (+₹{extra} கூடுதல்).',
    weeklyReminderBanner:
      'வாராந்திர நினைவூட்டல்: உங்கள் மின் பயன்பாட்டைத் துல்லியமாக அறிய இன்று ஒரு முறை மீட்டரை போட்டோ எடுக்கவும்.',

    // Settings & Setup
    settingsTitle: 'வீட்டு இணைப்பு, மொழி மற்றும் அறிவிப்பு அமைப்புகள்',
    connectionSectionTitle: 'வீட்டு மின் இணைப்பு & கடந்த பில் ரீடிங் விவரம்',
    labelHouseholdName: 'இணைப்பின் பெயர் (எ.கா. வீடு, கடை)',
    labelServiceNumber: 'TANGEDCO மின் இணைப்பு எண் (விருப்பப்பட்டால்)',
    labelBaselineReading: 'கடந்த முறை எடுத்த அதிகாரப்பூர்வ பில் ரீடிங் (kWh)',
    labelBaselineDate: 'கடந்த பில் ரீடிங் எடுத்த தேதி',
    btnSaveSettings: 'அமைப்புகளைச் சேமி',
    settingsSavedToast: 'விவரங்கள் சேமிக்கப்பட்டு யூனிட்கள் புதுப்பிக்கப்பட்டன.',
    preferencesSectionTitle: 'பெரிய எழுத்து, மொழி & எச்சரிக்கை அறிவிப்புகள்',
    toggleLargeTextDesc: 'பெரியவர்கள் எளிதாகப் படிக்க எழுத்துக்களைப் பெரிதாக்கு',
    toggleAlertsDesc: '450 மற்றும் 500 யூனிட் தாண்டும்போது எச்சரிக்கை அனுப்பு',
    toggleWeeklyReminderDesc: 'வாரம் ஒருமுறை மீட்டர் போட்டோ எடுக்க நினைவூட்டு',
    btnTestAlert: 'வாராந்திர நினைவூட்டலைச் சோதித்துப் பார்',
    faqSectionTitle: 'அடிக்கடி கேட்கப்படும் கேள்விகள் (உதவி)',
    faq1Q: '1. மீட்டரைத் தெளிவாக போட்டோ எடுப்பது எப்படி?',
    faq1A:
      'டிஜிட்டல் மீட்டருக்கு நேராக நின்று, திரையில் "kWh" எண் (5 அல்லது 6 இலக்கங்கள்) வரும்போது கட்டத்திற்குள் பொருத்தி போட்டோ எடுக்கவும்.',
    faq2Q: '2. 500 யூனிட்டுக்கு மேல் வெறும் 10 யூனிட் கூடினால் ₹554 உயர்வது ஏன்?',
    faq2A:
      '500 யூனிட் வரை 200 யூனிட் இலவசம். ஆனால் 500-ஐத் தாண்டினால் 100 யூனிட் மட்டுமே இலவசம். அதனால் 101-200 யூனிட்டுக்கு ₹470 + 10 யூனிட்டுக்கு ₹84 என மொத்தம் ₹554 உடனடியாக உயர்கிறது.',
    faq3Q: '3. கடந்த பில் ரீடிங்கை (Baseline) எங்கே பார்ப்பது?',
    faq3A:
      'உங்கள் வீட்டு வெள்ளை நிற EB அட்டை அல்லது TANGEDCO குறுஞ்செய்தியில் (SMS) கடந்த முறை கணக்கெடுத்த ரீடிங் மற்றும் தேதி இருக்கும்.',

    // Onboarding Modal
    onboardWelcomeTitle: 'EB மீட்டர்ஸ்நாப்-க்கு வரவேற்கிறோம்',
    onboardWelcomeSub: 'உங்கள் வீட்டு மின் கட்டணத்தைக் கண்காணிக்க மொழியைத் தேர்ந்தெடுக்கவும்:',
    onboardSlide1Title: '1. மீட்டரை போட்டோ எடுங்கள்',
    onboardSlide1Desc:
      'வீட்டு மின் மீட்டரை போட்டோ எடுத்தால் போதும், செயலி தானாகவே எண்களைப் படித்து எத்தனை யூனிட் ஓடியுள்ளது எனக் காட்டும்.',
    onboardSlide2Title: '2. 500 யூனிட் வரம்பைக் கண்காணியுங்கள்',
    onboardSlide2Desc:
      'தமிழ்நாட்டில் 500 யூனிட்டைத் தாண்டினால் ₹554+ கூடுதல் பில் வரும். 500 யூனிட்டுக்கு இன்னும் எவ்வளவு பாக்கி உள்ளது எனத் தெளிவாகப் பாருங்கள்.',
    onboardSlide3Title: '3. முன்கூட்டியே எச்சரிக்கை பெறுங்கள்',
    onboardSlide3Desc:
      '450 யூனிட்டைத் தொடும்போதே செயலி உங்களை எச்சரிக்கும். ஏசி மற்றும் ஹீட்டர் பயன்பாட்டைக் குறைத்து 200 இலவச யூனிட்களைப் பாதுகாக்கலாம்.',
    onboardSetupTitle: 'கடந்த EB பில் ரீடிங்கைப் பதிவிடுங்கள்',
    onboardCameraNote:
      'கேமரா பாதுகாப்பு: மீட்டர் எண்களைப் படிக்க மட்டுமே உங்கள் கேமரா பயன்படுத்தப்படுகிறது.',
    btnSkip: 'தவிர்',
    btnNext: 'அடுத்து',
    btnGetStarted: 'சேமித்துத் தொடங்கு',
    readingHistoryTitle: 'மீட்டர் ரீடிங் வரலாறு',
    sourceCamera: 'கேமரா OCR',
    sourceManual: 'நேரடிப் பதிவு',
  },
};
