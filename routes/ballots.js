const express = require('express');
const { requireLogin } = require('../middleware/session');
const router = express.Router();
const Ballot = require('../queries/ballot')
const User = require('../queries/user')
const Twitter = require('../utils/twitter')


/*
 * POST /ballots
 * 
*/
router.post('/', requireLogin, async (req, res, next) => {
  const { username: voter } = req.auth
  const { candidate, score } = req.body
  
  try {
    const requiredCredits = score * score
    const user = await User.getUser(voter)
    if( user.availableCredits < requiredCredits ) {
      throw new Error('Not enough credits')
    }
    const newScore = await User.castVote({ voter, candidate, score })
    const data = { newScore }
    res.send({ data });
  } catch (e) {
    next(e)
  }
});

/*
 * GET /ballots
 *   Retrive ballots
 * Query:
 *   voter: votes given by this user
 *   candidate: votes received by this user
 *   offset: rows starting offset
 *   limit: max number of rows to return
 */
router.get('/', async (req, res, next) => {
  const { voter, candidate, limit, offset = 0 } = req.query

  try {
    const filter = { candidate, voter }
    const ballots = await Ballot.get({ ...filter, limit, offset })
    const data =  { ballots }
    if (offset === 0){
      data.total = await Ballot.count(filter)
    }
    res.json({ data });
  } catch (e) {
    next(e)
  }
});

/*
 * GET /ballots/credits/:candidate/:score
 *   Calculate the credits required to give the candidate the trust score
 * Params:
 *   candidate: recipient of the trust score
 *   score: trust score
 */
router.get('/credits/:candidate/:score', requireLogin, async (req, res, next) => {
  const { username: voter } = req.auth
  const { candidate } = req.params

  try {
    const filter = { candidate, voter }
    const ballots = await Ballot.get({ ...filter, limit, offset })
    const data =  { ballots }
    if (offset === 0){
      data.total = await Ballot.count(filter)
    }
    res.json({ data });
  } catch (e) {
    next(e)
  }
});

module.exports = router;