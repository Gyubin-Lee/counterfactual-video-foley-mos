const STUDY_STORAGE_PREFIX = "counterflow-mos-grouped-v1";
const SCALE = [
  [1, "매우 그렇지 않다", "Strongly disagree"],
  [2, "약간 그렇지 않다", "Somewhat disagree"],
  [3, "보통이다", "Neutral"],
  [4, "약간 그렇다", "Somewhat agree"],
  [5, "매우 그렇다", "Strongly agree"],
];
const QUESTIONS = [
  {
    key: "qTargetEvidence",
    title: "1. 타깃 소리 인지 / Target sound evidence",
    helpKo: "타깃(Target)은 새로 들려주려는 소리입니다. 생성 오디오를 들었을 때 지정된 타깃의 특징을 얼마나 느낄 수 있는지 판단해주세요. 예를 들어 타깃이 개 짖는 소리라면 실제로 짖음의 특징이 들리는지 평가합니다. 화면에 개가 보이는지는 이 문항의 기준이 아닙니다. 정확한 시점에 나는지는 고려하지 말고, 영상의 다른 시점에 들리더라도 타깃 소리로 판단해주세요. 음질과도 별도로 판단하며, 타깃이 전혀 느껴지지 않으면 1, 매우 분명하게 느껴지면 5에 가깝게 답해주세요.",
    helpEn: "The target is the new sound requested for the video. Judge how clearly you can hear its characteristic identity in the generated audio. For a dog-barking target, listen for the qualities of barking; a dog does not need to appear on screen. Ignore whether it occurs at the correct time: a target sound at a different time still counts as target evidence. Judge this separately from audio quality. Use ratings closer to 1 when the target is not perceived and closer to 5 when it is very clear.",
    text: (trial) => `타이밍과 무관하게, 생성된 오디오에서 “${trial.targetPrompt}” 소리가 느껴지는가?`,
    english: (trial) => `Can you perceive “${trial.targetPrompt}” in the generated audio, regardless of its timing?`,
  },
  {
    key: "qSourceEvidence",
    title: "2. 소스 소리 잔류 / Source sound evidence",
    helpKo: "소스(Source)는 영상의 원래 상황에서 예상되는 소리입니다. 생성 오디오에 이 소스 소리의 특징이 얼마나 남아 들리는지 판단해주세요. 화면에 소스 물체나 동물이 보인다는 이유만으로 소리가 들린다고 판단하지 말고, 실제 들리는 오디오에 근거해 답해주세요. 소스 소리가 정확한 시점에 나는지는 고려하지 말고, 영상의 다른 시점에 들려도 소스 소리로 판단해주세요. 소스가 전혀 느껴지지 않으면 1, 매우 분명하게 느껴지면 5에 가깝게 답합니다. 이 문항은 높은 점수일수록 소스 소리가 더 많이 남아 있다는 뜻이며, 좋고 나쁨을 직접 묻는 문항이 아닙니다.",
    helpEn: "The source is the sound expected from the original scene. Judge how much of its characteristic identity remains audible in the generated audio. Base your answer on what you hear, not merely on seeing the source object or animal. Ignore whether it occurs at the correct time: a source sound at a different time still counts as source evidence. Use ratings closer to 1 when the source is not perceived and closer to 5 when it is very clear. A higher score means more source sound remains; this question does not directly ask whether the result is good or bad.",
    text: (trial) => `타이밍과 무관하게, 생성된 오디오에서 “${trial.sourcePrompt}” 소리가 느껴지는가?`,
    english: (trial) => `Can you perceive “${trial.sourcePrompt}” in the generated audio, regardless of its timing?`,
  },
  {
    key: "qUnrelatedEvidence",
    title: "3. 무관한 소리 인지 / Unrelated sound evidence",
    helpKo: "타깃과 소스 어느 쪽에도 해당하지 않는 다른 소리가 생성 오디오에서 들리는지 판단해주세요. 예를 들어 타깃·소스로 지정되지 않은 내레이션(voice-over), 배경 음악, 알 수 없는 다른 소리 등이 해당합니다. 단, 말소리나 음악 자체가 지정된 타깃 또는 소스라면 그 소리를 무관한 소리로 세지 마세요. 타이밍과 무관하게 실제 들리는 소리를 기준으로, 무관한 소리가 전혀 느껴지지 않으면 1, 매우 분명하게 느껴지면 5에 가깝게 답해주세요. 높은 점수일수록 무관한 소리가 더 뚜렷하게 들린다는 뜻입니다.",
    helpEn: "Judge whether you hear sounds belonging to neither the target nor the source, such as voice-over, background music, or unidentified other sounds. Do not count speech or music as unrelated when it is itself the specified target or source. Judge audible presence regardless of timing. Use ratings closer to 1 when no unrelated sound is perceived and closer to 5 when it is very clear. Higher scores mean more clearly audible unrelated sounds.",
    text: () => "생성된 오디오에서 타깃·소스와 무관한 다른 소리(예: 내레이션, 배경 음악)가 느껴지는가?",
    english: () => "Can you perceive other sounds unrelated to the target and source, such as voice-over or background music?",
  },
  {
    key: "qTemporalAlignment",
    title: "4. 타깃 소리의 시간 정렬 / Temporal alignment on target sound",
    helpKo: "영상에서 소스 소리가 발생해야 하는 시점에 타깃 소리가 발생하는지 판단해주세요. 아무 소리나 동작에 맞는 것으로는 충분하지 않으며, 실제 타깃 소리의 시작·반복·쉼·끝이 소스 동작의 시점과 맞아야 합니다. 예를 들어 강아지가 짖는 영상의 타깃이 돼지 울음이라면, 강아지가 짖는 동작을 할 때 돼지 울음이 들리는지 봅니다. 돼지 울음은 다른 시점에 나오고 짖는 동작에 맞춰 알 수 없는 소리만 난다면, 이를 타깃의 올바른 정렬로 보지 마세요. 타깃이 들리지 않아 정렬이 성립하지 않으면 1, 매우 잘 맞으면 5에 가깝게 답해주세요.",
    helpEn: "Judge whether the target sound occurs when the source sound would be expected from the visible action. An arbitrary sound synchronized with the action is not sufficient: the target's onsets, repetitions, pauses and endings should match the source-action timing. For a barking-dog video with a pig-oinking target, listen for oinks when the dog visibly barks. If oinks occur elsewhere and only an unidentified sound accompanies the barking action, that is not correct target alignment. Use 1 when no audible target alignment is present and ratings closer to 5 when it aligns very well.",
    text: () => "타깃 소리가 영상에서 소스 소리가 발생해야 하는 시점과 시간적으로 잘 정렬되어 있는가?",
    english: () => "Does the target sound align with the times when the source sound should occur in the video?",
  },
  {
    key: "qAudioQuality",
    title: "5. 전반적인 음질 / Overall audio quality",
    helpKo: "생성 오디오 자체가 얼마나 자연스럽고 깨끗하게 들리는지 판단해주세요. 불필요한 잡음, 찢어짐이나 왜곡, 부자연스러운 끊김, 인공적인 울림 등 듣기 품질을 떨어뜨리는 요소를 고려하세요. 타깃 종류가 맞는지와 영상 타이밍이 맞는지는 앞 문항에서 별도로 평가하므로, 이 문항에서는 오디오 자체의 품질에 집중해주세요. 매우 부자연스럽거나 품질이 나쁘면 1, 매우 자연스럽고 품질이 좋으면 5에 가깝게 답해주세요.",
    helpEn: "Judge how natural and clean the generated audio sounds in its own right. Consider unwanted noise, clipping or distortion, unnatural interruptions, and artificial-sounding artifacts. Target identity and timing are assessed separately in the other questions; focus here on listening quality. Use ratings closer to 1 for very unnatural or poor-quality audio and closer to 5 for very natural, high-quality audio.",
    text: () => "생성된 오디오의 전반적인 음질이 좋은가?",
    english: () => "Is the overall quality of the generated audio good?",
  },

];

const $ = (selector) => document.querySelector(selector);
const config = window.MOS_CONFIG || {};
let manifest;
let tutorial;
let study;
let currentIndex = 0;
let playbackToken = 0;
let helpCounter = 0;
let collectorReady = false;
let collectorFailure = '';

function helpContent(question) {
  const panel = document.createElement('div');
  panel.className = 'question-help';
  for (const [lang, text] of [['ko', question.helpKo], ['en', question.helpEn]]) {
    const paragraph = document.createElement('p');
    paragraph.lang = lang;
    paragraph.textContent = text;
    panel.appendChild(paragraph);
  }
  return panel;
}

function renderQuestionGuide() {
  $('#question-guide').replaceChildren(...QUESTIONS.map(question => {
    const detail = document.createElement('details');
    const summary = document.createElement('summary');
    summary.textContent = question.title;
    detail.append(summary, helpContent(question));
    return detail;
  }));
}

function questionHelp(question) {
  const wrapper = document.createElement('div');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'help-button';
  button.textContent = '도움말 / Help';
  button.setAttribute('aria-label', `${question.title} · 도움말 / Help`);
  const panel = helpContent(question);
  panel.id = `question-help-${++helpCounter}`;
  panel.hidden = true;
  button.setAttribute('aria-controls', panel.id);
  button.setAttribute('aria-expanded', 'false');
  button.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
    button.setAttribute('aria-expanded', String(!panel.hidden));
    button.textContent = panel.hidden ? '도움말 / Help' : '도움말 닫기 / Close help';
  });
  wrapper.append(button, panel);
  return wrapper;
}

function hashString(value) {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededShuffle(values, seed) {
  const shuffled = [...values];
  let state = seed || 1;
  const random = () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let result = Math.imul(state ^ (state >>> 15), 1 | state);
    result = (result + Math.imul(result ^ (result >>> 7), 61 | result)) ^ result;
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swap]] = [shuffled[swap], shuffled[index]];
  }
  return shuffled;
}

function storageKey(participantId) {
  return `${STUDY_STORAGE_PREFIX}:${manifest.studyVersion}:${hashString(participantId)}`;
}

function saveStudy() {
  localStorage.setItem(storageKey(study.participant.participantId), JSON.stringify(study));
}

function makeTrials(participantId) {
  const methods = [...new Set(manifest.samples.flatMap((sample) => sample.outputs.map((output) => output.methodKey)))];
  const seed = hashString(`${manifest.studyVersion}:${participantId}`);
  const methodCodes = new Map(
    seededShuffle(methods, seed ^ 0xa53a9e11).map((method, index) => [method, String.fromCharCode(65 + index)]),
  );
  const samples = [...manifest.samples].sort((a, b) =>
    (a.dataset === 'VGGSound' ? 0 : 1) - (b.dataset === 'VGGSound' ? 0 : 1) ||
    a.datasetSampleIndex - b.datasetSampleIndex);
  const trials = samples.flatMap((sample) => sample.outputs.map((output) => ({
    trialId: `${sample.sampleId}:${output.methodId}`,
    sampleIndex: sample.sampleIndex,
    dataset: sample.dataset,
    datasetSampleIndex: sample.datasetSampleIndex,
    sampleId: sample.sampleId,
    sourcePrompt: sample.sourcePrompt,
    targetPrompt: sample.targetPrompt,
    methodId: output.methodId,
    methodCode: methodCodes.get(output.methodKey),
    videoUrl: sample.videoUrl,
    audioUrl: output.audioUrl,
  })).sort((a, b) => a.methodCode.localeCompare(b.methodCode)));
  return trials;
}

function pages() {
  const result = [];
  for (let index = 0; index < study.trials.length; index += 8) {
    result.push(study.trials.slice(index, index + 8));
  }
  return result;
}

function currentTrials() { return pages()[currentIndex]; }

function stopPlayback() {
  playbackToken += 1;
  document.querySelectorAll('#model-cards video, #model-cards audio, #tutorial-examples video').forEach((media) => media.pause());
}

function participantIdentity(fullName) {
  const key = `${STUDY_STORAGE_PREFIX}:identity:${manifest.studyVersion}:${encodeURIComponent(fullName)}`;
  let id = localStorage.getItem(key);
  if (!id) { id = crypto.randomUUID(); localStorage.setItem(key, id); }
  return id;
}

function participantFromForm() {
  const fullName = $('#full-name').value.trim();
  const gender = $("#gender").value === "self_describe"
    ? `self_describe:${$("#gender-self").value.trim()}`
    : $("#gender").value;
  return {
    participantId: participantIdentity(fullName),
    fullName,
    phoneNumber: $('#phone-number').value.trim(),
    ageGroup: $("#age-group").value,
    gender,
    audioExperience: $("#audio-experience").value,
    listeningDevice: $("#listening-device").value,
    language: "ko-en",
    consent: $("#consent").checked,
  };
}

function startStudy(event) {
  event.preventDefault();
  if (!event.currentTarget.reportValidity() || !$('#full-name').value.trim()) return;
  const participant = participantFromForm();
  const prior = localStorage.getItem(storageKey(participant.participantId));
  if (prior) {
    study = JSON.parse(prior);
    study.participant = participant;
    currentIndex = Math.min(study.currentIndex || 0, pages().length - 1);
  } else {
    study = {
      studyVersion: manifest.studyVersion,
      submissionId: crypto.randomUUID(),
      startedAt: new Date().toISOString(),
      participant,
      trials: makeTrials(participant.participantId),
      responses: {},
      listened: {},
      currentIndex: 0,
      submitted: false,
    };
    saveStudy();
  }
  $("#intro-view").hidden = true;
  if (study.submitted) {
    $("#complete-view").hidden = false;
    $("#submission-id-label").textContent = `제출 ID / Submission ID: ${study.submissionId}`;
    return;
  }
  if (study.tutorialVersion !== tutorial.version || !study.tutorialFinished) showTutorial();
  else { $("#trial-view").hidden = false; renderTrial(); }
}

function tutorialScores(example) {
  return example.referenceScores.map(value => tutorial.zeroMeansMinimum ? Math.max(1, value) : value);
}

function showTutorial() {
  stopPlayback();
  $('#trial-view').hidden = true;
  $('#tutorial-view').hidden = false;
  if (study.tutorialVersion !== tutorial.version) {
    study.tutorialWatched = {};
    study.tutorialVersion = tutorial.version;
    study.tutorialFinished = false;
  }
  $('#tutorial-scale-note').textContent = tutorial.zeroMeansMinimum
    ? '예시 점수는 실제 평가와 같은 1–5 척도입니다. 1은 해당 문항에 매우 그렇지 않다는 뜻입니다. / Example scores use the same 1–5 scale as the study; 1 means strongly disagree.'
    : '예시의 0은 해당 소리가 없거나 정렬이 없다는 설명용 표시입니다. 실제 평가에서는 0 대신 최저점 1을 선택하세요. / A tutorial score of 0 denotes absence; in the actual 1–5 study, use 1 instead.';
  $('#tutorial-examples').replaceChildren(...tutorial.examples.map(example => {
    const card = document.createElement('article');
    card.className = 'tutorial-card';
    const title = document.createElement('h3');
    title.textContent = `${example.titleKo} / ${example.titleEn}`;
    const prompts = document.createElement('p');
    prompts.textContent = `소스 / Source: ${example.sourcePrompt} → 타깃 / Target: ${example.targetPrompt}`;
    const video = document.createElement('video');
    video.src = example.videoUrl;
    video.volume = 0.8;
    video.playsInline = true;
    video.controls = true;
    video.addEventListener('play', () => {
      document.querySelectorAll('#tutorial-examples video').forEach(other => {
        if (other !== video) other.pause();
      });
    });
    video.preload = 'metadata';
    const play = document.createElement('button');
    play.type = 'button';
    play.textContent = '예시 재생 / Play example';
    const status = document.createElement('p');
    status.setAttribute('aria-live', 'polite');
    status.textContent = study.tutorialWatched?.[example.id] ? '재생 완료 / Playback completed' : '예시를 끝까지 들어주세요. / Listen to the full example.';
    play.addEventListener('click', async () => {
      stopPlayback(); video.currentTime = 0;
      const token = playbackToken;
      status.textContent = '재생 중… / Playing…';
      try { await video.play(); if (token !== playbackToken) video.pause(); }
      catch (error) { status.textContent = `재생 오류 / Playback error: ${error.message}`; }
    });
    video.addEventListener('ended', () => {
      study.tutorialWatched ||= {};
      study.tutorialWatched[example.id] = true;
      saveStudy(); status.textContent = '재생 완료 / Playback completed';
    });
    video.addEventListener('error', () => { status.textContent = '예시를 불러오지 못했습니다. / Failed to load example.'; });
    const table = document.createElement('table');
    table.className = 'tutorial-scores';
    const caption = document.createElement('caption');
    caption.textContent = '평가 기준 설명을 위한 예시 점수 / Illustrative scores for the evaluation criteria';
    table.appendChild(caption);
    const scores = tutorialScores(example);
    QUESTIONS.forEach((q, i) => {
      const row = document.createElement('tr');
      const label = document.createElement('th');
      label.scope = 'row'; label.textContent = q.title;
      const value = document.createElement('td'); value.textContent = String(scores[i]);
      row.append(label, value); table.appendChild(row);
    });
    card.append(title, prompts, video, play, status, table);
    for (const [lang, text] of [['ko', example.explanationKo], ['en', example.explanationEn]]) {
      const paragraph = document.createElement('p'); paragraph.lang = lang; paragraph.textContent = text; card.appendChild(paragraph);
    }
    return card;
  }));
  $('#finish-tutorial').disabled = false;
  saveStudy(); window.scrollTo({top: 0, behavior: 'smooth'});
}

function finishTutorial() {
  stopPlayback(); study.tutorialFinished = true; saveStudy();
  $('#tutorial-view').hidden = true;
  $('#trial-view').hidden = false;
  renderTrial();
}

function scaleControl(question, trial, selected, card) {
  const wrapper = document.createElement("section");
  wrapper.className = "question";
  const category = document.createElement('p');
  category.className = 'question-label';
  category.textContent = question.title;
  wrapper.appendChild(category);
  const heading = document.createElement("h3");
  heading.textContent = `${question.text(trial)} / ${question.english(trial)}`;
  wrapper.appendChild(heading);
  wrapper.appendChild(questionHelp(question));
  const scale = document.createElement("div");
  scale.className = "scale";
  for (const [value, korean, english] of SCALE) {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = `${trial.trialId}:${question.key}`;
    input.dataset.question = question.key;
    input.value = String(value);
    input.checked = selected === value;
    input.addEventListener("change", () => recordAnswers(trial, card));
    const number = document.createElement("strong");
    number.textContent = value;
    const words = document.createElement("span");
    words.textContent = `${korean} / ${english}`;
    label.append(input, number, words);
    scale.appendChild(label);
  }
  wrapper.appendChild(scale);
  return wrapper;
}

function renderTrial() {
  stopPlayback();
  const trials = currentTrials();
  const trial = trials[0];
  study.currentIndex = currentIndex;
  saveStudy();
  $("#progress-label").textContent = `${trial.dataset} · 페이지 / Page ${currentIndex + 1} / ${pages().length} · ${trial.datasetSampleIndex} / ${trial.dataset === 'VGGSound' ? 15 : 16}`;
  $("#sample-label").textContent = `${trial.dataset} · 영상 / Video ${trial.datasetSampleIndex} · 8개 출력 / 8 outputs`;
  $("#prompt-pair").textContent = `소스 / Source: ${trial.sourcePrompt} → 타깃 / Target: ${trial.targetPrompt}`;
  $("#model-cards").replaceChildren(...trials.map(createModelCard));
  $("#previous-trial").disabled = currentIndex === 0;
  updateNextState();
  window.scrollTo({top: 0, behavior: "smooth"});
}

function createModelCard(trial) {
  const card = document.createElement("article");
  card.className = "model-card";
  const title = document.createElement("h3");
  title.textContent = `오디오 샘플 / Audio sample ${trial.methodCode}`;
  const video = document.createElement("video");
  video.playsInline = true;
  video.muted = true;
  video.preload = "metadata";
  video.src = trial.videoUrl;
  const audio = document.createElement("audio");
  audio.preload = "metadata";
  audio.src = trial.audioUrl;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "primary";
  button.textContent = "처음부터 재생 / Play from start";
  const pause = document.createElement('button');
  pause.type = 'button';
  pause.textContent = '재생·일시정지 / Play–pause';
  pause.addEventListener('click', () => {
    if (audio.paused) playTrial(video, audio, status, slider, audio.currentTime || 0);
    else { stopPlayback(); status.textContent = '일시정지 / Paused'; }
  });
  const timeline = document.createElement('label');
  timeline.textContent = '재생 위치 / Playback position';
  const seek = document.createElement('input');
  seek.type = 'range';
  seek.min = 0; seek.max = manifest.clipSeconds || 8; seek.step = 0.01; seek.value = 0;
  const time = document.createElement('span');
  const updateTime = () => {
    seek.value = audio.currentTime || 0;
    time.textContent = `${Number(seek.value).toFixed(1)} / ${Number(seek.max).toFixed(1)} s`;
  };
  audio.addEventListener('loadedmetadata', () => {
    if (Number.isFinite(audio.duration)) seek.max = audio.duration;
    updateTime();
  });
  audio.addEventListener('timeupdate', updateTime);
  seek.addEventListener('input', () => {
    audio.currentTime = Number(seek.value);
    video.currentTime = Number(seek.value);
    updateTime();
  });
  updateTime();
  timeline.append(seek, time);
  const volume = document.createElement("label");
  volume.className = "volume";
  volume.textContent = "볼륨 / Volume ";
  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = 0; slider.max = 1; slider.step = .05; slider.value = .8;
  slider.addEventListener("input", () => { audio.volume = Number(slider.value); });
  volume.appendChild(slider);
  const status = document.createElement("p");
  status.className = "listen-status";
  status.setAttribute("aria-live", "polite");
  status.textContent = study.listened[trial.trialId]
    ? "재생 종료 / Playback ended"
    : "재생바로 원하는 구간을 다시 들을 수 있습니다. / Use the seek bar to revisit any part.";
  button.addEventListener("click", () => playTrial(video, audio, status, slider));
  audio.addEventListener("ended", () => {
    video.pause();
    study.listened[trial.trialId] = true;
    saveStudy();
    status.textContent = "재생 종료 / Playback ended";
    updateNextState();
  });
  for (const media of [audio, video]) {
    media.addEventListener("error", () => {
      video.pause(); audio.pause();
      status.textContent = "미디어를 불러오지 못했습니다. / Failed to load media.";
    });
  }
  card.append(title, video, audio, button, pause, timeline, volume, status);
  const response = study.responses[trial.trialId] || {};
  card.append(...QUESTIONS.map(q => scaleControl(q, trial, response[q.key], card)));
  return card;
}

function recordAnswers(trial, card) {
  const values = {};
  for (const input of card.querySelectorAll('input[type="radio"]:checked')) {
    values[input.dataset.question] = Number(input.value);
  }
  study.responses[trial.trialId] = values;
  saveStudy();
  updateNextState();
}

function responseComplete(trial) {
  const response = study.responses[trial.trialId] || {};
  return QUESTIONS.every(q => Number.isInteger(response[q.key]) && response[q.key] >= 1 && response[q.key] <= 5);
}

function pageComplete(trials) {
  return trials.every(responseComplete);
}

function updateNextState() {
  $("#progress").max = study.trials.length;
  $("#progress").value = study.trials.filter(responseComplete).length;
  const trials = currentTrials();
  const complete = trials.filter(responseComplete).length;
  $("#page-status").textContent = `이 페이지 완료: ${complete}/8 · Completed on this page: ${complete}/8`;
  $("#next-trial").disabled = !pageComplete(trials);
  $("#next-trial").textContent = currentIndex === pages().length - 1
    ? "제출 확인 / Review submission"
    : currentIndex === 14 ? "GH 평가 시작 / Start GH evaluation" : "다음 페이지 / Next page";
}

async function playTrial(video, audio, status, slider, startTime = 0) {
  stopPlayback();
  const token = playbackToken;
  video.currentTime = startTime;
  audio.currentTime = startTime;
  audio.volume = Number(slider.value);
  status.textContent = "재생 중… / Playing…";
  try {
    await Promise.all([video.play(), audio.play()]);
    if (token !== playbackToken) { video.pause(); audio.pause(); return; }
    const keepSynchronized = () => {
      if (token !== playbackToken || audio.paused || audio.ended) return;
      if (Math.abs(video.currentTime - audio.currentTime) > 0.1) video.currentTime = audio.currentTime;
      requestAnimationFrame(keepSynchronized);
    };
    requestAnimationFrame(keepSynchronized);
  } catch (error) {
    if (token !== playbackToken) return;
    video.pause(); audio.pause();
    status.textContent = `재생 오류 / Playback error: ${error.message}`;
  }
}

function showReview() {
  stopPlayback();
  $("#trial-view").hidden = true;
  $("#review-view").hidden = false;
  window.scrollTo({top: 0, behavior: "smooth"});
}

async function submitStudy() {
  if (!study.tutorialFinished || study.tutorialVersion !== tutorial.version) return;
  if (!pages().every(pageComplete)) return;
  if (!collectorReady) {
    $('#submit-status').textContent = `수집 서버 연결 확인 후 새로고침해주세요. / Check the collector connection and reload. ${collectorFailure}`;
    return;
  }
  const button = $("#submit-study");
  button.disabled = true;
  $("#submit-status").textContent = "응답을 전송하고 있습니다… / Submitting responses…";
  const completionSeconds = Math.round((Date.now() - Date.parse(study.startedAt)) / 1000);
  const payload = {
    studyVersion: study.studyVersion,
    submissionId: study.submissionId,
    participant: study.participant,
    startedAt: study.startedAt,
    completionSeconds,
    userAgent: navigator.userAgent,
    website: "",
    responses: study.trials.map((trial, trialOrder) => ({
      trialOrder: trialOrder + 1,
      sampleIndex: trial.sampleIndex,
      sampleId: trial.sampleId,
      sourcePrompt: trial.sourcePrompt,
      targetPrompt: trial.targetPrompt,
      methodCode: trial.methodCode,
      methodId: trial.methodId,
      ...study.responses[trial.trialId],
    })),
  };
  try {
    await fetch(config.appsScriptUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {"Content-Type": "text/plain;charset=utf-8"},
      body: JSON.stringify(payload),
    });
    const confirmed = await verifySubmission(study.submissionId);
    if (!confirmed) throw new Error("Sheet receipt could not be confirmed");
    study.submitted = true;
    saveStudy();
    $("#review-view").hidden = true;
    $("#complete-view").hidden = false;
    $("#submission-id-label").textContent = `제출 ID / Submission ID: ${study.submissionId}`;
  } catch (error) {
    button.disabled = false;
    $("#submit-status").textContent = `전송에 실패했습니다. 다시 시도해주세요. / Submission failed; please retry. (${error.message})`;
  }
}

function verifySubmissionOnce(submissionId, versionOnly = false) {
  return new Promise((resolve) => {
    const callback = `mosSheetReceipt_${crypto.randomUUID().replaceAll("-", "")}`;
    const script = document.createElement("script");
    const timeout = setTimeout(() => fail('연결 시간 초과 / Connection timed out'), 20000);
    function fail(reason) {
      if (versionOnly) collectorFailure = reason;
      finish(false);
    }
    function finish(value) {
      clearTimeout(timeout);
      delete window[callback];
      script.remove();
      resolve(value);
    }
    window[callback] = (payload) => {
      if (versionOnly && payload?.studyVersion !== manifest.studyVersion) {
        fail(`버전 불일치 / Version mismatch: ${payload?.studyVersion || 'unknown'} → ${manifest.studyVersion}`);
      } else {
        finish(versionOnly ? payload?.ok === true : Boolean(payload?.received));
      }
    };
    const url = new URL(config.appsScriptUrl);
    if (submissionId) url.searchParams.set("submissionId", submissionId);
    url.searchParams.set("callback", callback);
    script.onerror = () => fail('연결 요청 실패 / Connection request failed');
    script.src = url.toString();
    document.head.appendChild(script);
  });
}

async function verifySubmission(submissionId) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    if (await verifySubmissionOnce(submissionId)) return true;
    await new Promise((resolve) => setTimeout(resolve, 1200));
  }
  return false;
}

async function initialize() {
  renderQuestionGuide();
  const configurationError = $("#configuration-error");
  const startButton = $("#participant-form button[type=submit]");
  let ready = true;
  if (!config.appsScriptUrl || config.appsScriptUrl.includes("__APPS_SCRIPT")) {
    ready = false;
    configurationError.hidden = false;
    configurationError.textContent = "응답 저장 URL이 설정되지 않았습니다. / The response endpoint is not configured.";
  }
  try {
    const response = await fetch(config.manifestUrl || "study_manifest.json", {cache: "no-store"});
    if (!response.ok) throw new Error(`manifest HTTP ${response.status}`);
    manifest = await response.json();
    const tutorialResponse = await fetch('tutorial.json', {cache: 'no-store'});
    if (!tutorialResponse.ok) throw new Error(`tutorial HTTP ${tutorialResponse.status}`);
    tutorial = await tutorialResponse.json();
    if (tutorial.examples?.length !== 3 || tutorial.examples.some(e =>
      !e.videoUrl || e.referenceScores?.length !== QUESTIONS.length ||
      e.referenceScores.some(v => !Number.isInteger(v) || v < 0 || v > 5))) throw new Error('invalid tutorial');
    if (manifest.samples?.length !== 31 || manifest.expectedTrialCount !== 248 ||
        manifest.methodCount !== 8 || manifest.clipSeconds !== 8 ||
        manifest.samples.some((sample) => sample.outputs.length !== 8)) {
      throw new Error("invalid study manifest");
    }
  } catch (error) {
    ready = false;
    configurationError.hidden = false;
    configurationError.textContent = `연구 manifest를 불러오지 못했습니다. / Failed to load study manifest: ${error.message}`;
  }
  startButton.disabled = !ready;
  $('#submit-study').disabled = true;
  if (ready) {
    collectorReady = await verifySubmissionOnce('', true);
    if (!collectorReady) collectorReady = await verifySubmissionOnce('', true);
    $('#submit-study').disabled = !collectorReady;
    if (!collectorReady) {
      configurationError.hidden = false;
      configurationError.textContent = `화면 검수는 가능하지만 수집 서버 확인에 실패해 제출이 잠겨 있습니다. URL·네트워크를 확인하고 새로고침해주세요. / Preview is available, but submission is locked because collector verification failed. Check the URL/network and reload. ${collectorFailure} · URL: ${config.appsScriptUrl}`;
    }
  }
}

$("#gender").addEventListener("change", (event) => {
  $("#gender-self-label").hidden = event.target.value !== "self_describe";
});
$("#participant-form").addEventListener("submit", startStudy);
$('#finish-tutorial').addEventListener('click', finishTutorial);
$('#reopen-tutorial').addEventListener('click', showTutorial);
$("#previous-trial").addEventListener("click", () => {
  if (currentIndex > 0) { currentIndex -= 1; renderTrial(); }
});
$("#next-trial").addEventListener("click", () => {
  if (!pageComplete(currentTrials())) return;
  if (currentIndex === pages().length - 1) showReview();
  else { currentIndex += 1; renderTrial(); }
});
$("#submit-study").addEventListener("click", submitStudy);
initialize();
