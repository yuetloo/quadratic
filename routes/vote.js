const express = require('express')
const createError = require('http-errors')
const { requireLogin } = require('../middleware/session')
const router = express.Router()
const User = require('../queries/user')
const Twitter = require('../utils/twitter')

async function validate(req, res, next) {
  const { candidate, score } = req.body
  if (!candidate) {
    next(createError(400, 'Missing candidate'))
  }
  if (!score) {
    next(createError(400, 'Missing score'))
  }

  const twitter = new Twitter()
  try {
    const profile = await twitter.getUserProfile({ username: candidate })
    if (!profile) {
      next(createError(400, 'Candidate is invalid twitter user'))
    }  
  } catch (e) {
    next(createError(400, 'Failed to get candidate profile from twitter'))
  }
  next()
}

/*
 * POST /api/vote
 *
 */
router.post('/', requireLogin, validate, async (req, res, next) => {
  const { username: voter } = req.auth
  const { candidate, score } = req.body

  try {
    const requiredCredits = score * score
    const user = await User.getUser(voter)
    const availableCredits = user.credits || 0
    if (availableCredits < requiredCredits) {
      throw new Error('Not enough credits')
    }
    const newScore = await User.castVote({ voter, candidate, score })
    const data = { newScore }
    res.send({ data })
  } catch (e) {
    let error = e
    if (e.message === 'Validation error' && e.parent) {
      error = createError(400, `${e.message}: ${e.parent.detail}`)
    }
    console.log('POST /api/vote error', e)
    next(error)
  }
})

module.exports = router
