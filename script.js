import { findBestCluster } from './utils/match.js';

let clusters = {};
let questions = [];

document.addEventListener("DOMContentLoaded", async () => {
  questions = await fetch(`data/questions.json`).then(r => r.json());
  const select = document.getElementById("questionSelect");

  questions.forEach(q => {
    const option = document.createElement("option");
    option.value = q.id;
    option.textContent = q.text;
    select.appendChild(option);
  });

  select.addEventListener("change", loadQuestion);
  loadQuestion();
});

async function loadQuestion() {
  const questionId = document.getElementById("questionSelect").value || questions[0].id;
  const question = questions.find(q => q.id === questionId);
  document.getElementById("question").textContent = question.text;
  clusters = await fetch(`data/${questionId}_clusters.json`).then(r => r.json()).then(d => d.clusters);
  document.getElementById("result").classList.add("hidden");
  document.getElementById("userAnswer").value = "";
}

window.submitAnswer = () => {
  const input = document.getElementById("userAnswer").value.trim();
  const questionId = document.getElementById("questionSelect").value;
  if (!input) return;
  let getCluster = clusters;
  console.log(getCluster)
  const result = findBestCluster(input, clusters);
  if (result == undefined) {
    // document.getElementById("clusterLabel").textContent = result.label;
    document.getElementById("clusterPercent").textContent = `No similar answers found. You are quite unique 🤔`;

    document.getElementById("clusterTopRegion").textContent = '';
    document.getElementById("clusterDomAgeGrp").textContent = '';
    document.getElementById("clusterGenderSkew").textContent = '';
    document.getElementById("clusterAvgSentScore").textContent = '';
    document.getElementById("result").classList.remove("hidden");
    
    const examples = getCluster[0].examples;
    const shuffled = examples.sort(() => 0.5 - Math.random());
    const selectedAnswer = shuffled.slice(0, 3);
    const ul = document.getElementById("ParticipantsAnswers");
    ul.innerHTML = "";
    selectedAnswer.forEach(example => {
      const li = document.createElement("li");
      li.textContent = example;
      ul.appendChild(li);
    });
    
    return;
  }

  // document.getElementById("clusterLabel").textContent = result.label;
  document.getElementById("clusterPercent").textContent = `${result.percentage}% of people gave similar answers.`;
  document.getElementById("clusterTopRegion").textContent = `Top Region: ${result.top_region}`;
  document.getElementById("clusterDomAgeGrp").textContent = `Dominant Age Group: ${result.dom_age_grp}`;
  document.getElementById("clusterGenderSkew").textContent = `Gender Skew: ${result.gender_skew}`;
  
  // document.getElementById("clusterAvgSentScore").textContent = `Avg Sentiment Score: ${result.avg_sent_score}`;

  // const imageDiv = document.getElementById("imageGallery");
  // imageDiv.innerHTML = "";
  // result.images?.forEach(src => {
  //   const img = document.createElement("img");
  //   img.src = `images/${questionId}/${result.label}/${src}`;
  //   img.alt = result.label;
  //   imageDiv.appendChild(img);
  // });

  document.getElementById("result").classList.remove("hidden"); 
  const examples = result.examples;
  const shuffled = examples.sort(() => 0.5 - Math.random());
  const selectedAnswer = shuffled.slice(0, 3);
  const ul = document.getElementById("ParticipantsAnswers");
  ul.innerHTML = "";
  selectedAnswer.forEach(example => {
    const li = document.createElement("li");
    li.textContent = example;
    ul.appendChild(li);
  });

};