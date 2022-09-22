const router = require('express').Router();

const mongoose = require('mongoose');

const User = require('../models/User.model');
const Poll = require('../models/Poll.model');
const isLoggedIn = require('../middleware/isLoggedIn');

router.get('/join/:pollId', isLoggedIn, async (req, res) => {
  const poll = await Poll.findById(req.params.pollId);
  if (!poll) return res.status(404).send('Invalid poll id');
  const username = (await User.findById(poll.creatorId)).username;

  res.render('active-poll', { poll, username });
});

router.get('/:pollId/vote/:vote', isLoggedIn, async (req, res) => {
  const poll = await Poll.findById(req.params.pollId);
  if (!poll) return res.status(404).send('Invalid poll id');

  const user = req.session.user;
  if (poll.votes.some((vote) => vote.voterId.toString() === user._id))
    return res.send(calculatePercentages(poll));

  if (!poll.votes) poll.votes = [];
  poll.votes.push({
    voterId: user._id,
    vote: req.params.vote,
  });

  await poll.save();

  res.send(calculatePercentages(poll));
});

router.get('/create', isLoggedIn, (req, res) => {
  res.render('create-poll');
});

router.post('/create', isLoggedIn, async (req, res) => {
  try {
    let poll = new Poll({
      creatorId: req.session.user._id,
      title: req.body.title,
      choices: req.body.choices,
    });

    await poll.save();
    res.status(200).send(poll);
  } catch {
    res.status(404).send({ faliure: true });
  }
});

function calculatePercentages(poll) {
  let percentages = {};
  for (let i = 0; i < poll.choices.length; i++)
    percentages[poll.choices[i]] = 0;
  for (let i = 0; i < poll.votes.length; i++)
    percentages[poll.votes[i].vote] += 1 / poll.votes.length;

  return percentages;
}

module.exports = router;
