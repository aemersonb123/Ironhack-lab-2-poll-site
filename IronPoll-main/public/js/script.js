document.addEventListener(
  'DOMContentLoaded',
  () => {
    document
      .getElementById('join-poll')
      ?.addEventListener('click', handleJoinPoll);
    document
      .getElementById('create-poll')
      ?.addEventListener('click', handleCreatePoll);
    document.getElementById('vote')?.addEventListener('click', handleVote);

    document
      .getElementById('add-choice-button')
      ?.addEventListener('click', handleAddChoice);

    document
      .getElementById('publish-poll-button')
      ?.addEventListener('click', handlePublishPoll);

    let newPollTitle = document.getElementById('new-poll-title');
    newPollTitle
      ? (newPollTitle.innerText = newPollName =
          new URLSearchParams(window.location.search).entries().next().value[1])
      : null;
  },
  false
);

const handleJoinPoll = () => {
  let pollId = prompt('Enter poll id: ');
  window.location = '/poll/join/' + pollId;
};

const handleVote = (vote) => {
  const pollId = window.location.pathname.split('/')[3];

  var request = new XMLHttpRequest();
  request.open('GET', `/poll/${pollId}/vote/${vote}`);
  request.send();
  request.onload = () => {
    const percentages = JSON.parse(request.response);
    for (const key in percentages)
      document.getElementById(key + '-percentage').textContent =
        Math.round(percentages[key] * 1000) / 10 + '%';
  };
};

function handleCreatePoll() {
  let pollTitle = prompt("Enter your poll's title");

  window.location = '/poll/create?title=' + pollTitle;
}

function handleAddChoice() {
  let choiceInput = document.getElementById('new-choice-input');
  let choice = choiceInput.value;

  choiceInput.value = '';
  choices.push(choice);

  document.getElementById(
    'poll-choices'
  ).innerHTML += `<li class='poll-choice'>${choice}</li>`;
}

function handlePublishPoll() {
  var request = new XMLHttpRequest();
  request.open('POST', `/poll/create`);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(
    JSON.stringify({
      title: newPollName,
      choices,
    })
  );
  request.onload = () => {
    window.location = request.faliure
      ? window.location
      : '/poll/join/' + JSON.parse(request.response)._id;
  };
}

let newPollName = '';
let choices = [];
