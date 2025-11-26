const Users = require('../models').users;
const TravelDetails = require('../models').travelsDetails;
const BusDetails = require('../models').busDetails;
const { to, ReE, ReS } = require('../responseHandler');
const { ERROR, SUCCESS } = require('../constants/messages');
const addOwners = async (req, res) => {
    let err, find, user;
    const body = req.body;
    [err, find] = await to(Users.findOne({where : { email : body.email}}));
    if(err) return ReE( req, res, err, 422);
    if(find) return ReE( req, res, { message : ERROR.SUPER_USER_EXIST}, 422);
    [err, user] = await to(Users.create({
        email : body.email,
        name : body.name,
        phoneNumber : body.phoneNumber,
        password : body.password,
        role : 'owner'
    }));
    if(err) return ReE(req, res, err, 422);
    const deleteFields = ["address", "forgetpassAt", "password", "forgetPass", "createdAt"];
    deleteFields.forEach((values) => {
        delete user.dataValues[values];
    });
    [err, td] = await to(TravelDetails.create({
        ownerID : user.dataValues.id
    }));
    if(err) return ReE(req, res, err, 422);
    if(!td) return ReE(req, res, { message : ERROR.UNNABLE_TO_UPDATE}, 401);
    return ReS(res, { data : user, message : SUCCESS.USER_CREATED}, 201);
}
module.exports.addOwners = addOwners;
const getAllOwners = async(req, res) => {
    let err, owners;
    [err, owners] = await to(Users.findAll({ 
        where : { role : 'owner'},
        attributes : ['id', 'name', 'email'],
        include : [
            {
                model : TravelDetails,
                attributes : ['isRegister']
            }
        ]
    }));
    if(err) return ReE(req, res, err, 422);
    if(!owners) return ReE(res, { message : ERROR.NO_OWNER_EXIST}, 422);
    return ReS(res, { data : owners, message : SUCCESS.OWNER_DETAILS}, 200);
}
module.exports.getAllOwners = getAllOwners;
const updateTravelsDetails = async(req, res) => {
    let err, up;
    const body = req.body;
    [err, up] = await to(TravelDetails.update({
        isRegister : true, 
        travelsName : body.travelsName,
        CIN : body.CIN,
        GST : body.GST
    }, { where : { ownerID : body.ownerID}}));
    if(err) return ReE(req, res, err, 422);
    if(!up) return ReE(req, res, { message : ERROR.UNNABLE_TO_UPDATE}, 422);
    return ReS(res, { message : SUCCESS.DETAILS_UPDATED}, 200); 
}
module.exports.updateTravelsDetails = updateTravelsDetails;
const addBusDetails = async(req, res) => {
    let err, check, bus;
    const body = req.body;
    [err, check] = await to(BusDetails.findOne({ where : { numberPlate : body.numberPlate}}));
    if(err) return ReE(req, res, err, 422);
    if(check) return ReE(req, res, { message : ERROR.BUS_EXIST}, 422);
    [err, bus] = await to(BusDetails.create({
        travelsID : body.travelsID,
        numberPlate : body.numberPlate,
        AC : body.AC,
        seatCount : body.seatCount,
        sleeper : body.sleeper
    }));
    if(err) return ReE(req, res, err, 422);
    return ReS(res, {data : bus, message : SUCCESS.BUS_DETAILS}, 201);
}
module.exports.addBusDetails = addBusDetails;
const travelsBuses = async(req, res) => {
    let err, buses;
    const body = req.body;
    [err, buses] = await to(BusDetails.findAll({ where : { travelsID : body.travelsID}}));
    if(err) return ReE(req, res, err, 422);
    if(!buses) return ReE(req, res, { message : ERROR.NO_BUS}, 404);
    return ReS(res, { data : buses, message : SUCCESS.BUS_DETAILS_FETCHED}, 200);
}
module.exports.travelsBuses = travelsBuses;
