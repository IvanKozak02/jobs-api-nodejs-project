const {StatusCodes} = require("http-status-codes");
const Job = require('../models/Job');
const {NotFoundError, BadRequestError} = require("../errors");
const getAllJobs = async (req, res) => {
    const {id: userId} = req.user;
    const jobs = await Job.find({createdBy: userId}).sort('createdAt');
    res.status(StatusCodes.OK).json({jobs, count: jobs.length});
}

const getJob = async (req, res) => {
    const {id} = req.params;
    const job = await Job.findOne({_id: id,createdBy: req.user.id});
    if (!job){
        throw new NotFoundError('Cannot find a job.')
    }
    return res.status(StatusCodes.OK).json({job});
}

const createJob = async (req, res) => {
    const newJob = await Job.create({createdBy: req.user.id,...req.body});
    return res.status(StatusCodes.CREATED).json({newJob});
}

const updateJob = async (req, res) => {
    const {
        user: {id: userId},
        params: {id: jobId},
        body: {company, position}
    } = req
    if (!company && !position){
        throw new BadRequestError('Company or Position fields cannot be empty.');
    }
    const job = await Job.findByIdAndUpdate(
        {_id: jobId, createdBy: userId},
        req.body,
        {new: true, runValidators: true}
    );
    if (!job){
        throw new NotFoundError('Cannot find a job.')
    }
    return res.status(StatusCodes.OK).json({job});
}

const deleteJob = async (req, res) => {
    const {
        user: {id: userId},
        params: {id: jobId},
    } = req;
    const job = await Job.findByIdAndDelete({_id: jobId, createdBy: userId});
    if (!job){
        throw new NotFoundError('Cannot find a job.')
    }
    return res.status(StatusCodes.OK).json({job});
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}