import election_data from './election_data.js';
import { encryptWithGamma, decryptWithGamma } from './gamma.js';

const { cecKey, voters, candidates } = election_data;
const votingList = document.querySelector('.voting-list');
votingList.style.display = 'none';

document.addEventListener('DOMContentLoaded', function () {
  const checkVoterForm = document.querySelector('.check-form');
  const votingForm = document.getElementById('votingForm');
  const resultContainer = document.getElementById('resultContainer');
  const votingResult = document.querySelector('.votingResult');

  checkVoterForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const pibInput = document.getElementById('pib');
    const innInput = document.getElementById('inn');

    const pibValue = pibInput.value.trim();
    const innValue = innInput.value.trim();

    const foundVoter = voters.find(
      (voter) => voter.name === pibValue && voter.inn === innValue
    );

    resultContainer.innerHTML = '';

    if (foundVoter) {
      resultContainer.textContent = 'Вас знайдено у списку виборців!';
      resultContainer.style.color = 'green';
      votingList.style.display = 'block';
    } else {
      resultContainer.textContent = 'Вас не знайдено у списку виборців.';
      resultContainer.style.color = 'red';
    }
  });

  candidates.forEach((candidate) => {
    const div = document.createElement('div');
    div.classList.add('candidate-wrapper');
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'candidate';
    radio.value = candidate.id;

    const label = document.createElement('label');
    label.textContent = candidate.name;
    votingForm.appendChild(div);
    div.appendChild(radio);
    div.appendChild(label);
  });

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Відправити голос';
  votingForm.appendChild(submitButton);

  votingForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const pibInput = document.getElementById('pib');
    const innInput = document.getElementById('inn');
    const candidateRadio = document.querySelector(
      'input[name="candidate"]:checked'
    );

    const pibValue = pibInput.value.trim();
    const innValue = innInput.value.trim();
    const candidateValue = candidateRadio ? candidateRadio.value : null;

    if (!candidateValue) {
      votingResult.textContent = 'Будь ласка, виберіть кандидата.';
      votingResult.style.color = 'red';
      return;
    }

    console.log('ЦВК отримало зашифрований бюлетень:');
    const encryptedPib = encryptWithGamma(pibValue, cecKey);
    console.log('ПІБ: ' + encryptedPib);
    const encryptedInn = encryptWithGamma(innValue, cecKey);
    console.log('ІНН: ' + encryptedInn);
    const encryptedCandidateValue = encryptWithGamma(candidateValue, cecKey);
    console.log('Кандидат ID: ' + encryptedCandidateValue);
    console.log('=======================================');
    console.log('ЦВК розшифрувала бюлетень');
    const decryptedPib = decryptWithGamma(encryptedPib, cecKey);
    console.log('ПІБ: ' + decryptedPib);
    const decryptedInn = decryptWithGamma(encryptedInn, cecKey);
    console.log('ІНН: ' + decryptedInn);
    const decryptedCandidateValue = decryptWithGamma(
      encryptedCandidateValue,
      cecKey
    );
    console.log('Кандидат ID: ' + candidateValue);

    votingResult.innerHTML = 'Ваш голос зараховано!';
    votingResult.style.color = 'green';
  });
});
