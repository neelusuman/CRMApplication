const Client = require("node-rest-client").Client

const client = new Client();

module.exports = (ticketId, content, emailIds, requester )=>{
    let reqBody ={

        "ticketId": ticketId,
        "content": content,
        "receipientEmails": emailIds,
        "requester": requester
    }

    const args ={
        data: reqBody,
        headers: {"Content-Type": "application/json"}
    }
    client.post("http://localhost:3033/notifiServ/api/notifications/",
    args,
    (data, response)=>{
        console.log("Request sent")
        console.log(data)
    }
)
}