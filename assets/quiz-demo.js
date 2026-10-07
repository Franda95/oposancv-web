(() => {
  const root = document.querySelector('[data-demo-quiz]');
  if (!root) return;

  const common = [
    {q:'¿En qué fecha fue ratificada en referéndum la Constitución Española de 1978?',a:['31 de octubre de 1978','6 de diciembre de 1978','27 de diciembre de 1978','29 de diciembre de 1978'],c:1,e:'La Constitución fue ratificada en referéndum el 6 de diciembre de 1978.'},
    {q:'¿Qué ley regula con carácter básico la autonomía del paciente y la información clínica?',a:['Ley 14/1986','Ley 41/2002','Ley 55/2003','Ley 31/1995'],c:1,e:'La Ley 41/2002 regula la autonomía del paciente y los derechos y obligaciones en materia de información y documentación clínica.'},
    {q:'¿Qué norma es el Estatuto Marco del personal estatutario de los servicios de salud?',a:['Ley 55/2003','Ley 16/2003','Ley 44/2003','Real Decreto Legislativo 5/2015'],c:0,e:'La Ley 55/2003 aprueba el Estatuto Marco del personal estatutario de los servicios de salud.'},
    {q:'¿Qué ley es la Ley General de Sanidad?',a:['Ley 14/1986','Ley 16/2003','Ley 41/2002','Ley 33/2011'],c:0,e:'La Ley 14/1986 es la Ley General de Sanidad.'},
    {q:'La Ley 31/1995 regula principalmente:',a:['Protección de datos','Prevención de riesgos laborales','Autonomía del paciente','Cohesión del SNS'],c:1,e:'La Ley 31/1995 es la norma básica de Prevención de Riesgos Laborales.'},
    {q:'¿Qué artículo de la Constitución reconoce el derecho a la protección de la salud?',a:['Artículo 14','Artículo 27','Artículo 43','Artículo 103'],c:2,e:'El artículo 43 de la Constitución reconoce el derecho a la protección de la salud.'},
    {q:'La Ley 16/2003 se refiere a:',a:['Cohesión y calidad del Sistema Nacional de Salud','Prevención de riesgos laborales','Autonomía del paciente','Régimen electoral'],c:0,e:'La Ley 16/2003 regula la cohesión y calidad del Sistema Nacional de Salud.'},
    {q:'La Constitución Española entró en vigor el:',a:['6 de diciembre de 1978','27 de diciembre de 1978','29 de diciembre de 1978','1 de enero de 1979'],c:2,e:'Entró en vigor el 29 de diciembre de 1978, día de su publicación en el BOE.'},
    {q:'¿Cuál de estas normas se relaciona directamente con protección de datos personales en España?',a:['LO 3/2018','Ley 55/2003','Ley 14/1986','Ley 31/1995'],c:0,e:'La Ley Orgánica 3/2018 adapta y complementa el marco español de protección de datos personales.'},
    {q:'El consentimiento informado forma parte del marco regulado por:',a:['Ley 41/2002','Ley 31/1995','Ley 55/2003','Ley 16/2003'],c:0,e:'La Ley 41/2002 regula, entre otras materias, el consentimiento informado.'}
  ];

  const lab = [
    {q:'¿Qué parámetro se utiliza habitualmente para valorar la función renal?',a:['Bilirrubina total','Creatinina sérica','Proteína C reactiva','Amilasa'],c:1,e:'La creatinina sérica es uno de los parámetros básicos para valorar la función renal.'},
    {q:'¿Qué anticoagulante se usa de forma habitual en tubos para hemograma?',a:['EDTA','Citrato para todo uso','Heparina sódica siempre','Fluoruro sin anticoagulante'],c:0,e:'El EDTA se utiliza habitualmente para hematología porque preserva bien la morfología celular.'},
    {q:'En una tinción de Gram, las bacterias grampositivas suelen observarse:',a:['Rojas','Verdes','Violetas','Incoloras'],c:2,e:'Las grampositivas retienen el complejo cristal violeta-yodo y se observan violetas.'},
    {q:'La PCR se utiliza para:',a:['Separar proteínas por tamaño','Amplificar secuencias de ADN','Medir directamente la osmolaridad','Contar eritrocitos manualmente'],c:1,e:'La reacción en cadena de la polimerasa permite amplificar secuencias específicas de ADN.'},
    {q:'La HbA1c refleja aproximadamente el control glucémico de:',a:['Las últimas 24 horas','La última semana','Los últimos 2-3 meses','El último año'],c:2,e:'La HbA1c se relaciona con la glucemia media de los últimos dos a tres meses.'},
    {q:'El INR se calcula a partir de una prueba relacionada con:',a:['Tiempo de protrombina','Tiempo de sangría','Recuento de plaquetas','Velocidad de sedimentación'],c:0,e:'El INR estandariza el tiempo de protrombina, especialmente útil en control de anticoagulación con antagonistas de vitamina K.'},
    {q:'Una muestra hemolizada puede producir una elevación falsa de:',a:['Potasio','Sodio siempre','Cloro siempre','Bicarbonato exclusivamente'],c:0,e:'La rotura de eritrocitos libera potasio intracelular y puede elevar falsamente su concentración.'},
    {q:'Una diferencia clásica entre plasma y suero es que el plasma:',a:['No contiene agua','Conserva fibrinógeno','No contiene proteínas','Carece de electrolitos'],c:1,e:'El plasma conserva factores de coagulación como el fibrinógeno; el suero se obtiene tras coagulación.'},
    {q:'ELISA es una técnica basada habitualmente en:',a:['Reacciones antígeno-anticuerpo con marcador enzimático','Radiografía','Electrocardiografía','Cultivo anaerobio exclusivamente'],c:0,e:'ELISA utiliza reconocimiento inmunológico y un sistema enzimático para generar una señal medible.'},
    {q:'¿Qué fase incluye identificación, transporte y conservación de la muestra?',a:['Preanalítica','Analítica exclusivamente','Postanalítica exclusivamente','Administrativa sin relación con laboratorio'],c:0,e:'La fase preanalítica incluye la preparación del paciente, obtención, identificación, transporte y conservación de la muestra.'}
  ];

  const img = [
    {q:'¿Qué técnica utiliza rayos X para obtener imágenes seccionales?',a:['Ecografía','Resonancia magnética','Tomografía computarizada','Electroencefalografía'],c:2,e:'La tomografía computarizada utiliza rayos X y reconstrucción computacional para obtener cortes.'},
    {q:'¿Cuál de estas técnicas no utiliza radiación ionizante?',a:['Radiografía simple','TC','Resonancia magnética','Fluoroscopia'],c:2,e:'La resonancia magnética utiliza campos magnéticos y radiofrecuencia, no radiación ionizante.'},
    {q:'La ecografía forma imágenes principalmente mediante:',a:['Rayos gamma','Ultrasonidos','Rayos X','Electrones acelerados'],c:1,e:'La ecografía utiliza ondas ultrasónicas y los ecos producidos en los tejidos.'},
    {q:'En la escala de Hounsfield, el agua tiene aproximadamente:',a:['-1000 UH','0 UH','+1000 UH','+3000 UH'],c:1,e:'El agua se define aproximadamente como 0 unidades Hounsfield.'},
    {q:'El contraste yodado en TC aumenta principalmente:',a:['La atenuación de estructuras vascularizadas','La frecuencia de Larmor','La velocidad del sonido','El tamaño del píxel físico'],c:0,e:'El yodo aumenta la atenuación de los rayos X y realza estructuras vascularizadas.'},
    {q:'ALARA significa mantener la exposición:',a:['Tan alta como sea posible','Tan baja como sea razonablemente posible','Siempre a cero','Igual en todos los pacientes'],c:1,e:'ALARA es el principio de mantener las exposiciones tan bajas como sea razonablemente posible.'},
    {q:'DICOM es un estándar relacionado con:',a:['Imagen médica y comunicación de datos','Análisis bioquímico','Dosificación farmacológica','Gestión de nóminas'],c:0,e:'DICOM estandariza formato, almacenamiento y comunicación de imágenes médicas y datos asociados.'},
    {q:'PACS se utiliza principalmente para:',a:['Archivar y distribuir imágenes médicas','Medir glucosa','Controlar ventiladores mecánicos','Preparar contrastes'],c:0,e:'PACS permite almacenar, recuperar, distribuir y visualizar imágenes médicas.'},
    {q:'La mamografía convencional utiliza:',a:['Rayos X de baja energía','Ultrasonidos exclusivamente','Campos magnéticos exclusivamente','Radiación alfa'],c:0,e:'La mamografía utiliza rayos X de energía relativamente baja optimizados para el estudio de la mama.'},
    {q:'En RM, la señal se relaciona con núcleos sometidos a:',a:['Campo magnético y radiofrecuencia','Rayos X y yodo','Ultrasonidos y Doppler','Radiación gamma exclusivamente'],c:0,e:'La resonancia magnética utiliza un campo magnético y pulsos de radiofrecuencia para generar señal.'}
  ];

  const profile = (root.getAttribute('data-quiz-profile') || 'common').toLowerCase();
  const questions = profile.includes('lab') ? lab : profile.includes('img') || profile.includes('radio') ? img : common;
  let index = 0;
  let score = 0;
  let locked = false;

  const counter = root.querySelector('[data-quiz-counter]');
  const questionEl = root.querySelector('[data-quiz-question]');
  const optionsEl = root.querySelector('[data-quiz-options]');
  const feedbackEl = root.querySelector('[data-quiz-feedback]');
  const nextBtn = root.querySelector('[data-quiz-next]');
  const resultEl = root.querySelector('[data-quiz-result]');
  const scoreEl = root.querySelector('[data-quiz-score]');
  const playEl = root.querySelector('[data-quiz-play]');

  function render() {
    locked = false;
    feedbackEl.hidden = true;
    nextBtn.hidden = true;
    const item = questions[index];
    counter.textContent = `Pregunta ${index + 1} de ${questions.length}`;
    questionEl.textContent = item.q;
    optionsEl.innerHTML = '';
    item.a.forEach((label, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'quiz-option';
      button.textContent = `${String.fromCharCode(65 + i)}. ${label}`;
      button.addEventListener('click', () => answer(i, button));
      optionsEl.appendChild(button);
    });
  }

  function answer(choice, clicked) {
    if (locked) return;
    locked = true;
    const item = questions[index];
    const buttons = [...optionsEl.querySelectorAll('.quiz-option')];
    buttons.forEach((button, i) => {
      button.disabled = true;
      if (i === item.c) button.classList.add('correct');
    });
    if (choice === item.c) {
      score += 1;
      feedbackEl.className = 'quiz-feedback correct';
      feedbackEl.innerHTML = `<strong>✓ Correcta</strong><span>${item.e}</span>`;
    } else {
      clicked.classList.add('wrong');
      feedbackEl.className = 'quiz-feedback wrong';
      feedbackEl.innerHTML = `<strong>✗ Incorrecta</strong><span>${item.e}</span>`;
    }
    feedbackEl.hidden = false;
    nextBtn.hidden = false;
    nextBtn.textContent = index === questions.length - 1 ? 'Ver resultado' : 'Siguiente pregunta';
  }

  function finish() {
    playEl.hidden = true;
    resultEl.hidden = false;
    scoreEl.textContent = `${score}/${questions.length}`;
    const pct = Math.round((score / questions.length) * 100);
    const copy = resultEl.querySelector('[data-quiz-result-copy]');
    copy.textContent = pct >= 80
      ? 'Muy buen nivel. Ahora prueba el banco completo y los simulacros de tu oposición.'
      : pct >= 50
      ? 'Vas por buen camino. OpoSanCV puede ayudarte a detectar exactamente qué temas debes reforzar.'
      : 'Aquí tienes margen de mejora. Empieza con tus 10 preguntas gratis al día y convierte los fallos en repaso.';
  }

  nextBtn.addEventListener('click', () => {
    if (index >= questions.length - 1) return finish();
    index += 1;
    render();
  });

  render();
})();
