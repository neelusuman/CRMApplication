const ticketController= require("../controllers/ticket.controller")

const authJwt= require("../middleware/authJwt")


module.exports = function(app){
    app.post("/crm/api/tickets/", [authJwt.verifyToken],ticketController.createTicket)
    app.put("/crm/api/tickets/:id",
    [authJwt.verifyToken],
    ticketController.updateTicket)
}