import sgMail from '@sendgrid/mail'
import { Router } from 'express'
import { z } from 'zod'

const subscriptionSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
}).strict()

function buildWelcomeEmail(email, fromEmail) {
  return {
    to: email,
    from: {
      email: fromEmail,
      name: 'DEV@Deakin',
    },
    subject: 'Welcome to DEV@Deakin',
    text: `Hi there,\n\nThanks for subscribing to DEV@Deakin. You are now part of a student community interested in development, cloud technology and secure applications.\n\nRegards,\nAarya Patel\nDEV@Deakin`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #202427;">
        <h2 style="color: #4f641c;">Welcome to DEV@Deakin</h2>
        <p>Hi there,</p>
        <p>Thanks for subscribing to DEV@Deakin. You are now part of a student community interested in development, cloud technology and secure applications.</p>
        <p>I look forward to sharing new project notes and useful resources with you.</p>
        <p>Regards,<br>Aarya Patel<br>DEV@Deakin</p>
      </div>
    `,
  }
}

async function sendWithSendGrid(message, apiKey) {
  sgMail.setApiKey(apiKey)
  return sgMail.send(message)
}

export function handleMalformedJson(error, req, res, next) {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ message: 'Request body must be valid JSON.' })
  }

  next(error)
}

export function createNewsletterRouter({
  sendEmail = sendWithSendGrid,
  getConfig = () => ({
    apiKey: process.env.SENDGRID_API_KEY,
    fromEmail: process.env.SENDGRID_FROM_EMAIL,
  }),
  logger = console,
} = {}) {
  const router = Router()

  router.post('/subscribe', async (req, res) => {
    const validation = subscriptionSchema.safeParse(req.body)

    if (!validation.success) {
      return res.status(400).json({ message: 'Please enter a valid email address.' })
    }

    const { apiKey, fromEmail } = getConfig()

    if (!apiKey || !fromEmail) {
      logger.error('Email service is not configured. Check the .env file.')
      return res.status(500).json({ message: 'The email service is not configured yet.' })
    }

    const welcomeEmail = buildWelcomeEmail(validation.data.email, fromEmail)

    try {
      const [sendGridResponse] = await sendEmail(welcomeEmail, apiKey)
      const providerStatus = sendGridResponse?.statusCode

      if (providerStatus !== 202) {
        logger.error('SendGrid returned an unexpected status:', providerStatus)
        return res.status(502).json({
          message: 'Your email was received, but the welcome email request was not accepted.',
        })
      }

      logger.log(`SendGrid status: ${providerStatus}`)
      logger.log('Welcome email accepted by SendGrid.')

      return res.status(202).json({
        message: 'Your subscription request was accepted and the welcome email was queued.',
      })
    } catch {
      logger.error('SendGrid request failed.')
      return res.status(502).json({
        message: 'Your email was received, but the welcome email request was not accepted.',
      })
    }
  })

  return router
}
