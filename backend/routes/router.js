import express from 'express';

const router = express.Router() 
const { google } = require('googleapis')

const GOODLE_CLIENT_ID = '824943228622-9cffm6j6jboi5v04j7o1sla2rvekva0k.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = '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'

const REFRESH_TOKEN_Test = '1//0eWkLTLb7tNerCgYIARAAGA4SNwF-L9IrNpljK8LqrW4DStuYmO5nk7TCGaPEY90oTn0Q7isGyAhNer9Fr-mMZXT5Ph3bKEwA_CQ'
let REFRESH_TOKEN = ''

const oauth2Client = new google.auth.OAuth2(
    GOODLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    'http://localhost:3000'
)



router.get('/', async(req, res, next)=>{
    res.send({message: "piyanapi is working"})
})

router.post('/create-tokens', async(req, res, next) => {
    try{
        const {code} = req.body
        const { tokens } = await oauth2Client.getToken(code)
        console.log(tokens.refresh_token)
        REFRESH_TOKEN = tokens.refresh_token
        res.send(tokens)

    } catch(error){
        next(error)
    }
})

router.post('/create-event', async(req, res, next) => {
    try{
        const {summary, description, location, startDateTime, endDateTime} =
            req.body
        oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN})
        const calendar = google.calendar('v3')
        const response = await calendar.events.insert({
            auth:oauth2Client,
            calendarId: 'primary',
            requestBody:{
                summary: summary,
                description: description,
                location: location,
                colorId: '1',
                start: {
                    dateTime: new Date(startDateTime)
                },
                end:{
                    dateTime: new Date(endDateTime)
                }


            }
        })

        res.send(response)

    } catch(error){
        next(error)
    }
})



export default router

