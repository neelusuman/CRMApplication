const User = require("../models/user.model")
const Ticket = require ("../models/ticket.model")
const constants = require("../utils/constants")
const sendEmail= require('../utils/NotificationClient')
const objectConverter = require("../utils/objectConverter")

exports.createTicket = async(req, res)=>{
const ticketObject ={
    title : req.body.title,
    ticketPriority: req.body.ticketPriority,
    description: req.body.description,
    status: req.body.status,
    reporter: req.body.userId,

}
const engineer = await User.findOne({
    userType : constants.userType.engineer,
    userStatus: constants.userStatus.approved
})
ticketObject.assignee= engineer.userId

try{
    const ticket= await Ticket.create(ticketObject)

    if(ticket){
        const user =await User.findOne({
            userId : req.body.userId
        })
        user.ticketCreated.push(ticket._id)
        await user.save()

        engineer.ticketAssigned.push(ticket._id)
        await engineer.save()
        sendEmail(ticket._id,
            `Ticket with id : ${ticket._id} created`,
            ticket.description,
            user.email + "," + engineer.email,
            user.email)

        res.status(201).send(objectConverter.ticketResponse(ticket))
    }

}catch(err){
  console.log("Some error happened while creating ticket", err.message)
  res.status(500).send({
    mesaage : "Internal Server error"
  })
}
}



const canUpdate = (user, ticket) => {
    return user.userId == ticket.reporter ||
        user.userId == ticket.assignee ||
        user.userType == constants.userTypes.admin
}

exports.updateTicket = async (req, res) => {
    const ticket = await Ticket.findOne({ _id: req.params.id })

    const savedUser = await User.findOne({
        userId: req.body.userId
    })

    if (canUpdate(savedUser, ticket)) {
        ticket.title = req.body.title != undefined
            ? req.body.title
            : ticket.title
        ticket.description = req.body.description != undefined
            ? req.body.description
            : ticket.description
        ticket.ticketPriority = req.body.ticketPriority != undefined
            ? req.body.ticketPriority
            : ticket.ticketPriority
        ticket.status = req.body.status != undefined
            ? req.body.status
            : ticket.status
        ticket.assignee = req.body.assignee != undefined
            ? req.body.assignee
            : ticket.assignee
        await ticket.save()
        const engineer = await User.findOne({
            userId: ticket.assignee
        })

        const reporter = await User.findOne({
            userId: ticket.reporter
        })

        sendEmail(ticket._id,
            `Ticket with id: ${ticket._id} updated`,
            ticket.description,
            savedUser.email + ',' + engineer.email + "," + reporter.email,
            savedUser.email
        )
        res.status(200).send(objectConverter.ticketResponse(ticket))

    } else {
        console.log("Ticket update was attempted by someone without access to the ticket")
        res.status(401).send({
            message: "Ticket can be updated only by the customer who created it"
        })
    }
}

exports.getAllTickets = async (req, res) => { }

exports.getOneTicket = async (req, res) => { }