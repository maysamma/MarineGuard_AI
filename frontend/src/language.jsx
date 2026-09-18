import React,{createContext,useContext,useEffect,useState}from'react';

const translations={
  en:{
    language:'English',
    switchLanguage:'العربية',
    nav:{
      dashboard:'Dashboard',
      submit:'New Observation',
      map:'GIS Map',
      reports:'Reports',
      sensors:'Sensors',
      verification:'Verification',
    },
    system:{
      ready:'System ready',
      flow:'Observe → Evidence → Priority → Verify',
    },
    topbar:{
      exploreMap:'Explore map',
      newObservation:'New observation',
    },
    dashboard:{
      title:'Marine intelligence dashboard',
      subtitle:'A live view of observations, evidence, priorities, and verification.',
      totalReports:'Total reports',
      activeAreas:'Active areas',
      highPriority:'High priority',
      verified:'Verified',
      observationActivity:'Observation activity',
      observationActivityDesc:'Records stored in the MarineGuard database.',
      noHistory:'No observation history yet.',
      priorityDistribution:'Priority distribution',
      recentObservations:'Recent observations',
      recentObservationsDesc:'Latest cases and their current decision state.',
      viewAll:'View all →',
      site:'Site',
      observation:'Observation',
      priority:'Priority',
      status:'Status',
      noObservations:'No observations yet. Submit the first community observation.',
    },
    mapPage:{
      title:'MarineGuard GIS',
      subtitle:'OpenStreetMap · community observation priority',
      all:'All',
      high:'High',
      medium:'Medium',
      low:'Low',
      needsReview:'Needs Review',
      priority:'Priority',
      openCase:'Open case →',
    },        reports:{
      title:'Community observations',
      subtitle:'Every card is backed by a database record — not frontend mock data.',
      marineObservation:'Marine observation',
      noImage:'No image attached',
      noDescription:'No description provided.',
      noObservations:'No observations yet. Submit the first community observation.',
    },    submit:{
      title:'Submit a marine observation',
      subtitle:'Create a real database record, upload evidence, and run the agentic workflow.',
      imageEvidence:'01 · Image evidence',
      dropImage:'Drop or select a marine image',
      imageFormats:'JPG, JPEG, PNG, WebP · max 10 MB',
      readyForAnalysis:'ready for analysis',
      observationContext:'02 · Observation context',
      description:'Description',
      descriptionPlaceholder:'What did you observe?',
      observationLocation:'Observation location',
      mapInstruction:'Click on the map to select the location.',
      latitude:'Latitude',
      longitude:'Longitude',
      observationType:'Observation type',
      general:'General',
      marineDebris:'Marine debris',
      waterAppearance:'Water appearance',
      coralCondition:'Coral condition',
      depth:'Depth (optional)',
      locationEvidence:'Location is evidence',
      locationEvidenceDesc:'Use the observation coordinates; do not infer sensitive site context.',
      runAnalysis:'Run agentic analysis',
      complete:'Complete',
      processing:'Processing…',
      invalidImage:'Please upload JPG, PNG or WebP.',
      reportError:'Could not complete the report. Check that the backend is running.',
    },
    home:{
      badge:'Tanmiyathon 2026 · Marine Monitoring',
      title:'Community intelligence for',
      titleAccent:'healthier seas.',
      description:'MarineGuard AI turns community observations, marine imagery, sensor-ready data, and geospatial history into evidence-based priorities for monitoring and field verification.',
      analyze:'Analyze a marine site',
      explore:'Explore GIS map',
      disclaimer:'Visual AI is an evidence signal, not a diagnosis. Priority is an internal operational index. Official decisions require appropriate approved data and verification.',
      observeVerify:'Observe → Verify',
      ecosystem:'People + AI + Sensors + History + GIS',
      features:{
        ai:'AI Analysis',
        aiDesc:'Structured visual indicators, confidence, and limitations.',
        sensors:'Sensor Intelligence',
        sensorsDesc:'Simulator-ready marine measurements with transparent source labels.',
        trends:'Environmental Trends',
        trendsDesc:'Site history, repeated observations, and temporal context.',
        gis:'GIS Prioritization',
        gisDesc:'Interactive map that shows where attention is needed.',
        community:'Community Science',
        communityDesc:'Turn scattered observations into a shared evidence layer.',
        verification:'Human Verification',
        verificationDesc:'Needs Review → Under Review → Verified.',
      },
    },
  },
  ar:{
    language:'العربية',
    switchLanguage:'English',
    nav:{
      dashboard:'لوحة المعلومات',
      submit:'ملاحظة جديدة',
      map:'خريطة GIS',
      reports:'التقارير',
      sensors:'المستشعرات',
      verification:'التحقق',
    },
    system:{
      ready:'النظام جاهز',
      flow:'الرصد ← الأدلة ← الأولوية ← التحقق',
    },
    topbar:{
      exploreMap:'استكشاف الخريطة',
      newObservation:'ملاحظة جديدة',
    },
    dashboard:{
      title:'لوحة ذكاء البيئة البحرية',
      subtitle:'عرض مباشر للملاحظات والأدلة والأولويات وحالات التحقق.',
      totalReports:'إجمالي التقارير',
      activeAreas:'المناطق النشطة',
      highPriority:'أولوية عالية',
      verified:'تم التحقق',
      observationActivity:'نشاط الملاحظات',
      observationActivityDesc:'السجلات المخزنة في قاعدة بيانات MarineGuard.',
      noHistory:'لا يوجد سجل للملاحظات حتى الآن.',
      priorityDistribution:'توزيع الأولويات',
      recentObservations:'أحدث الملاحظات',
      recentObservationsDesc:'أحدث الحالات وحالتها الحالية في عملية اتخاذ القرار.',
      viewAll:'عرض الكل ←',
      site:'الموقع',
      observation:'الملاحظة',
      priority:'الأولوية',
      status:'الحالة',
      noObservations:'لا توجد ملاحظات حتى الآن. أرسل أول ملاحظة مجتمعية.',
    },
    submit:{
      title:'إرسال ملاحظة بحرية',
      subtitle:'إنشاء سجل حقيقي في قاعدة البيانات، ورفع الأدلة، وتشغيل سير عمل الوكلاء.',
      imageEvidence:'01 · الأدلة المصورة',
      dropImage:'أفلت صورة بحرية أو اخترها',
      imageFormats:'JPG، JPEG، PNG، WebP · بحد أقصى 10 ميجابايت',
      readyForAnalysis:'جاهزة للتحليل',
      observationContext:'02 · سياق الملاحظة',
      description:'الوصف',
      descriptionPlaceholder:'ماذا لاحظت؟',
      observationLocation:'موقع الملاحظة',
      mapInstruction:'اضغط على الخريطة لتحديد الموقع.',
      latitude:'خط العرض',
      longitude:'خط الطول',
      observationType:'نوع الملاحظة',
      general:'عامة',
      marineDebris:'مخلفات بحرية',
      waterAppearance:'مظهر المياه',
      coralCondition:'حالة الشعاب المرجانية',
      depth:'العمق (اختياري)',
      locationEvidence:'الموقع جزء من الأدلة',
      locationEvidenceDesc:'استخدم إحداثيات الملاحظة؛ ولا تستنتج سياقًا حساسًا للموقع.',
      runAnalysis:'تشغيل تحليل الوكلاء',
      complete:'مكتمل',
      processing:'جارٍ المعالجة…',
      invalidImage:'يرجى رفع صورة بصيغة JPG أو PNG أو WebP.',
      reportError:'تعذر إكمال التقرير. تأكد من تشغيل الخادم الخلفي.',
    },
    mapPage:{
      title:'MarineGuard GIS',
      subtitle:'OpenStreetMap · community observation priority',
      all:'All',
      high:'High',
      medium:'Medium',
      low:'Low',
      needsReview:'Needs Review',
      priority:'Priority',
      openCase:'Open case →',
    },        reports:{
      title:'الملاحظات المجتمعية',
      subtitle:'كل بطاقة مدعومة بسجل حقيقي في قاعدة البيانات، وليست بيانات وهمية من الواجهة.',
      marineObservation:'ملاحظة بحرية',
      noImage:'لا توجد صورة مرفقة',
      noDescription:'لم يتم تقديم وصف.',
      noObservations:'لا توجد ملاحظات حتى الآن. أرسل أول ملاحظة مجتمعية.',
    },
    home:{
      badge:'تنمية ثون 2026 · المراقبة البحرية',
      title:'ذكاء المجتمع من أجل',
      titleAccent:'بحار أكثر صحة.',
      description:'يحوّل MarineGuard AI الملاحظات المجتمعية والصور البحرية والبيانات الجاهزة للمستشعرات والسجل الجغرافي المكاني إلى أولويات قائمة على الأدلة للمراقبة والتحقق الميداني.',
      analyze:'تحليل موقع بحري',
      explore:'استكشاف خريطة GIS',
      disclaimer:'الذكاء الاصطناعي المرئي هو إشارة من الأدلة وليس تشخيصًا. الأولوية مؤشر تشغيلي داخلي. تتطلب القرارات الرسمية بيانات معتمدة مناسبة والتحقق منها.',
      observeVerify:'الرصد ← التحقق',
      ecosystem:'المجتمع + الذكاء الاصطناعي + المستشعرات + السجل + GIS',
      features:{
        ai:'تحليل بالذكاء الاصطناعي',
        aiDesc:'مؤشرات مرئية منظمة مع مستوى الثقة والقيود.',
        sensors:'ذكاء المستشعرات',
        sensorsDesc:'قياسات بحرية جاهزة للمحاكاة مع توضيح مصادر البيانات.',
        trends:'الاتجاهات البيئية',
        trendsDesc:'سجل الموقع والملاحظات المتكررة والسياق الزمني.',
        gis:'تحديد الأولويات عبر GIS',
        gisDesc:'خريطة تفاعلية توضح المواقع التي تحتاج إلى اهتمام.',
        community:'العلوم المجتمعية',
        communityDesc:'تحويل الملاحظات المتفرقة إلى طبقة أدلة مشتركة.',
        verification:'التحقق البشري',
        verificationDesc:'بحاجة إلى مراجعة ← قيد المراجعة ← تم التحقق.',
      },
    },
  },
};


translations.en.result={
  imageEvidence:'Image evidence',
  loading:'Loading case...',
  backToReports:'Back to reports',
  marineObservation:'Marine observation',
  noImageEvidence:'No image evidence',
  observation:'Observation',
  location:'Location',
  community:'Community',
  history:'History',
  additionalReports:'additional reports',
  observations:'observations',
  aiVisualFindings:'AI visual findings',
  available:'Available',
  missing:'Missing',
  sensorEvidence:'Sensor evidence',
  readings:'readings',
  unknownSource:'Unknown source',
  noReadings:'No readings',
  historicalEvidence:'Historical evidence',
  noHistoricalObservations:'No historical observations',
  communityEvidence:'Community evidence',
  noAdditionalCommunityReports:'No additional community reports',
  reliableIndicatorMissing:'No reliable visual indicator was produced.',
  confidence:'Confidence',
  limitation:'Limitation',
  analysisNotAvailable:'Analysis not available.',
  priorityAssessment:'Priority assessment',
  internalOperationalIndex:'/ 100 internal operational index',
  priorityDisclaimer:'This score is for monitoring prioritization only; it is not an official environmental threshold.',
  evidencePackage:'Evidence package',
  recommendation:'Recommendation',
  needsReview:'Needs Review',
  agentExecutionTrace:'Agent execution trace',
  status:'Status'
};

translations.ar.result={
  imageEvidence:'???? ?????',
  loading:'???? ????? ??????...',
  backToReports:'?????? ??? ????????',
  marineObservation:'?????? ?????',
  noImageEvidence:'?? ???? ???? ?????',
  observation:'????????',
  location:'??????',
  community:'???????',
  history:'?????',
  additionalReports:'?????? ??????',
  observations:'???????',
  aiVisualFindings:'??????? ??????? ?????? ?????????',
  available:'?????',
  missing:'??? ?????',
  sensorEvidence:'???? ??????????',
  readings:'??????',
  unknownSource:'???? ??? ?????',
  noReadings:'?? ???? ??????',
  historicalEvidence:'?????? ?????????',
  noHistoricalObservations:'?? ???? ??????? ???????',
  communityEvidence:'???? ???????',
  noAdditionalCommunityReports:'?? ???? ?????? ??????? ??????',
  reliableIndicatorMissing:'?? ??? ????? ???? ???? ?????.',
  confidence:'????? ?????',
  limitation:'??????',
  analysisNotAvailable:'??????? ??? ?????.',
  priorityAssessment:'????? ????????',
  internalOperationalIndex:'/ 100 ???? ?????? ?????',
  priorityDisclaimer:'??? ??????? ???? ?????? ??????? ???????? ???? ???? ???? ?????? ??????.',
  evidencePackage:'???? ??????',
  recommendation:'???????',
  needsReview:'????? ??? ??????',
  agentExecutionTrace:'??? ????? ???????',
  status:'??????'
};

translations.en.review={
  title:'Field Verification Queue',
  subtitle:'Human-in-the-loop for uncertain or high-priority cases.',
  underReview:'Under review',
  verify:'Verify',
  verified:'Verified',
  status:'Status',
  noCases:'No cases currently require review.',
  reviewedAgainstEvidence:'Reviewed against available evidence.',
  requiresAdditionalEvidence:'Requires additional field/approved environmental evidence.'
};

translations.ar.review={
  title:'????? ?????? ????????',
  subtitle:'?????? ????? ??????? ??? ??????? ?? ??? ???????? ???????.',
  underReview:'??? ????????',
  verify:'????',
  verified:'?? ??????',
  status:'??????',
  noCases:'?? ???? ????? ????? ???????? ??????.',
  reviewedAgainstEvidence:'??? ???????? ????????? ??? ?????? ???????.',
  requiresAdditionalEvidence:'????? ???? ??????? ?????? ?? ???? ????? ??????.'
};

translations.en.sensors={
  title:'Sensor simulator',
  subtitle:'IoT-ready ingestion without pretending physical sensors are connected.',
  simulatedSensorData:'SIMULATED SENSOR DATA',
  storedSource:'Every generated reading is stored with source = simulated.',
  simulateAnomaly:'Simulate anomaly',
  generateReadings:'Generate readings',
  generatedReadings:'Generated simulated readings.',
  recentReadings:'Recent readings',
  site:'Site',
  sensor:'Sensor',
  value:'Value',
  source:'Source',
  time:'Time',
  noReadings:'No readings yet.',
  warning:'Simulated values are for workflow demonstration and must not be represented as measurements from real sensors.'
};

translations.ar.sensors={
  title:'????? ??????????',
  subtitle:'????? ?????? ???? ??????? ??????? ??? ??????? ????? ???????? ????? ?????.',
  simulatedSensorData:'?????? ?????????? ????????',
  storedSource:'??? ??? ?? ????? ????? ?? ?????? = simulated.',
  simulateAnomaly:'?????? ???? ????',
  generateReadings:'????? ????????',
  generatedReadings:'?? ????? ?????? ???????? ??????.',
  recentReadings:'???? ????????',
  site:'??????',
  sensor:'????????',
  value:'??????',
  source:'??????',
  time:'?????',
  noReadings:'?? ???? ?????? ??? ????.',
  warning:'????? ???????? ????? ???? ??? ????? ???? ??? ??? ??????? ??? ???? ?????? ?? ???????? ??????.'
};

translations.en.site={
  loading:'Loading site...',
  backToMap:'Back to map',
  observationTimeline:'Observation timeline',
  marineGuard:'MarineGuard',
  observationStored:'Observation stored in site history.',
  noObservations:'No observations recorded yet.'
};

translations.ar.site={
  loading:'???? ????? ??????...',
  backToMap:'?????? ??? ???????',
  observationTimeline:'????? ?????? ?????????',
  marineGuard:'MarineGuard',
  observationStored:'?? ??? ???????? ?? ??? ??????.',
  noObservations:'?? ???? ??????? ????? ??? ????.'
};

translations.en.reports.status={
  analyzed:'Analyzed',
  needsReview:'Needs Review',
  verified:'Verified'
};

translations.ar.reports.status={
  analyzed:'?? ???????',
  needsReview:'????? ??? ??????',
  verified:'?? ??????'
};

translations.en.agentTrace={
  runAnalysis:'Run an analysis to see the live evidence trail.',
  tool:'Tool'
};

translations.ar.agentTrace={
  runAnalysis:'???? ??????? ???? ???? ?????? ???????.',
  tool:'??????'
};

const LanguageContext=createContext(null);

export function LanguageProvider({children}){
  const[language,setLanguage]=useState(()=>localStorage.getItem('marineguard-language')||'en');

  useEffect(()=>{
    localStorage.setItem('marineguard-language',language);
    document.documentElement.lang=language;
    document.documentElement.dir=language==='ar'?'rtl':'ltr';
  },[language]);

  const toggleLanguage=()=>setLanguage(v=>v==='en'?'ar':'en');

  return(
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      toggleLanguage,
      t:translations[language],
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(){
  const context=useContext(LanguageContext);
  if(!context)throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}
